import { Routes } from "@/constants/enums";
import { getUser } from "@/server/db/user";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import UpdateUserForm from "../../_components/UpdateUserForm";

interface EditUserPageProps {
  params: Promise<{ userId: string }>;
}

const EditUserPage = async ({ params }: EditUserPageProps) => {
  const { userId } = await params;
  const user = await getUser({ clerkUserId: userId });

  if (!user) notFound();

  return (
    <main>
      <section className="section-gap lg:w-10/12 mx-auto">
        <div className="container">
          <Link
            href={`${Routes.USERS}?pageNumber=1`}
            className="flex items-center gap-2 mb-20 bg-primary/80 text-white text-base rounded-full w-fit py-2 px-3"
          >
            <ArrowLeftCircle size={24} /> Back to Users
          </Link>

          <>
            <h1 className="text-primary text-center font-bold text-4xl italic mb-7">
              Update User
            </h1>
            <UpdateUserForm key={user.id} user={user} />
          </>
        </div>
      </section>
    </main>
  );
};

export default EditUserPage;
