import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { DOMAIN } from "@/constants/enums";
import { useToast } from "@/hooks/use-toast";
import { updateBookingPayment } from "@/server/actions/bookings";
import { BookingWithUserShowMovie } from "@/types/booking";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

interface CheckoutFormProps {
  amount: number;
  bookingId: string;
}

const CheckoutForm = ({ amount, bookingId }: CheckoutFormProps) => {
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    try {
      setLoading(true);

      // Validate form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast({
          className: "bg-red-100 text-red-600",
          description:
            submitError.message || "Please fill all required card fields",
        });
        return;
      }

      // Create payment intent
      const res = await fetch(`${DOMAIN}/api/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const responseData = await res.json();

      let bookingRes: BookingWithUserShowMovie | null = null;

      if (!res.ok || !responseData.clientSecret) {
        console.error("Failed to create payment intent:", responseData.error);
        toast({
          className: "bg-red-100 text-red-600",
          description: "Payment creation failed. Try again later.",
        });

        return;
      } else {
        // updated Booking
        bookingRes = (await updateBookingPayment(
          bookingId
        )) as BookingWithUserShowMovie;

        if (!bookingRes) return;

        //send email
        await sendEmail(bookingRes);
        toast({
          description: "Payment successful and Booking created and send email",
          className: "bg-green-100 text-green-600",
        });
      }

      const clientSecret = responseData.clientSecret;

      // Confirm payment
      const result = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
          return_url: `${DOMAIN}/payment-confirm`,
        },
      });

      if (result.error) {
        toast({
          description: result.error.message,
          className: "bg-red-100 text-red-600",
        });

        return;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        description: "Unexpected error occurred",
        className: "bg-red-100 text-red-600",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (booking: BookingWithUserShowMovie) => {
    await fetch(`${DOMAIN}/api/send-email`, {
      method: "POST",
      body: JSON.stringify({
        amount: amount,
        email: booking.user.email,
        fullName: booking.user.name,
        sub: booking.show.movie.title,
        dateTime: booking.show.showDateTime,
      }),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-90px)] py-10">
      <form
        onSubmit={handleSubmit}
        className="container w-full md:w-2/3 lg:w-2/4"
      >
        <div className="w-full">
          <PaymentElement />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-5 !py-6 text-lg"
        >
          {loading ? (
            <LoaderCircle className="animate-spin mx-auto" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>

      <BackButton
        title="Go Back"
        variant="default"
        className="rounded-full mt-10"
      />
    </div>
  );
};

export default CheckoutForm;
