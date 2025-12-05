import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="mb-8 animate-fade-in">About Shosholoza Progressive Party</h1>
              
              <div className="prose prose-lg max-w-none space-y-6 text-foreground">
                <div className="bg-card p-8 rounded-lg shadow-elegant animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <h2 className="text-2xl font-bold mb-4">Our History</h2>
                  <p className="text-muted-foreground mb-4">
                    The Shosholoza Progressive Party (Shosh) was founded in 2015 with a clear vision: to build a South Africa 
                    where social democracy, equal opportunity, and shared prosperity are not just ideals, but lived realities 
                    for every citizen.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    In the same year of our founding, we achieved official registration with the Independent Electoral 
                    Commission (IEC), marking our formal entry into South African politics. This milestone represented not 
                    just a bureaucratic achievement, but a commitment to working within democratic institutions to effect 
                    real change.
                  </p>
                </div>

                <div className="bg-card p-8 rounded-lg shadow-elegant animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground mb-4">
                    We envision a South Africa where every citizen, regardless of background or circumstance, has access to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li>Quality education that opens doors to opportunity</li>
                    <li>Healthcare that treats dignity as a right, not a privilege</li>
                    <li>Economic opportunities that create pathways out of poverty</li>
                    <li>Safe communities where families can thrive</li>
                    <li>A government that serves the people, not special interests</li>
                  </ul>
                </div>

                <div className="bg-card p-8 rounded-lg shadow-elegant animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground mb-4">
                    The Shosholoza Progressive Party is committed to advancing social democracy in South Africa through:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li>Championing policies that reduce inequality and create opportunity for all</li>
                    <li>Building strong, accountable institutions that serve the public interest</li>
                    <li>Fostering economic growth that benefits workers and communities</li>
                    <li>Protecting the rights and dignity of every South African</li>
                    <li>Promoting transparency, integrity, and ethical leadership in government</li>
                  </ul>
                </div>

                <div className="bg-card p-8 rounded-lg shadow-elegant animate-fade-in" style={{ animationDelay: '400ms' }}>
                  <h2 className="text-2xl font-bold mb-4">Why "Shosholoza"?</h2>
                  <p className="text-muted-foreground">
                    Our name comes from the iconic South African folk song "Shosholoza," which was sung by miners as they 
                    worked together. The song speaks to the power of collective effort, perseverance, and moving forward 
                    together—values that define our approach to politics and governance. Like the train in the song, we 
                    believe in moving South Africa forward, together, leaving no one behind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
