import CTASection from "@/components/home/CTASection";
import DemoSection from "@/components/home/DemoSection";
import HeroSection from "@/components/home/HeroSection";
import HowItWork from "@/components/home/HowItWork";
import PricingSection from "@/components/home/PricingSection";
import BgGradient from "@/components/layout/BgGradient";

export default function Home() {
  console.log("sdf");
  return (
    <div className="relative w-full overflow-x-hidden">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        <DemoSection />
        <HowItWork />
        <PricingSection />
        <CTASection />
      </div>
    </div>
  );
}
