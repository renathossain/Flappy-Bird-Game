<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Button from "./components/Button.svelte";
  import Avatar from "./components/Avatar.svelte";
  import { user } from "../store";
  import { get } from "svelte/store";
  import io, { Socket } from "socket.io-client";

  let lobbyId: number | null = null;
  const userData = get(user);

  let socket: Socket;

  function initializeSocket() {
    if (userData) {
      socket = io("http://localhost:3000");

      socket.on("connect", () => {
        console.log("Socket connected");
        socket.emit("lobby-create", userData.id);
      });

      socket.on("lobby-send-code", (code) => {
        console.log(`Received lobby code: ${code}`);
        lobbyId = code;
      });

      socket.on("error", (message) => {
        console.error(`Socket error: ${message}`);
      });

      socket.on("disconnect", () => {
        console.warn("Socket disconnected");
      });
    }
  }

  onMount(() => {
    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  });
</script>

<div class="container">
  <div class="retro-container code">Code: {lobbyId}</div>
  <div class="players">
    <!-- {#each playerUsernames as username}
      <Avatar {username} />
    {/each} -->
  </div>
  <div class="controls">
    <Button text="Destroy Lobby" link="/"></Button>
    <Button text="Start Game" link="/game"></Button>
  </div>
</div>

<style>
  .container {
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
