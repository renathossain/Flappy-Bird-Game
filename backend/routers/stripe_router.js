import {Router} from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { PurchasedSkins } from "../models/users.js";
import express from "express";

//Stripe
//https://github.com/stripe/stripe-node
//https://medium.com/web-development-with-sumit/how-to-make-payment-with-stripe-using-nodejs-e4581d357dcd
//https://medium.com/@huzaifa.saleem3111/how-to-integrate-stripe-checkout-session-in-node-express-6fed126aabc0

export const stripeRouter = Router();
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });

stripeRouter.post('/charge', async (req, res) => {
    const price = req.body.price;
    const currency = req.body.currency;
    const skinId = req.body.skinId;
    if (req.body.userId === null){
      return res.status(400).json({error: 'User not logged in'});
    }
    const userId = req.body.userId;
    try{
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items:[{
          price_data:{
            currency: currency,
            product_data:{
              name:'Skin',
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'http://localhost:3000/api/stripe/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:5173/store',
        metadata: {
          skinId: skinId,
          userId: userId,
        },
      })
      res.status(200).json({url: session.url});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
});

//sucess url
stripeRouter.get('/success', async (req, res) => {
  const session_id = req.query.session_id;
  try{
    const checkout_session = await stripe.checkout.sessions.retrieve(session_id);
    const metadata = checkout_session.metadata;
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
    return res.status(200).json({message: 'Success payment'}); 
  }catch(error){
    res.status(500).json({error: error.message});
  }
});


stripeRouter.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const endpointSecret = "whsec_771d739871c20f698b80dd740452fc67098a4c63b038f3c1ac1f2741c4ffcd07";
  const sig = req.headers['stripe-signature'];
  let event;
  try{
    event = stripe.webhooks.constructEvent(req.body, sig, "whsec_771d739871c20f698b80dd740452fc67098a4c63b038f3c1ac1f2741c4ffcd07");
  }catch(error){
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  switch (event.type){
    //copied from the stripe api documentation
    case 'checkout.session.completed':
      const session = event.data.object;
      const metadata = session.metadata;
      try{
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
      }catch(error){
        console.error('Error saving purchase', error.message);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.status(200).send('Received');
})