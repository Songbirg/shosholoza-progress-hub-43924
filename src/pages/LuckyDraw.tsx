import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Gift, Users, CheckCircle, ExternalLink, Sparkles, Award, User, Mail, Phone, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const LuckyDraw = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    membershipId: "",
  });

  // Countdown to closing date: 4 November 2026
  useEffect(() => {
    const closingDate = new Date("2026-11-04T23:59:59").getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = closingDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isPromotionClosed = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("lucky_draw_entries").insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          membership_id: formData.membershipId,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Entry Submitted!",
        description: "Your lucky draw entry has been registered successfully.",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        membershipId: "",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-950 to-slate-900">
      <SEO
        title="SHOSH Lucky Draw 2026 - Win Up To R100,000!"
        description="Enter the SHOSH Lucky Draw 2026 for your chance to win up to R100,000! For SHOSH members only. Closing date: 4 November 2026. Draw date: 12 November 2026."
        url="https://shosh.org.za/lucky-draw"
        image="https://shosh.org.za/og-image.png"
      />
      <Navigation />
      
      {/* Floating Confetti Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
            }}
            animate={{
              y: ["0vh", "110vh"],
              rotate: [0, 360],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-red-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                OFFICIAL SHOSH LUCKY DRAW 2026
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
            >
              LUCKY DRAW FOR<br />SHOSH MEMBERS
            </motion.h1>

            {/* Prize Amount */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative mb-8"
            >
              <div className="inline-block relative">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(250, 204, 21, 0.3)",
                      "0 0 40px rgba(250, 204, 21, 0.5)",
                      "0 0 20px rgba(250, 204, 21, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text"
                >
                  <h2 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none">
                    WIN UP TO
                  </h2>
                  <h2 className="text-7xl md:text-9xl lg:text-[12rem] font-black leading-none">
                    R100,000!
                  </h2>
                </motion.div>
                <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-yellow-400 animate-pulse" />
                <Sparkles className="absolute -bottom-4 -left-4 w-8 h-8 text-yellow-300 animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-yellow-400 font-bold mb-4"
            >
              The number of votes we get will be the prize money.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
            >
              Be part of the excitement! Visit SHOSH to find out how to participate in the 2026 Lucky Draw.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/lucky-draw" scroll={false}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-red-900 font-bold px-10 py-7 text-lg shadow-2xl"
                  onClick={() => document.getElementById('entry-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  ENTER THE DRAW
                  <Gift className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a
                href="https://shosh.org.za/candidate"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-red-900 px-10 py-7 text-lg font-bold"
                >
                  BECOME A MEMBER
                  <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </motion.div>

            {/* Countdown Timer */}
            {!isPromotionClosed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 max-w-2xl mx-auto"
              >
                <p className="text-yellow-400 text-sm font-semibold mb-4 uppercase tracking-wide">
                  Closing in:
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Days", value: timeLeft.days },
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
                      <div className="text-3xl md:text-4xl font-black text-yellow-400">
                        {String(item.value).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-400 uppercase mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="mt-12 bg-red-600/20 border border-red-600 rounded-xl p-6 max-w-2xl mx-auto">
                <p className="text-red-400 font-bold text-lg">
                  The promotion has closed. Check official announcements for the draw results!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              HOW IT WORKS
            </h2>
            <p className="text-xl text-gray-300">
              Three simple steps to participate in the SHOSH Lucky Draw
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "STEP 1",
                icon: Users,
                title: "BE A SHOSH MEMBER",
                description: "The promotion is intended for SHOSH members. Visit shosh.org.za/candidate to register as a member and review eligibility requirements.",
              },
              {
                step: "STEP 2",
                icon: CheckCircle,
                title: "CHECK THE PROMOTION DETAILS",
                description: "Visit the official SHOSH website to learn how the lucky draw works, including any voting or participation requirements.",
              },
              {
                step: "STEP 3",
                icon: Award,
                title: "LOOK OUT FOR THE DRAW",
                description: "Check the official announcements for the draw outcome and any instructions for winners.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/20 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" />
                
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8 text-red-900" strokeWidth={2.5} />
                </div>

                <div className="text-yellow-400 text-sm font-bold mb-2">{item.step}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Money Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-red-600/20" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-12 md:p-16 border-4 border-yellow-400 shadow-2xl"
          >
            <Gift className="w-20 h-20 text-yellow-400 mx-auto mb-8 animate-bounce" />
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              YOUR VOTES. THE PRIZE MONEY.
            </h2>

            <div className="my-10">
              <motion.div
                animate={{
                  textShadow: [
                    "0 0 20px rgba(250, 204, 21, 0.5)",
                    "0 0 40px rgba(250, 204, 21, 0.8)",
                    "0 0 20px rgba(250, 204, 21, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl md:text-8xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-transparent bg-clip-text"
              >
                UP TO R100,000
              </motion.div>
            </div>

            <p className="text-xl md:text-2xl text-yellow-400 font-bold">
              The number of votes we get will be the prize money.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Important Dates Section */}
      <section className="py-20 px-4 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              IMPORTANT DATES
            </h2>
            <p className="text-xl text-gray-300">
              Mark your calendar for these key dates
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                label: "CLOSING DATE",
                date: "4 NOVEMBER 2026",
                color: "from-red-600 to-red-700",
                icon: Calendar,
              },
              {
                label: "DRAW DATE",
                date: "12 NOVEMBER 2026",
                color: "from-yellow-500 to-yellow-600",
                icon: Gift,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-10 border-4 border-yellow-400 text-center relative overflow-hidden group shadow-xl"
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${item.color}`} />
                
                <item.icon className="w-16 h-16 text-yellow-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                
                <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-3">
                  {item.label}
                </div>
                <div className="text-4xl md:text-5xl font-black text-white">
                  {item.date}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Timeline Connector */}
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 w-px h-8 bg-yellow-400" />
        </div>
      </section>

      {/* Entry Form Section */}
      <section id="entry-form" className="py-20 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              ENTER THE DRAW
            </h2>
            <p className="text-xl text-gray-300">
              Complete your entry for the SHOSH Lucky Draw 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-8 md:p-12 border-2 border-yellow-400 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-yellow-400" />
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="h-12 text-lg bg-white/10 border-yellow-400/30 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-semibold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-yellow-400" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 text-lg bg-white/10 border-yellow-400/30 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-lg font-semibold text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-yellow-400" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="h-12 text-lg bg-white/10 border-yellow-400/30 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Membership ID */}
              <div className="space-y-2">
                <Label htmlFor="membershipId" className="text-lg font-semibold text-white flex items-center gap-2">
                  <Hash className="w-5 h-5 text-yellow-400" />
                  SHOSH Membership ID *
                </Label>
                <Input
                  id="membershipId"
                  name="membershipId"
                  type="text"
                  placeholder="Enter your membership ID"
                  value={formData.membershipId}
                  onChange={handleChange}
                  required
                  className="h-12 text-lg bg-white/10 border-yellow-400/30 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || isPromotionClosed}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-red-900 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Gift className="w-5 h-5" />
                    </motion.div>
                    Submitting...
                  </span>
                ) : isPromotionClosed ? (
                  "Promotion Closed"
                ) : (
                  <span className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Submit Entry
                  </span>
                )}
              </Button>

              <p className="text-center text-sm text-gray-400 pt-2">
                By entering, you confirm you are a SHOSH member and agree to the terms and conditions.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-700 via-red-600 to-red-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              READY TO JOIN THE EXCITEMENT?
            </h2>
            <p className="text-xl text-white/90 mb-4">
              Not a member yet?
            </p>
            <p className="text-lg text-white/80 mb-10">
              Register as a SHOSH member to participate in the lucky draw.
            </p>
            
            <a
              href="https://shosh.org.za/candidate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-red-900 font-black px-12 py-8 text-xl shadow-2xl"
              >
                BECOME A SHOSH MEMBER
                <ExternalLink className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>

            <p className="text-white/70 text-sm mt-6">
              Already a member? Scroll up to enter the lucky draw.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <div className="bg-slate-950 py-8 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <p className="text-gray-400 text-sm leading-relaxed">
            <strong className="text-yellow-400">Disclaimer:</strong> Eligibility, participation rules, prize details, and the official terms and conditions must be confirmed on the official SHOSH website at{" "}
            <a href="https://shosh.org.za/candidate" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
              shosh.org.za/candidate
            </a>
            . This promotion page is for informational purposes only.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LuckyDraw;
