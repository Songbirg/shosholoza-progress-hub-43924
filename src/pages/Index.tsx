import Navigation from "@/components/Navigation";
import HeroSlider from "@/components/HeroSlider";
import FivePointPlan from "@/components/FivePointPlan";
import Timeline from "@/components/Timeline";
import Values from "@/components/Values";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSlider />
        <FivePointPlan />
        <Timeline />
        <Values />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
