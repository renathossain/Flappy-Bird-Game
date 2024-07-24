<script lang="ts">
  import { onMount } from "svelte";
  import { Router, Route } from "svelte-routing";
  import Main from "./lib/Main.svelte";
  import Lobby from "./lib/Lobby.svelte";
  import Game from "./lib/Game.svelte";
  import Player from "./lib/Player.svelte";
  import { user } from "./store";

  onMount(async () => {
    const res = await fetch("/api/user");
    const data = await res.json();
    user.set(data.user);
  });
</script>

<Router>
  <Route path="/"><Main /></Route>
  <Route path="/lobby"><Lobby /></Route>
  <Route path="/game" component={Game} />
  <Route path="/player" component={Player} />
</Router>
