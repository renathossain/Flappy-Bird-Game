<script lang="ts">
  import Konva from "konva";
  import type { Rect } from "konva/lib/shapes/Rect";
  import { onMount } from "svelte";

  // Changeable Constants
  const backgroundColor = "#70c5ce";
  const flappyRightOffset = 50;
  const flappyRadius = 20;
  const flappyColor = "#f7f74c";
  const pipeWidth = 50;
  const pipeVerticalGap = 150;
  const pipeSpeed = 2;

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

  const defaultFlappyConfig = {
    x: flappyRightOffset,
    y: window.innerHeight / 2,
    radius: flappyRadius,
    fill: flappyColor,
  };

  // Data that changes during game
  let flappyConfig = defaultFlappyConfig;
  let needNewPipes = true;
  let pipePairs: { upperPipe: Rect; lowerPipe: Rect }[] = [];

  // Generate Upper and Lower Pipe Pair
  function generatePipePair() {
    if (needNewPipes) {
      const upperPipeHeight = Math.floor(
        Math.random() * (window.innerHeight - pipeVerticalGap),
      );
      const UpperPipeConfig = {
        x: window.innerWidth,
        y: 0,
        width: pipeWidth,
        height: upperPipeHeight,
        fill: "#4caf50",
      };
      const lowerPipeVertOffset = upperPipeHeight + pipeVerticalGap;
      const LowerPipeConfig = {
        x: window.innerWidth,
        y: lowerPipeVertOffset,
        width: pipeWidth,
        height: window.innerHeight - lowerPipeVertOffset,
        fill: "#4caf50",
      };
      pipePairs.push({
        upperPipe: new Konva.Rect(UpperPipeConfig),
        lowerPipe: new Konva.Rect(LowerPipeConfig),
      });
    }
  }

  onMount(() => {
    // Stage Initialization
    const stage = new Konva.Stage(StageConfig);
    const layer = new Konva.Layer();
    stage.add(layer);

    // Add Background and Flappy
    const background = new Konva.Rect(backgroundConfig);
    const flappy = new Konva.Circle(flappyConfig);
    layer.add(background);
    layer.add(flappy);

    // Generate Pipes
    generatePipePair();

    // Move Pipes
    pipePairs.forEach((pair) => {
      layer.add(pair.upperPipe);
      layer.add(pair.lowerPipe);
      const anim = new Konva.Animation(
        function () {
          pair.upperPipe.move({ x: -pipeSpeed, y: 0 });
          pair.lowerPipe.move({ x: -pipeSpeed, y: 0 });
        },
        [pair.upperPipe.getLayer(), pair.lowerPipe.getLayer()],
      );
      anim.start();
    });
  });
</script>

<div id="container"></div>
