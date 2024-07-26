<script lang="ts">
  import Button from "./components/Button.svelte";
  import Avatar from "./components/Avatar.svelte";
  import Game from "./Game.svelte";
  import { user } from "../store";
  import { onMount } from "svelte";
  import io, { Socket } from "socket.io-client";

  let socket: Socket;
  let lobbyId: number | null = null;
  let players: {
    userId: number;
    givenName: string;
    currentSkin: number;
  }[] = [];
  let gameStarted: boolean = false;

  const startGame = () => {
    gameStarted = true;
  };

  onMount(() => {
    socket = io("http://localhost:3000");

    socket.on("connect", () => {
      if ($user) {
        socket.emit("lobby-create", $user.id);
      }
    });

    socket.on(`lobby-send-code`, (code) => {
      lobbyId = code;
    });

    socket.on(`lobby-send-players`, (data) => {
      players = data;
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  });
</script>

{#if gameStarted}
  <Game {socket} {players} />
{:else}
  <div class="lobby-container">
    <div class="retro-container code">Code: {lobbyId}</div>
    <div class="players">
      {#each players as { givenName, currentSkin }}
        <Avatar {givenName} {currentSkin} />
      {/each}
    </div>
    <div class="controls">
      <Button text="Destroy Lobby" link="/"></Button>
      <Button text="Start Game" onClick={startGame}></Button>
    </div>
  </div>
{/if}

<style>
  .lobby-container {
    width: 90vw;
    height: 80vh;
    margin: 20px;
    display: flex;
    flex-direction: column;
  }

  .retro-container {
    text-align: center;
    font-family: "RetroGaming", sans-serif;
    font-size: 50px;
    color: #fc7858;
    background-color: #ded895;
    border-radius: 30px 70px 50px 10px / 20px 40px 60px 80px;
    border: 4px solid #543847;
    padding: 20px;
  }

  .code {
    width: fit-content;
    display: inline-block;
    margin-bottom: 20px;
  }

  .players {
    margin-bottom: 20px;
    flex: auto;
    display: flex;
    column-gap: 20px;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    column-gap: 20px;
  }
</style>
