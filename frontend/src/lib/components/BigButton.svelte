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
    width: 100%; /* Make button occupy full width of its container */
    height: 100%; /* Make button occupy full height of its container */
  }

  .container1 {
    background-color: #553000;
    padding: 5px 5px 10px 5px;
    width: 100%; /* Ensure container1 occupies full width */
    height: 100%; /* Ensure container1 occupies full height */
    box-sizing: border-box; /* Include padding in width and height calculation */
  }

  .container2 {
    background-color: #fcfdfb;
    padding: 5px;
    width: 100%; /* Ensure container2 occupies full width */
    height: 100%; /* Ensure container2 occupies full height */
    box-sizing: border-box; /* Include padding in width and height calculation */
  }

  .container3 {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: "RetroGaming", sans-serif;
    font-size: 6vmin; /* Responsive font size */
    color: #fffefd;
    background-color: #e86101;
    padding: 10px;
    width: 100%; /* Ensure container3 occupies full width */
    height: 100%; /* Ensure container3 occupies full height */
    box-sizing: border-box; /* Include padding in width and height calculation */
  }

  button.button-link {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 100%; /* Ensure button occupies full width */
    height: 100%; /* Ensure button occupies full height */
  }

  button.button-link:focus {
    outline: none;
  }
</style>
