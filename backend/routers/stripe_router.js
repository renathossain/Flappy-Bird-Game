import {Router} from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";

//Stripe
//https://github.com/stripe/stripe-node
//https://medium.com/web-development-with-sumit/how-to-make-payment-with-stripe-using-nodejs-e4581d357dcd
//https://medium.com/@huzaifa.saleem3111/how-to-integrate-stripe-checkout-session-in-node-express-6fed126aabc0

export const stripeRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });

stripeRouter.post('/charge', async (req, res) => {
    const price = req.body.price;
    const currency = req.body.currency;
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
        success_url: 'http://localhost:3000/api/stripe/success',
        cancel_url: 'http://localhost:5173/store',
      })
      res.status(200).json({url: session.url});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
});

//sucess url
stripeRouter.get('/success', (req, res) => {
  res.send('Payment Successful');
});


stripeRouter.post('/webhook', bodyParser.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try{
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }catch(error){
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  switch (event.type){
    //copied from the stripe api documentation
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      break;
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      break;
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      break;
    case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object;
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.status(200).send('Received');
})