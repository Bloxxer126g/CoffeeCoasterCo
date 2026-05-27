export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sourceId, amount } = req.body;

  try {
    const response = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SANDBOX_ACCESS}`,
        'Square-Version': '2026-03-18'
      },
      body: JSON.stringify({
        sourceId: sourceId,
        idempotencyKey: crypto.randomUUID(),
        amountMoney: {
          amount: amount,
          currency: 'GBP'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ success: false, error: data.errors });
    }

    return res.status(200).json({ success: true, payment: data.payment });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}