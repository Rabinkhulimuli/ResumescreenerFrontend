import { CTASection } from "./components/Cta-section";
import { DashboardPreview } from "./components/Dashboard-preview";
import { FeaturesSection } from "./components/Feature-section";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HeroSection } from "./components/Hero-section";
import { UploadInterface } from "./components/Upload-interface";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <UploadInterface />
      <DashboardPreview />
      <CTASection />
      <Footer />
    </div>
  )
}
