import { motion } from "framer-motion";
import { 
  Zap, 
  GraduationCap, 
  Shield, 
  Users, 
  Building2,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const planPoints = [
  {
    number: "01",
    icon: Zap,
    title: "Quality Service Delivery",
    subtitle: "Power to the People",
    description: "We will establish regional management offices to manage service delivery closer to communities. We will also outsource key municipal services like waste collection, pothole repairs, electricity, water pipe repairs, etc. to community cooperatives.",
    color: "from-yellow-500 to-amber-500"
  },
  {
    number: "02",
    icon: GraduationCap,
    title: "Job Creation and Skills Development",
    subtitle: "Opportunities for All",
    description: "We will establish Job Centres in all communities to connect people to opportunities. These centres will offer free Wi-Fi, advertise all jobs locally, and train our youth for real work.",
    color: "from-green-500 to-emerald-500"
  },
  {
    number: "03",
    icon: Shield,
    title: "Zero Tolerance for Corruption",
    subtitle: "Transparency & Accountability",
    description: "We will dismantle municipal corruption networks and prosecute water tank mafias and tender cartels. Local Anti-Corruption Units will ensure transparency and conduct lifestyle audits for councillors and officials.",
    color: "from-red-500 to-rose-500"
  },
  {
    number: "04",
    icon: Users,
    title: "Safe and United Communities",
    subtitle: "Youth Brigades Initiative",
    description: "We will introduce Youth Brigades to support community safety, fight drugs and tackle gangsterism. This national service-style programme will instill discipline, pride, and purpose among our youth.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    number: "05",
    icon: Building2,
    title: "Reclaim Our Cities and Townships",
    subtitle: "Restore Order & Pride",
    description: "We will restore order and pride in our cities by refusing influx of illegals, cleaning cities, regulating informal trading, supporting local entrepreneurs, and funding township mini-supermarkets owned by South Africans. Clean, modern, and dignified spaces will return to our communities.",
    color: "from-purple-500 to-violet-500"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const FivePointPlan = () => {
  return (
    <section id="five-point-plan" className="py-20 lg:py-28 bg-rainbow-subtle relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-32 right-10 w-20 h-20 border-2 border-green-500/20 rounded-lg rotate-12 animate-spin" style={{ animationDuration: '25s' }} />
      <div className="absolute bottom-40 left-10 w-16 h-16 border-2 border-yellow-500/20 rounded-full animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
      <div className="absolute top-1/2 right-1/4 w-12 h-12 border-2 border-blue-500/20 rotate-45 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">Our Commitment</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Our <span className="text-primary">5 Point Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive roadmap to rebuild our cities, restore dignity, and revive the South African dream
          </p>
        </motion.div>

        {/* Plan Points Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {planPoints.map((point, index) => (
            <motion.div
              key={point.number}
              variants={itemVariants}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-elegant hover:shadow-bold transition-all duration-300 hover:-translate-y-2 border border-border/50 overflow-hidden ${
                index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${point.color}`} />
              
              {/* Number badge */}
              <div className={`absolute -top-3 -right-3 w-14 h-14 rounded-full bg-gradient-to-br ${point.color} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {point.number}
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${point.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <point.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors duration-300">
                {point.title}
              </h3>
              <p className={`text-sm font-semibold mb-3 bg-gradient-to-r ${point.color} bg-clip-text text-transparent`}>
                {point.subtitle}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {point.description}
              </p>

              {/* Hover indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className={`w-5 h-5 bg-gradient-to-r ${point.color} bg-clip-text text-transparent`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Commitment Statement */}
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-yellow-500/10 rounded-3xl p-8 md:p-12 border border-primary/20 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10">
              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
                We, <span className="font-bold text-primary">Shosholoza Progressive Party</span>, commit to serve with integrity, deliver with excellence, and govern with humility. 
                <span className="font-semibold"> We will not wait for change – we are the change.</span>
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Together, we will rebuild our cities, restore dignity, and revive the South African dream.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-6 text-lg shadow-bold hover:shadow-glow transition-all duration-300 group"
                >
                  <Link to="/join" className="flex items-center gap-2">
                    Join SHOSH Movement
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
              
              <p className="mt-6 text-xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent uppercase tracking-wider">
                VOTE SHOSH – SHOSHOLOZA PROGRESSIVE PARTY
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FivePointPlan;
