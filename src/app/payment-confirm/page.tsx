"use client";

import { Pages } from "@/constants/enums";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PaymentConfirm = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace(Pages.MYBOOKINGS);
    }, 5000);
  }, [router]);

  return (
    <div className="h-[calc(100vh-114px)] flex flex-col justify-center items-center gap-5">
      <div className="flex justify-center items-center relative">
        <Image
          className="absolute p-5"
          src="/checkmark.png"
          width={80}
          height={80}
          alt="payment-confirm-img"
        />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-400 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">
        Booking Placed Successfully
      </div>
    </div>
  );
};

export default PaymentConfirm;
