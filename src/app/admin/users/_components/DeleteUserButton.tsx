"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { confirmDelete } from "@/lib/swal";
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
      const confirmed = await confirmDelete(
        "Delete User?",
        "Are you sure you want to delete this user?",
      );

      if (!confirmed) return;

      const res = await deleteUser(userId);

      if (res.success) {
        toast({
          title: "Success! 🎉",
          description: res.message,
          className: "bg-green-100 text-green-600",
        });

        onSuccess?.();
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
          error instanceof Error ? error.message : "Unknown error occurred",
        className: "bg-red-100 text-red-600",
      });
    }
  };

  return (
    <Button onClick={handleDelete} variant="destructive" size="icon">
      <Trash2 size={20} />
    </Button>
  );
};

export default DeleteUserButton;
