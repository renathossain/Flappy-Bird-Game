<script lang="ts">
  import Flappy from "./lib/Flappy.svelte";
  import io from "socket.io-client";

  const socket = io("http://localhost:3000");
</script>

<Flappy />
