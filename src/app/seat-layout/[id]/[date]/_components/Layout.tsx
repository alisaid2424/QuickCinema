"use client";

import BlurCircle from "@/components/BlurCircle";
import isoTimeFormat from "@/lib/isoTimeFormat";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReanderSeats from "./ReanderSeats";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { createBooking } from "@/server/actions/bookings";

export type TimeSlot = {
  time: Date;
  showId: string;
};

type LayoutProps = {
  date: string;
  occupiedSeats: string[];
  dateTime: Record<
    string,
    {
      time: Date;
      showId: string;
    }[]
  >;
};

const Layout = ({ date, dateTime, occupiedSeats }: LayoutProps) => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const { openSignIn } = useClerk();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);

  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const handleBookTickets = async () => {
    if (!user) {
      openSignIn();
      return;
    }

    if (!selectedTime || !selectedSeats.length) {
      return toast({
        description: "Please select a time and seats",
        className: "bg-red-100 text-red-600",
      });
    }

    const res = await createBooking({
      clerkUserId: user.id,
      showId: selectedTime.showId,
      selectedSeats,
    });
    if (res.status === 201) {
      toast({
        description: res.message,
        className: "bg-green-100 text-green-600",
      });

      router.push(
        `/checkout?amount=${res.data?.amount}&bookingId=${res.data?.id}`
      );
    } else {
      toast({
        title: "Error",
        description: res.message,
        className: "bg-red-100 text-red-600",
      });
    }
  };

  return (
    <div className="container-section flex flex-col md:flex-row py-24">
      {/* Available Timings */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>

        <div className="mt-5 space-y-1">
          {dateTime[date].map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                selectedTime?.time === item.time
                  ? "bg-primary text-white"
                  : "hover:bg-primary/20 "
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seats Layout */}
      <div className="relative flex flex-1 flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />

        <h2 className="text-2xl font-semibold mb-4">Select Your Seat</h2>

        <Image
          src="/seatlayoutimg.svg"
          alt="img-screen"
          width={500}
          height={200}
        />

        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row, idx) => (
              <ReanderSeats
                key={idx}
                row={row}
                selectedSeats={selectedSeats}
                selectedTime={selectedTime}
                setSelectedSeats={setSelectedSeats}
                occupiedSeats={occupiedSeats}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, groupIdx) => (
              <div key={groupIdx}>
                {group.map((row, idx) => (
                  <ReanderSeats
                    key={idx}
                    row={row}
                    selectedSeats={selectedSeats}
                    selectedTime={selectedTime}
                    setSelectedSeats={setSelectedSeats}
                    occupiedSeats={occupiedSeats}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <Button
          className="rounded-full mt-20 text-sm font-medium active:scale-95 !py-6 !px-10"
          onClick={handleBookTickets}
        >
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Layout;
