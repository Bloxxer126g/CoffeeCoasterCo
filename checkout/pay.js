import express from "express";
import crypto from "crypto";
import { Client, Environment } from "square";

const app = express();
app.use(express.json());

const client = new Client({
  accessToken: process.env.SANDBOX_ACCESS,
  environment: Environment.Sandbox
});

app.post("/pay", async (req, res) => {
  const { token } = req.body;

  try {
    const payment = await client.paymentsApi.createPayment({
      sourceId: token,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: 5000,
        currency: "GBP"
      }
    });

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
