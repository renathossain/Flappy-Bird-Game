<script lang="ts">
  import { Stage, Layer, Rect, Circle } from "svelte-konva";
  import { onMount } from "svelte";

  const defaultFlappy = {
    x: 50,
    y: window.innerHeight / 2,
    radius: 20,
    fill: "#f7f74c",
  };

  const stageProp = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const backgroundProp = {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    fill: "#70c5ce",
  };

  let flappyBird = defaultFlappy;

  let pipes = [];

  function gameLoop() {
    flappyBird.x += 1;
    requestAnimationFrame(gameLoop);
  }

  onMount(() => {
    gameLoop();
  });
</script>

<Stage config={stageProp}>
  <Layer>
    <Rect config={backgroundProp} />
    <Circle config={flappyBird} />
  </Layer>
</Stage>
