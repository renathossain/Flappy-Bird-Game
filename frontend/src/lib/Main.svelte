<script lang="ts">
	import { onMount } from "svelte";
	import Button from "./components/Button.svelte";
	import NumberInput from "./components/NumberInput.svelte";

	let userName: string | null = null;
</script>

<div class="header">
	{#if userName}
		<p>Welcome, {userName}</p>
		<Button text="Store" link="/store"></Button>
		<Button text="Sign Out" link=""></Button>
	{:else}
		<Button text="Sign In" link="http://localhost:3000/auth/google"></Button>
	{/if}
</div>

<div class="container">
	<div class="start">
		<Button text="Start Singleplayer" link="/game"></Button>
		<Button text="Host Multiplayer" link="/lobby"></Button>
	</div>
	<div class="join">
		<NumberInput />
		<Button text="Join Lobby" link="/player/0"></Button>
	</div>
</div>

<style>
	.header {
		position: absolute;
		top: 20px;
		right: 20px;
	}

	.container {
		display: flex;
		flex-direction: column;
	}
</style>
