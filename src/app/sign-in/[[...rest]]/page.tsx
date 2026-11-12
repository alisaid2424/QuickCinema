import { BackButton } from "@/components/BackButton";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="fixed element-center inset-0 z-50 bg-black/75">
      <div className="relative">
        <SignIn />

        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
          <BackButton
            title="Go Back"
            variant="default"
            className="rounded-full px-6"
          />
        </div>
      </div>
    </div>
  );
}
