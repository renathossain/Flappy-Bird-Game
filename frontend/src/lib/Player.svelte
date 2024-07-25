<script lang="ts">
  import BigButton from "./components/BigButton.svelte";
  import Button from "./components/Button.svelte";
  import { user, code } from "../store";
  import { onMount } from "svelte";
  import io, { Socket } from "socket.io-client";

  let socket: Socket;

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

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  });

  function handleClick() {
    // Add logic for BigButton click here if needed
  }
</script>

<div class="container">
  <BigButton text="Tap to Fly" onClick={handleClick} />
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
