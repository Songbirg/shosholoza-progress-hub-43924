import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Message sent!",
        description:
          "Thank you for reaching out. We'll get back to you as soon as possible.",
      });

      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      toast({
        title: "Failed to send message",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="mb-6 animate-fade-in">Get in Touch</h1>
              <p
                className="text-xl text-muted-foreground animate-fade-in"
                style={{ animationDelay: "100ms" }}
              >
                Have questions or want to learn more? We'd love to hear from
                you.
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
              {/* ── Contact Info ────────────────────────────────────────── */}
              <div
                className="animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:info@shosholoza.org.za"
                        className="text-muted-foreground hover:text-foreground transition-smooth"
                      >
                        info@shosholoza.org.za
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Office</h3>
                      <p className="text-muted-foreground">
                        126 Plantation Rd
                        <br />
                        Blue Hills AH, Midrand
                        <br />
                        Johannesburg, South Africa
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="bg-muted p-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth"
                      aria-label="Facebook"
                    >
                      <Facebook size={20} />
                    </a>
                    <a
                      href="#"
                      className="bg-muted p-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth"
                      aria-label="Twitter"
                    >
                      <Twitter size={20} />
                    </a>
                    <a
                      href="#"
                      className="bg-muted p-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth"
                      aria-label="Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                    <a
                      href="#"
                      className="bg-muted p-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth"
                      aria-label="YouTube"
                    >
                      <Youtube size={20} />
                    </a>
                  </div>
                </div>
              </div>

              {/* ── Contact Form ─────────────────────────────────────────── */}
              <div
                className="bg-card p-8 rounded-lg shadow-elegant animate-fade-in"
                style={{ animationDelay: "300ms" }}
              >
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="mt-2"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="mt-2"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">
                      Subject <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      className="mt-2"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      className="mt-2"
                      rows={6}
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
