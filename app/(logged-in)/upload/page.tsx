import BgGradient from "@/components/layout/BgGradient";
import { Button } from "@/components/ui/button";
import UploadForm from "@/components/upload/UploadForm";
import UploadHeader from "@/components/upload/UploadHeader";
import { getStatus, hasReachedUploadLimit } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import React from "react";

const page = async () => {
  const user = await currentUser();
  const userId = user?.id;
  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!userId || !email) {
    redirect("/sign-in");
  }

  const status = await getStatus(email);
  const limit = await hasReachedUploadLimit(userId, email);
  if (status == "inactive" || status == null) {
    return (
      <section className="min-h-screen">
        <BgGradient />
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center ">
              <BookOpen className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold">Subscription Required</h1>
            <p className="text-lg">
              Start Experience with our AI-Powered Quiz by subscribing to a
              plan.
            </p>
            <Link href="/#pricing">
              <Button
                variant="ghost"
                className=" bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                <p className="text-white font-bold flex items-center gap-2">
                  Get Started <ArrowRight className="ml-2" />
                </p>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="min-h-screen">
      <BgGradient />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <UploadHeader title="AI-Powered Content Creation" />

          <UploadForm limit={limit} />
        </div>
      </div>
    </section>
  );
};

export default page;
