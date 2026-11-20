"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import CheckoutForm from "./_components/CheckoutForm";
import type { StripeElementsOptions } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY!);

const Checkout = () => {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const bookingId = searchParams.get("bookingId");

  const numericAmount = Number(amount) || 0;

  const options: StripeElementsOptions = {
    mode: "payment",
    currency: "usd",
    amount: Math.round(numericAmount) * 100,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm amount={numericAmount} bookingId={bookingId!} />
    </Elements>
  );
};

export default Checkout;
