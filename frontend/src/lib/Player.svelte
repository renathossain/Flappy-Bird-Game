<script lang="ts">
  import BigButton from "./components/BigButton.svelte";
  import Button from "./components/Button.svelte";
  import { user, code } from "../store";
  import { onMount } from "svelte";
  import io, { Socket } from "socket.io-client";

  let socket: Socket;
  let jumpFunction = () => {};
  let lobbySocket: string;

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

    // Make your flappy jump
    jumpFunction = () => {
      if ($user && $code !== null) {
        socket.emit("jump", {
          userId: $user.id,
          lobbyId: $code,
        });
      }
    };

    window.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Spacebar") {
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

<div class="container">
  <BigButton text="Tap to Fly" onClick={jumpFunction} />
  <div class="controls">
    <Button text="Leave the Game" link="/" />
  </div>
</div>

<style>
  .controls {
    display: flex;
    justify-content: flex-end;
    column-gap: 20px;
  }
</style>
