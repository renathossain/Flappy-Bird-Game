<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Main from "./lib/Main.svelte";
  import Lobby from "./lib/Lobby.svelte";
  import Flappy from "./lib/Flappy.svelte";
  import Player from "./lib/Player.svelte";
  import Login from "./lib/Login.svelte";

  export let url = "";
</script>

<Router {url}>
  <Route path="/"><Main /></Route>
  <Route path="/lobby"><Lobby /></Route>
  <Route path="/game" component={Flappy} />
  <Route path="/player/:username" let:params
    ><Player username={params.username} /></Route
  >
  <Route path="/login" component={Login} />
</Router>
