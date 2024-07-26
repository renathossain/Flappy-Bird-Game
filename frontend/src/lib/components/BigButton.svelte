<script lang="ts">
  export let text: string;
  export let link: string | null = null;
  export let onClick: (() => void) | null = null;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === " ") {
      event.preventDefault();
    }
  }
</script>

{#if link}
  <a class="button-link" href={link}>
    <div class="container1">
      <div class="container2">
        <div class="container3">
          {text}
        </div>
      </div>
    </div>
  </a>
{:else if onClick}
  <button class="button-link" on:click={onClick} on:keydown={handleKeyDown}>
    <div class="container1">
      <div class="container2">
        <div class="container3">
          {text}
        </div>
      </div>
    </div>
  </button>
{/if}

<style>
  .button-link {
    display: block;
    text-decoration: none;
    margin-bottom: 20px;
  }

  .container1 {
    background-color: #553000;
    padding: 5px 5px 10px 5px;
  }

  .container2 {
    background-color: #fcfdfb;
    padding: 5px;
  }

  .container3 {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
    max-height: 768px;
    width: 80vw;
    max-width: 1024px;
    text-align: center;
    font-family: "RetroGaming", sans-serif;
    font-size: 80px;
    color: #fffefd;
    background-color: #e86101;
    padding: 10px;
  }

  button.button-link {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  button.button-link:focus {
    outline: none;
  }
</style>
