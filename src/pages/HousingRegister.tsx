import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Home, MapPin, Mail, Phone, User, Hash, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const HousingRegister = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    fullNames: "",
    idNumber: "",
    residentialAddress: "",
    email: "",
    telephone: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to database
      const { error } = await supabase.from("housing_applications").insert([
        {
          full_names: formData.fullNames,
          id_number: formData.idNumber,
          residential_address: formData.residentialAddress,
          email: formData.email,
          telephone: formData.telephone,
        },
      ]);

      if (error) throw error;

      // Prepare WhatsApp message
      const whatsappMessage = `🏠 *NEW HOUSING APPLICATION*\n\n` +
        `📝 *Full Names:* ${formData.fullNames}\n` +
        `🆔 *ID Number:* ${formData.idNumber}\n` +
        `📍 *Address:* ${formData.residentialAddress}\n` +
        `📧 *Email:* ${formData.email}\n` +
        `📱 *Phone:* ${formData.telephone}\n\n` +
        `✅ Registered via Housing Register Page`;

      // WhatsApp number (use your organization's WhatsApp number)
      const whatsappNumber = "27768477960"; // Replace with your actual WhatsApp number
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      toast({
        title: "Registration Successful!",
        description: "Redirecting to WhatsApp to complete your registration...",
      });

      // Reset form
      setFormData({
        fullNames: "",
        idNumber: "",
        residentialAddress: "",
        email: "",
        telephone: "",
      });

      // Redirect to WhatsApp after a short delay
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1500);

    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
              Housing Register
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
                
                <p className="text-base md:text-lg text-gray-200">
                  Register now for your own house
                </p>
                
                <div className="pt-4">
                  <p className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text inline-block">
                    Vote Shosh and see the Magic! ✨
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10"
            >
              <button
                onClick={() => {
                  document.querySelector('#registration-form')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-slate-900 font-bold text-lg px-10 py-5 rounded-full shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105"
              >
                <span>Register Now</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements - Subtle */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-400/5 rounded-full blur-3xl" />
      </div>

      {/* Registration Form Section */}
      <div id="registration-form" className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-600 px-8 py-6">
              <h2 className="text-3xl font-bold text-white text-center flex items-center justify-center gap-3">
                <Home className="w-8 h-8" />
                Register for Housing
              </h2>
              <p className="text-green-100 text-center mt-2">
                Fill in your details to secure your future home
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Full Names */}
              <div className="space-y-2">
                <Label htmlFor="fullNames" className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-green-700" />
                  Full Names
                </Label>
                <Input
                  id="fullNames"
                  name="fullNames"
                  type="text"
                  placeholder="Enter your full names"
                  value={formData.fullNames}
                  onChange={handleChange}
                  required
                  className="h-12 text-lg border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* ID Number */}
              <div className="space-y-2">
                <Label htmlFor="idNumber" className="text-lg font-semibold flex items-center gap-2">
                  <Hash className="w-5 h-5 text-green-700" />
                  ID Number
                </Label>
                <Input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  placeholder="Enter your ID number"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                  className="h-12 text-lg border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Residential Address */}
              <div className="space-y-2">
                <Label htmlFor="residentialAddress" className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-700" />
                  Residential Address
                </Label>
                <Textarea
                  id="residentialAddress"
                  name="residentialAddress"
                  placeholder="Enter your current residential address"
                  value={formData.residentialAddress}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="text-lg border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-green-700" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 text-lg border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Telephone */}
              <div className="space-y-2">
                <Label htmlFor="telephone" className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-700" />
                  Telephone Number
                </Label>
                <Input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  className="h-12 text-lg border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Building2 className="w-5 h-5" />
                      </motion.div>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Register Now
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* Additional Info */}
              <p className="text-center text-sm text-gray-600 pt-4">
                By registering, you'll be redirected to WhatsApp to complete your application.
                Your information will also be saved securely in our database.
              </p>
            </form>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {[
              { title: "Modern High-Rise Living", desc: "State-of-the-art apartment blocks with modern amenities" },
              { title: "Accessible Locations", desc: "Housing developments from South to North, East to West" },
              { title: "Affordable Housing", desc: "Quality homes that are accessible to all residents of Joburg" },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Building2 className="w-12 h-12 text-green-700 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
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
