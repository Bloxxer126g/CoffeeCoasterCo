import crypto from "crypto";
import { Client, Environment } from "square";

const client = new Client({
  accessToken: process.env.SANDBOX_ACCESS,
  environment: Environment.Sandbox
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    const payment = await client.paymentsApi.createPayment({
      sourceId: token,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: 500,
        currency: "GBP"
      }
    });

    return res.status(200).json(payment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
