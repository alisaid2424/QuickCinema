"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateFavoriteUser } from "@/server/actions/user";
import { useClerk, useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { useState } from "react";

const AddToFavoriteButton = ({
  movieId,
  initialFavorite,
}: {
  movieId: string;
  initialFavorite: boolean;
}) => {
  const { user } = useUser();
  const { toast } = useToast();
  const { openSignIn } = useClerk();

  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleAddToFavoriteButton = async () => {
    try {
      if (!user) {
        openSignIn();
        return;
      }

      const res = await updateFavoriteUser(movieId);

      if (res.status === 200) {
        setIsFavorite((res.favorites ?? []).includes(movieId));
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
      console.error(error);
      toast({
        title: "Error",
        description: "Unexpected error occurred",
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
