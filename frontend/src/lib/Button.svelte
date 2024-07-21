<script>
  export let text;
  export let link;
</script>

<a class="button-link" href={link}>
  <div class="container1">
    <div class="container2">
      <div class="container3">
        {text}
      </div>
    </div>
  </div>
</a>

<style>
  .button-link {
    display: inline-block;
    text-decoration: none;
  }

  .container1 {
    color: #fffefd;
    background-color: #553000;
    padding: 5px 5px 10px 5px;
    display: inline-block;
  }

  .container2 {
    background-color: #fcfdfb;
    padding: 5px;
  }

  .container3 {
    text-align: center;
    font-family: "RetroGaming", sans-serif;
    font-size: 50px;
    background-color: #e86101;
    padding: 10px;
    transition: background-color 0.3s ease;
  }

  .container3:hover {
    background-color: #aa4700;
  }
</style>
