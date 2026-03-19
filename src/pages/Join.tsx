import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  Download,
  ChevronRight,
  ChevronLeft,
  User,
  MapPin,
  FileCheck,
  Users,
  Building2,
  TrendingUp,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import jsPDF, { type TextOptionsLight } from "jspdf";
import { supabase } from "@/lib/supabase";

type Role = "candidate" | "councillor" | "investor";

const Join = () => {
  const { toast } = useToast();

  // ── Role selection ──────────────────────────────────────────────────────────
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // ── Candidate form state ────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [membershipNumber, setMembershipNumber] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    surname: "",
    dateOfBirth: "",
    idNumber: "",
    phoneNumber: "+27",
    email: "",
    residentialAddress: "",
    province: "",
    city: "",
    areaSuburb: "",
    signature: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const totalSteps = 3;
  const steps = [
    { number: 1, title: "Personal Details", icon: User },
    { number: 2, title: "Address Information", icon: MapPin },
    { number: 3, title: "Confirmation", icon: FileCheck },
  ];

  const provinces = [
    "Gauteng",
    "KwaZulu-Natal",
    "Western Cape",
    "Eastern Cape",
    "Mpumalanga",
    "North West",
    "Limpopo",
    "Northern Cape",
    "Free State",
  ];

  // ── Councillor form state ───────────────────────────────────────────────────
  const [councillorData, setCouncillorData] = useState({
    fullName: "",
    email: "",
    phone: "",
    municipality: "",
    motivation: "",
  });
  const [councillorErrors, setCouncillorErrors] = useState<
    Record<string, string>
  >({});
  const [councillorSubmitted, setCouncillorSubmitted] = useState(false);
  const [councillorLoading, setCouncillorLoading] = useState(false);

  // ── Investor form state ─────────────────────────────────────────────────────
  const [investorData, setInvestorData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    investmentRange: "",
    areaOfInterest: "",
    message: "",
  });
  const [investorErrors, setInvestorErrors] = useState<Record<string, string>>(
    {},
  );
  const [investorSubmitted, setInvestorSubmitted] = useState(false);
  const [investorLoading, setInvestorLoading] = useState(false);

  // ── Candidate helpers ───────────────────────────────────────────────────────
  const validateIdNumber = (id: string): boolean => {
    return /^\d{13}$/.test(id);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    return /^\+27\d{9}$/.test(phone);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim())
        newErrors.fullName = "Full name is required";
      if (!formData.surname.trim()) newErrors.surname = "Surname is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!validateIdNumber(formData.idNumber)) {
        newErrors.idNumber = "ID number must be exactly 13 digits";
      }
      if (!validatePhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber =
          "Phone number must be a valid SA number (+27XXXXXXXXX)";
      }
    }

    if (step === 2) {
      if (!formData.residentialAddress.trim()) {
        newErrors.residentialAddress = "Residential address is required";
      }
      if (!formData.province) newErrors.province = "Province is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.areaSuburb.trim())
        newErrors.areaSuburb = "Area/Suburb is required";
    }

    if (step === 3) {
      const canvas = signatureCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const hasSignature = imageData.data.some((channel) => channel !== 0);
          if (!hasSignature) {
            newErrors.signature = "Signature is required";
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast({
        title: "Please complete all required fields",
        description: "Check the form for any errors.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generateMembershipNumber = (): string => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `SHOSH-${timestamp}-${random}`;
  };

  const generateEmailHTML = (membershipNum: string): string => {
    const signatureDataUrl = signatureCanvasRef.current?.toDataURL() || "";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #15803d 0%, #166534 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 5px 0 0 0; font-style: italic; opacity: 0.9; }
          .content { background: #f9fafb; padding: 30px; border: 2px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
          .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .section h2 { color: #15803d; margin-top: 0; border-bottom: 2px solid #15803d; padding-bottom: 10px; }
          .field { margin-bottom: 15px; }
          .field-label { font-weight: bold; color: #4b5563; display: inline-block; width: 180px; }
          .field-value { color: #1f2937; }
          .membership-number { background: #dcfce7; border: 2px solid #15803d; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
          .membership-number .label { font-size: 14px; color: #4b5563; margin-bottom: 5px; }
          .membership-number .number { font-size: 32px; font-weight: bold; color: #15803d; }
          .signature-box { border: 2px solid #e5e7eb; padding: 15px; border-radius: 8px; background: white; text-align: center; }
          .signature-box img { max-width: 300px; height: auto; }
          .statement { background: #f3f4f6; padding: 15px; border-left: 4px solid #15803d; font-style: italic; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          .branding { text-align: right; font-style: italic; color: #9ca3af; font-size: 24px; margin-top: -10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Shosholoza Progressive Party (Shosh)</h1>
          <p>MEMBERSHIP APPLICATION</p>
        </div>
        <div class="branding">Shhh...</div>

        <div class="content">
          <div class="membership-number">
            <div class="label">Membership Number</div>
            <div class="number">${membershipNum}</div>
          </div>

          <div class="section">
            <h2>Personal Information</h2>
            <div class="field">
              <span class="field-label">Full Name:</span>
              <span class="field-value">${formData.fullName}</span>
            </div>
            <div class="field">
              <span class="field-label">Surname:</span>
              <span class="field-value">${formData.surname}</span>
            </div>
            <div class="field">
              <span class="field-label">Date of Birth:</span>
              <span class="field-value">${new Date(formData.dateOfBirth).toLocaleDateString("en-ZA")}</span>
            </div>
            <div class="field">
              <span class="field-label">ID Number:</span>
              <span class="field-value">${formData.idNumber}</span>
            </div>
            <div class="field">
              <span class="field-label">Phone Number:</span>
              <span class="field-value">${formData.phoneNumber}</span>
            </div>
            <div class="field">
              <span class="field-label">Email Address:</span>
              <span class="field-value">${formData.email || "Not provided"}</span>
            </div>
          </div>

          <div class="section">
            <h2>Address Information</h2>
            <div class="field">
              <span class="field-label">Residential Address:</span>
              <span class="field-value">${formData.residentialAddress}</span>
            </div>
            <div class="field">
              <span class="field-label">Province:</span>
              <span class="field-value">${formData.province}</span>
            </div>
            <div class="field">
              <span class="field-label">City:</span>
              <span class="field-value">${formData.city}</span>
            </div>
            <div class="field">
              <span class="field-label">Area/Suburb:</span>
              <span class="field-value">${formData.areaSuburb}</span>
            </div>
          </div>

          <div class="section">
            <h2>Confirmation</h2>
            <div class="statement">
              I understand the objectives of Shosholoza Progressive Party and I voluntarily join the party.
            </div>
            <div class="field">
              <span class="field-label">Date:</span>
              <span class="field-value">${new Date().toLocaleDateString("en-ZA")}</span>
            </div>
            <div class="field">
              <span class="field-label">Signature:</span>
              <div class="signature-box">
                <img src="${signatureDataUrl}" alt="Member Signature" />
              </div>
            </div>
          </div>

          <div class="footer">
            <p><strong>Shosholoza Progressive Party (Shosh)</strong></p>
            <p>Thank you for joining our movement for a better South Africa!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateStep(3)) {
      toast({
        title: "Form Incomplete",
        description: "Please complete the signature.",
        variant: "destructive",
      });
      return;
    }

    // Generate membership number
    const newMembershipNumber = generateMembershipNumber();
    setMembershipNumber(newMembershipNumber);

    toast({
      title: "Processing...",
      description: "Submitting your membership application.",
    });

    try {
      const signatureDataUrl =
        signatureCanvasRef.current?.toDataURL("image/png") || "";

      // ── Save to Supabase ──────────────────────────────────────────────────────
      const { error: dbError } = await supabase
        .from("membership_applications")
        .insert({
          membership_number: newMembershipNumber,
          full_name: formData.fullName,
          surname: formData.surname,
          date_of_birth: formData.dateOfBirth,
          id_number: formData.idNumber,
          phone_number: formData.phoneNumber,
          email: formData.email || null,
          residential_address: formData.residentialAddress,
          province: formData.province,
          city: formData.city,
          area_suburb: formData.areaSuburb,
          signature_data_url: signatureDataUrl,
          user_agent: navigator.userAgent,
          status: "pending",
        });

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      // ── Send email notification (optional – best effort) ──────────────────────
      let emailSent = false;
      try {
        const emailRes = await fetch("/.netlify/functions/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "info@shosh.org.za",
            subject: `New Membership Application - ${newMembershipNumber}`,
            html: generateEmailHTML(newMembershipNumber),
          }),
        });
        if (emailRes.ok) {
          emailSent = true;
        }
      } catch {
        // Email is best-effort; don't block the submission
      }

      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: emailSent
          ? "Your membership has been successfully submitted and a notification has been sent."
          : "Your membership has been successfully submitted.",
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      toast({
        title: "Submission Failed",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Header with green background
      doc.setFillColor(21, 128, 61);
      doc.rect(0, 0, pageWidth, 45, "F");

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Shosholoza Progressive Party (Shosh)", pageWidth / 2, 20, {
        align: "center",
      } as TextOptionsLight);

      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("MEMBERSHIP APPLICATION", pageWidth / 2, 30, {
        align: "center",
      } as TextOptionsLight);

      // Branding
      doc.setFontSize(16);
      doc.setFont("helvetica", "italic");
      doc.text("Shhh...", pageWidth - 20, 40, {
        align: "right",
      } as TextOptionsLight);

      yPos = 55;

      // Membership Number Box
      doc.setFillColor(220, 252, 231);
      doc.setDrawColor(21, 128, 61);
      doc.setLineWidth(1);
      doc.rect(15, yPos, pageWidth - 30, 25, "FD");

      doc.setTextColor(75, 85, 99);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Membership Number", pageWidth / 2, yPos + 8, {
        align: "center",
      } as TextOptionsLight);

      doc.setTextColor(21, 128, 61);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(membershipNumber, pageWidth / 2, yPos + 18, {
        align: "center",
      } as TextOptionsLight);

      yPos += 35;

      // Personal Information Section
      doc.setTextColor(21, 128, 61);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Personal Information", 15, yPos);

      doc.setDrawColor(21, 128, 61);
      doc.setLineWidth(0.5);
      doc.line(15, yPos + 2, pageWidth - 15, yPos + 2);

      yPos += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      const addField = (label: string, value: string) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 20, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(value, 80, yPos);
        yPos += 7;
      };

      addField("Full Name:", formData.fullName);
      addField("Surname:", formData.surname);
      addField(
        "Date of Birth:",
        new Date(formData.dateOfBirth).toLocaleDateString("en-ZA"),
      );
      addField("ID Number:", formData.idNumber);
      addField("Phone Number:", formData.phoneNumber);
      addField("Email Address:", formData.email || "Not provided");

      yPos += 5;

      // Address Information Section
      doc.setTextColor(21, 128, 61);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Address Information", 15, yPos);

      doc.setDrawColor(21, 128, 61);
      doc.line(15, yPos + 2, pageWidth - 15, yPos + 2);

      yPos += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      doc.setFont("helvetica", "bold");
      doc.text("Residential Address:", 20, yPos);
      doc.setFont("helvetica", "normal");

      // Handle multi-line address
      const addressLines = doc.splitTextToSize(
        formData.residentialAddress,
        pageWidth - 100,
      );
      doc.text(addressLines, 80, yPos);
      yPos += addressLines.length * 7;

      addField("Province:", formData.province);
      addField("City:", formData.city);
      addField("Area/Suburb:", formData.areaSuburb);

      yPos += 5;

      // Confirmation Section
      doc.setTextColor(21, 128, 61);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Confirmation", 15, yPos);

      doc.setDrawColor(21, 128, 61);
      doc.line(15, yPos + 2, pageWidth - 15, yPos + 2);

      yPos += 10;

      // Statement box
      doc.setFillColor(243, 244, 246);
      doc.setDrawColor(21, 128, 61);
      doc.setLineWidth(2);
      doc.rect(15, yPos, pageWidth - 30, 20, "FD");

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      const statement =
        "I understand the objectives of Shosholoza Progressive Party and I voluntarily join the party.";
      const statementLines = doc.splitTextToSize(statement, pageWidth - 40);
      doc.text(statementLines, 20, yPos + 7);

      yPos += 30;

      // Date
      doc.setFont("helvetica", "bold");
      doc.text("Date:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(new Date().toLocaleDateString("en-ZA"), 80, yPos);

      yPos += 10;

      // Signature
      doc.setFont("helvetica", "bold");
      doc.text("Signature:", 20, yPos);

      if (signatureCanvasRef.current) {
        const signatureData = signatureCanvasRef.current.toDataURL("image/png");
        doc.addImage(signatureData, "PNG", 80, yPos - 5, 80, 20);
      }

      yPos += 25;

      // Footer
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(15, yPos, pageWidth - 15, yPos);

      yPos += 7;
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Shosholoza Progressive Party (Shosh)", pageWidth / 2, yPos, {
        align: "center",
      } as TextOptionsLight);

      yPos += 5;
      doc.setFont("helvetica", "normal");
      doc.text(
        "Thank you for joining our movement for a better South Africa!",
        pageWidth / 2,
        yPos,
        { align: "center" } as TextOptionsLight,
      );

      // Suppress unused variable warning
      void pageHeight;

      // Save the PDF
      doc.save(`SHOSH-Membership-${membershipNumber}.pdf`);

      toast({
        title: "PDF Downloaded",
        description: "Your membership form has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y =
      "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return;

    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y =
      "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // ── Councillor helpers ──────────────────────────────────────────────────────
  const validateCouncillorForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!councillorData.fullName.trim())
      errs.fullName = "Full name is required";
    if (!councillorData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(councillorData.email))
      errs.email = "Please enter a valid email address";
    if (!councillorData.phone.trim()) errs.phone = "Phone number is required";
    if (!councillorData.municipality)
      errs.municipality = "Please select a municipality";
    setCouncillorErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCouncillorSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!validateCouncillorForm()) {
      toast({
        title: "Please complete all required fields",
        description: "Check the form for any errors.",
        variant: "destructive",
      });
      return;
    }
    setCouncillorLoading(true);
    try {
      const { error } = await supabase.from("councillor_applications").insert({
        full_name: councillorData.fullName,
        email: councillorData.email,
        phone: councillorData.phone,
        municipality: councillorData.municipality,
        motivation: councillorData.motivation || null,
        user_agent: navigator.userAgent,
        status: "new",
      });
      if (error) throw new Error(error.message);
      setCouncillorSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll be in touch with you very soon.",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({
        title: "Submission Failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setCouncillorLoading(false);
    }
  };

  // ── Investor helpers ────────────────────────────────────────────────────────
  const validateInvestorForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!investorData.fullName.trim()) errs.fullName = "Full name is required";
    if (!investorData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(investorData.email))
      errs.email = "Please enter a valid email address";
    if (!investorData.phone.trim()) errs.phone = "Phone number is required";
    if (!investorData.investmentRange)
      errs.investmentRange = "Please select an investment range";
    if (!investorData.areaOfInterest)
      errs.areaOfInterest = "Please select an area of interest";
    if (!investorData.message.trim())
      errs.message = "Please tell us how we can work together";
    setInvestorErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInvestorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInvestorForm()) {
      toast({
        title: "Please complete all required fields",
        description: "Check the form for any errors.",
        variant: "destructive",
      });
      return;
    }
    setInvestorLoading(true);
    try {
      const { error } = await supabase.from("investor_inquiries").insert({
        full_name: investorData.fullName,
        email: investorData.email,
        phone: investorData.phone,
        company: investorData.company || null,
        investment_range: investorData.investmentRange,
        area_of_interest: investorData.areaOfInterest,
        message: investorData.message,
        user_agent: navigator.userAgent,
        status: "new",
      });
      if (error) throw new Error(error.message);
      setInvestorSubmitted(true);
      toast({
        title: "Inquiry Submitted!",
        description: "Our team will reach out to you shortly.",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({
        title: "Submission Failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setInvestorLoading(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER: Role Selection
  // ══════════════════════════════════════════════════════════════════════════════
  if (!selectedRole) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-16">
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                  <h1 className="text-4xl font-bold mb-4">
                    Join Shosholoza Progressive Party
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Choose how you want to be part of South Africa's future.
                    Every role matters — from grassroots membership to civic
                    leadership and investment.
                  </p>
                </div>

                {/* Role Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Card 1 — Party Member / Candidate */}
                  <div
                    className="relative flex flex-col bg-white border-2 border-green-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: "100ms" }}
                  >
                    <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 text-white">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                        <Users size={28} className="text-white" />
                      </div>
                      <h2 className="text-xl font-bold">
                        Party Member / Candidate
                      </h2>
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Join the movement as a registered party member and help
                        shape South Africa's democratic future from the ground
                        up.
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-6 inline-flex items-center gap-2">
                        <CheckCircle2
                          size={16}
                          className="text-green-600 shrink-0"
                        />
                        <span className="text-green-800 text-sm font-medium">
                          Official membership certificate &amp; number
                        </span>
                      </div>
                      <div className="mt-auto">
                        <Button
                          onClick={() => setSelectedRole("candidate")}
                          className="w-full bg-green-700 hover:bg-green-800 text-white gap-2"
                          size="lg"
                        >
                          Select
                          <ChevronRight size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 — Councillor Candidate */}
                  <div
                    className="relative flex flex-col bg-white border-2 border-yellow-400 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: "200ms" }}
                  >
                    {/* Popular badge */}
                    <div className="absolute top-4 right-4 bg-yellow-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                      HIGH EARNING
                    </div>
                    <div className="bg-gradient-to-br from-green-900 to-green-700 p-6 text-white">
                      <div className="w-14 h-14 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-4">
                        <Building2 size={28} className="text-yellow-300" />
                      </div>
                      <h2 className="text-xl font-bold">
                        Councillor Candidate
                      </h2>
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      {/* Earning highlight */}
                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-xl px-4 py-3 mb-4 text-center">
                        <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1">
                          Earning Potential
                        </p>
                        <p className="text-2xl font-extrabold text-green-900">
                          R49,000 – R100,000
                        </p>
                        <p className="text-sm font-semibold text-yellow-700">
                          per month
                        </p>
                      </div>
                      <p className="text-gray-600 mb-2 leading-relaxed text-sm">
                        Represent your community in one of South Africa's major
                        metros and earn a competitive salary as a ward
                        councillor.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {["Joburg", "Ekurhuleni", "Tshwane"].map((metro) => (
                          <span
                            key={metro}
                            className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full border border-green-300"
                          >
                            {metro}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto">
                        <Button
                          onClick={() => setSelectedRole("councillor")}
                          className="w-full bg-green-900 hover:bg-green-950 text-yellow-300 border border-yellow-400 gap-2"
                          size="lg"
                        >
                          Apply Now
                          <ChevronRight size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 — Investor */}
                  <div
                    className="relative flex flex-col bg-white border-2 border-blue-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: "300ms" }}
                  >
                    <div className="bg-gradient-to-br from-slate-800 to-blue-900 p-6 text-white">
                      <div className="w-14 h-14 bg-blue-400/20 rounded-xl flex items-center justify-center mb-4">
                        <TrendingUp size={28} className="text-blue-300" />
                      </div>
                      <h2 className="text-xl font-bold">Investor</h2>
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Invest in South Africa's future. Partner with us to fund
                        campaigns, community development, and nation-building
                        initiatives.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-6 inline-flex items-center gap-2">
                        <TrendingUp
                          size={16}
                          className="text-blue-600 shrink-0"
                        />
                        <span className="text-blue-800 text-sm font-medium">
                          Multiple investment tiers available
                        </span>
                      </div>
                      <div className="mt-auto">
                        <Button
                          onClick={() => setSelectedRole("investor")}
                          className="w-full bg-slate-800 hover:bg-slate-900 text-white gap-2"
                          size="lg"
                        >
                          Invest Now
                          <ChevronRight size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER: Councillor Flow
  // ══════════════════════════════════════════════════════════════════════════════
  if (selectedRole === "councillor") {
    if (councillorSubmitted) {
      return (
        <div className="min-h-screen">
          <Navigation />
          <main className="pt-16">
            <section className="py-20 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-elegant text-center animate-fade-in border-2 border-green-800">
                  <div className="animate-scale-in">
                    <CheckCircle2 className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                  </div>
                  <h1
                    className="text-3xl font-bold mb-3 text-green-900"
                    style={{ animationDelay: "200ms" }}
                  >
                    Application Received!
                  </h1>
                  <p
                    className="text-xl mb-4 text-green-800 font-semibold"
                    style={{ animationDelay: "300ms" }}
                  >
                    Thank you, {councillorData.fullName}!
                  </p>
                  <p
                    className="text-gray-600 mb-8 leading-relaxed"
                    style={{ animationDelay: "400ms" }}
                  >
                    We have received your councillor application for{" "}
                    <strong>{councillorData.municipality}</strong>. Our team
                    will contact you as soon as possible to discuss next steps.
                  </p>
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl px-6 py-4 mb-8 inline-block">
                    <p className="text-sm font-semibold text-yellow-700 uppercase tracking-wider mb-1">
                      Earning Potential
                    </p>
                    <p className="text-3xl font-extrabold text-green-900">
                      R49,000 – R100,000 pm
                    </p>
                  </div>
                  <p className="text-green-800 font-semibold text-lg">
                    We'll contact you ASAP!
                  </p>
                  <Button
                    onClick={() => setSelectedRole(null)}
                    variant="outline"
                    className="mt-8 gap-2 border-green-800 text-green-800 hover:bg-green-50"
                  >
                    <ArrowLeft size={16} />
                    Back to Home
                  </Button>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-16">
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                {/* Change role button */}
                <button
                  onClick={() => setSelectedRole(null)}
                  className="flex items-center gap-1 text-green-800 hover:text-green-600 font-medium mb-6 transition-colors"
                >
                  <ChevronLeft size={18} />
                  Change role
                </button>

                {/* Header */}
                <div className="bg-gradient-to-br from-green-900 to-green-700 p-8 rounded-t-2xl text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                      <Building2 size={24} className="text-yellow-300" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">
                        Councillor Candidate
                      </h1>
                      <p className="text-green-200 text-sm">
                        Shosholoza Progressive Party
                      </p>
                    </div>
                  </div>
                  {/* Earnings banner */}
                  <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-xl px-5 py-4 mt-4">
                    <p className="text-yellow-300 text-xs font-bold uppercase tracking-wider mb-1">
                      Earn as a Councillor
                    </p>
                    <p className="text-white text-2xl font-extrabold">
                      R49,000 – R100,000{" "}
                      <span className="text-lg font-semibold">per month</span>
                    </p>
                    <p className="text-green-200 text-sm mt-1">
                      Represent Joburg / Ekurhuleni / Tshwane
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-b-2xl shadow-elegant border-x border-b border-green-200">
                  <form onSubmit={handleCouncillorSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <Label
                        htmlFor="c-fullName"
                        className="text-green-900 font-semibold"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="c-fullName"
                        value={councillorData.fullName}
                        onChange={(e) =>
                          setCouncillorData({
                            ...councillorData,
                            fullName: e.target.value,
                          })
                        }
                        placeholder="Your full name"
                        className="mt-1 border-green-200 focus-visible:ring-green-600"
                      />
                      {councillorErrors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {councillorErrors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label
                        htmlFor="c-email"
                        className="text-green-900 font-semibold"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="c-email"
                        type="email"
                        value={councillorData.email}
                        onChange={(e) =>
                          setCouncillorData({
                            ...councillorData,
                            email: e.target.value,
                          })
                        }
                        placeholder="you@example.com"
                        className="mt-1 border-green-200 focus-visible:ring-green-600"
                      />
                      {councillorErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {councillorErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label
                        htmlFor="c-phone"
                        className="text-green-900 font-semibold"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="c-phone"
                        type="tel"
                        value={councillorData.phone}
                        onChange={(e) =>
                          setCouncillorData({
                            ...councillorData,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+27 XX XXX XXXX"
                        className="mt-1 border-green-200 focus-visible:ring-green-600"
                      />
                      {councillorErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {councillorErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Municipality */}
                    <div>
                      <Label
                        htmlFor="c-municipality"
                        className="text-green-900 font-semibold"
                      >
                        Preferred Municipality{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={councillorData.municipality}
                        onValueChange={(v) =>
                          setCouncillorData({
                            ...councillorData,
                            municipality: v,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1 border-green-200 focus:ring-green-600">
                          <SelectValue placeholder="Select municipality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="City of Johannesburg">
                            City of Johannesburg (Joburg)
                          </SelectItem>
                          <SelectItem value="Ekurhuleni">Ekurhuleni</SelectItem>
                          <SelectItem value="City of Tshwane">
                            City of Tshwane (Tshwane)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {councillorErrors.municipality && (
                        <p className="text-red-500 text-sm mt-1">
                          {councillorErrors.municipality}
                        </p>
                      )}
                    </div>

                    {/* Motivation */}
                    <div>
                      <Label
                        htmlFor="c-motivation"
                        className="text-green-900 font-semibold"
                      >
                        Brief Motivation{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Textarea
                        id="c-motivation"
                        value={councillorData.motivation}
                        onChange={(e) =>
                          setCouncillorData({
                            ...councillorData,
                            motivation: e.target.value,
                          })
                        }
                        placeholder="Why do you want to become a councillor? What will you bring to your community?"
                        rows={4}
                        className="mt-1 border-green-200 focus-visible:ring-green-600"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={councillorLoading}
                      className="w-full bg-green-900 hover:bg-green-950 text-yellow-300 border border-yellow-400 gap-2 mt-2"
                    >
                      {councillorLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          Submit Application
                          <ChevronRight size={18} />
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
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER: Investor Flow
  // ══════════════════════════════════════════════════════════════════════════════
  if (selectedRole === "investor") {
    if (investorSubmitted) {
      return (
        <div className="min-h-screen">
          <Navigation />
          <main className="pt-16">
            <section className="py-20 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-elegant text-center animate-fade-in border-2 border-slate-700">
                  <div className="animate-scale-in">
                    <CheckCircle2 className="w-20 h-20 text-blue-500 mx-auto mb-6" />
                  </div>
                  <h1 className="text-3xl font-bold mb-3 text-slate-800">
                    Inquiry Received!
                  </h1>
                  <p className="text-xl mb-4 text-slate-700 font-semibold">
                    Thank you, {investorData.fullName}!
                  </p>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    We have received your investment inquiry for{" "}
                    <strong>{investorData.areaOfInterest}</strong>. Our team
                    will review your submission and reach out to discuss
                    partnership opportunities.
                  </p>
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-xl px-6 py-4 mb-8 inline-block">
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-1">
                      Investment Range
                    </p>
                    <p className="text-2xl font-extrabold text-slate-800">
                      {investorData.investmentRange}
                    </p>
                  </div>
                  <p className="text-slate-700 font-semibold text-lg">
                    Our team will reach out to you shortly.
                  </p>
                  <Button
                    onClick={() => setSelectedRole(null)}
                    variant="outline"
                    className="mt-8 gap-2 border-slate-700 text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft size={16} />
                    Back to Home
                  </Button>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-16">
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                {/* Change role button */}
                <button
                  onClick={() => setSelectedRole(null)}
                  className="flex items-center gap-1 text-slate-700 hover:text-slate-500 font-medium mb-6 transition-colors"
                >
                  <ChevronLeft size={18} />
                  Change role
                </button>

                {/* Header */}
                <div className="bg-gradient-to-br from-slate-800 to-blue-900 p-8 rounded-t-2xl text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                      <TrendingUp size={24} className="text-blue-300" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Investor Inquiry</h1>
                      <p className="text-blue-200 text-sm">
                        Invest in South Africa's future
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-b-2xl shadow-elegant border-x border-b border-slate-200">
                  <form onSubmit={handleInvestorSubmit} className="space-y-5">
                    {/* Full Name + Email */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <Label
                          htmlFor="i-fullName"
                          className="text-slate-800 font-semibold"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="i-fullName"
                          value={investorData.fullName}
                          onChange={(e) =>
                            setInvestorData({
                              ...investorData,
                              fullName: e.target.value,
                            })
                          }
                          placeholder="Your full name"
                          className="mt-1 border-slate-300 focus-visible:ring-blue-600"
                        />
                        {investorErrors.fullName && (
                          <p className="text-red-500 text-sm mt-1">
                            {investorErrors.fullName}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="i-email"
                          className="text-slate-800 font-semibold"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="i-email"
                          type="email"
                          value={investorData.email}
                          onChange={(e) =>
                            setInvestorData({
                              ...investorData,
                              email: e.target.value,
                            })
                          }
                          placeholder="you@example.com"
                          className="mt-1 border-slate-300 focus-visible:ring-blue-600"
                        />
                        {investorErrors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {investorErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone + Company */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <Label
                          htmlFor="i-phone"
                          className="text-slate-800 font-semibold"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="i-phone"
                          type="tel"
                          value={investorData.phone}
                          onChange={(e) =>
                            setInvestorData({
                              ...investorData,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+27 XX XXX XXXX"
                          className="mt-1 border-slate-300 focus-visible:ring-blue-600"
                        />
                        {investorErrors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {investorErrors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="i-company"
                          className="text-slate-800 font-semibold"
                        >
                          Company / Organisation{" "}
                          <span className="text-gray-400 font-normal">
                            (optional)
                          </span>
                        </Label>
                        <Input
                          id="i-company"
                          value={investorData.company}
                          onChange={(e) =>
                            setInvestorData({
                              ...investorData,
                              company: e.target.value,
                            })
                          }
                          placeholder="Your company or organisation"
                          className="mt-1 border-slate-300 focus-visible:ring-blue-600"
                        />
                      </div>
                    </div>

                    {/* Investment Range */}
                    <div>
                      <Label
                        htmlFor="i-range"
                        className="text-slate-800 font-semibold"
                      >
                        Investment Range <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={investorData.investmentRange}
                        onValueChange={(v) =>
                          setInvestorData({
                            ...investorData,
                            investmentRange: v,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1 border-slate-300 focus:ring-blue-600">
                          <SelectValue placeholder="Select investment range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under R50,000">
                            Under R50,000
                          </SelectItem>
                          <SelectItem value="R50,000–R100,000">
                            R50,000 – R100,000
                          </SelectItem>
                          <SelectItem value="R100,000–R500,000">
                            R100,000 – R500,000
                          </SelectItem>
                          <SelectItem value="R500,000–R1,000,000">
                            R500,000 – R1,000,000
                          </SelectItem>
                          <SelectItem value="R1,000,000+">
                            R1,000,000+
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {investorErrors.investmentRange && (
                        <p className="text-red-500 text-sm mt-1">
                          {investorErrors.investmentRange}
                        </p>
                      )}
                    </div>

                    {/* Area of Interest */}
                    <div>
                      <Label
                        htmlFor="i-area"
                        className="text-slate-800 font-semibold"
                      >
                        Area of Interest <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={investorData.areaOfInterest}
                        onValueChange={(v) =>
                          setInvestorData({
                            ...investorData,
                            areaOfInterest: v,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1 border-slate-300 focus:ring-blue-600">
                          <SelectValue placeholder="Select area of interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Political Campaign Funding">
                            Political Campaign Funding
                          </SelectItem>
                          <SelectItem value="Community Development">
                            Community Development
                          </SelectItem>
                          <SelectItem value="Infrastructure">
                            Infrastructure
                          </SelectItem>
                          <SelectItem value="Technology & Digital">
                            Technology &amp; Digital
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {investorErrors.areaOfInterest && (
                        <p className="text-red-500 text-sm mt-1">
                          {investorErrors.areaOfInterest}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <Label
                        htmlFor="i-message"
                        className="text-slate-800 font-semibold"
                      >
                        Message / How can we work together?{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="i-message"
                        value={investorData.message}
                        onChange={(e) =>
                          setInvestorData({
                            ...investorData,
                            message: e.target.value,
                          })
                        }
                        placeholder="Tell us about your investment goals and how you envision working with Shosholoza Progressive Party…"
                        rows={5}
                        className="mt-1 border-slate-300 focus-visible:ring-blue-600"
                      />
                      {investorErrors.message && (
                        <p className="text-red-500 text-sm mt-1">
                          {investorErrors.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={investorLoading}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white gap-2 mt-2"
                    >
                      {investorLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          Submit Inquiry
                          <ChevronRight size={18} />
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
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER: Candidate Flow (success screen)
  // ══════════════════════════════════════════════════════════════════════════════
  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-16">
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-elegant text-center animate-fade-in">
                <div className="animate-scale-in">
                  <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-6" />
                </div>
                <h1
                  className="text-3xl font-bold mb-4 animate-fade-in"
                  style={{ animationDelay: "200ms" }}
                >
                  Thank You!
                </h1>
                <p
                  className="text-xl mb-6 animate-fade-in"
                  style={{ animationDelay: "300ms" }}
                >
                  Your membership has been successfully registered.
                </p>
                <div
                  className="bg-muted p-6 rounded-lg mb-8 animate-fade-in"
                  style={{ animationDelay: "400ms" }}
                >
                  <p className="text-sm text-muted-foreground mb-2">
                    Your Membership Number
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {membershipNumber}
                  </p>
                </div>
                <p
                  className="text-muted-foreground mb-8 animate-fade-in"
                  style={{ animationDelay: "500ms" }}
                >
                  A confirmation email has been sent to your email address.
                </p>
                <Button
                  onClick={handleDownloadPDF}
                  size="lg"
                  className="gap-2 animate-fade-in"
                  style={{ animationDelay: "600ms" }}
                >
                  <Download size={20} />
                  Download/Print PDF Copy
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER: Candidate Flow (multi-step form)
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Change role button */}
              <button
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-1 text-green-800 hover:text-green-600 font-medium mb-6 transition-colors"
              >
                <ChevronLeft size={18} />
                Change role
              </button>

              {/* Header */}
              <div className="bg-card p-8 rounded-t-lg shadow-elegant border-b-2 border-green-600 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      Shosholoza Progressive Party (Shosh)
                    </h1>
                    <h2 className="text-xl text-muted-foreground">
                      MEMBERSHIP FORM
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl italic text-gray-400">Shhh...</p>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div
                className="bg-card px-8 py-6 border-b animate-fade-in"
                style={{ animationDelay: "100ms" }}
              >
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;

                    return (
                      <div
                        key={step.number}
                        className="flex items-center flex-1"
                      >
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isCompleted
                                ? "bg-green-600 text-white scale-110"
                                : isActive
                                  ? "bg-green-600 text-white scale-110 ring-4 ring-green-200"
                                  : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={24} />
                            ) : (
                              <StepIcon size={24} />
                            )}
                          </div>
                          <p
                            className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                              isActive || isCompleted
                                ? "text-green-700"
                                : "text-gray-400"
                            }`}
                          >
                            {step.title}
                          </p>
                        </div>
                        {index < steps.length - 1 && (
                          <div className="flex-1 h-1 mx-4 -mt-8">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isCompleted ? "bg-green-600" : "bg-gray-200"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <div className="bg-card p-8 rounded-b-lg shadow-elegant">
                <form
                  name="membership-application"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <input
                    type="hidden"
                    name="form-name"
                    value="membership-application"
                  />
                  <input type="hidden" name="bot-field" />

                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="animate-slide-in">
                      <h3 className="text-xl font-semibold mb-6 pb-2 border-b">
                        Personal Information
                      </h3>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="fullName">
                              Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="fullName"
                              value={formData.fullName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  fullName: e.target.value,
                                })
                              }
                              className="mt-2"
                            />
                            {errors.fullName && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.fullName}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="surname">
                              Surname <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="surname"
                              value={formData.surname}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  surname: e.target.value,
                                })
                              }
                              className="mt-2"
                            />
                            {errors.surname && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.surname}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="dateOfBirth">
                              Date of Birth{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  dateOfBirth: e.target.value,
                                })
                              }
                              className="mt-2"
                            />
                            {errors.dateOfBirth && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.dateOfBirth}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="idNumber">
                              ID Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="idNumber"
                              type="text"
                              maxLength={13}
                              value={formData.idNumber}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setFormData({ ...formData, idNumber: value });
                              }}
                              placeholder="13 digits"
                              className="mt-2"
                            />
                            {errors.idNumber && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.idNumber}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="phoneNumber">
                              Phone Number{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="phoneNumber"
                              type="tel"
                              value={formData.phoneNumber}
                              onChange={(e) => {
                                let value = e.target.value;
                                if (!value.startsWith("+27")) {
                                  value = "+27" + value.replace(/\D/g, "");
                                } else {
                                  value =
                                    "+27" + value.slice(3).replace(/\D/g, "");
                                }
                                setFormData({
                                  ...formData,
                                  phoneNumber: value,
                                });
                              }}
                              placeholder="+27XXXXXXXXX"
                              className="mt-2"
                            />
                            {errors.phoneNumber && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.phoneNumber}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Address Information */}
                  {currentStep === 2 && (
                    <div className="animate-slide-in">
                      <h3 className="text-xl font-semibold mb-6 pb-2 border-b">
                        Address Information
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="residentialAddress">
                            Residential Address{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="residentialAddress"
                            value={formData.residentialAddress}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                residentialAddress: e.target.value,
                              })
                            }
                            className="mt-2"
                            rows={3}
                          />
                          {errors.residentialAddress && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.residentialAddress}
                            </p>
                          )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="province">
                              Province <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.province}
                              onValueChange={(value) =>
                                setFormData({ ...formData, province: value })
                              }
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select province" />
                              </SelectTrigger>
                              <SelectContent>
                                {provinces.map((province) => (
                                  <SelectItem key={province} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.province && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.province}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="city">
                              City <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  city: e.target.value,
                                })
                              }
                              className="mt-2"
                            />
                            {errors.city && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.city}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="areaSuburb">
                              Area/Suburb{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="areaSuburb"
                              value={formData.areaSuburb}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  areaSuburb: e.target.value,
                                })
                              }
                              className="mt-2"
                            />
                            {errors.areaSuburb && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.areaSuburb}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirmation */}
                  {currentStep === 3 && (
                    <div className="animate-slide-in">
                      <h3 className="text-xl font-semibold mb-6 pb-2 border-b">
                        Confirmation
                      </h3>
                      <div className="space-y-6">
                        <div className="bg-muted p-6 rounded-lg">
                          <p className="text-base leading-relaxed">
                            I understand the objectives of Shosholoza
                            Progressive Party and I voluntarily join the party.
                          </p>
                        </div>

                        <div>
                          <Label>
                            Signature <span className="text-red-500">*</span>
                          </Label>
                          <div className="mt-2 border-2 border-gray-300 rounded-lg overflow-hidden">
                            <canvas
                              ref={signatureCanvasRef}
                              width={600}
                              height={200}
                              className="w-full cursor-crosshair bg-white"
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={stopDrawing}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={clearSignature}
                            className="mt-2"
                          >
                            Clear Signature
                          </Button>
                          {errors.signature && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.signature}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="text"
                            value={new Date().toLocaleDateString("en-ZA")}
                            disabled
                            className="mt-2 bg-muted"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handlePrevious}
                        className="gap-2"
                      >
                        <ChevronLeft size={20} />
                        Previous
                      </Button>
                    )}

                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        size="lg"
                        onClick={handleNext}
                        className="ml-auto gap-2 bg-green-700 hover:bg-green-800 text-white"
                      >
                        Next
                        <ChevronRight size={20} />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        size="lg"
                        className="ml-auto bg-green-700 hover:bg-green-800 text-white"
                      >
                        Submit Membership Application
                      </Button>
                    )}
                  </div>
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

export default Join;
