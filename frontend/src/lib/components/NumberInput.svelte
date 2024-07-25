<script lang="ts">
  import { code } from "../../store";
  let codeValue: string = "";

  // Subscribe to the store and initialize codeValue
  $: code.subscribe((value) => {
    codeValue = value !== null ? value.toString() : "";
  });

  const onlyNumbers = () => {
    // Keep only the first 4 digits and update the store
    codeValue = codeValue.replace(/\D*(\d{0,4}).*/, "$1");
    code.set(codeValue !== "" ? Number(codeValue) : null);
  };
</script>

<div class="container1">
  <div class="container2">
    <input
      class="container3"
      type="text"
      placeholder="Enter Code"
      bind:value={codeValue}
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
    width: 400px;
  }

  .container3:focus {
    outline: none;
  }
</style>
