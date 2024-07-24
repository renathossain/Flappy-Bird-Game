<script lang="ts">
	import { navigate } from "svelte-routing";
	import Button from "./components/Button.svelte";
	import NumberInput from "./components/NumberInput.svelte";
	import ProfilePic from "./components/ProfilePic.svelte";
	import { user, codeStore } from "../store";
	import { get } from "svelte/store";

	async function createLobby() {
		const currentUser = get(user);
		if (currentUser) {
			try {
				// Make a POST request to /api/lobby
				const response = await fetch("/api/lobby", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ userId: currentUser.id }),
				});

				// Check if the response is okay
				if (!response.ok) {
					throw new Error("Failed to create lobby");
				}

				// Parse the response as JSON
				const data = await response.json();

				// Extract the id from the response
				const { lobbyId } = data;

				// Redirect to /lobby/{lobbyId} using svelte-routing
				navigate(`/lobby/${lobbyId}`);
			} catch (error) {
				console.error("Error:", error);
			}
		} else {
			alert("Please log in to create a lobby.");
		}
	}
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
	<Button text="Host Multiplayer" onClick={createLobby} />
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
