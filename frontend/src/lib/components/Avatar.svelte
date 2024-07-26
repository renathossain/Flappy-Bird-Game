<script lang="ts">
  export let givenName: string;
  export let currentSkin: number;
</script>

<div class="container">
  <div class="username">{givenName}</div>
  <img src="/assets/flappies/{currentSkin}.png" alt="Flappy" />
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    max-width: 50vmin;
    max-height: 50vmin;
    justify-content: center;
    align-items: center;
    border: 4px solid #543847;
    margin: 50px auto;

    /* Glassy effect */
    background-color: rgba(255, 255, 255, 0.2); /* semi-transparent white */
    backdrop-filter: blur(10px); /* blur behind the element */
    border-radius: 10px; /* rounded corners */
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* subtle shadow */
    transition: background-color 0.3s ease; /* smooth transition */
  }

  .username {
    font-family: "RetroGaming", sans-serif;
    color: #553000;
    font-size: 2vw;
    margin-bottom: 10px;
  }

  img {
    image-rendering: pixelated;
    width: 20vmin;
    max-width: 300px;
    margin-top: 20px;
  }
</style>
