import { Heart, Scale, Shield, TrendingUp } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Social Democracy",
    description: "A fair and just society where everyone has a voice and opportunity to thrive",
  },
  {
    icon: Scale,
    title: "Equal Opportunity",
    description: "Breaking down barriers and ensuring access to education, healthcare, and employment for all",
  },
  {
    icon: Shield,
    title: "Security for All",
    description: "Safe communities, strong institutions, and protection of rights for every South African",
  },
  {
    icon: TrendingUp,
    title: "Shared Prosperity",
    description: "Economic growth that benefits everyone, not just the privileged few",
  },
];

const Values = () => {
  return (
    <section id="values" className="py-20 px-4 bg-geometric relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 via-transparent to-yellow-500/5 pointer-events-none" />
      
      {/* Floating accent shapes */}
      <div className="absolute top-20 right-20 w-40 h-40 border-2 border-green-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
      <div className="absolute bottom-32 left-10 w-24 h-24 border-2 border-yellow-500/20 rounded-lg animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="bubble-morph blob-1" />
          <div className="bubble-morph blob-2" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:bg-muted/50 transition-smooth animate-scale-in group cursor-pointer hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-4 shadow-elegant group-hover:shadow-glow transition-bounce group-hover:rotate-6">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-smooth">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Values;
