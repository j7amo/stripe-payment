/* eslint-disable camelcase */
const stripe = require('stripe')(process.env.STRIPE_SECRET);

// This is what we get from our frontend side (by the way the price is
// in CENTS(!) because this is what Stripe requires):
// {
//   purchase: [
//     { id: '1', name: 't-shirt', price: 1999 },
//     { id: '2', name: 'shoes', price: 4999 }
//   ],
//   total_amount: 10998,
//   shipping_fee: 1099
// }
// Here we are just receiving data and NOT REALLY PAYING ANYTHING.
// In fact next steps after receiving this data from FE is to:
// 1) Communicate with Stripe service.
// 2) Send data to them.
// 3) Get "clientSecret" that is generated on their side.
// 4) Send data + "clientSecret" to the FE.
const stripeController = async (req, res) => {
  const { total_amount, shipping_fee } = req.body;

  // in the real world we MUST verify the data sent from FE
  // (especially when it comes to mooney), because advanced users can manipulate
  // data and send an order with incorrect values (e.g. lower prices), so
  // normally we must query the DB and check the prices. Here we do not
  // have any products in the DB, so nothing to check for.
  // So we just calculate a simple amount for development’s sake:
  const calculateOrderAmount = () => total_amount + shipping_fee;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: 'usd',
  });

  res.json({ clientSecret: paymentIntent.client_secret });
};

module.exports = stripeController;
