<script lang="ts">
  import Konva from "konva";
  import { onMount, onDestroy } from "svelte";

  // Changeable Constants
  const backgroundColor = "#70c5ce";
  const flappyRightOffset = 50;
  const flappyRadius = 20;
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

  const flappyConfig = {
    x: flappyRightOffset,
    y: window.innerHeight / 2,
    radius: flappyRadius,
    fill: flappyColor,
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
    x: window.innerWidth / 2 - 80,
    y: window.innerHeight / 2,
    text: "",
    fontSize: 30,
    fontFamily: "Arial",
    fill: "#000",
  };

  // Data that changes during game
  let gameRunning = false;
  let gameOver = false;
  let score = 0;
  let flappyVelocity = 0;
  let pipePairs: { upperPipe: Konva.Rect; lowerPipe: Konva.Rect }[] = [];

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
    pipePairs.push({ upperPipe, lowerPipe });
    return { upperPipe, lowerPipe };
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

    // Add Background, Flappy and Score
    const background = new Konva.Rect(backgroundConfig);
    const flappy = new Konva.Circle(flappyConfig);
    const scoreText = new Konva.Text(scoreTextConfig);
    const topText = new Konva.Text(topTextConfig);
    layer.add(background);
    layer.add(flappy);
    layerTop.add(scoreText);

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
        flappy.y() + flappy.radius() === window.innerHeight ||
        flappy.y() - flappy.radius() === 0
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

        // Remove pipes that are off-screen
        if (pair.upperPipe.x() + pipeWidth < 0) {
          pair.upperPipe.destroy();
          pair.lowerPipe.destroy();
          pipePairs.shift();
          score++;
          scoreText.text(`Score: ${score}`);
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
            window.innerHeight - flappy.radius(), // ground
          ),
          flappy.radius(), // ceiling
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
