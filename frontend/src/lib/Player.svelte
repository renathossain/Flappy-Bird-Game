<script lang="ts">
  import BigButton from "./components/BigButton.svelte";
  import Button from "./components/Button.svelte";
  import Unauthorized from "./Unauthorized.svelte";
  import Store from "./Store.svelte";
  import { user, code } from "../store";
  import { onMount } from "svelte";
  import io, { Socket } from "socket.io-client";

  let socket: Socket;
  let jumpFunction = () => {};
  let lobbySocket: string = "";
  let pageState = "player";

  const setupJumpFunction = () => {
    jumpFunction = () => {
      if ($user && lobbySocket != "") {
        socket.emit("jump", {
          userId: $user.id,
          lobbySocket: lobbySocket,
        });
      }
    };
  };

  const changeSkinFunction = () => {
    pageState = "store";
  };

  onMount(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
    socket = io(SOCKET_URL);

    socket.on("connect", () => {
      if ($user && $code !== null) {
        socket.emit("lobby-join", {
          userId: $user.id,
          lobbyId: $code,
        });
      }
    });

    socket.on("send-lobby-socket", (data) => {
      lobbySocket = data;
      setupJumpFunction();
    });

    window.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === " ") {
        jumpFunction();
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  });
</script>

{#if lobbySocket != "" && pageState === "player"}
  <div class="container">
    <div class="big-button-container">
      <BigButton text="Tap\Press Space To Fly" onClick={jumpFunction} />
    </div>
    <div class="controls">
      {#if $user}
        <Button text="Change Skin" onClick={changeSkinFunction} />
      {/if}
      <Button text="Leave the Game" link="/" />
    </div>
  </div>
{:else if lobbySocket != "" && pageState === "store"}
  <Store bind:pageState {socket} />
{:else}
  <Unauthorized />
{/if}

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 90vh; /* 90% of viewport height */
    width: 90vw; /* 90% of viewport width */
    margin: auto; /* Center horizontally */
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end; /* Align to the bottom */
    column-gap: 20px;
    padding: 10px; /* Optional padding */
  }

  .big-button-container {
    flex: 1; /* Allow this to take the remaining space */
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
