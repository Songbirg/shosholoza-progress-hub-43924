import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ParticleWave from "@/components/ParticleWave";

// Import slide images from the images folder (relative path from src/components)
import slide1 from "../../images/ultra-realistic_textures_and_202604091129.png";
import slide2 from "../../images/ultra-realistic_textures_and_202604091141.png";
import slide3 from "../../images/ultra-realistic_textures_and_202604091147.png";
import slide4 from "../../images/Ultra-realistic,_expansive_wide_202604211138.png";
import slide5 from "../../images/Please_remove_the_icon_on_the_bottom_right__2k_delpmaspu.png";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  effect: "zoom" | "slide" | "fade";
  textPosition: "center" | "left" | "right";
  primaryButton: string;
  secondaryButton: string;
}

// 5 Slides with unique effects (zoom/slide/fade), text positions, and messaging
const slides: Slide[] = [
  {
    id: 1,
    image: slide1, // Founder/Leader with Shhh logo - ZOOM effect
    title: "Shhh... Change is Coming",
    subtitle: "Leadership",
    description: "A new voice for South Africa. Join the movement that's quietly transforming our nation from the ground up.",
    effect: "zoom",
    textPosition: "left",
    primaryButton: "Join SHOSH",
    secondaryButton: "Meet Our Founder",
  },
  {
    id: 2,
    image: slide2, // Mother & child at rally - FADE effect
    title: "For Our Children's Future",
    subtitle: "Family & Community",
    description: "Every South African family deserves security, opportunity, and a voice in their community. Together, we build for the next generation.",
    effect: "fade",
    textPosition: "right",
    primaryButton: "Get Involved",
    secondaryButton: "Our Vision",
  },
  {
    id: 3,
    image: slide3, // Blue shirt crowd marching - SLIDE effect
    title: "March With Us",
    subtitle: "Youth Power",
    description: "Thousands of young South Africans are already marching toward change. Be part of the movement that's taking our streets and our future back.",
    effect: "slide",
    textPosition: "center",
    primaryButton: "Become a Member",
    secondaryButton: "Local Chapters",
  },
  {
    id: 4,
    image: slide4, // Shhh flag banner march - ZOOM effect
    title: "Raise the Banner",
    subtitle: "Shosholoza Progressive Party",
    description: "From townships to cities, our banner represents hope, unity, and the silent revolution that's changing South Africa. Fly it with pride.",
    effect: "zoom",
    textPosition: "center",
    primaryButton: "Get Your Banner",
    secondaryButton: "Our Story",
  },
  {
    id: 5,
    image: slide5, // Close-up group singing - FADE effect
    title: "Unity in Diversity",
    subtitle: "One Nation",
    description: "South Africa's strength is in its diversity. Together, we sing one song of hope, prosperity, and equal opportunity for all.",
    effect: "fade",
    textPosition: "left",
    primaryButton: "Join Our Movement",
    secondaryButton: "Our Values",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  const slide = slides[currentSlide];

  // Animation variants based on effect type
  const imageVariants = {
    zoom: {
      initial: { scale: 1.2, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.1, opacity: 0 },
    },
    slide: {
      initial: { x: direction > 0 ? "100%" : "-100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: direction > 0 ? "-100%" : "100%", opacity: 0 },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  };

  const textVariants = {
    left: {
      initial: { x: -100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
    },
    right: {
      initial: { x: 100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
    },
    center: {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
    },
  };

  return (
    <section
      className="relative h-screen max-h-[900px] min-h-[600px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0 z-0"
          variants={imageVariants[slide.effect]}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          />
          {/* Ken Burns effect for zoom slides */}
          {slide.effect === "zoom" && (
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
              animate={{ scale: [1, 1.1] }}
              transition={{ duration: 8, ease: "linear" }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Particle Wave Overlay */}
      <ParticleWave className="absolute inset-0 z-[5] w-full h-full opacity-40" />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-black/30" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />

      {/* Content */}
      <div className="container mx-auto px-4 h-full relative z-30 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className={`max-w-3xl ${
              slide.textPosition === "center"
                ? "mx-auto text-center"
                : slide.textPosition === "left"
                ? "mr-auto text-left"
                : "ml-auto text-right"
            }`}
            variants={textVariants[slide.textPosition]}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Subtitle badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-yellow-500/90 text-green-900 font-bold text-sm rounded-full shadow-lg">
                {slide.subtitle}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ textShadow: "0 4px 24px rgba(0,0,0,0.8)" }}
            >
              {slide.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl leading-relaxed drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}
            >
              {slide.description}
            </motion.p>

            {/* Buttons */}
            <motion.div
              className={`flex flex-col sm:flex-row gap-4 ${
                slide.textPosition === "center"
                  ? "justify-center"
                  : slide.textPosition === "right"
                  ? "justify-end"
                  : "justify-start"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link
                to={
                  slide.id === 2 ? "/candidate" : "/candidate"
                }
                className="hover:scale-105 transition-transform inline-block"
              >
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold px-8 py-6 text-lg shadow-xl border-2 border-yellow-400"
                >
                  {slide.primaryButton}
                </Button>
              </Link>

              <Link
                to={slide.id === 2 ? "/candidate" : "/about"}
                className="hover:scale-105 transition-transform inline-block"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-green-900 px-8 py-6 text-lg shadow-xl bg-white/10 backdrop-blur-sm"
                >
                  {slide.secondaryButton}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "w-10 bg-yellow-500"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 z-40 text-white/60 font-mono text-sm">
        <span className="text-yellow-500 font-bold text-lg">
          {String(currentSlide + 1).padStart(2, "0")}
        </span>
        <span className="mx-2">/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
};

export default HeroSlider;
