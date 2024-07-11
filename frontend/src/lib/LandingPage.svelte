<main class="background-container">
<Dialog
  bind:open
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
  <Title id="simple-title">Dialog Title</Title>
  <Content id="simple-content">Super awesome dialog body text?</Content>
  <Actions>
    <Button on:click={() => (clicked = 'No')}>
      <Label>Join</Label>
    </Button>
    <Button on:click={() => (clicked = 'Yes')}>
      <Label>Close</Label>
    </Button>
  </Actions>
</Dialog>
 <div>
    <Button on:click={() => (open = true)}>
        <Label>Join Game</Label>
      </Button>
      <Button>
          <Label>Sign Up</Label>
      </Button>
 </div>
</main>
<script lang="ts">
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
 
  let open = false;
  let clicked = 'Nothing yet.';
</script>

<style>
    .background-container {
    width: 100vw;
    height: 100vh;
    background-image: url('../../public/background-night.png');
    background-repeat: repeat-x;
    background-size: contain;
  }
</style>