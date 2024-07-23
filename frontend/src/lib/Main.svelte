<script lang="ts">
	import { onMount } from "svelte";
	import Button from "./components/Button.svelte";
	import NumberInput from "./components/NumberInput.svelte";
	import { user, registered } from "../store.js";

	onMount(async () => {
		const res = await fetch("/api/user");
		const data = await res.json();
		registered.set(data.registered);
		user.set(data.user);
	});
</script>

<div class="header">
	{#if $registered}
		<Button text="Buy/Change Skins" link="/store"></Button>
		<Button text="Sign Out" link="/auth/logout"></Button>
	{:else}
		<Button text="Sign In" link="/auth/google"></Button>
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
