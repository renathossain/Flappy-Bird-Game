<script lang="ts">
  import Konva from "konva";
  import { onMount, onDestroy } from "svelte";

  // Magic Constants
  const flappyRightOffset = window.innerHeight / 10;
  const flappyWidth = 34 * (window.innerHeight / 400);
  const flappyHeight = 24 * (window.innerHeight / 400);
  const flappyJumpHeight = -window.innerHeight / 140;
  const flappyGravity = window.innerHeight / 3000;
  const pipeWidth = window.innerHeight / 16;
  const pipeVerticalGap = window.innerHeight / 4;
  const pipeMovementSpeed = window.innerHeight / 250;
  const pipeHorizontalGap = window.innerHeight / 2;

  // Flappies Constants
  const noOfFlappies = 2;
  const flappyImgSources = [
    "src/assets/redbird-midflap.png",
    "src/assets/yellowbird-midflap.png",
    "src/assets/bluebird-midflap.png",
  ];
  const flappyImgObjs = flappyImgSources.map((src) => {
    const imgObj = new Image();
    imgObj.src = src;
    return imgObj;
  });
  const jumpKeyBinds = [" ", "o", "p"];

  // Flappies Data Structure
  type FlappyObject = {
    imageKonva: Konva.Image;
    imageObj: HTMLImageElement;
    downVelocity: number;
    playing: boolean;
    jumpKeyBind: string;
  };

  const flappies = flappyImgObjs.slice(0, noOfFlappies).map((imgObj, index) => {
    const imageKonva = new Konva.Image({
      x: flappyRightOffset,
      y: window.innerHeight / 2,
      image: imgObj,
      width: flappyWidth,
      height: flappyHeight,
    });
    return {
      imageKonva: imageKonva,
      imageObj: imgObj,
      downVelocity: 0,
      playing: true,
      jumpKeyBind: jumpKeyBinds[index],
    };
  });

  // Stage and Game Text
  let gameRunning = false;
  let gameOver = false;
  let score = 0;

  const StageConfig = {
    container: "container",
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: false,
  };

  const scoreTextConfig = {
    x: 10,
    y: 10,
    text: "Score: 0",
    fontSize: 30,
    fontFamily: "Arial",
    fill: "#000",
  };

  const topTextConfig = {
    x: window.innerWidth / 2 - 100,
    y: window.innerHeight / 2,
    text: "Press Space to Start",
    fontSize: 40,
    fontFamily: "Arial",
    fill: "#000",
  };

  // Pipe Data Structures
  const pipeUpperImgObj = new Image();
  pipeUpperImgObj.src = "src/assets/pipe-green-upper.png";

  const pipeLowerImgObj = new Image();
  pipeLowerImgObj.src = "src/assets/pipe-green-lower.png";

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
      image: pipeUpperImgObj,
      width: pipeWidth,
      height: upperPipeHeight,
    };

    const lowerPipeVertOffset = upperPipeHeight + pipeVerticalGap;

    const LowerPipeConfig = {
      x: window.innerWidth,
      y: lowerPipeVertOffset,
      image: pipeLowerImgObj,
      width: pipeWidth,
      height: window.innerHeight - lowerPipeVertOffset,
    };

    const upperPipe = new Konva.Image(UpperPipeConfig);
    const lowerPipe = new Konva.Image(LowerPipeConfig);

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
    const scoreText = new Konva.Text(scoreTextConfig);
    const topText = new Konva.Text(topTextConfig);
    flappies.forEach((flappy) => {
      flappy.imageObj.onload = () => {
        layer.add(flappy.imageKonva);
      };
    });
    layerTop.add(scoreText);
    layerTop.add(topText);

    // Initial pipe generation
    let { upperPipe, lowerPipe } = generatePipePair();
    layer.add(upperPipe);
    layer.add(lowerPipe);

    // Create Animation
    const anim = new Konva.Animation(() => {
      // Function to stop the game
      function stopGame() {
        gameOver = true;
        gameRunning = false;
        anim.stop();
        topText.text("Game Over");
        layerTop.add(topText);
      }

      // Animate Flappy
      function animateFlappy(flappy: FlappyObject) {
        // Calculate boundaries
        const ground = window.innerHeight - flappy.imageKonva.height();
        const ceiling = 0;

        // If flappy hits boundary, its out
        if (
          flappy.imageKonva.y() >= ground ||
          flappy.imageKonva.y() <= ceiling
        ) {
          flappy.playing = false;
        }

        if (flappy.playing) {
          // If flappy is in play, calculate new Y
          const newY = flappy.imageKonva.y() + flappy.downVelocity;
          flappy.imageKonva.position({
            x: flappy.imageKonva.x(),
            y: Math.max(Math.min(newY, ground), ceiling),
          });
        } else {
          // If flappy is out and the last one, stop the game
          if (flappies.length === 1) {
            stopGame();
          }

          // If flappy is out and not last, it gets sweeped out
          flappy.imageKonva.position({
            x: flappy.imageKonva.x() - pipeMovementSpeed,
            y: flappy.imageKonva.y(),
          });

          // Remove flappies that are off-screen
          if (flappy.imageKonva.x() + flappy.imageKonva.width() < 0) {
            const flappyIndex = flappies.indexOf(flappy);
            if (flappyIndex !== -1) {
              flappies.splice(flappyIndex, 1);
            }
            flappy.imageKonva.destroy();
          }
        }
        flappy.downVelocity += flappyGravity;
      }

      // Animate all flappies
      flappies.forEach((flappy) => {
        animateFlappy(flappy);
      });

      pipePairs.forEach((pair) => {
        // If flappy collides with a pipe, it loses
        function pipeCollisionCheck(flappy: FlappyObject) {
          if (
            isCollision(flappy.imageKonva, pair.upperPipe) ||
            isCollision(flappy.imageKonva, pair.lowerPipe)
          ) {
            flappy.playing = false;
          }
        }

        // Perform pipe collision check for all flappies
        flappies.forEach((flappy) => {
          pipeCollisionCheck(flappy);
        });

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
    }, layer);

    // Handle spacebar events
    window.addEventListener("keydown", (event) => {
      if (!gameRunning && !gameOver) {
        if (event.key === " ") {
          // Start game when spacebar is pressed
          gameRunning = true;
          topText.remove();
          anim.start();
        }
      } else if (gameRunning && !gameOver) {
        // Make flappies jump
        flappies.forEach((flappy) => {
          if (event.key === flappy.jumpKeyBind) {
            flappy.downVelocity = flappyJumpHeight;
          }
        });
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
