<script lang="ts">
	import { navigate } from "svelte-routing";
	import Button from "./components/Button.svelte";
	import NumberInput from "./components/NumberInput.svelte";
	import ProfilePic from "./components/ProfilePic.svelte";
	import { user, code, host } from "../store";

	const gotoLobby = async () => {
		if ($user) {
			const res = await fetch("/api/lobby", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: $user.id,
				}),
			});
			const data = await res.json();
			if (data.error) {
				$host = null;
				alert(data.error);
			} else {
				if (data.lobbyId) {
					$host = data.lobbyId;
					navigate("/lobby");
				}
			}
		} else {
			$host = null;
			alert("Login to create lobby.");
		}
	};

	const joinLobby = async () => {
		if ($user && $code !== null) {
			if ($code !== null && /^\d{4}$/.test($code.toString())) {
				const res = await fetch("/api/lobby/join", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: $user.id,
						lobbyId: $code,
					}),
				});
				const data = await res.json();
				if (data.error) {
					alert(data.error);
				} else {
					navigate("/player");
				}
			} else {
				alert("Enter a valid 4-digit code.");
			}
		} else {
			alert("Login to join lobby.");
		}
	};
</script>

<div class="header">
	{#if $user}
		<div class="auth">
			<ProfilePic />
			<Button text="Sign Out" link="/auth/logout" fontSize="3vmin" />
			<Button text="Skins" link="/store" fontSize="3vmin" />
		</div>
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
		row-gap: 20px;
	}

	.auth {
		display: flex;
		flex-direction: column;
		row-gap: 10px;
	}
</style>
