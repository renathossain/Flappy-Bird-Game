import { Router } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { PurchasedSkins } from "../models/users.js";
import { isLoggedIn } from "../middleware/auth.js";
import express from "express";

//Stripe
//https://github.com/stripe/stripe-node
//https://medium.com/web-development-with-sumit/how-to-make-payment-with-stripe-using-nodejs-e4581d357dcd
//https://medium.com/@huzaifa.saleem3111/how-to-integrate-stripe-checkout-session-in-node-express-6fed126aabc0

export const stripeRouter = Router();
dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2024-06-20',
});


stripeRouter.post('/charge', isLoggedIn, async (req, res) => {
  const price = req.body.price;
  const currency = req.body.currency;
  const skinId = req.body.skinId;
  if (req.body.userId === null) {
    return res.status(400).json({ error: 'User not logged in' });
  }
  const userId = req.body.userId;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency,
          product_data: {
            name: 'Skin',
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: `${process.env.FRONTEND_URL}/store`,
      metadata: {
        skinId: skinId,
        userId: userId,
      },
    })
    res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//sucess url
stripeRouter.get('/success', isLoggedIn, async (req, res) => {
  const session_id = req.query.session_id;
  try {
    const checkout_session = await stripe.checkout.sessions.retrieve(session_id);
    // const metadata = checkout_session.metadata;
    // await PurchasedSkins.findOrCreate({
    //   where: {
    //     userId: metadata.userId,
    //     skinId: metadata.skinId,
    //   },
    //   defaults: {
    //     userId: metadata.userId,
    //     skinId: metadata.skinId,
    //   }
    // });
    res.redirect(`${process.env.FRONTEND_URL}/store`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


stripeRouter.post('/webhook', isLoggedIn, express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  console.log(sig);
  let event;
  try {
    //in the dotenv file
    event = stripe.webhooks.constructEvent(req.rawBody, sig, "whsec_j8k2XlCJ3OxzNgFTgL6M61lFNFUNCLP2");
  } catch (error) {
    console.log(error.message)
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  switch (event.type) {
    //copied from the stripe api documentation
    case 'checkout.session.completed':
      const session = event.data.object;
      const metadata = session.metadata;
      try {
        await PurchasedSkins.findOrCreate({
          where: {
            userId: metadata.userId,
            skinId: metadata.skinId,
          },
          defaults: {
            userId: metadata.userId,
            skinId: metadata.skinId,
          }
        });
      } catch (error) {
        console.error('Error saving purchase', error.message);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.status(200).send('Received');
})