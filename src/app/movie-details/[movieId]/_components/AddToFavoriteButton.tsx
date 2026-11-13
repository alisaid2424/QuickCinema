"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateFavoriteUser } from "@/server/actions/user";
import { useClerk, useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";

const AddToFavoriteButton = ({
  movieId,
  isFavorite,
}: {
  movieId: string;
  isFavorite: boolean;
}) => {
  const { user } = useUser();
  const { toast } = useToast();
  const { openSignIn } = useClerk();

  const handleAddToFavoriteButton = async () => {
    try {
      if (!user) {
        openSignIn({
          appearance: {
            elements: {
              modalContent: "mx-auto my-auto",
            },
          },
        });
        return;
      }

      const res = await updateFavoriteUser(movieId);

      if (res.status === 200) {
        toast({
          title: "Success! 🎉",
          description: res.message,
          className: "bg-green-100 text-green-600",
        });
      } else {
        toast({
          title: "Error",
          description: res.message,
          className: "bg-red-100 text-red-600",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Unexpected error occurred",
        className: "bg-red-100 text-red-600",
      });
    }
  };

  return (
    <Button
      size="icon"
      onClick={handleAddToFavoriteButton}
      className="bg-gray-700 rounded-full active:scale-95 hover:bg-gray-600 transition"
    >
      <Heart
        className={`w-5 h-5 transition ${
          isFavorite ? "fill-primary stroke-primary" : "stroke-white"
        }`}
      />
    </Button>
  );
};

export default AddToFavoriteButton;
