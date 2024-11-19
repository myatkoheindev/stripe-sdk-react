import React from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'https://localhost:3000/complete',
      },
    });

    if (result.error) {
      // Show error to your customer
      console.error(result.error.message);
    } else {
      // The payment has been processed!
      console.log('Payment successful!', result);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>
        Submit
      </button>
    </form>
  );
};

export default CheckoutForm;
