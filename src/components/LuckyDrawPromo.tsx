import { motion } from "framer-motion";
import { Gift, Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const LuckyDrawPromo = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-red-900 via-red-800 to-red-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Floating sparkles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-red-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              SHOSH LUCKY DRAW 2026
              <Sparkles className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Icon */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8"
          >
            <Gift className="w-20 h-20 text-yellow-400 mx-auto" strokeWidth={2} />
          </motion.div>

          {/* Headline */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            WIN UP TO
            <motion.span
              animate={{
                textShadow: [
                  "0 0 20px rgba(250, 204, 21, 0.5)",
                  "0 0 40px rgba(250, 204, 21, 0.8)",
                  "0 0 20px rgba(250, 204, 21, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="block text-6xl md:text-8xl lg:text-9xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-transparent bg-clip-text"
            >
              R100,000!
            </motion.span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-yellow-400 font-bold mb-4 max-w-3xl mx-auto">
            The number of votes we get will be the prize money
          </p>

          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            For SHOSH members only! Enter now for your chance to win.
          </p>

          {/* Dates */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
              <div className="text-yellow-400 text-sm font-semibold mb-1">CLOSES</div>
              <div className="text-2xl md:text-3xl font-black text-white">4 NOV 2026</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
              <div className="text-yellow-400 text-sm font-semibold mb-1">DRAW DATE</div>
              <div className="text-2xl md:text-3xl font-black text-white">12 NOV 2026</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/lucky-draw" className="group">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-red-900 font-black px-10 py-7 text-lg shadow-2xl"
              >
                ENTER NOW
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-red-900 px-10 py-7 text-lg font-bold bg-white/5 backdrop-blur-sm"
              >
                BECOME A MEMBER
                <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>

          {/* Small text */}
          <p className="text-white/70 text-sm mt-8">
            Must be a SHOSH member to enter. Terms and conditions apply.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LuckyDrawPromo;
