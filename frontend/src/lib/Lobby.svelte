<script lang="ts">
    import { navigate } from "svelte-routing";

    // Function to navigate to the game route
    const navigateToGame = () => {
        navigate("/game");
    };

    // Function to navigate to the player route with a specific username
    const navigateToPlayer = (username: string) => {
        navigate(`/player/${username}`);
    };
</script>

<div class="lobby-container">
    <h1>Welcome to the Lobby</h1>
    <button on:click={navigateToGame}>Play Game</button>
    <div class="player-buttons">
        <button on:click={() => navigateToPlayer("0")}>Player 0</button>
        <button on:click={() => navigateToPlayer("1")}>Player 1</button>
        <button on:click={() => navigateToPlayer("2")}>Player 2</button>
    </div>
</div>

<style>
    .lobby-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    button {
        margin: 10px;
        padding: 10px 20px;
        font-size: 1.2em;
        cursor: pointer;
    }

    .player-buttons {
        margin-top: 20px;
    }
</style>
