<script lang="ts">
  import { onMount } from "svelte";
  import { Router, Route } from "svelte-routing";
  import Protected from "./lib/Protected.svelte";
  import Main from "./lib/Main.svelte";
  import Lobby from "./lib/Lobby.svelte";
  import Game from "./lib/Game.svelte";
  import Player from "./lib/Player.svelte";
  import { user } from "./store";
  import Store from "./lib/Store.svelte";

  onMount(async () => {
    const res = await fetch("/api/user");
    const data = await res.json();
    user.set(data.user);
  });
</script>

<Router>
  <Route path="/" component={Main} />
  <Route path="/store" component={Store} />
  <Protected path="/lobby" component={Lobby} />
  <Route path="/game" component={Game} />
  <Protected path="/player" component={Player} />
</Router>
