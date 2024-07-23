<script>
  import { user } from "../../store";
</script>

{#if $user}
  <div class="profile-container">
    <div class="container1">
      <div class="container2">
        <div class="container3">
          <img src={$user.photo} alt="Profile" class="profile-picture" />
          <div class="user-name">{$user.displayName}</div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .container1 {
    background-color: #553000;
    padding: 5px 5px 10px 5px;
  }

  .container2 {
    background-color: #fcfdfb;
    padding: 5px;
  }

  .container3 {
    text-align: center;
    font-family: "RetroGaming", sans-serif;
    color: #fffefd;
    background-color: #e86101;
    padding: 10px;
  }

  .profile-picture {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .user-name {
    margin-top: 10px;
    text-align: center;
  }
</style>
