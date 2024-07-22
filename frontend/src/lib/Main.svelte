<script lang="ts">
	import Button from "./components/Button.svelte";
	import NumberInput from "./components/NumberInput.svelte";
</script>

<div class="sign-in-button">
	<Button text="Store" link="/signin"></Button>
	<Button text="Sign In" link="/signin"></Button>
</div>

<div class="container">
	<div class="join">
		<NumberInput />
		<Button text="Join Lobby" link="/player/0"></Button>
	</div>
	<div class="start">
		<Button text="Start Singleplayer" link="/game"></Button>
		<Button text="Host Multiplayer" link="/lobby"></Button>
	</div>
</div>

<style>
	.sign-in-button {
		position: absolute;
		top: 20px;
		right: 20px;
	}

	.container {
		display: flex;
		flex-direction: column;
	}
</style>
