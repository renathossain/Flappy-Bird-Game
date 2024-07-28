<script lang="ts">
    //https://medium.com/@jack.dixon.ryan/sveltequest-iii-making-api-calls-fffda33e5527
    import Card from "./components/Card.svelte";
    import type { Skin } from "../types/skin";
    import Button from "./components/Button.svelte";
    import { onMount } from "svelte";
    import { user } from "../store";

    let skins: Skin[] = [];
    let prevCursor: number | null = null;
    let nextCursor: number | null = null;
    let limit = 5;
    
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
        <Button text="Main" link="/"></Button>
        <!-- maybe needs registration because users can do /store and get to this route without being registered -->
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
                ></Card>
            {/each}
        </div>
        <div class="buttons-pagination">
            {#if prevCursor !== null && prevCursor !== 1}
                <button class="button-pag" on:click={handlePrev}
                    >Previous</button
                >
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
    }
    .container {
        width: 90vw;
        height: 80vh;
        margin: 20px;
        display: flex;
        flex-direction: column;
        padding: 20px;
    }
    .skins {
        margin-bottom: 20px;
        flex: auto;
        display: flex;
        column-gap: 20px;
    }
    .buttons-pagination {
        display: flex;
        justify-content: space-between;
        position: absolute;
        gap: 20px;
        bottom: 60px;
        padding: 0 20px;
        width: 85vw;
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
</style>
