<script lang="ts">
  import Konva from "konva";
  import { onMount, onDestroy } from "svelte";

  // Constants
  const flappyWidth = 34 * (window.innerHeight / 400);
  const flappyHeight = 24 * (window.innerHeight / 400);

  const flappyData = [
    { midflapSrc: "src/assets/redbird-midflap.png" },
    { midflapSrc: "src/assets/yellowbird-midflap.png" },
    { midflapSrc: "src/assets/bluebird-midflap.png" },
  ];

  const StageConfig = {
    container: "container",
    width: 500,
    height: 500,
    draggable: true,
  };

  const imgObj = new Image();
  imgObj.src = flappyData[0].midflapSrc;
  const imageKonva = new Konva.Image({
    x: 100,
    y: 100,
    image: imgObj,
    width: flappyWidth,
    height: flappyHeight,
  });

  onMount(() => {
    // Stage Initialization
    const stage = new Konva.Stage(StageConfig);
    const layer = new Konva.Layer();
    stage.add(layer);

    // Draw Image
    layer.add(imageKonva);
  });
</script>

<div id="container"></div>

<style>
  #container {
    background-color: rgba(0, 0, 0, 0.3);
  }
</style>
