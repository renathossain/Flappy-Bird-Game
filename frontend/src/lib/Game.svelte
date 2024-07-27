<script lang="ts">
  import Konva from "konva";
  import { onMount, onDestroy } from "svelte";
  import { Socket } from "socket.io-client";

  // Imported variables
  export let socket: Socket | null = null;
  export let players: {
    userId: string;
    givenName: string;
    currentSkin: number;
  }[] = [
    {
      userId: "1",
      givenName: "Player",
      currentSkin: 1,
    },
  ];

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

  // Flappies Data Structure
  type FlappyObject = {
    userId: string;
    givenName: string;
    imageKonva: Konva.Image;
    imageObj: HTMLImageElement;
    downVelocity: number;
    playing: boolean;
    score: number;
  };

  const flappies = players.map((data) => {
    const imgObj = new Image();
    imgObj.src = `/assets/flappies/${data.currentSkin}.png`;
    const imageKonva = new Konva.Image({
      x: flappyRightOffset,
      y: window.innerHeight / 2,
      image: imgObj,
      width: flappyWidth,
      height: flappyHeight,
    });
    return {
      userId: data.userId,
      givenName: data.givenName,
      imageKonva: imageKonva,
      imageObj: imgObj,
      downVelocity: 0,
      playing: true,
      score: 0,
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
    text: "",
    fontSize: 30,
    fontFamily: "Arial",
    fill: "#000",
  };

  const topTextConfig = {
    text: "",
    fontSize: 40,
    fontFamily: "Arial",
    fill: "#000",
    align: "center",
  };

  // Pipe Data Structures
  const pipeUpperImgObj = new Image();
  pipeUpperImgObj.src = "/assets/pipe-green-upper.png";

  const pipeLowerImgObj = new Image();
  pipeLowerImgObj.src = "/assets/pipe-green-lower.png";

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

  // Display leaderboard
  function displayLeaderboard(scoreText: Konva.Text) {
    if (socket) {
      const leaderboard = flappies
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .map((flappy) => `${flappy.givenName}: ${flappy.score}`)
        .join("\n");

      scoreText.text(`Leaderboard\n${leaderboard}`);
    } else {
      scoreText.text(`Score: ${score}`);
    }
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
    displayLeaderboard(scoreText);
    const topText = new Konva.Text(topTextConfig);

    // Draw topText
    function drawTopText(text: string) {
      topText.text(text);
      topText.position({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      topText.offsetX(topText.width() / 2);
      topText.offsetY(topText.height() / 2);
      layerTop.add(topText);
      layerTop.draw();
    }

    topText.position({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    topText.offsetX(topText.width() / 2);
    topText.offsetY(topText.height() / 2);
    flappies.forEach((flappy) => {
      flappy.imageObj.onload = () => {
        layer.add(flappy.imageKonva);
      };
    });
    layerTop.add(scoreText);

    async function startCountdown() {
      for (let countdown = 3; countdown >= 0; countdown--) {
        drawTopText(countdown > 0 ? countdown.toString() : "Go!");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      topText.remove();
      gameRunning = true;
      anim.start();
    }

    // Initial pipe generation
    let { upperPipe, lowerPipe } = generatePipePair();
    layer.add(upperPipe);
    layer.add(lowerPipe);

    // Create Animation
    const anim = new Konva.Animation(() => {
      displayLeaderboard(scoreText);

      // Function to stop the game
      function stopGame() {
        gameOver = true;
        gameRunning = false;
        anim.stop();
        drawTopText("Game Over");
      }

      // If flappy is out and the last one, stop the game
      if (flappies.filter((flappy) => flappy.playing).length === 0) {
        stopGame();
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
          flappy.score = score;
        } else {
          // If flappy is out and not last, it gets sweeped out
          flappy.imageKonva.position({
            x: flappy.imageKonva.x() - pipeMovementSpeed,
            y: flappy.imageKonva.y(),
          });

          // Remove flappies that are off-screen
          if (flappy.imageKonva.x() + flappy.imageKonva.width() < 0) {
            flappy.imageKonva.destroy();
          }
        }
        flappy.downVelocity += flappyGravity;
      }

      // Animate all flappies
      flappies.forEach((flappy) => {
        animateFlappy(flappy);

        if (socket) {
          // Flappy jumps upon recieving signal
          socket.on(`jump-${flappy.userId}`, () => {
            flappy.downVelocity = flappyJumpHeight;
          });
        }
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

    if (socket) {
      // Count down for multi-player
      startCountdown();
    } else {
      // Display the start message for single-player
      drawTopText("Start Game");
    }

    // Handle spacebar events
    window.addEventListener("keydown", (event) => {
      if (!gameRunning && !gameOver) {
        if (event.key === " ") {
          gameRunning = true;
          topText.remove();
          anim.start();
        }
      }

      if (gameRunning && !gameOver) {
        if (event.key === " ") {
          if (!socket) {
            flappies[0].downVelocity = flappyJumpHeight;
          }
        }
      }

      if (!gameRunning && gameOver) {
        if (event.key === " ") {
          window.location.reload();
        }
      }

      // Pause game when Escape is pressed
      if (event.key === "Escape") {
        if (gameRunning && !gameOver) {
          gameRunning = false;
          anim.stop();
          drawTopText("Paused");
        }
      }
    });

    const container = document.getElementById("container");
    container?.addEventListener("click", () => {
      if (!gameRunning && !gameOver) {
        // Start game for single-player
        gameRunning = true;
        topText.remove();
        anim.start();
      }

      if (gameRunning && !gameOver) {
        if (!socket) {
          // Handle tap events for single-player
          flappies[0].downVelocity = flappyJumpHeight;
        }
      }

      if (!gameRunning && gameOver) {
        window.location.reload();
      }
    });

    onDestroy(() => {
      if (anim) {
        anim.stop();
      }
      if (stage) {
        stage.destroy();
      }
    });
  });
</script>

<div id="container"></div>
