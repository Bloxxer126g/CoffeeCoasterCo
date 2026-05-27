export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  try {
    const checkoutUrl = await createDetailedCheckout();

    return response.status(200).json({ url: checkoutUrl });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}

async function createDetailedCheckout() {
  const SQUARE_API_URL = 'https://connect.squareup.com/v2/online-checkout/payment-links';
  const ACCESS_TOKEN = process.env.PAYMENT_ACCESS; 
  const LOCATION_ID = "LQ69R2E9RR9R9";
  
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
      "redirect_url": `https://jamton.bloxxer.dev/success`,
      "allow_tipping": true,
      "ask_for_shipping_address": true
    }
  };

  const res = await fetch(SQUARE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Square-Version': '2025-04-16'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.errors?.[0]?.detail || 'Square API Error');
  }

  const data = await res.json();
  return data.payment_link.url;
}