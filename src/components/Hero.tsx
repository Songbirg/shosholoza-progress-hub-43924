import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.png";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 hero-bg-image"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />

      {/* Subtle dark scrim so text is readable without hiding the image */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* Bottom fade into page background */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent z-20" />

      {/* Content — centred in the diagonal stripe area */}
      <div className="container mx-auto px-4 py-24 relative z-30">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-white mb-6 animate-slide-up drop-shadow-lg"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}
          >
            Building a Better South Africa
          </h1>

          <p
            className="text-lg md:text-2xl text-white/90 mb-10 max-w-xl mx-auto animate-slide-up leading-relaxed drop-shadow"
            style={{
              animationDelay: "0.2s",
              textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}
          >
            Social democracy. Equal opportunity.
            <br />
            Security and prosperity for all.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Link to="/membership" className="hover-scale inline-block">
              <Button
                variant="hero"
                size="lg"
                className="w-full sm:w-auto shadow-lg"
              >
                Join Our Movement
              </Button>
            </Link>

            <Link to="/about" className="hover-scale inline-block">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto shadow-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
