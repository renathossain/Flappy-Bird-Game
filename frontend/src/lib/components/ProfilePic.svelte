<script>
  import { user, registered } from "../../store";
</script>

{#if $registered}
  {#if $user}
    {#if $user.photo}
      <img src={$user.photo} alt="Profile" class="profile-picture" />
    {/if}
  {/if}
{/if}

<style>
  .profile-picture {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-left: 10px;
  }
</style>
