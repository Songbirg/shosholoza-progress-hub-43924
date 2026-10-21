import Navigation from "@/components/Navigation";
import HeroSlider from "@/components/HeroSlider";
import LuckyDrawPromo from "@/components/LuckyDrawPromo";
import FivePointPlan from "@/components/FivePointPlan";
import Timeline from "@/components/Timeline";
import Values from "@/components/Values";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen pt-16">
      <Navigation />
      <main className="pt-16">
        <HeroSlider />
        <LuckyDrawPromo />
        <FivePointPlan />
        <Timeline />
        <Values />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
