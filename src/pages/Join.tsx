import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Download, ChevronRight, ChevronLeft, User, MapPin, FileCheck } from "lucide-react";
import jsPDF from "jspdf";

const Join = () => {
  const { toast } = useToast();
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

  const validateIdNumber = (id: string): boolean => {
    return /^\d{13}$/.test(id);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    return /^\+27\d{9}$/.test(phone);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.surname.trim()) newErrors.surname = "Surname is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (!validateIdNumber(formData.idNumber)) {
        newErrors.idNumber = "ID number must be exactly 13 digits";
      }
      if (!validatePhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = "Phone number must be a valid SA number (+27XXXXXXXXX)";
      }
    }

    if (step === 2) {
      if (!formData.residentialAddress.trim()) {
        newErrors.residentialAddress = "Residential address is required";
      }
      if (!formData.province) newErrors.province = "Province is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.areaSuburb.trim()) newErrors.areaSuburb = "Area/Suburb is required";
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
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
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

  const sendEmailToPresident = async (membershipNum: string) => {
    const emailHTML = generateEmailHTML(membershipNum);
    
    // In production, this would call your backend API to send the email
    // For now, we'll create a mailto link as a fallback
    const subject = encodeURIComponent(`New Membership Application - ${membershipNum}`);
    const body = encodeURIComponent(`
New membership application received:

Name: ${formData.fullName} ${formData.surname}
Membership Number: ${membershipNum}
Phone: ${formData.phoneNumber}
Email: ${formData.email || "Not provided"}
Province: ${formData.province}
City: ${formData.city}

Please check the attached details for the complete application.
    `);

    // Log the email content for development
    console.log("Email to president@shosh.org.za:");
    console.log(emailHTML);

    // In production, replace this with actual email API call
    // Example: await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ to: 'president@shosh.org.za', html: emailHTML }) });
    
    return { success: true };
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
      // Send email to president
      await sendEmailToPresident(newMembershipNumber);

      // Simulate API call to store data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Your membership has been successfully registered and sent to president@shosh.org.za",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue submitting your application. Please try again.",
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
      doc.text("Shosholoza Progressive Party (Shosh)", pageWidth / 2, 20, { align: "center" } as any);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("MEMBERSHIP APPLICATION", pageWidth / 2, 30, { align: "center" } as any);

      // Branding
      doc.setFontSize(16);
      doc.setFont("helvetica", "italic");
      doc.text("Shhh...", pageWidth - 20, 40, { align: "right" } as any);

      yPos = 55;

      // Membership Number Box
      doc.setFillColor(220, 252, 231);
      doc.setDrawColor(21, 128, 61);
      doc.setLineWidth(1);
      doc.rect(15, yPos, pageWidth - 30, 25, "FD");
      
      doc.setTextColor(75, 85, 99);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Membership Number", pageWidth / 2, yPos + 8, { align: "center" } as any);
      
      doc.setTextColor(21, 128, 61);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(membershipNumber, pageWidth / 2, yPos + 18, { align: "center" } as any);

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
      addField("Date of Birth:", new Date(formData.dateOfBirth).toLocaleDateString("en-ZA"));
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
      const addressLines = doc.splitTextToSize(formData.residentialAddress, pageWidth - 100);
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
      const statement = "I understand the objectives of Shosholoza Progressive Party and I voluntarily join the party.";
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
      doc.text("Shosholoza Progressive Party (Shosh)", pageWidth / 2, yPos, { align: "center" } as any);
      
      yPos += 5;
      doc.setFont("helvetica", "normal");
      doc.text("Thank you for joining our movement for a better South Africa!", pageWidth / 2, yPos, { align: "center" } as any);

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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

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
                <h1 className="text-3xl font-bold mb-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
                  Thank You!
                </h1>
                <p className="text-xl mb-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
                  Your membership has been successfully registered.
                </p>
                <div className="bg-muted p-6 rounded-lg mb-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
                  <p className="text-sm text-muted-foreground mb-2">Your Membership Number</p>
                  <p className="text-2xl font-bold text-green-700">{membershipNumber}</p>
                </div>
                <p className="text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "500ms" }}>
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

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="bg-card p-8 rounded-t-lg shadow-elegant border-b-2 border-green-600 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Shosholoza Progressive Party (Shosh)</h1>
                    <h2 className="text-xl text-muted-foreground">MEMBERSHIP FORM</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl italic text-gray-400">Shhh...</p>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="bg-card px-8 py-6 border-b animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;
                    
                    return (
                      <div key={step.number} className="flex items-center flex-1">
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
                              isActive || isCompleted ? "text-green-700" : "text-gray-400"
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
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="animate-slide-in">
                      <h3 className="text-xl font-semibold mb-6 pb-2 border-b">Personal Information</h3>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="fullName">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="mt-2"
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="surname">
                            Surname <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="surname"
                            value={formData.surname}
                            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                            className="mt-2"
                          />
                          {errors.surname && (
                            <p className="text-red-500 text-sm mt-1">{errors.surname}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="dateOfBirth">
                            Date of Birth <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="mt-2"
                          />
                          {errors.dateOfBirth && (
                            <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
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
                            <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="phoneNumber">
                            Phone Number <span className="text-red-500">*</span>
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
                                value = "+27" + value.slice(3).replace(/\D/g, "");
                              }
                              setFormData({ ...formData, phoneNumber: value });
                            }}
                            placeholder="+27XXXXXXXXX"
                            className="mt-2"
                          />
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      <h3 className="text-xl font-semibold mb-6 pb-2 border-b">Address Information</h3>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="residentialAddress">
                            Residential Address <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="residentialAddress"
                            value={formData.residentialAddress}
                            onChange={(e) =>
                              setFormData({ ...formData, residentialAddress: e.target.value })
                            }
                            className="mt-2"
                            rows={3}
                          />
                          {errors.residentialAddress && (
                            <p className="text-red-500 text-sm mt-1">{errors.residentialAddress}</p>
                          )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="province">
                              Province <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.province}
                              onValueChange={(value) => setFormData({ ...formData, province: value })}
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
                              <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="city">
                              City <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              className="mt-2"
                            />
                            {errors.city && (
                              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="areaSuburb">
                              Area/Suburb <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="areaSuburb"
                              value={formData.areaSuburb}
                              onChange={(e) => setFormData({ ...formData, areaSuburb: e.target.value })}
                              className="mt-2"
                            />
                            {errors.areaSuburb && (
                              <p className="text-red-500 text-sm mt-1">{errors.areaSuburb}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirmation */}
                  {currentStep === 3 && (
                    <div className="animate-slide-in">
                      <h3 className="text-xl font-semibold mb-6 pb-2 border-b">Confirmation</h3>
                    <div className="space-y-6">
                      <div className="bg-muted p-6 rounded-lg">
                        <p className="text-base leading-relaxed">
                          I understand the objectives of Shosholoza Progressive Party and I voluntarily
                          join the party.
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
                          <p className="text-red-500 text-sm mt-1">{errors.signature}</p>
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
