<script lang="ts">
  import Konva from "konva";
  import { onMount, onDestroy } from "svelte";

  // Changeable Constants
  const flappyRightOffset = window.innerHeight / 10;
  const flappyWidth = 34 * (window.innerHeight / 400);
  const flappyHeight = 24 * (window.innerHeight / 400);
  const flappyImgSource = "src/assets/redbird-midflap.png";
  const flappyJumpHeight = -window.innerHeight / 140;
  const flappyGravity = window.innerHeight / 3000;
  const pipeWidth = window.innerHeight / 16;
  const pipeVerticalGap = window.innerHeight / 4;
  const pipeMovementSpeed = window.innerHeight / 250;
  const pipeHorizontalGap = window.innerHeight / 2;
  const pipeColor = "#4caf50";

  // Default Data Structures
  const StageConfig = {
    container: "container",
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
  };

  const flappyImgObj = new Image();
  flappyImgObj.src = flappyImgSource;

  const flappyConfig = {
    x: flappyRightOffset,
    y: window.innerHeight / 2,
    image: flappyImgObj,
    width: flappyWidth,
    height: flappyHeight,
  };

  const scoreTextConfig = {
    x: 10,
    y: 10,
    text: "Score: 0",
    fontSize: 20,
    fontFamily: "Arial",
    fill: "#000",
  };

  const topTextConfig = {
    x: window.innerWidth / 2 - 100,
    y: window.innerHeight / 2,
    text: "Press Space to Start",
    fontSize: 30,
    fontFamily: "Arial",
    fill: "#000",
  };

  // Data that changes during game
  let gameRunning = false;
  let gameOver = false;
  let score = 0;
  let flappyVelocity = 0;
  let pipePairs: {
    upperPipe: Konva.Rect;
    lowerPipe: Konva.Rect;
    passed: boolean;
  }[] = [];

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
      fill: pipeColor,
    };

    const lowerPipeVertOffset = upperPipeHeight + pipeVerticalGap;

    const LowerPipeConfig = {
      x: window.innerWidth,
      y: lowerPipeVertOffset,
      width: pipeWidth,
      height: window.innerHeight - lowerPipeVertOffset,
      fill: pipeColor,
    };

    const upperPipe = new Konva.Rect(UpperPipeConfig);
    const lowerPipe = new Konva.Rect(LowerPipeConfig);
    pipePairs.push({ upperPipe, lowerPipe, passed: false });
    return { upperPipe, lowerPipe, passed: false };
  }

  // Check Collision between 2 sprites
  function isCollision(sprite1: Konva.Shape, sprite2: Konva.Shape) {
    const sprite1Bounds = sprite1.getClientRect();
    const sprite2Bounds = sprite2.getClientRect();
    return (
      sprite1Bounds.x + sprite1Bounds.width > sprite2Bounds.x &&
      sprite1Bounds.x < sprite2Bounds.x + sprite2Bounds.width &&
      sprite1Bounds.y + sprite1Bounds.height > sprite2Bounds.y &&
      sprite1Bounds.y < sprite2Bounds.y + sprite2Bounds.height
    );
  }

  onMount(() => {
    // Stage Initialization
    const stage = new Konva.Stage(StageConfig);
    const layer = new Konva.Layer();
    const layerTop = new Konva.Layer();
    stage.add(layer);
    stage.add(layerTop);

    // Add Flappy and Text Sprites
    const flappy = new Konva.Image(flappyConfig);
    const scoreText = new Konva.Text(scoreTextConfig);
    const topText = new Konva.Text(topTextConfig);
    flappyImgObj.onload = () => {
      layer.add(flappy);
    };
    layerTop.add(scoreText);
    layerTop.add(topText);

    // Initial pipe generation
    let { upperPipe, lowerPipe } = generatePipePair();
    layer.add(upperPipe);
    layer.add(lowerPipe);

    // Create Animation
    const anim = new Konva.Animation(() => {
      function stopGame() {
        gameOver = true;
        gameRunning = false;
        anim.stop();
        topText.text("Game Over");
        layerTop.add(topText);
      }

      // If flappy hits the ground or ceiling, gameover
      if (
        flappy.y() + flappy.height() === window.innerHeight || // ground
        flappy.y() === 0 // ceiling
      ) {
        stopGame();
      }

      pipePairs.forEach((pair) => {
        // If flappy collides with a pipe, gamover
        if (
          isCollision(flappy, pair.upperPipe) ||
          isCollision(flappy, pair.lowerPipe)
        ) {
          stopGame();
        }

        // Move existing pipes
        pair.upperPipe.move({ x: -pipeMovementSpeed, y: 0 });
        pair.lowerPipe.move({ x: -pipeMovementSpeed, y: 0 });

        // Update score once flappy passes
        if (
          pair.upperPipe.x() + pipeWidth < flappyRightOffset &&
          !pair.passed
        ) {
          pair.passed = true;
          score++;
          scoreText.text(`Score: ${score}`);
        }

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

      // Animate Flappy
      flappy.position({
        x: flappy.x() + 0,
        y: Math.max(
          Math.min(
            flappy.y() + flappyVelocity, // in between ground and ceiling
            window.innerHeight - flappy.height(), // ground
          ),
          0, // ceiling
        ),
      });
      flappyVelocity += flappyGravity;
    }, layer);

    // Handle spacebar events
    window.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        if (!gameRunning && !gameOver) {
          // Start game when spacebar is pressed
          gameRunning = true;
          topText.remove();
          anim.start();
        } else if (gameRunning && !gameOver) {
          // Make Flappy Jump when Spacebar pressed
          flappyVelocity = flappyJumpHeight;
        }
      }
      // Pause game when Escape is pressed
      if (event.key === "Escape") {
        if (gameRunning && !gameOver) {
          gameRunning = false;
          anim.stop();
          topText.text("Paused");
          layerTop.add(topText);
        }
      }
    });

    onDestroy(() => {
      if (anim) {
        anim.stop();
      }
    });
  });
</script>

<div id="container"></div>

<style>
  #container {
    height: 100vh;
    width: 100vw;
    background-image: url("src/assets/background-day.png");
    background-repeat: repeat-x;
    background-size: contain;
  }
</style>
