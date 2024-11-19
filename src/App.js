import React, { useState, useEffect } from 'react';
import './App.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './components/CheckoutForm';
import axios from 'axios';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(`${process.env.REACT_APP_PK_KEY}`);

function App() {
  const [clientSecret, setClientSecret] = useState('');
  
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/create-payment-intent`,
          {
            amount: 50, 
            currency: 'usd',
            //add other additional data like orderIs,customerEmail
          }
        );

        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Error fetching clientSecret:', error);
      }
    };

    createPaymentIntent();
  }, []);

  const appearance = {
    appearance: {
      theme: 'stripe', 
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
      },
      rules: {
        '.Tab': {
          padding: '10px',
        },
        '.Input': {
          backgroundColor: '#f6f9fc',
        },
        '.Input:focus': {
          borderColor: '#0570de',
        },
      },
    },
  };

  const options = {
    clientSecret: clientSecret,
    appearance,
  };
  
  return (
    <div className="App">
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
export default App