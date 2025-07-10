import { cn } from "@/lib/utils";
import { pricingPlans } from "@/utils/constant";
import { ArrowRight, CheckIcon } from "lucide-react";
import Link from "next/link";

type PriceType = {
  name: string;
  description: string;
  price: number;
  items: string[];
  paymentLink: string;
  priceId: string;
  id: string;
};

const PricingCard = ({
  name,
  price,
  description,
  items,
  id,
  paymentLink,
}: PriceType) => {
  return (
    <div className="relative w-full max-w-lg hover:scale-105 transition-all duration-300">
      <div
        className={cn(
          "relative flex flex-col gap-4 h-full lg:gap-8 z-10 p-8 rounded-2xl border-[1px] border-gray-500/20",
          id === "pro" && "border-purple-500 gap-5 border-2"
        )}
      >
        <div className="flex justify-between items-center gap-4">
          <div>
            <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
            <p className="text-base-content/80 mt-2">{description}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <p className="text-5xl tracking-tight font-extrabold">{price}</p>
          <div className="flex flex-col justify-end mb-[4px]">
            <p className="text-xs uppercase font-semibold">USD</p>
            <p className="text-xs">/month</p>
          </div>
        </div>
        <div className="space-y-2.5 leading-relaxed text-base flex-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckIcon size={18} />
              <span>{item}</span>
            </li>
          ))}
        </div>
        <div className="space-y-2 flex justify-center w-full">
          <Link
            href={paymentLink}
            target="_blank"
            className={cn(
              "w-full rounded-full flex items-center justify-center gap-2 bg-linear-to-r from-purple-800 to-purple-500 hover:from-purple-500 hover:to-purple-800 text-white border-2 py-2",
              id === "pro"
                ? "border-purple-900"
                : "border-purple-100 from-purple-400 to-purple-500"
            )}
          >
            Buy Now <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function PricingSection() {
  return (
    <section className="relative overflow-hidden " id="pricing">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div className="flex items-center justify-center w-full pb-12">
          <h2 className="font-bold uppercase text-xl mb-8 text-purple-500">
            Pricing
          </h2>
        </div>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
