import crypto from 'crypto';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  try {
    const rawCartString = request.body || "";

    let Table = [];
    if (rawCartString.trim() !== "") {
      rawCartString.split(",").forEach(element => {
        if (element) Table.splice(1, 0, element);
      });
    }

    const checkoutUrl = await createDetailedCheckout(Table);

    return response.status(200).json({ url: checkoutUrl });
  } catch (error) {
    console.error("Backend Error Details:", error);
    return response.status(500).json({ error: error.message });
  }
}

async function createDetailedCheckout(Table) {
  const SQUARE_API_URL = 'https://connect.squareup.com/v2/online-checkout/payment-links';
  const ACCESS_TOKEN = process.env.PAYMENT_ACCESS; 
  const LOCATION_ID = "LQ69R2E9RR9R9";

  let Items = await fetch("https://jamton.bloxxer.dev/data/items.json");
  let Response = await Items.json();

  let CurrentItems = [];

  Table.forEach(element => {
    let FoundExistingItem = null;

    CurrentItems.forEach(CItem => {
      if (CItem.name === element) {
        FoundExistingItem = CItem;
      }
    });

    if (FoundExistingItem !== null) {
      let newQuantity = parseInt(FoundExistingItem.quantity) + 1;
      FoundExistingItem.quantity = newQuantity.toString();
    } else {
      let Found = null;
      Response.Items.forEach(item => {
        if (item.Name === element) {
          Found = item;
        }
      });

      if (Found == null) {
        return;
      }

      let itemQuantity = 1;
      let DataTable = {
        name: element,
        Cost: Found.Cost,
        base_price_money: {
          amount: Found.Cost, 
          currency: "GBP",
        },
        quantity: itemQuantity.toString(), 
      };

      CurrentItems.push(DataTable);
    }
  });

  const LineItems = CurrentItems.map(({name, base_price_money, quantity}) => ({
    name,
    base_price_money,
    quantity
  }));
  
  const payload = {
    "idempotency_key": crypto.randomUUID(), 
    "order": {
      "location_id": LOCATION_ID,
      "line_items": LineItems
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