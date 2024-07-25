<script lang="ts">
	import { navigate } from "svelte-routing";
	import Button from "./components/Button.svelte";
	import NumberInput from "./components/NumberInput.svelte";
	import ProfilePic from "./components/ProfilePic.svelte";
	import { user } from "../store";

	const gotoLobby = () => {
		if ($user) {
			navigate("/lobby");
		} else {
			alert("Login to create lobby.");
		}
	};

	const joinLobby = () => {
		if ($user) {
			navigate("/player");
		} else {
			alert("Login to join lobby.");
		}
	};
</script>

<div class="header">
	{#if $user}
		<Button text="Buy/Change Skins" link="/store" />
		<Button text="Sign Out" link="/auth/logout" />
		<ProfilePic />
	{:else}
		<Button text="Sign In" link="/auth/google" />
	{/if}
</div>

<div class="container">
	<Button text="Start Singleplayer" link="/game" />
	<Button text="Host Multiplayer" onClick={gotoLobby} />
	<div class="join">
		<NumberInput />
		<Button text="Join Lobby" onClick={joinLobby} />
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
