<script lang="ts">
  export let text: string;
  export let link: string | null = null;
  export let onClick: (() => void) | null = null;
  export let fontSize: string = "4vmin";
</script>

{#if link}
  <a class="button-link" href={link}>
    <div class="container1">
      <div class="container2">
        <div class="container3" style="font-size: {fontSize};">
          {text}
        </div>
      </div>
    </div>
  </a>
{:else if onClick}
  <button class="button-link" on:click={onClick}>
    <div class="container1">
      <div class="container2">
        <div class="container3" style="font-size: {fontSize};">
          {text}
        </div>
      </div>
    </div>
  </button>
{/if}

<style>
  .button-link {
    display: inline-block;
    text-decoration: none;
    white-space: nowrap;
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
    text-align: center;
    font-family: "RetroGaming", sans-serif;
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
