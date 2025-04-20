import { HeroSection } from '../components/sections/HeroSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { PropertiesSection } from '../components/sections/PropertiesSection';
import { AIConsultantSection } from '../components/sections/AIConsultantSection';
import { Footer } from '../components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <PropertiesSection />
      <AIConsultantSection />
      <Footer />
    </main>
  );
}
