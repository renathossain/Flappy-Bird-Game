<script lang="ts">
  import Konva from "konva";
  import { onMount } from "svelte";

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
    fill: "#70c5ce",
  };

  const defaultFlappyConfig = {
    x: 50,
    y: window.innerHeight / 2,
    radius: 20,
    fill: "#f7f74c",
  };

  let flappyConfig = defaultFlappyConfig;

  let pipes = [];

  onMount(() => {
    const stage = new Konva.Stage(StageConfig);
    const layer = new Konva.Layer();
    const background = new Konva.Rect(backgroundConfig);
    const flappy = new Konva.Circle(flappyConfig);
    layer.add(background);
    layer.add(flappy);
    stage.add(layer);
    const anim = new Konva.Animation(function (frame) {
      flappy.move({ x: 2, y: 0 });
    }, flappy.getLayer());
    anim.start();
  });
</script>

<div id="container"></div>
