import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Home, ChevronLeft, ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const HousingRegister = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Housing development slides - Professional with real images
  const slides = [
    {
      title: "Modern Township Development",
      description: "Building sustainable communities across Johannesburg",
      image: "/images/Campaign images/Make_this_image_high_quality_202605131039.jpeg",
    },
    {
      title: "Quality Family Housing",
      description: "Affordable homes with modern amenities",
      image: "/images/Campaign images/Make_this_image_high_quality_202605131039 (1).jpeg",
    },
    {
      title: "Integrated Communities",
      description: "Housing with essential services and infrastructure",
      image: "/images/Campaign images/Make_this_image_high_quality_202605131039 (2).jpeg",
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <Navigation />
      
      {/* Professional Hero Section with Image Slider */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-green-900 to-emerald-950 min-h-[700px] md:min-h-[800px]">
        
        {/* Image Slider Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${slides[currentSlide].image}')`,
              }}
            />
            
            {/* Professional Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-green-900/85 to-emerald-900/75" />
            
            {/* Sophisticated Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="professionalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#professionalGrid)" />
              </svg>
            </div>

            {/* Elegant Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls - Minimalist Design */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-lg p-4 rounded-full transition-all duration-300 border border-white/20 group shadow-2xl"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-7 h-7 text-white group-hover:scale-110 transition-transform" strokeWidth={2.5} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-lg p-4 rounded-full transition-all duration-300 border border-white/20 group shadow-2xl"
          aria-label="Next slide"
        >
          <ChevronRight className="w-7 h-7 text-white group-hover:scale-110 transition-transform" strokeWidth={2.5} />
        </button>

        {/* Elegant Progress Indicators */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex gap-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-700 ${
                idx === currentSlide
                  ? "bg-yellow-400 w-16 h-1.5 shadow-lg shadow-yellow-400/50"
                  : "bg-white/40 hover:bg-white/60 w-8 h-1.5"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Content Overlay - Professional Layout */}
        <div className="relative z-20 container mx-auto px-6 md:px-12 h-full min-h-[700px] md:min-h-[800px] flex flex-col justify-center">
          <div className="max-w-4xl">
            
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl">
                <Home className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2} />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight"
            >
              Housing Development
            </motion.h1>

            {/* Slide-specific Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6 }}
                className="mb-10"
              >
                <h2 className="text-2xl md:text-4xl font-bold text-yellow-400 mb-3">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-xl md:text-2xl text-gray-200 font-light">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Campaign Message - Elegant Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-3xl bg-white/10 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/20 shadow-2xl"
            >
              <div className="space-y-5">
                <p className="text-2xl md:text-3xl font-bold text-yellow-300 leading-relaxed">
                  "Adequate housing for all in Joburg"
                </p>
                
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                
                <p className="text-lg md:text-xl text-gray-100 font-medium leading-relaxed">
                  We Promise Quality Homes from South to North and East to West
                </p>
                
                <div className="pt-4">
                  <p className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text inline-block">
                    Vote Shosh and see the Magic! ✨
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements - Subtle */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-400/5 rounded-full blur-3xl" />
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Our Housing Commitment
            </h2>
            <p className="text-xl text-gray-600">
              Building modern, accessible, and affordable housing for all residents of Johannesburg
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { title: "Modern High-Rise Living", desc: "State-of-the-art apartment blocks with modern amenities and infrastructure" },
              { title: "Accessible Locations", desc: "Housing developments from South to North, East to West across Johannesburg" },
              { title: "Affordable Housing", desc: "Quality homes that are accessible to all residents of Joburg" },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                <Building2 className="w-12 h-12 text-green-700 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-lg">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HousingRegister;
