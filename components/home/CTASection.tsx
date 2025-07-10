import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-gray-50">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative left-[calc(50%-3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-20 sm:left-[calc(40%-30rem)] sm:w-[40.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="text-center mb-16">
          <h2 className="font-black text-3xl uppercase mb-4  text-black">
            Ready to Save Hours of Learning?
          </h2>
          <h3 className=" text-lg max-w-2xl mx-auto text-gray-400">
            Transform your documents into clear, fun and easy to learn with our
            AI-Powered Quiz
          </h3>
          <Link href="/#pricing">
            <Button
              variant="ghost"
              className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              <p className="text-white text-lg font-bold flex items-center gap-2">
                Get Started
                <MoveRight />
              </p>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
