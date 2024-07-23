<script lang="ts">
	import Button from "./components/Button.svelte";
	import NumberInput from "./components/NumberInput.svelte";
	import ProfilePic from "./components/ProfilePic.svelte";
	import { user, registered } from "../store";
</script>

<div class="header">
	{#if $registered}
		<Button text="Buy/Change Skins" link="/store"></Button>
		<Button text="Sign Out" link="/auth/logout"></Button>
		<ProfilePic></ProfilePic>
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
		<Button text="Join Lobby" link="/player"></Button>
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
