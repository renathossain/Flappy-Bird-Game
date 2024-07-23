<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Main from "./lib/Main.svelte";
  import Lobby from "./lib/Lobby.svelte";
  import Game from "./lib/Game.svelte";
  import Player from "./lib/Player.svelte";

  export let url = "";
</script>

<Router {url}>
  <Route path="/"><Main /></Route>
  <Route path="/lobby"><Lobby /></Route>
  <Route path="/game" component={Game} />
  <Route path="/player/:username" let:params
    ><Player username={params.username} /></Route
  >
</Router>
