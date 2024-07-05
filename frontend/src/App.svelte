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
  const pipeMovementSpeed = 2;
  const pipeHorizontalGap = 300;

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
  let pipePairs: { upperPipe: Rect; lowerPipe: Rect }[] = [];

  // Generate Upper and Lower Pipe Pair
  function generatePipePair() {
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
    const upperPipe = new Konva.Rect(UpperPipeConfig);
    const lowerPipe = new Konva.Rect(LowerPipeConfig);
    pipePairs.push({ upperPipe, lowerPipe });
    return { upperPipe, lowerPipe };
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

    // Initial pipe generation
    let { upperPipe, lowerPipe } = generatePipePair();
    layer.add(upperPipe);
    layer.add(lowerPipe);

    // Move Pipes
    const anim = new Konva.Animation(function (frame) {
      pipePairs.forEach((pair) => {
        pair.upperPipe.move({ x: -pipeMovementSpeed, y: 0 });
        pair.lowerPipe.move({ x: -pipeMovementSpeed, y: 0 });

        // Remove pipes that are off-screen
        if (pair.upperPipe.x() + pipeWidth < 0) {
          pair.upperPipe.destroy();
          pair.lowerPipe.destroy();
          pipePairs.shift();
        }
      });

      // Generate new pipes every `pipeHorizontalGap`
      const lastPipePair = pipePairs[pipePairs.length - 1];
      if (lastPipePair.upperPipe.x() <= window.innerWidth - pipeHorizontalGap) {
        let { upperPipe, lowerPipe } = generatePipePair();
        layer.add(upperPipe);
        layer.add(lowerPipe);
      }
    }, layer);
    anim.start();

    return () => {
      anim.stop();
    };
  });
</script>

<div id="container"></div>
