import BgGradient from "@/components/layout/BgGradient";
import UploadForm from "@/components/upload/UploadForm";
import UploadHeader from "@/components/upload/UploadHeader";
import { hasReachedUploadLimit } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import React from "react";

const page = async () => {
  const user = await currentUser();
  const userId = user?.id;
  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!userId || !email) {
    redirect("/sign-in");
  }

  const limit = await hasReachedUploadLimit(userId, email);

  return (
    <section className="min-h-screen">
      <BgGradient />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <UploadHeader />

          <UploadForm limit={limit} />
        </div>
      </div>
    </section>
  );
};

export default page;
