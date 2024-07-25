<script lang="ts">
	import { navigate } from "svelte-routing";
	import Button from "./components/Button.svelte";
	import NumberInput from "./components/NumberInput.svelte";
	import ProfilePic from "./components/ProfilePic.svelte";
	import { user, codeStore } from "../store";
	import { get } from "svelte/store";

	const gotoLobby = () => {
		if ($user) {
			navigate("/lobby");
		} else {
			alert("Login to create a lobby.");
		}
	};
</script>

<div class="header">
	{#if $user}
		<Button text="Buy/Change Skins" link="/store"></Button>
		<Button text="Sign Out" link="/auth/logout"></Button>
		<ProfilePic />
	{:else}
		<Button text="Sign In" link="/auth/google"></Button>
	{/if}
</div>

<div class="container">
	<Button text="Start Singleplayer" link="/game"></Button>
	<Button text="Host Multiplayer" onClick={gotoLobby} />
	<div class="join">
		<NumberInput />
		<Button text="Join Lobby" link="/player/{$codeStore}"></Button>
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
