import HeroSection from '@/components/sections/hero-home';
import FeaturesSection from '@/components/sections/features-home';
import HowItWorksSection from '@/components/sections/how-it-works-home';
import TestimonialsSection from '@/components/sections/testimonials-home';
import PricingHomeSection from '@/components/sections/pricing-home';
import CtaSection from '@/components/sections/cta-home';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 lg:gap-32">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingHomeSection />
      <CtaSection />
    </div>
  );
}
