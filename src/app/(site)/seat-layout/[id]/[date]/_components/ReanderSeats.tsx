import { useToast } from "@/hooks/use-toast";
import { TimeSlot } from "./Layout";

type ReanderSeatsProps = {
  row: string;
  selectedSeats: string[];
  selectedTime: TimeSlot | null;
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
  count?: number;
  occupiedSeats: string[];
};

const ReanderSeats = ({
  row,
  selectedSeats,
  selectedTime,
  setSelectedSeats,
  occupiedSeats,
  count = 9,
}: ReanderSeatsProps) => {
  const { toast } = useToast();

  const handleSelectedClick = (seatId: string) => {
    if (!selectedTime) {
      return toast({
        description: "Please Select Time First",
        className: "bg-red-100 text-red-600",
      });
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast({
        description: "You can only select 5 seats",
        className: "bg-red-100 text-red-600",
      });
    }
    if (occupiedSeats.includes(seatId)) {
      return toast({
        description: "This seat is already booked",
        className: "bg-red-100 text-red-600",
      });
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  return (
    <div className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;

          return (
            <button
              key={seatId}
              onClick={() => handleSelectedClick(seatId)}
              className={`w-8 h-8 rounded border border-primary/60 cursor-pointer 
              ${
                selectedSeats.includes(seatId) ? "bg-primary text-white" : ""
              } ${
                occupiedSeats.includes(seatId) &&
                "opacity-50 hover:cursor-not-allowed"
              }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReanderSeats;
