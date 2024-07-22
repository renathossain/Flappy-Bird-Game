<script lang="ts">
  let code: string = "";
  const onlyNumbers = () => (code = code.replace(/\D/g, ""));
</script>

<div class="container1">
  <div class="container2">
    <input
      class="container3"
      type="text"
      placeholder="Enter the Code"
      bind:value={code}
      on:input={onlyNumbers}
    />
  </div>
</div>

<style>
  .container1 {
    display: inline-block;
    text-decoration: none;
    margin-bottom: 20px;
    background-color: #553000;
    padding: 5px 5px 10px 5px;
  }

  .container2 {
    background-color: #e86101;
    padding: 5px;
  }

  .container3 {
    text-align: center;
    font-family: "RetroGaming", sans-serif;
    font-size: 50px;
    background-color: #fcfdfb;
    padding: 10px;
    border: none;
  }

  .container3:focus {
    outline: none;
  }
</style>
