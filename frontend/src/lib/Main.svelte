<script lang="ts">
	import Button from "./components/Button.svelte";
	import NumberInput from "./components/NumberInput.svelte";
	import ProfilePic from "./components/ProfilePic.svelte";
	import { user } from "../store";
</script>

<div class="header">
	{#if $user}
		<Button text="Buy/Change Skins" link="/store"></Button>
		<Button text="Sign Out" link="/auth/logout"></Button>
		<ProfilePic></ProfilePic>
	{:else}
		<Button text="Sign In" link="/auth/google"></Button>
	{/if}
</div>

<div class="container">
	<Button text="Start Singleplayer" link="/game"></Button>
	<Button text="Host Multiplayer" link="/lobby"></Button>
	<div class="join">
		<NumberInput />
		<Button text="Join Lobby" link="/player"></Button>
	</div>
</div>

<style>
	.header {
		position: absolute;
		top: 20px;
		right: 20px;
		display: flex;
		align-items: flex-start;
		gap: 10px;
	}

	.container {
		display: flex;
		flex-direction: column;
	}
</style>
