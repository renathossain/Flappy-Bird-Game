<script lang="ts">
	let code: string = "";
	import Button from "./Button.svelte";
</script>

<div class="container">
	<div class="join">
		<input
			type="text"
			bind:value={code}
			on:input={() => (code = code.replace(/\D/g, ""))}
		/>
		<Button text="Join" link="/player/0"></Button>
	</div>
	<Button text="Start Singleplayer" link="/game"></Button>
	<Button text="Host Multiplayer" link="/lobby"></Button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
</style>
