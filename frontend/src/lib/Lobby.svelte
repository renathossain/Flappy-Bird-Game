<script lang="ts">
  import { navigate } from "svelte-routing";
  import Button from "./components/Button.svelte";
  import Avatar from "./components/Avatar.svelte";
  import Unauthorized from "./Unauthorized.svelte";
  import Game from "./Game.svelte";
  import { user, host } from "../store";
  import { onMount } from "svelte";
  import io, { Socket } from "socket.io-client";

  let socket: Socket;
  let players: {
    userId: string;
    givenName: string;
    currentSkin: number;
  }[] = [];
  let authorized = false;
  let inGame = false;

  const startGame = () => {
    if (players.length >= 2) {
      inGame = true;
    } else {
      alert("Need at least 2 people to start.");
    }
  };

  const destroyLobby = () => {
    if ($host) {
      socket.emit("lobby-dstroy", $host);
    }
    navigate("/");
  };

  onMount(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
    socket = io(SOCKET_URL);

    socket.on("connect", () => {
      if ($user && $host) {
        socket.emit("lobby-create", {
          userId: $user.id,
          lobbyId: $host,
        });
      }
    });

    socket.on(`lobby-authorize`, (data) => {
      authorized = data;
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

{#if inGame && $host && authorized}
  <Game {socket} {players} />
{:else if !inGame && $host && authorized}
  <div class="lobby-container">
    <div class="retro-container code">Code: {$host}</div>
    <div class="players">
      {#if players.length > 0}
        {#each players as { givenName, currentSkin }}
          <Avatar {givenName} {currentSkin} />
        {/each}
      {:else}
        <div class="waiting">Waiting for players to join...</div>
      {/if}
    </div>
    <div class="controls">
      <Button text="Destroy Lobby" onClick={destroyLobby}></Button>
      <Button text="Start Game" onClick={startGame}></Button>
    </div>
  </div>
{:else}
  <Unauthorized />
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
    font-size: 4vmin;
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
    justify-content: center;
    align-items: center;
    column-gap: 20px;
    height: 30vh;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    column-gap: 20px;
  }

  .waiting {
    text-align: center;
    font-family: "RetroGaming", sans-serif;
    font-size: 4vmin;
    color: #553000;
  }
</style>
