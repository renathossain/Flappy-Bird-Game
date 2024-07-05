<script lang="ts">
  import { Stage, Layer, Rect, Circle } from "svelte-konva";

  // Bird variables
  let birdX = 50;
  let birdY = window.innerHeight / 2;
  let birdRadius = 20;
  let birdColor = "#f7f74c";
  let gravity = 0.1;
  let jumpStrength = -2;
  let birdSpeed = 0;

  // Pipe variables
  let pipeWidth = 50;
  let pipeGap = 150;
  let pipeDistance = 300;
  let pipes = [];

  // Game variables
  let score = 0;
  let gameOver = false;
</script>

<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  <Layer>
    <Rect
      config={{
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        fill: "#70c5ce",
      }}
    />
  </Layer>
  <Layer>
    <Circle
      config={{
        x: birdX,
        y: birdY,
        radius: birdRadius,
        fill: birdColor,
      }}
    />
  </Layer>
</Stage>
