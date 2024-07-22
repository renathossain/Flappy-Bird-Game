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
    margin-bottom: 20px;
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
    font-size: 50px;
    color: #fffefd;
    background-color: #e86101;
    padding: 10px;
  }
</style>
