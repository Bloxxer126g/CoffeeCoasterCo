import crypto from 'crypto';

async function createDetailedCheckout() {
  const SQUARE_API_URL = 'https://connect.squareupsandbox.com/v2/online-checkout/payment-links';
  const ACCESS_TOKEN = process.env.SANDBOX_ACCESS; 
  const LOCATION_ID = "LBKW9Y07HJT7B";
  const payload = {
    "idempotency_key": crypto.randomUUID(), 
    "order": {
      "location_id": LOCATION_ID,
      "line_items": [
        {
          "name": "TestingItem",
          "quantity": "2",
          "base_price_money": {
            "amount": 100,
            "currency": "GBP"
          }
        },
      ]
    },
    "checkout_options": {
      "redirect_url": `jamton.bloxxer.dev/success`,
      "allow_tipping": true,
      "ask_for_shipping_address": true
    }
  };

  try {
    const response = await fetch(SQUARE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2026-05-27'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API Error Details:', errorData);
      throw new Error(`Square API responded with status ${response.status}`);
    }

    const data = await response.json();

    const checkoutUrl = data.payment_link.url;
    console.log('Checkout Link Created:', checkoutUrl);
    return checkoutUrl;

  } catch (error) {
    console.error('Failed to create Square checkout session:', error);
    throw error;
  }
}