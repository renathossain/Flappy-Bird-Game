<script lang="ts">
  //https://medium.com/@jack.dixon.ryan/sveltequest-iii-making-api-calls-fffda33e5527
  import Card from "./components/Card.svelte";
  import type { Skin } from "../types/skin";
  import Button from "./components/Button.svelte";
  import { onMount } from "svelte";
  import { user } from "../store";
  import { navigate } from "svelte-routing";
  import { Socket } from "socket.io-client";

  export let pageState = "";
  export let socket: Socket | null = null;

  let skins: Skin[] = [];
  let prevCursor: number | null = null;
  let nextCursor: number | null = null;
  let currentSkin: number = 1;

  const backFunction = () => {
    if (pageState === "") {
      navigate("/");
    } else if (pageState === "store") {
      pageState = "player";
    }
  };

  async function getSkins(cursor: number | null, action: string | null) {
    if ($user) {
      const res = await fetch(
        `/api/skin/?cursor=${cursor}&action=${action}&userId=${$user.id}`,
      );
      const data = await res.json();
      skins = data.data.map((skin: any) => {
        return {
          id: skin.id,
          price: skin.price,
          imagePath: skin.imageMetadata.path,
          purchased: skin.purchased,
        };
      });
      prevCursor = data.prev;
      nextCursor = data.next;
      currentSkin = data.currentSkin;
    }
  }

  function handleNext() {
    if (nextCursor) getSkins(nextCursor, "next");
  }
  function handlePrev() {
    if (prevCursor) getSkins(prevCursor, "prev");
  }

  onMount(() => {
    getSkins(null, null);
  });
</script>

<main>
  <div class="header">
    <Button text="Back" onClick={backFunction}></Button>
    <Button text="Sign Out" link="/api/auth/logout"></Button>
  </div>
  <div class="container">
    <div class="skins">
      {#each skins as skin}
        <Card
          id={skin.id}
          price={skin.price}
          image={skin.imagePath}
          purchased={skin.purchased}
          bind:currentSkinNumber={currentSkin}
          {socket}
        ></Card>
      {/each}
    </div>
    <div class="buttons-pagination">
      {#if prevCursor !== null && prevCursor !== 1}
        <button class="button-pag" on:click={handlePrev}>Previous</button>
      {/if}
      {#if nextCursor != null && nextCursor !== 20}
        <button class="button-pag next-button" on:click={handleNext}
          >Next</button
        >
      {/if}
    </div>
  </div>
</main>

<style>
  .header {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1;
  }
  .skins {
    margin-bottom: 20px;
    flex: auto;
    display: grid;
    column-gap: 20px;
    /* grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); */
    justify-content: center; /* Center the cards horizontally */
    flex-wrap: wrap; /* Allow wrapping of cards if they don't fit in one line */
    gap: 20px; /* Adjust the gap between cards */
  }
  .buttons-pagination {
    display: flex;
    justify-content: space-between;
    position: absolute;
    gap: 20px;
    bottom: 60px;
    padding: 0 20px;
    width: 85vw;
    z-index: 1;
  }
  .container {
    flex: 1;
    width: 90vw;
    height: 80vh;
    margin: 20px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    overflow-y: auto;
  }

  .button-pag {
    background-color: yellow;
    font-family: "RetroGaming", sans-serif;
    font-size: 20px;
    cursor: pointer;
  }

  .next-button {
    margin-left: auto;
  }

  /* larger screens */

  @media (min-width: 1200px) {
    .skins {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  /* smaller screens */
  @media (max-width: 1199px) {
    .skins {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
  }
</style>
