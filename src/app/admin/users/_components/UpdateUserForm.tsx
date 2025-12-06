"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { User, UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { UpdateUserSchema, UpdateUserType } from "@/zod-schemas/user";
import { Routes } from "@/constants/enums";
import { useToast } from "@/hooks/use-toast";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ProfileImagePreview from "@/components/ProfileImagePreview";

interface UpdateUserFormProps {
  user: User;
}

const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(user.role === UserRole.ADMIN);

  const form = useForm<UpdateUserType>({
    mode: "onBlur",
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      image: user.image ?? "",
      admin: isAdmin,
    },
  });

  const { handleSubmit } = form;

  const submitForm = async (data: UpdateUserType) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: user.clerkUserId,
          ...data,
        }),
      });

      const result = await res.json();

      if (res.ok && result.message) {
        toast({
          title: "Success! 🎉",
          description: result.message,
          className: "bg-green-100 text-green-600",
        });

        router.push(`${Routes.USERS}?pageNumber=1`);
      } else {
        toast({
          title: "Error",
          description: result.message || "Something went wrong",
          className: "bg-red-100 text-red-600",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(submitForm)}
        className="flex flex-col md:flex-row gap-10 items-center md:items-start w-full"
      >
        <ProfileImagePreview
          image={
            user.image ??
            "https://res.cloudinary.com/djhoc0ys4/image/upload/v1758875923/profile_images/img-profile-1.jpg.jpg"
          }
          alt={user.name ?? "User"}
        />

        <div className="flex flex-col space-y-4 flex-1 w-full">
          <InputWithLabel<UpdateUserType>
            fieldTitle="Name"
            nameInSchema="name"
            placeholder="Enter Your Username"
          />

          <InputWithLabel<UpdateUserType>
            fieldTitle="Email"
            nameInSchema="email"
            readOnly={true}
            placeholder="Enter Your Email"
          />

          <InputWithLabel<UpdateUserType>
            fieldTitle="Phone"
            nameInSchema="phone"
            placeholder="+201001234567"
          />

          <CheckboxWithLabel<UpdateUserType>
            fieldTitle="Admin"
            nameInSchema="admin"
            checked={isAdmin}
            onCheckedChange={(checked) => setIsAdmin(checked)}
          />

          <Button type="submit" title="Save" disabled={isLoading}>
            {isLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Update User"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
