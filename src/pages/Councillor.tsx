import { useMemo, useState } from "react";
import shoshLogo from "@/assets/shosh-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Councillor = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [municipality, setMunicipality] = useState<string>("");

  const canNext = useMemo(() => {
    if (step === 1) return Boolean(name.trim()) && Boolean(email.trim()) && Boolean(phone.trim());
    if (step === 2) return Boolean(municipality);
    return true;
  }, [email, municipality, name, phone, step]);

  const next = () => {
    if (!canNext) {
      toast({
        title: "Form Incomplete",
        description: step === 2 ? "Please select a preferred municipality." : "Please complete all fields.",
        variant: "destructive",
      });
      return;
    }

    setStep((s) => (s === 1 ? 2 : 3));
  };

  const prev = () => {
    setStep((s) => (s === 3 ? 2 : 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step !== 3) {
      next();
      return;
    }

    if (!canNext) {
      toast({
        title: "Form Incomplete",
        description: "Please complete all fields.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const application = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        name,
        email,
        phone,
        municipality,
        user_agent: navigator.userAgent,
      };

      const existing = JSON.parse(localStorage.getItem("shosh_councillor_applications") || "[]");
      existing.push(application);
      localStorage.setItem("shosh_councillor_applications", JSON.stringify(existing));

      let emailSent = false;
      try {
        const emailRes = await fetch("/.netlify/functions/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "info@shosh.org.za",
            subject: `New Councillor Application - ${name}`,
            html: `
              <h2>New Councillor Application</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Municipality:</strong> ${municipality}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString("en-ZA")}</p>
            `,
          }),
        });
        if (emailRes.ok) {
          emailSent = true;
        }
      } catch (err) {
      }

      toast({
        title: "Application received",
        description: emailSent ? "We’ll contact you soon." : "Saved successfully.",
      });

      setSubmittedId(application.id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSubmittedId(null);
    setSubmitting(false);
    setStep(1);
    setName("");
    setEmail("");
    setPhone("");
    setMunicipality("");
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

          <section className="max-w-3xl mx-auto">
            <div className="rounded-3xl border border-white/10 bg-black/25 backdrop-blur-sm p-6 md:p-10 shadow-2xl">
              {submittedId ? (
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: "var(--c-gold)" }}>
                    Application submitted
                  </h2>
                  <p className="mt-3 opacity-90">Reference: {submittedId}</p>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      type="button"
                      className="w-full text-lg font-bold py-6 rounded-xl"
                      style={{ backgroundColor: "var(--c-gold)", color: "#111" }}
                      onClick={reset}
                    >
                      Submit another
                    </Button>
                    <Button type="button" className="w-full text-lg font-bold py-6 rounded-xl" variant="secondary" onClick={() => (window.location.href = "/")}
                    >
                      Back home
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm opacity-95">
                      <span className="font-semibold" style={{ color: "var(--c-gold)" }}>
                        Step {step} of 3
                      </span>
                      <span className="opacity-80">Councillor application</span>
                    </p>
                    <h2 className="mt-5 text-3xl md:text-5xl font-extrabold leading-tight" style={{ color: "var(--c-gold)" }}>
                      Become a Councillor
                    </h2>
                    <p className="mt-3 text-base md:text-lg opacity-90">Complete the form and we’ll contact you ASAP.</p>
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

                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {step === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="c-name" className="text-white">
                            Full name
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
                          <Label htmlFor="c-phone" className="text-white">
                            Phone number
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

                        <div className="space-y-2 md:col-span-2">
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
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-white">Preferred municipality</Label>
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

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-sm opacity-75">Name</p>
                            <p className="mt-1 font-semibold break-words">{name || "-"}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-sm opacity-75">Phone</p>
                            <p className="mt-1 font-semibold break-words">{phone || "-"}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-sm opacity-75">Email</p>
                            <p className="mt-1 font-semibold break-words">{email || "-"}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <p className="text-sm opacity-75">Review</p>
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs opacity-70">Full name</p>
                              <p className="font-semibold break-words">{name}</p>
                            </div>
                            <div>
                              <p className="text-xs opacity-70">Phone</p>
                              <p className="font-semibold break-words">{phone}</p>
                            </div>
                            <div>
                              <p className="text-xs opacity-70">Email</p>
                              <p className="font-semibold break-words">{email}</p>
                            </div>
                            <div>
                              <p className="text-xs opacity-70">Municipality</p>
                              <p className="font-semibold break-words">{municipality}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full sm:w-auto"
                        disabled={step === 1 || submitting}
                        onClick={prev}
                      >
                        Back
                      </Button>
                      <Button
                        type={step === 3 ? "submit" : "button"}
                        className="w-full text-lg md:text-xl font-extrabold py-7 rounded-xl transition-all duration-300"
                        style={{
                          backgroundColor: "var(--c-gold)",
                          color: "#111",
                          boxShadow: "0 0 0 rgba(212,175,55,0)",
                        }}
                        disabled={submitting}
                        onClick={step === 3 ? undefined : next}
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
                        {submitting ? "Submitting..." : step === 3 ? "Submit application" : "Continue"}
                      </Button>
                    </div>
                  </form>
                </>
              )}
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
