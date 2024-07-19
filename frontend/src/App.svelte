<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Lobby from "./lib/Lobby.svelte";
  import Flappy from "./lib/Flappy.svelte";
  import Player from "./lib/Player.svelte";

  export let url = "";
</script>

<Router {url}>
  <Route path="/"><Lobby /></Route>
  <Route path="/game" component={Flappy} />
  <Route path="/player/:username" let:params
    ><Player username={params.username} /></Route
  >
</Router>
