<script lang="ts">
  import Button from "./Button.svelte";
  import Avatar from "./Avatar.svelte";

  const lobbyCode = 12345;
  const playerUsernames = ["amy", "bobby", "clinton"];
</script>

<div class="container">
  <div class="retro-container code">Code: {lobbyCode}</div>
  <div class="players">
    {#each playerUsernames as username}
      <Avatar {username} />
    {/each}
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
