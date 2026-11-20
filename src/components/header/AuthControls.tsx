"use client";

import { Pages } from "@/constants/enums";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { TicketPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const AuthControls = () => {
  const router = useRouter();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  if (!user) {
    return (
      <Button
        onClick={() =>
          openSignIn({
            appearance: {
              elements: {
                modalContent: "mx-auto my-auto",
              },
            },
          })
        }
        className="rounded-full text-white hover:bg-primary/90 transition-colors duration-300"
      >
        Login
      </Button>
    );
  }

  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Action
          label="My Bookings"
          labelIcon={<TicketPlus className="w-4 h-4 text-gray-600" />}
          onClick={() => router.push(Pages.MYBOOKINGS)}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default AuthControls;
