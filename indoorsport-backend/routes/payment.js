const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents/smallest unit
      currency: "usd", // using usd to avoid issues with standard test keys
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ message: "Failed to create payment intent.", error: err.message });
  }
});

module.exports = router;
