import { Calendar, Flag, Users, Award } from "lucide-react";

const timelineEvents = [
  {
    year: "2015",
    title: "Party Founded",
    description: "Shosholoza Progressive Party launched with a vision for social democracy",
    icon: Flag,
  },
  {
    year: "2015",
    title: "IEC Registration",
    description: "Official registration with the Independent Electoral Commission",
    icon: Award,
  },
  {
    year: "2016-2024",
    title: "Growing Support",
    description: "Building grassroots support across South Africa",
    icon: Users,
  },
  {
    year: "2025+",
    title: "Future Vision",
    description: "Working towards a more equitable and prosperous South Africa",
    icon: Calendar,
  },
];

const Timeline = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-4">Our Journey</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From founding to the future, our commitment to South Africa remains unwavering
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              return (
                <div
                  key={index}
                  className="relative bg-card p-6 rounded-lg shadow-elegant hover-lift animate-fade-in group cursor-pointer"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-elegant group-hover:shadow-glow transition-smooth group-hover:scale-110">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">
                        {event.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-smooth">{event.title}</h3>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
