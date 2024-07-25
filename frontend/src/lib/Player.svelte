<script lang="ts">
  import BigButton from "./components/BigButton.svelte";
  import Button from "./components/Button.svelte";
  import { user, code } from "../store";
  import { onMount } from "svelte";
  import io, { Socket } from "socket.io-client";

  let socket: Socket;

  onMount(() => {
    const unsubscribe = user.subscribe((userData) => {
      if (userData) {
        socket = io("http://localhost:3000");
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
      unsubscribe();
    };
  });

  // if (userData && codeData !== null) {
  //   socket.on("connect", () => {
  //     socket.emit("lobby-join", { userId: userData.id, lobbyId: codeData });
  //   });
  // }

  // // Make your flappy jump
  // const jumpFunction = () => {
  //   socket.emit("jump", 1);
  // };

  // // Adding event listener for spacebar on mount
  // onMount(() => {
  //   window.addEventListener("keydown", (event) => {
  //     if (event.key === " " || event.key === "Spacebar") {
  //       jumpFunction();
  //     }
  //   });
  // });
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
