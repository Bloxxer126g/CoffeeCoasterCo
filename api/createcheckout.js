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

    let Items = await fetch("/data/items.json");
    let Response = await Items.json();

    let CurrentItems = []

    Table.forEach(element => {
        let Index
        CurrentItems.forEach(CItem => {
            if (CItem.Name == element) {
                Index = CItem.Index;
            };
        });
        if (Index != null) {

            CurrentItems.forEach(CItem => {
                if (CItem.Name == element) {
                    CItem.quantity += 1;
                };
            });

        } else {
            let Found = null
            Response.Items.forEach(item => {
                if (item.Name == element) {
                    Found = item;
                }
            });
            if (Found == null) {
                const index = Table.indexOf(Table, element);
                Table.splice(index, 1);
                return false;
            }

            DataTable = {
                name: element,
                Index: CurrentItems.length + 1,
                Cost: Found.Cost,
                base_price_money: {
                  amount: DataTable.Cost * DataTable.quantity,
                  currency: "GBP",
                },
                quantity: 1,
            }

            CurrentItems.splice(1, 0, DataTable);
        }
    });
  
  const payload = {
    "idempotency_key": crypto.randomUUID(), 
    "order": {
      "location_id": LOCATION_ID,
      "line_items": CurrentItems
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