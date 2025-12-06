"use client";

import { useToast } from "@/hooks/use-toast";
import { deleteUser } from "@/server/actions/user";
import { Trash2 } from "lucide-react";

interface DeleteUserButtonProps {
  userId: string;
  onSuccess?: () => void;
}
const DeleteUserButton = ({ userId, onSuccess }: DeleteUserButtonProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      if (confirm("Are you sure you want to delete this User?")) {
        const res = await deleteUser(userId);

        if (res.status && res.message) {
          if (res.status === 200) {
            toast({
              title: "Success! 🎉",
              description: res.message,
              className: "bg-green-100 text-green-600",
            });

            if (onSuccess) {
              onSuccess();
            }
          } else {
            toast({
              title: "Error",
              description: res.message,
              className: "bg-red-100 text-red-600",
            });
          }
        } else {
          toast({
            title: "Error",
            description: "Unexpected response from server.",
            className: "bg-red-100 text-red-600",
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the User.",
        className: "bg-red-100 text-red-600",
      });
    }
  };

  return (
    <div
      onClick={handleDelete}
      className="bg-red-600 text-white p-2 hover:bg-red-500 transition-all duration-300 rounded-lg inline-block cursor-pointer"
    >
      <Trash2 size={20} />
    </div>
  );
};

export default DeleteUserButton;
