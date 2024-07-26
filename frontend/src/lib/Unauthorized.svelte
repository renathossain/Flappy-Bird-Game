<script lang="ts">
  import Button from "./components/Button.svelte";
</script>

<div class="container">
  <div class="message">Unauthorized</div>
  <div class="message">You need to be logged in to access this page.</div>
  <Button text="Return to Login Page" link="/" />
</div>

<style>
  .message {
    font-family: "RetroGaming", sans-serif;
    font-size: 20px;
    margin-bottom: 20px;
  }
</style>
