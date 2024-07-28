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
    if ($user) {
      const response = await fetch(`/api/skin/change`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: $user.id,
          skinId: skinId,
        }),
      });
      const data = await response.json();
      if(data){
        $user.currentSkin = skinId;
        console.log("Skin changed successfully");
      } else {
        console.log("Issue changing skin");
      }
    }
  }
</script>

<div class="arcade-container">
  <div class="arcade-text">
    Skin {id}
  </div>
  <div class="arcade-image">
    <img src={image} alt={"/assets/picture.png"} />
  </div>
  <div class="arcade-price">
    <p>Price: ${price}</p>
    {#if purchased}
      <button class="arcade-button" on:click={() => handleUseSkin(id)}
        >Use Skin</button
      >
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
    font-family: "RetroGaming", sans-serif;
    color: #553000;
    font-size: 1.5rem;
    text-align: center;
  }
  .arcade-container {
    /* Glassy effect */
    background-color: rgba(255, 255, 255, 0.2); /* semi-transparent white */
    backdrop-filter: blur(10px); /* blur behind the element */
    border-radius: 10px; /* rounded corners */
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* subtle shadow */
    transition: background-color 0.3s ease; /* smooth transition */

    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 400px;
    border: 4px solid #543847;
    margin: 50px auto;
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
