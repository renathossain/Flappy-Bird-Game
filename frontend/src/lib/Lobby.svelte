<script lang="ts">
  import Textbox from "./Textbox.svelte";
  import { navigate } from "svelte-routing";

  const code = 12345;

  // Function to navigate to the player route with a specific username
  const navigateToPlayer = (username: string) => {
    navigate(`/player/${username}`);
  };
</script>

<div class="container">
  <div class="retro-container code">Code: {code}</div>
  <div class="retro-container players">
    <div class="player"></div>
    <div class="player"></div>
    <div class="player"></div>
  </div>
</div>

<style>
  .container {
    width: calc(100vw - 40px);
    height: calc(100vh - 400px);
    margin: 20px;
    display: flex;
    flex-direction: column;
  }

  .players {
    flex: auto;
    display: flex;
    column-gap: 20px;
  }

  .player {
    background-color: rgba(0, 0, 0, 0.3);
    flex: auto;
  }

  .code {
    width: 500px;
    margin-bottom: 20px;
  }
</style>
