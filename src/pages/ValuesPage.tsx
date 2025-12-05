import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Heart, Scale, Shield, TrendingUp, Users, Book, Briefcase, Home } from "lucide-react";

const coreValues = [
  {
    icon: Heart,
    title: "Social Democracy",
    description: "We believe in a political and economic system that combines social justice with economic prosperity. Government should work for the people, ensuring that the benefits of progress are shared by all, not concentrated in the hands of a few."
  },
  {
    icon: Scale,
    title: "Equal Opportunity",
    description: "Every South African deserves a fair chance to succeed, regardless of their background. We are committed to breaking down barriers that prevent people from accessing education, employment, and opportunities for advancement."
  },
  {
    icon: Shield,
    title: "Security for All",
    description: "Safety is a fundamental right. We believe in strong institutions, effective law enforcement, and community-based approaches to crime prevention that make every neighborhood a safe place to live, work, and raise a family."
  },
  {
    icon: TrendingUp,
    title: "Shared Prosperity",
    description: "Economic growth must benefit everyone, not just the wealthy. We support policies that create jobs, raise wages, strengthen worker protections, and ensure that the economy works for working people."
  }
];

const policyPriorities = [
  {
    icon: Book,
    title: "Quality Education",
    description: "Investing in education from early childhood through university, ensuring every child has access to schools with qualified teachers, modern facilities, and the resources they need to succeed."
  },
  {
    icon: Users,
    title: "Universal Healthcare",
    description: "Healthcare is a right, not a privilege. We support a healthcare system that provides quality care to all South Africans, regardless of their ability to pay."
  },
  {
    icon: Briefcase,
    title: "Job Creation",
    description: "Supporting small businesses, attracting investment, and developing infrastructure projects that create meaningful employment opportunities for South Africans."
  },
  {
    icon: Home,
    title: "Affordable Housing",
    description: "Working to ensure every family has access to safe, affordable housing through innovative financing, efficient government programs, and partnerships with the private sector."
  }
];

const ValuesPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="mb-6 animate-fade-in">Our Values & Principles</h1>
              <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
                The foundation of everything we do is built on these core beliefs and commitments to the people of South Africa.
              </p>
            </div>

            <div className="max-w-6xl mx-auto mb-20">
              <h2 className="text-3xl font-bold text-center mb-12">Core Values</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {coreValues.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div 
                      key={index}
                      className="bg-card p-8 rounded-lg shadow-elegant hover:shadow-bold transition-smooth animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-elegant flex-shrink-0">
                          <Icon size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                          <p className="text-muted-foreground">{value.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Policy Priorities</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {policyPriorities.map((priority, index) => {
                  const Icon = priority.icon;
                  return (
                    <div 
                      key={index}
                      className="bg-card p-8 rounded-lg shadow-elegant hover:shadow-bold transition-smooth animate-fade-in"
                      style={{ animationDelay: `${(index + 4) * 100}ms` }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="bg-secondary text-secondary-foreground p-4 rounded-lg shadow-elegant flex-shrink-0">
                          <Icon size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-3">{priority.title}</h3>
                          <p className="text-muted-foreground">{priority.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ValuesPage;
