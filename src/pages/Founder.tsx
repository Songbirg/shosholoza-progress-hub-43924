import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import founderImage from "@/assets/founder-portrait.jpg";

const Founder = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-center mb-12 animate-fade-in">Our Founder & President</h1>
              
              <div className="grid md:grid-cols-2 gap-12 mb-12">
                <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <img 
                    src={founderImage} 
                    alt="Dr. R. Russon - Founder and President of Shosholoza Progressive Party"
                    className="w-full rounded-lg shadow-bold"
                  />
                </div>
                
                <div className="flex flex-col justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <h2 className="text-3xl font-bold mb-4">Dr. R. Russon</h2>
                  <p className="text-xl text-muted-foreground mb-6">
                    Founder & President
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Dr. Russon's journey in service to South Africa spans decades, rooted in the liberation struggle 
                    and dedicated to building a more just and prosperous nation for all.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card p-8 rounded-lg shadow-elegant animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <h3 className="text-2xl font-bold mb-4">Liberation Struggle Contributions</h3>
                  <p className="text-muted-foreground mb-4">
                    Dr. Russon was a committed member of Umkhonto we Sizwe (MK), the armed wing of the African National 
                    Congress, during the struggle against apartheid. His dedication to freedom and justice led him to serve 
                    in various capacities both within South Africa and in exile.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    His journey took him to Moscow and Lusaka, where he received training and worked alongside other freedom 
                    fighters to strategize the liberation of South Africa. These experiences shaped his understanding of 
                    international solidarity, the importance of disciplined organization, and the transformative power of 
                    collective action.
                  </p>
                </div>

                <div className="bg-card p-8 rounded-lg shadow-elegant animate-fade-in" style={{ animationDelay: '400ms' }}>
                  <h3 className="text-2xl font-bold mb-4">Education & Background</h3>
                  <p className="text-muted-foreground mb-4">
                    Dr. Russon's commitment to learning and development has been a constant throughout his life. His academic 
                    pursuits were not merely about personal advancement, but about equipping himself with the knowledge and 
                    skills necessary to serve his people effectively.
                  </p>
                  <p className="text-muted-foreground">
                    His educational background, combined with his lived experience in the liberation struggle, gives him a 
                    unique perspective on the challenges facing South Africa and the practical solutions needed to address them.
                  </p>
                </div>

                <div className="bg-card p-8 rounded-lg shadow-elegant animate-fade-in" style={{ animationDelay: '500ms' }}>
                  <h3 className="text-2xl font-bold mb-4">Political Vision</h3>
                  <p className="text-muted-foreground mb-4">
                    Dr. Russon's political philosophy is grounded in the principles of social democracy—a belief that economic 
                    prosperity and social justice are not opposing goals, but complementary necessities for a thriving society.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    He believes that the promise of freedom that drove the liberation struggle can only be fully realized when 
                    every South African has access to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li>Quality education that unlocks potential</li>
                    <li>Economic opportunities that create pathways to prosperity</li>
                    <li>Healthcare that protects dignity and life</li>
                    <li>Safe communities where families can flourish</li>
                    <li>A government that serves the people with integrity and accountability</li>
                  </ul>
                </div>

                <div className="bg-card p-8 rounded-lg shadow-elegant animate-fade-in" style={{ animationDelay: '600ms' }}>
                  <h3 className="text-2xl font-bold mb-4">The Founding of Shosholoza</h3>
                  <p className="text-muted-foreground mb-4">
                    In 2015, recognizing that South Africa needed a renewed commitment to the ideals of the liberation struggle, 
                    Dr. Russon founded the Shosholoza Progressive Party. The party represents his vision of what South Africa 
                    can become: a nation where the promise of freedom extends beyond political rights to include economic 
                    security, social opportunity, and shared prosperity.
                  </p>
                  <p className="text-muted-foreground">
                    Under his leadership, the party has remained steadfast in its commitment to social democracy, working to 
                    build grassroots support and develop policies that address the real challenges facing ordinary South Africans.
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

export default Founder;
