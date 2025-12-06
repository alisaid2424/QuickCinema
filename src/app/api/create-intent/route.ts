import { NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

interface PaymentRequestBody {
  amount: number;
}

export async function POST(request: Request) {
  try {
    const data: PaymentRequestBody = await request.json();
    const amount = data.amount;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "USD",
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Stripe error:", error);

    return NextResponse.json(
      { error: "Failed to create payment intent." },
      { status: 400 }
    );
  }
}
