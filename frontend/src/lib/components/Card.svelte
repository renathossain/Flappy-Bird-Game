<script lang="ts">
  //https://codepen.io/paulnoble/pen/gaPaoY
  //https://codepen.io/Brandon-Stoyles/pen/RajYmd
  //https://docs.stripe.com/js/deprecated/redirect_to_checkout
  //https://stackoverflow.com/questions/68479217/how-to-load-environment-variables-in-svelte-using-vite-or-svite

  import { loadStripe } from "@stripe/stripe-js";
  import { onMount } from "svelte";
  import { user } from "../../store";

  export let id: number;
  export let price: number;
  export let image: string;
  export let purchased: boolean;

  let stripe;

  onMount(async () => {
    stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  });

  async function handlePurchase(
    skinId: number,
    price: number,
    currency: string,
  ) {
    if ($user) {
      const response = await fetch(`/api/stripe/charge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: price,
          currency: currency,
          userId: $user.id,
          skinId: skinId,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.log("Issue creating Stripe payment process", data.error);
      }
    }
  }

  async function handleUseSkin(skinId: number) {
    if($user){
      const response = await fetch(`/api/skin/change`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: $user.id,
          skinId: skinId,
        }),
      })
      const data = await response.json();
      if(data){
        console.log("Skin changed successfully");
      }else{
        console.log("Issue changing skin");
      }
    }
  }
</script>

<div class="arcade-container">
  <div class="arcade-text">
    Skin No: {id}
  </div>
  <div class="arcade-image">
    <img src={image} alt={"/assets/picture.png"} />
  </div>
  <div class="arcade-price">
    <p>Price: ${price}</p>
    {#if purchased}
      <button class="arcade-button"
      on:click={() => handleUseSkin(id)}>Use Skin</button>
    {:else}
      <button
        class="arcade-button"
        on:click={() => handlePurchase(id, price, "usd")}>Purchase</button
      >
    {/if}
  </div>
</div>

<style>
  .arcade-text {
    color: white;
    position: absolute;
    width: 100%;
    text-align: center;
    margin: auto;
    font-size: 2vw;
    margin-bottom: 10px;
    text-shadow:
      -2px 0 0 #fdff2a,
      -4px 0 0 #df4a42,
      2px 0 0 #91fcfe,
      4px 0 0 #4405fc;
  }
  .arcade-container {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 600px;
    border: 10px solid orange;
    margin: 50px auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    color: red;
    font-family: "Press Start 2P", cursive;
    text-align: center;
  }
  .arcade-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .arcade-image img {
    width: 100px;
    max-height: 100px;
    object-fit: cover;
  }

  .arcade-button {
    background: #881400;
    border-bottom: 6px inset rgba(0, 0, 0, 0.5);
    border-left: 6px inset rgba(0, 0, 0, 0.5);
    border-right: 6px inset rgba(255, 255, 255, 0.5);
    border-top: 6px inset rgba(255, 255, 255, 0.5);
    color: white;
    font-size: 1rem;
    margin: 0.5rem;
    min-width: 100px;
    padding: 0.5rem;
    cursor: pointer;
    &:hover {
      background: #a81000;
    }
  }
</style>
