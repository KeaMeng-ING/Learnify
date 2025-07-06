import DemoSection from "@/components/home/DemoSection";
import HeroSection from "@/components/home/HeroSection";
import HowItWork from "@/components/home/HowItWork";
import PricingSection from "@/components/home/PricingSection";
import BgGradient from "@/components/layout/BgGradient";

export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        <DemoSection />
        <HowItWork />
        <PricingSection />
      </div>
    </div>
  );
}
