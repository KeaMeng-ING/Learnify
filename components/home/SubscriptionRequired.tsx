import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const SubscriptionRequired = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-600 to-red-600 drop-shadow-sm">
        Subscription Required
      </h1>
      <p className="text-lg font-bold">
        Start Experience with the Best Learning Tool by subscribing to a plan.
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
  );
};

export default SubscriptionRequired;
