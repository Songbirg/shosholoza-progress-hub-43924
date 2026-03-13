import { useState } from "react";
import shoshLogo from "@/assets/shosh-logo.png";
import councillorPoster from "@/assets/councillor-poster.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Councillor = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [municipality, setMunicipality] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!municipality) {
      toast({
        title: "Form Incomplete",
        description: "Please select a preferred municipality.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing...",
      description: "Submitting your councillor application.",
    });

    try {
      const res = await fetch("/.netlify/functions/submit-councillor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          municipality,
          userAgent: navigator.userAgent,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit councillor application");
      }

      const data = (await res.json()) as { emailSent?: boolean; emailError?: string | null };
      toast({
        title: "Application received",
        description: data.emailSent
          ? "Your application has been received and sent to info@shosh.org.za"
          : `Your application was received, but email sending failed: ${data.emailError || "Unknown error"}`,
      });

      setName("");
      setEmail("");
      setPhone("");
      setMunicipality("");
    } catch {
      toast({
        title: "Error",
        description: "There was an issue submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="min-h-screen"
      style={
        {
          "--c-bg-1": "#0f2027",
          "--c-bg-2": "#203a43",
          "--c-bg-3": "#2c5364",
          "--c-text": "#fdfdfd",
          "--c-gold": "#d4af37",
          "--c-blue": "#3498db",
          "--c-yellow": "#f1c40f",
          "--c-red": "#e74c3c",
        } as React.CSSProperties
      }
    >
      <div
        className="min-h-screen"
        style={{
          backgroundImage:
            "radial-gradient(900px 500px at 10% 10%, rgba(52,152,219,0.18), transparent 60%), radial-gradient(700px 500px at 90% 20%, rgba(241,196,15,0.12), transparent 55%), radial-gradient(700px 500px at 50% 90%, rgba(231,76,60,0.10), transparent 60%), linear-gradient(135deg, var(--c-bg-1), var(--c-bg-2), var(--c-bg-3))",
          color: "var(--c-text)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-14">
          <header className="text-center mb-10">
            <div
              className="mx-auto inline-flex items-center justify-center rounded-2xl p-3"
              style={{
                background:
                  "linear-gradient(90deg, rgba(52,152,219,0.25), rgba(241,196,15,0.20), rgba(231,76,60,0.18))",
              }}
            >
              <img
                src={shoshLogo}
                alt="Shhhh..."
                className="h-20 w-auto rounded-xl shadow-lg"
              />
            </div>
            <h1 className="mt-6 text-2xl md:text-3xl font-semibold tracking-wide">
              Shosholoza Progressive Party
            </h1>
            <p className="text-lg md:text-xl opacity-90">(SHOSH)</p>
          </header>

          <section className="text-center mb-10">
            <h2
              className="text-4xl md:text-6xl font-extrabold leading-tight"
              style={{ color: "var(--c-gold)" }}
            >
              Earn R49,000 - R100,000 pm
            </h2>
            <div className="mt-6 max-w-3xl mx-auto">
              <div
                className="h-[3px] rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--c-blue), var(--c-yellow), var(--c-red))",
                }}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-sm p-6 md:p-8 shadow-2xl">
                <h3 className="text-2xl md:text-3xl font-bold">
                  Become a Councillor for Joburg / Ekurhuleni / Tshwane
                </h3>
                <p className="mt-2 text-base md:text-lg opacity-90">
                  Join Now at and we will contact you asap
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="c-name" className="text-white">
                      Name
                    </Label>
                    <Input
                      id="c-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/60"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="c-email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="c-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/60"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="c-phone" className="text-white">
                      Phone Number
                    </Label>
                    <Input
                      id="c-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+27..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/60"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Preferred Municipality</Label>
                    <Select value={municipality} onValueChange={setMunicipality}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select municipality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="joburg">Joburg</SelectItem>
                        <SelectItem value="ekurhuleni">Ekurhuleni</SelectItem>
                        <SelectItem value="tshwane">Tshwane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-lg md:text-xl font-extrabold py-7 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: "var(--c-gold)",
                      color: "#111",
                      boxShadow: "0 0 0 rgba(212,175,55,0)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 0 30px rgba(212,175,55,0.45)";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 rgba(212,175,55,0)";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0px)";
                    }}
                  >
                    APPLY TO VOTE SHOSH!
                  </Button>
                </form>

                <div className="mt-10 text-center">
                  <p className="text-2xl md:text-3xl font-bold">
                    We Are Taking Over! / <span style={{ color: "var(--c-gold)" }}>It’s Time for Change!</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div
                className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6 md:p-8 shadow-2xl"
                style={{
                  borderTop: "4px solid var(--c-red)",
                }}
              >
                <div className="mt-3">
                  <div className="aspect-[4/5] w-full rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                    <img
                      src={councillorPoster}
                      alt="Become a Councillor poster"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-6">
                    <div
                      className="h-[3px] rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--c-blue), var(--c-yellow), var(--c-red))",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-14 text-center">
            <p className="text-sm opacity-70">Shosholoza Progressive Party</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Councillor;
