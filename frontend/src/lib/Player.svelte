<script lang="ts">
  import BigButton from "./components/BigButton.svelte";
  import Button from "./components/Button.svelte";
  import { user, code } from "../store";
  import { onMount } from "svelte";
  import io, { Socket } from "socket.io-client";
  import { get } from "svelte/store";

  let socket: Socket;

  onMount(() => {
    socket = io("http://localhost:3000");

    socket.on("connect", () => {
      socket.emit("lobby-join", {
        userId: "109520711894316516317",
        lobbyId: 1426,
      });
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  });
</script>

<div class="container">
  <BigButton text="Tap to Fly" onClick={() => {}} />
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
