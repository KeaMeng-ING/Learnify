import SubscriptionRequired from "@/components/home/SubscriptionRequired";
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

export default async function Page({
  params,
}: {
  params: Promise<{ features: string }>;
}) {
  const { features } = await params;
  if (features !== "dashboard" && features !== "summary") {
    return;
  }

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
          <SubscriptionRequired />
        </div>
      </section>
    );
  }
  return (
    <section className="min-h-screen">
      <BgGradient />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <UploadHeader title="AI-Powered Summary" />

          <UploadForm limit={limit} redirectTo="summary" />
        </div>
      </div>
    </section>
  );
}
