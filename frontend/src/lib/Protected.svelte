<script lang="ts">
  import { Route } from "svelte-routing";
  import { user } from "../store";
  import Unauthorized from "./Unauthorized.svelte";

  export let path: string;
  export let component;
</script>

{#if $user}
  <Route {path} {component} />
{:else}
  <Route {path} component={Unauthorized} />
{/if}
