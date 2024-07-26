<script lang="ts">
  import BigButton from "./components/BigButton.svelte";
  import Button from "./components/Button.svelte";
  import Unauthorized from "./Unauthorized.svelte";
  import { user, code } from "../store";
  import { onMount, onDestroy } from "svelte";
  import io, { Socket } from "socket.io-client";

  let socket: Socket;
  let jumpFunction = () => {};
  let lobbySocket: string | null = null;

  const setupJumpFunction = () => {
    jumpFunction = () => {
      if ($user && lobbySocket) {
        socket.emit("jump", {
          userId: $user.id,
          lobbySocket: lobbySocket,
        });
      }
    };
  };

  onMount(() => {
    socket = io("http://localhost:3000");

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

{#if lobbySocket}
  <div class="container">
    <BigButton text="Tap to Fly" onClick={jumpFunction} />
    <div class="controls">
      <Button text="Leave the Game" link="/" />
    </div>
  </div>
{:else}
  <Unauthorized />
{/if}

<style>
  .controls {
    display: flex;
    justify-content: flex-end;
    column-gap: 20px;
  }
</style>
