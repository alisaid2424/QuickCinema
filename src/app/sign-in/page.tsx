"use client";

import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { Routes } from "@/constants/enums";
import { BackButton } from "@/components/BackButton";
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) return null;

  if (user) {
    router.replace(Routes.ROOT);
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2">
        <BackButton
          title="Go Back"
          variant="default"
          className="rounded-full px-6"
        />
      </div>

      <SignIn
        appearance={{
          elements: {
            rootBox: "shadow-lg rounded-xl bg-white",
          },
        }}
      />
    </div>
  );
}
