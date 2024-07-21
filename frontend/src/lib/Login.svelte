<script lang="ts">
  import Dialog, { Title, Actions } from "@smui/dialog";
  import Button, { Label } from "@smui/button";

  let openJoinGame = false;
  let openSignUp = false;
  let gameCode = "";
  let username = "";
  let password = "";
  let clicked = "Not clicked";

  function handleJoinGame() {
    console.log("Join Game");
    openJoinGame = false;
  }

  function handleSignUp() {
    console.log("Sign Up");
    openSignUp = false;
  }
</script>

<!-- https://github.com/hperrin/svelte-material-ui/blob/master/packages/site/src/routes/demo/dialog/_Simple.svelte -->
<link rel="stylesheet" href="node_modules/svelte-material-ui/bare.css" />
<main class="background-container">
  <div class="join-game-dialog">
    <Dialog
      bind:open={openJoinGame}
      aria-labelledby="simple-title"
      aria-describedby="simple-content"
    >
      <Title id="simple-title">Enter Game Code</Title>
      <form>
        <Actions>
          <input
            type="text"
            placeholder="Enter Game Code"
            bind:value={gameCode}
          />
          <Button on:click={() => (clicked = "No")}>
            <Label>Join</Label>
          </Button>
          <Button on:click={() => (clicked = "Yes")}>
            <Label>Close</Label>
          </Button>
        </Actions>
      </form>
    </Dialog>
  </div>
  <div>
    <Dialog
      bind:open={openSignUp}
      aria-labelledby="simple-title"
      aria-describedby="simple-content"
    >
      <Title id="simple-title">Signup or Signin</Title>
      <form class="form-style">
        <input type="text" placeholder="Enter Username" bind:value={username} />
        <input type="text" placeholder="Enter Password" bind:value={password} />
        <Button on:click={() => (clicked = "No")}>
          <Label>Signup</Label>
        </Button>
        <Button on:click={() => (clicked = "Yes")}>
          <Label>Close</Label>
        </Button>
      </form>
    </Dialog>
  </div>
  <a href="http://localhost:3000/auth/google">Login with Google</a>

  <div class="centre-buttons">
    <Button on:click={() => (openJoinGame = true)}>
      <Label>Join Game</Label>
    </Button>
    <Button on:click={() => (openSignUp = true)}>
      <Label>Sign Up</Label>
    </Button>
  </div>
</main>

<style>
  .centre-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .form-style {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
