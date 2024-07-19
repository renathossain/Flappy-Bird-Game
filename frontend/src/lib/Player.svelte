<script>
  import { onMount } from "svelte";
  import io from "socket.io-client";

  // Initialize constants
  export let username;
  const socket = io("http://localhost:3000");

  // Make your flappy jump
  const jumpFunction = () => {
    socket.emit("jump", username);
  };

  // Adding event listener for spacebar on mount
  onMount(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Spacebar") {
        jumpFunction();
      }
    });
  });
</script>

<div class="container">
  <button on:click={jumpFunction}>Tap to Fly</button>
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  button {
    height: 80%;
    width: 80%;
    display: block;
    font-size: 80px;
  }
</style>
