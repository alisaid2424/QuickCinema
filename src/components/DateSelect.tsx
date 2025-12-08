"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import BlurCircle from "./BlurCircle";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type DateSelectProps = {
  dateTime: Record<
    string,
    {
      time: Date;
      showId: string;
    }[]
  >;

  id: string;
};

const DateSelect = ({ dateTime, id }: DateSelectProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [selected, setSelected] = useState<string | null>(null);

  const onBookHandler = () => {
    if (!selected) {
      return toast({
        description: "Please Select a date",
        className: "bg-red-100 text-red-600",
      });
    }
    router.push(`/seat-layout/${id}/${selected}`);
    scrollTo(0, 0);
  };

  return (
    <div id="dateSelect" className="pt-32">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />

        <div>
          <p className="text-center md:text-start text-lg font-semibold">
            Choose Date
          </p>
          <div className="flex items-center gap-6 text-sm mt-5">
            <ChevronLeftIcon width={28} />

            <span className="flex flex-wrap md:max-w-lg gap-4">
              {Object.keys(dateTime).map((date) => (
                <button
                  onClick={() => setSelected(date)}
                  key={date}
                  className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${
                    selected === date
                      ? "bg-primary text-white"
                      : "border border-primary/70"
                  }`}
                >
                  <span>{new Date(date).getDate()}</span>
                  <span>
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                </button>
              ))}
            </span>

            <ChevronRightIcon width={28} />
          </div>
        </div>

        <Button onClick={onBookHandler}>Book Now</Button>
      </div>
    </div>
  );
};

export default DateSelect;
