<script lang="ts">
	import Konva from "konva";
	import { onMount, onDestroy } from "svelte";

	// Changeable Constants
	const backgroundColor = "#70c5ce";
	const flappyRightOffset = 200;
	const flappyWidth = 34 * 4;
	const flappyHeight = 24 * 4;
	const flappyColor = "#f7f74c";
	const flappyJumpHeight = -4;
	const flappyGravity = 0.3;
	const pipeWidth = window.innerHeight / 16;
	const pipeVerticalGap = window.innerHeight / 4;
	const pipeMovementSpeed = 2;
	const pipeHorizontalGap = window.innerWidth / 4;
	const pipeColor = "#4caf50";

	// Default Data Structures
	const StageConfig = {
		container: "container",
		width: window.innerWidth,
		height: window.innerHeight,
		draggable: true,
	};

	const backgroundConfig = {
		x: 0,
		y: 0,
		width: window.innerWidth,
		height: window.innerHeight,
		fill: backgroundColor,
	};

	const flappyImgObj = new Image();

	const flappyConfig = {
		x: flappyRightOffset,
		y: window.innerHeight / 2,
		image: flappyImgObj,
		width: flappyWidth,
		height: flappyHeight,
	};

	onMount(() => {
		// Stage Initialization
		const stage = new Konva.Stage(StageConfig);
		const layer = new Konva.Layer();
		stage.add(layer);

		const background = new Konva.Rect(backgroundConfig);
		layer.add(background);

		const flappy = new Konva.Image(flappyConfig);
		flappyImgObj.onload = function () {
			layer.add(flappy);
		};
		flappyImgObj.src = "src/assets/redbird-midflap.png";

		const anim = new Konva.Animation(() => {});
	});
</script>

<div id="container"></div>
