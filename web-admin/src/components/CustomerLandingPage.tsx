import React, { useState, useEffect } from "react";
import {
  School,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Upload,
  CreditCard,
  QrCode,
  Download,
  BookOpen,
  Users,
  Bus,
  FileText,
  DollarSign,
  TrendingUp,
  Award,
  Zap,
  ChevronDown,
  ChevronUp,
  Star,
  MapPin,
  Lock,
  Mail,
  Phone,
  Building,
  RefreshCw,
  LogOut,
  Layers,
  Sparkle,
  Smartphone,
  PieChart,
  Calendar,
  Bell,
  Sliders,
  CheckCircle,
  FileCheck,
  Building2,
  Scale
} from "lucide-react";

interface Props {
  onNavigateToLogin: (portal: "admin" | "super-admin") => void;
  onInstantLoginSuccess: (token: string, user: any, institute: any) => void;
}

export const CustomerLandingPage: React.FC<Props> = ({
  onNavigateToLogin,
  onInstantLoginSuccess,
}) => {
  // Billing cycle toggle
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "ANNUAL">("ANNUAL");

  // Rotating Headline Text Animation
  const rotatingTitles = [
    "Smart, Automated ERP",
    "Instant UPI Fee Gateway",
    "Live GPS Bus Tracking",
    "CBSE Digital Marksheets",
    "Parent & Teacher Mobile App",
    "Zero-Paper Campus System",
  ];
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % rotatingTitles.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [rotatingTitles.length]);

  // Interactive Feature Tab State
  const [activeFeatureTab, setActiveFeatureTab] = useState<"fees" | "attendance" | "gps" | "exams" | "app">("fees");

  // Interactive Student Calculator
  const [studentCountSlider, setStudentCountSlider] = useState<number>(850);

  // Onboarding Modal State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>({
    id: "solution",
    name: "Standard Plan",
    tagline: "Most Popular for K-12 Schools",
    monthlyPrice: 5000,
    annualPrice: 50000,
    studentLimit: 1500,
    staffLimit: 80,
  });

  const [wizardStep, setWizardStep] = useState<number>(1);
  const [formMode, setFormMode] = useState<"ALL_IN_ONE" | "STEPPER">("ALL_IN_ONE");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // =========================================================================
  // FULL SCHOOL REGISTRATION STATE (MATCHING SUPER ADMIN VIEW EXACTLY)
  // =========================================================================
  const [schoolForm, setSchoolForm] = useState({
    // Basic Details
    name: "",
    code: "",
    institute_type: "SCHOOL" as "SCHOOL" | "COLLEGE",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Delhi",
    plan_name: "Standard Plan",
    student_limit: 1500,
    staff_limit: 80,
    logo_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&q=80",

    // Mandatory Legal & Compliance Affiliation Certificates (Super Admin Spec)
    affiliation_board: "CBSE Affiliated",
    affiliation_number: "CBSE/AFF/213084/2026",
    fire_safety_noc: "FS-DEL-NOC-2026-994 (Valid till 2028)",
    building_safety_cert: "PWD/STR/2025/4412",
    water_sanitation_cert: "DJB/SAN/SAFE-881",
    society_trust_deed: "REG-TRUST-DEL-1994-08",
    state_govt_noc: "EDN-STATE-NOC-2024-119",
    land_possession_cert: "2.85 Acres Campus & Sports Ground",
    compliance_status: "VERIFIED",

    // Admin Credentials
    admin_name: "",
    admin_email: "",
    admin_password: "",
    admin_phone: "",

    // Enabled ERP Modules
    enabled_modules: [
      "admissions",
      "attendance",
      "fees",
      "exams",
      "homework",
      "notices",
      "transport",
      "cleanliness",
      "finance",
    ],
  });

  const [showPassword, setShowPassword] = useState(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("892");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Success Result
  const [createdTenantData, setCreatedTenantData] = useState<any>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Pre-made sample school logos for quick 1-click select
  const sampleLogos = [
    {
      name: "Heritage Shield",
      url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=128&q=80",
    },
    {
      name: "Crown Crest",
      url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&q=80",
    },
    {
      name: "Global Academy",
      url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=128&q=80",
    },
    {
      name: "Wisdom Torch",
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=128&q=80",
    },
  ];

  const handleOpenOnboarding = (plan: any) => {
    setSelectedPlan(plan);
    setSchoolForm((prev) => ({
      ...prev,
      plan_name: plan.name,
      student_limit: plan.studentLimit,
      staff_limit: plan.staffLimit,
    }));
    setWizardStep(1);
    setSubmissionError(null);
    setIsOnboardingOpen(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSchoolForm((prev) => ({ ...prev, logo_url: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleModule = (moduleKey: string) => {
    setSchoolForm((prev) => {
      const exists = prev.enabled_modules.includes(moduleKey);
      return {
        ...prev,
        enabled_modules: exists
          ? prev.enabled_modules.filter((m) => m !== moduleKey)
          : [...prev.enabled_modules, moduleKey],
      };
    });
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleAutoFillDemoSchool = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const samplePool = [
      {
        name: "Delhi Public International Academy",
        code: `DPIA${randomNum}`,
        city: "New Delhi",
        state: "Delhi",
        logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&q=80",
      },
      {
        name: "Cambridge Court World Academy",
        code: `CCWA${randomNum}`,
        city: "Jaipur",
        state: "Rajasthan",
        logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=128&q=80",
      },
      {
        name: "Apex Global Heritage School",
        code: `AGHS${randomNum}`,
        city: "Bangalore",
        state: "Karnataka",
        logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=128&q=80",
      },
      {
        name: "Modern Vidya Niketan Senior Secondary",
        code: `MVNS${randomNum}`,
        city: "Chandigarh",
        state: "Punjab",
        logo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=128&q=80",
      },
    ];
    const picked = samplePool[Math.floor(Math.random() * samplePool.length)];
    const generatedEmail = `principal@${picked.code.toLowerCase()}.edu.in`;

    setSchoolForm({
      name: picked.name,
      code: picked.code,
      institute_type: "SCHOOL",
      email: `info@${picked.code.toLowerCase()}.edu.in`,
      phone: "011-87654321",
      address: `Campus Block A, Institutional Area, ${picked.city}`,
      city: picked.city,
      state: picked.state,
      plan_name: selectedPlan.name || "Standard Plan",
      student_limit: selectedPlan.studentLimit || 1500,
      staff_limit: selectedPlan.staffLimit || 80,
      logo_url: picked.logo,
      affiliation_board: "CBSE Affiliated",
      affiliation_number: `CBSE/AFF/${picked.code}/2026`,
      fire_safety_noc: `FS-${picked.city.slice(0, 3).toUpperCase()}-NOC-2026-${randomNum}`,
      building_safety_cert: `PWD/STR/2026/${randomNum + 4000}`,
      water_sanitation_cert: `DJB/SAN/SAFE-${randomNum}`,
      society_trust_deed: `REG-TRUST-${picked.state.slice(0, 3).toUpperCase()}-1994-${randomNum}`,
      state_govt_noc: `EDN-STATE-NOC-2024-${randomNum}`,
      land_possession_cert: "3.25 Acres Campus & Sports Ground",
      compliance_status: "VERIFIED",
      admin_name: "Dr. Rajeshwar Sharma",
      admin_email: generatedEmail,
      admin_password: "School@123",
      admin_phone: "9876543210",
      enabled_modules: [
        "admissions",
        "attendance",
        "fees",
        "exams",
        "homework",
        "notices",
        "transport",
        "cleanliness",
        "finance",
      ],
    });
    setSubmissionError(null);
  };

  const handleRegisterSchool = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    if (!schoolForm.name || !schoolForm.name.trim()) {
      setSubmissionError("School / Institute Name is required.");
      setIsSubmitting(false);
      return;
    }

    const finalAdminEmail = (schoolForm.admin_email || schoolForm.email).trim();
    if (!finalAdminEmail) {
      setSubmissionError("Administrator Email (Master Login ID) is required.");
      setIsSubmitting(false);
      return;
    }

    const price =
      billingCycle === "ANNUAL"
        ? selectedPlan.annualPrice
        : selectedPlan.monthlyPrice;

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/register-school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: schoolForm.name.trim(),
          code: schoolForm.code.trim(),
          institute_type: schoolForm.institute_type,
          email: schoolForm.email ? schoolForm.email.trim() : finalAdminEmail,
          phone: schoolForm.phone || schoolForm.admin_phone || "011-87654321",
          city: schoolForm.city || "New Delhi",
          state: schoolForm.state || "Delhi",
          address: schoolForm.address || "",
          logo_url: schoolForm.logo_url,
          plan_name: schoolForm.plan_name,
          billing_cycle: billingCycle,
          student_limit: schoolForm.student_limit,
          staff_limit: schoolForm.staff_limit,
          admin_name: schoolForm.admin_name || "Principal In-Charge",
          admin_email: finalAdminEmail,
          admin_password: (schoolForm.admin_password || "School@123").trim(),
          admin_phone: schoolForm.admin_phone || schoolForm.phone || "9876543210",
          affiliation_board: schoolForm.affiliation_board,
          affiliation_number: schoolForm.affiliation_number,
          fire_safety_noc: schoolForm.fire_safety_noc,
          building_safety_cert: schoolForm.building_safety_cert,
          water_sanitation_cert: schoolForm.water_sanitation_cert,
          society_trust_deed: schoolForm.society_trust_deed,
          state_govt_noc: schoolForm.state_govt_noc,
          land_possession_cert: schoolForm.land_possession_cert,
          compliance_status: schoolForm.compliance_status,
          enabled_modules: schoolForm.enabled_modules,
          payment_id: `TXN_RDX_${Date.now()}`,
          payment_method: paymentMethod,
          amount_paid: price,
        }),
      });

      const json = await res.json();
      setIsSubmitting(false);

      if (!res.ok || !json.success) {
        setSubmissionError(json.message || "Failed to register school. Please verify your details.");
        return;
      }

      setCreatedTenantData(json);
      setWizardStep(5); // Success and Handover Screen
    } catch {
      setIsSubmitting(false);
      setSubmissionError("Unable to reach Radhix Cloud Backend. Please ensure backend is running.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07070a",
        color: "#ffffff",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Dynamic Animated Ambient Glow Lights */}
      <div
        className="animate-float"
        style={{
          position: "fixed",
          top: "-150px",
          left: "15%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(197, 157, 255, 0.18) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        className="animate-float-reverse"
        style={{
          position: "fixed",
          top: "40%",
          right: "-100px",
          width: "650px",
          height: "650px",
          background: "radial-gradient(circle, rgba(0, 110, 239, 0.18) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Cyber Grid Background Matrix */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Modern High-End Sticky Navbar with Glassmorphism */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(20px)",
          background: "rgba(7, 7, 10, 0.85)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "16px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
        >
          <div
            className="animate-badge-pulse"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #c59dff 0%, #006eef 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(197, 157, 255, 0.4)",
            }}
          >
            <School size={22} color="#07070a" strokeWidth={2.5} />
          </div>
          <div>
            <div
              className="text-gradient-animated"
              style={{
                fontSize: "17px",
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              RADHIX SCHOOL ERP
            </div>
            <div style={{ fontSize: "11px", color: "#8E92BC", fontWeight: 700, letterSpacing: "0.08em" }}>
              MULTI-TENANT SAAS CLOUD
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <a
            href="#features"
            style={{ color: "#D1D5DB", textDecoration: "none", fontSize: "14px", fontWeight: 600, transition: "color 0.2s" }}
          >
            Features & Modules
          </a>
          <a
            href="#packages"
            style={{ color: "#D1D5DB", textDecoration: "none", fontSize: "14px", fontWeight: 600, transition: "color 0.2s" }}
          >
            Packages & Pricing
          </a>
          <a
            href="#calculator"
            style={{ color: "#D1D5DB", textDecoration: "none", fontSize: "14px", fontWeight: 600, transition: "color 0.2s" }}
          >
            Savings Calculator
          </a>
          <a
            href="#faq"
            style={{ color: "#D1D5DB", textDecoration: "none", fontSize: "14px", fontWeight: 600, transition: "color 0.2s" }}
          >
            FAQ
          </a>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => onNavigateToLogin("admin")}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              padding: "9px 18px",
              borderRadius: "10px",
              fontSize: "13.5px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Admin Login
          </button>

          <button
            onClick={() => handleOpenOnboarding(selectedPlan)}
            className="animate-border-glow"
            style={{
              background: "linear-gradient(135deg, #c59dff 0%, #006eef 100%)",
              color: "#07070a",
              border: "none",
              padding: "10px 22px",
              borderRadius: "10px",
              fontSize: "13.5px",
              fontWeight: 900,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 0 25px rgba(197, 157, 255, 0.35)",
              transition: "all 0.2s ease",
            }}
          >
            <span>Register School Now</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* Dynamic Animated Marquee Ticker */}
      <div
        className="marquee-container"
        style={{
          background: "rgba(197, 157, 255, 0.05)",
          borderBottom: "1px solid rgba(197, 157, 255, 0.15)",
          padding: "10px 0",
          fontSize: "12.5px",
          fontWeight: 800,
          letterSpacing: "0.04em",
          color: "#c59dff",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="marquee-content">
          <span>⚡ 500+ SCHOOLS RUNNING ON RADHIX CLOUD</span>
          <span>•</span>
          <span>💳 INSTANT ONLINE UPI & RAZORPAY FEE SETTLEMENT</span>
          <span>•</span>
          <span>🚌 REAL-TIME LIVE GPS BUS TRACKING FOR PARENTS</span>
          <span>•</span>
          <span>📊 CBSE & STATE BOARD DIGITAL MARKSHEETS</span>
          <span>•</span>
          <span>📱 MODERN DEDICATED MOBILE APPS FOR PARENTS & TEACHERS</span>
          <span>•</span>
          <span>🔒 100% BANK-GRADE 256-BIT ENCRYPTION</span>
          <span>•</span>
          <span>⚡ 500+ SCHOOLS RUNNING ON RADHIX CLOUD</span>
          <span>•</span>
          <span>💳 INSTANT ONLINE UPI & RAZORPAY FEE SETTLEMENT</span>
          <span>•</span>
          <span>🚌 REAL-TIME LIVE GPS BUS TRACKING FOR PARENTS</span>
          <span>•</span>
          <span>📊 CBSE & STATE BOARD DIGITAL MARKSHEETS</span>
        </div>
      </div>

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "60px 24px 40px 24px",
          textAlign: "center",
        }}
      >
        {/* Futuristic Top Pill Badge with Pulse */}
        <div
          className="animate-badge-pulse"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(197, 157, 255, 0.08)",
            border: "1px solid rgba(197, 157, 255, 0.3)",
            padding: "8px 20px",
            borderRadius: "30px",
            fontSize: "12.5px",
            fontWeight: 800,
            color: "#c59dff",
            letterSpacing: "0.06em",
            marginBottom: "24px",
          }}
        >
          <Sparkles size={15} className="animate-spin-slow" />
          <span>INSTANT MULTI-TENANT SCHOOL ERP • ZERO SETUP TIME</span>
        </div>

        {/* Big Bold Headline with ROTATING ANIMATED TEXT */}
        <h1
          style={{
            fontSize: "58px",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            margin: "0 auto 20px auto",
            maxWidth: "980px",
          }}
        >
          Run Your Entire School With One{" "}
          <br />
          <span
            key={titleIndex}
            className="text-gradient-animated"
            style={{
              display: "inline-block",
              transition: "all 0.5s ease",
              borderBottom: "3px solid #c59dff",
              paddingBottom: "4px",
            }}
          >
            {rotatingTitles[titleIndex]}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "18px",
            color: "#9ca3af",
            maxWidth: "760px",
            margin: "0 auto 36px auto",
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Full Super-Admin grade self-service registration. Enter your legal CBSE/State affiliation credentials,
          customize your school logo, complete instant checkout, and immediately receive your dedicated portal URL & admin credentials!
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <button
            onClick={() => handleOpenOnboarding(selectedPlan)}
            className="animate-border-glow"
            style={{
              background: "linear-gradient(135deg, #c59dff 0%, #006eef 100%)",
              color: "#07070a",
              border: "none",
              padding: "16px 40px",
              borderRadius: "14px",
              fontSize: "16.5px",
              fontWeight: 900,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 0 35px rgba(197, 157, 255, 0.45)",
              transition: "transform 0.2s ease",
            }}
          >
            <span>Complete School Registration</span>
            <ArrowRight size={18} />
          </button>

          <a
            href="#packages"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              padding: "16px 28px",
              borderRadius: "14px",
              fontSize: "15px",
              fontWeight: 700,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>Explore Plans & Modules</span>
            <ChevronDown size={16} />
          </a>
        </div>
      </section>

      {/* Packages & Pricing Section */}
      <section
        id="packages"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          margin: "80px auto",
          padding: "0 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "#c59dff",
              fontWeight: 800,
              letterSpacing: "0.08em",
              marginBottom: "12px",
            }}
          >
            FLEXIBLE SUBSCRIPTION TIERS
          </div>
          <h2 style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-0.02em" }}>
            Our Packages & Transparent Pricing
          </h2>
          <p style={{ color: "#9ca3af", maxWidth: "600px", margin: "12px auto 0 auto", fontSize: "16px" }}>
            Choose from our affordable and customizable school ERP packages. Instant deployment with zero hidden setup fees.
          </p>

          {/* Billing Cycle Switch */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "30px",
              padding: "4px",
              marginTop: "28px",
            }}
          >
            <button
              onClick={() => setBillingCycle("MONTHLY")}
              style={{
                background: billingCycle === "MONTHLY" ? "rgba(255, 255, 255, 0.15)" : "transparent",
                color: billingCycle === "MONTHLY" ? "#ffffff" : "#9ca3af",
                border: "none",
                padding: "8px 20px",
                borderRadius: "24px",
                fontWeight: 700,
                fontSize: "13.5px",
                cursor: "pointer",
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("ANNUAL")}
              style={{
                background:
                  billingCycle === "ANNUAL"
                    ? "linear-gradient(135deg, #c59dff 0%, #006eef 100%)"
                    : "transparent",
                color: billingCycle === "ANNUAL" ? "#07070a" : "#9ca3af",
                border: "none",
                padding: "8px 24px",
                borderRadius: "24px",
                fontWeight: 900,
                fontSize: "13.5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>Annual Billing</span>
              <span
                style={{
                  background: billingCycle === "ANNUAL" ? "#07070a" : "#10b981",
                  color: billingCycle === "ANNUAL" ? "#c59dff" : "#07070a",
                  fontSize: "10.5px",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  fontWeight: 900,
                }}
              >
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
            alignItems: "stretch",
          }}
        >
          {/* Plan 1: Basic Plan */}
          <div
            style={{
              background: "rgba(18, 20, 29, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: "36px",
              backdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 800, letterSpacing: "0.08em" }}>
                STARTER ACADEMIES
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: 900, marginTop: "6px" }}>Basic Plan</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "4px" }}>
                Essential school management for primary and budding schools.
              </p>

              <div style={{ margin: "24px 0", display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "40px", fontWeight: 900, color: "#ffffff" }}>
                  ₹{billingCycle === "ANNUAL" ? "20,000" : "2,000"}
                </span>
                <span style={{ color: "#9ca3af", fontSize: "14px" }}>
                  /{billingCycle === "ANNUAL" ? "year" : "month"}
                </span>
              </div>

              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#c59dff", marginBottom: "14px" }}>
                  INCLUDED FEATURES:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#d1d5db" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#c59dff" />
                    <span>Up to <strong>500 Students</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#c59dff" />
                    <span>Up to <strong>50 Teachers & Staff</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#c59dff" />
                    <span>Admissions, Attendance & Timetable</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#c59dff" />
                    <span>School Notices & Basic Reports</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                handleOpenOnboarding({
                  id: "basic",
                  name: "Basic Plan",
                  tagline: "Starter Academies",
                  monthlyPrice: 2000,
                  annualPrice: 20000,
                  studentLimit: 500,
                  staffLimit: 50,
                })
              }
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                padding: "14px",
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "15px",
                cursor: "pointer",
                marginTop: "32px",
              }}
            >
              Select Basic Plan
            </button>
          </div>

          {/* Plan 2: Standard Plan (Popular) */}
          <div
            className="animate-border-glow"
            style={{
              background: "linear-gradient(180deg, rgba(30, 24, 48, 0.85) 0%, rgba(15, 18, 30, 0.85) 100%)",
              border: "2px solid #c59dff",
              borderRadius: "24px",
              padding: "36px",
              backdropFilter: "blur(16px)",
              position: "relative",
              boxShadow: "0 0 50px rgba(197, 157, 255, 0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              className="animate-badge-pulse"
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(90deg, #c59dff 0%, #006eef 100%)",
                color: "#07070a",
                padding: "4px 18px",
                borderRadius: "20px",
                fontSize: "11.5px",
                fontWeight: 900,
                letterSpacing: "0.06em",
              }}
            >
              ★ MOST POPULAR FOR K-12
            </div>

            <div>
              <div style={{ fontSize: "12px", color: "#c59dff", fontWeight: 800, letterSpacing: "0.08em" }}>
                ESTABLISHED INSTITUTIONS
              </div>
              <h3 style={{ fontSize: "28px", fontWeight: 900, marginTop: "6px" }}>Standard Plan</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "4px" }}>
                Complete digital campus with Mobile Apps, Fees & Exams.
              </p>

              <div style={{ margin: "24px 0", display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span
                  style={{
                    fontSize: "44px",
                    fontWeight: 900,
                    background: "linear-gradient(90deg, #ffffff 0%, #c59dff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ₹{billingCycle === "ANNUAL" ? "50,000" : "5,000"}
                </span>
                <span style={{ color: "#9ca3af", fontSize: "14px" }}>
                  /{billingCycle === "ANNUAL" ? "year" : "month"}
                </span>
              </div>

              <div style={{ borderTop: "1px solid rgba(197, 157, 255, 0.2)", paddingTop: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#c59dff", marginBottom: "14px" }}>
                  EVERYTHING IN BASIC, PLUS:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#e5e7eb" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#c59dff" />
                    <span>Up to <strong>1,500 Students</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#c59dff" />
                    <span>Up to <strong>80 Staff & Teachers</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#c59dff" />
                    <span><strong>Online Fees via UPI & Razorpay</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#c59dff" />
                    <span><strong>Parents & Students Mobile App</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#c59dff" />
                    <span>Exams, Marksheets & Digital Report Cards</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#c59dff" />
                    <span><strong>Custom School Logo & Brand Integration</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                handleOpenOnboarding({
                  id: "standard",
                  name: "Standard Plan",
                  tagline: "Most Popular for K-12 Schools",
                  monthlyPrice: 5000,
                  annualPrice: 50000,
                  studentLimit: 1500,
                  staffLimit: 80,
                })
              }
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #c59dff 0%, #006eef 100%)",
                color: "#07070a",
                border: "none",
                padding: "16px",
                borderRadius: "14px",
                fontWeight: 900,
                fontSize: "16px",
                cursor: "pointer",
                marginTop: "32px",
                boxShadow: "0 0 25px rgba(197, 157, 255, 0.4)",
              }}
            >
              Select Standard Plan (Recommended)
            </button>
          </div>

          {/* Plan 3: Premium Plan */}
          <div
            style={{
              background: "rgba(18, 20, 29, 0.6)",
              border: "1px solid rgba(0, 110, 239, 0.3)",
              borderRadius: "24px",
              padding: "36px",
              backdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", color: "#006eef", fontWeight: 800, letterSpacing: "0.08em" }}>
                ENTERPRISE & GROUP SCHOOLS
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: 900, marginTop: "6px" }}>Premium Plan</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "4px" }}>
                Full-suite ERP with Live GPS tracking, transport & payroll.
              </p>

              <div style={{ margin: "24px 0", display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "40px", fontWeight: 900, color: "#ffffff" }}>
                  ₹{billingCycle === "ANNUAL" ? "1,00,000" : "10,000"}
                </span>
                <span style={{ color: "#9ca3af", fontSize: "14px" }}>
                  /{billingCycle === "ANNUAL" ? "year" : "month"}
                </span>
              </div>

              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#006eef", marginBottom: "14px" }}>
                  EVERYTHING IN STANDARD, PLUS:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#d1d5db" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#006eef" />
                    <span>Up to <strong>5,000+ Students (Multi-Campus)</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#006eef" />
                    <span>Up to <strong>250 Staff Members</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#006eef" />
                    <span><strong>Live GPS Bus Tracking & Transport</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#006eef" />
                    <span>Staff Payroll, Leaves & Accounting</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                handleOpenOnboarding({
                  id: "premium",
                  name: "Premium Plan",
                  tagline: "Enterprise & Group Schools",
                  monthlyPrice: 10000,
                  annualPrice: 100000,
                  studentLimit: 5000,
                  staffLimit: 250,
                })
              }
              style={{
                width: "100%",
                background: "rgba(0, 110, 239, 0.15)",
                border: "1px solid rgba(0, 110, 239, 0.4)",
                color: "#60a5fa",
                padding: "14px",
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "15px",
                cursor: "pointer",
                marginTop: "32px",
              }}
            >
              Select Premium Plan
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          background: "#050608",
          padding: "50px 36px 30px 36px",
          marginTop: "80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
          © 2026 Radhix Technology. Built for Multi-Tenant School Excellence.
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE SCHOOL REGISTRATION MODAL (MATCHING SUPER ADMIN FORM)       */}
      {/* ========================================================================= */}
      {isOnboardingOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(14px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#0d0f18",
              border: "1px solid rgba(197, 157, 255, 0.35)",
              borderRadius: "28px",
              maxWidth: "840px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 30px 100px rgba(0, 0, 0, 0.95), 0 0 60px rgba(197, 157, 255, 0.2)",
              padding: "36px",
              position: "relative",
            }}
          >
            {/* Modal Close Button */}
            {wizardStep !== 5 && (
              <button
                onClick={() => setIsOnboardingOpen(false)}
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "24px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  color: "#9ca3af",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            )}

            {/* Modal Header & Navigation Controls */}
            {wizardStep !== 5 && (
              <div style={{ marginBottom: "26px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(197, 157, 255, 0.12)", color: "#c59dff", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 800, marginBottom: "6px" }}>
                      <Award size={14} /> Full Multi-Tenant School Registration
                    </div>
                    <h2 style={{ fontSize: "24px", fontWeight: 900, margin: 0, color: "#fff" }}>
                      School Registration & Cloud Tenant Setup
                    </h2>
                    <p style={{ margin: "4px 0 0 0", color: "#9ca3af", fontSize: "13px" }}>
                      Provision your school database tenant, admin credentials, legal certificates & ERP modules instantly.
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={handleAutoFillDemoSchool}
                      style={{
                        background: "linear-gradient(135deg, rgba(197, 157, 255, 0.18) 0%, rgba(0, 110, 239, 0.18) 100%)",
                        border: "1px solid rgba(197, 157, 255, 0.4)",
                        color: "#c59dff",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 0 15px rgba(197, 157, 255, 0.2)"
                      }}
                    >
                      <Sparkles size={14} /> ⚡ 1-Click Auto-Fill Demo School
                    </button>

                    <div style={{ display: "inline-flex", background: "rgba(255, 255, 255, 0.06)", padding: "3px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.12)" }}>
                      <button
                        type="button"
                        onClick={() => setFormMode("ALL_IN_ONE")}
                        style={{
                          background: formMode === "ALL_IN_ONE" ? "linear-gradient(135deg, #c59dff 0%, #006eef 100%)" : "transparent",
                          color: formMode === "ALL_IN_ONE" ? "#07070a" : "#9ca3af",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          fontSize: "11.5px",
                          fontWeight: 800,
                          cursor: "pointer"
                        }}
                      >
                        All-in-One Form (Super Admin)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormMode("STEPPER")}
                        style={{
                          background: formMode === "STEPPER" ? "linear-gradient(135deg, #c59dff 0%, #006eef 100%)" : "transparent",
                          color: formMode === "STEPPER" ? "#07070a" : "#9ca3af",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          fontSize: "11.5px",
                          fontWeight: 800,
                          cursor: "pointer"
                        }}
                      >
                        4-Step Wizard
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clickable Stepper Tabs if in Stepper Mode */}
                {formMode === "STEPPER" && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.03)", padding: "10px 18px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    {[
                      { step: 1, title: "1. Plan & Quota" },
                      { step: 2, title: "2. School Profile" },
                      { step: 3, title: "3. Legal & Compliance" },
                      { step: 4, title: "4. Admin & Modules" },
                    ].map((s) => (
                      <div
                        key={s.step}
                        onClick={() => setWizardStep(s.step)}
                        style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                      >
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            background:
                              wizardStep >= s.step
                                ? "linear-gradient(135deg, #c59dff 0%, #006eef 100%)"
                                : "rgba(255, 255, 255, 0.08)",
                            color: wizardStep >= s.step ? "#07070a" : "#9ca3af",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 900,
                            fontSize: "12px",
                          }}
                        >
                          {wizardStep > s.step ? <Check size={14} /> : s.step}
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: wizardStep === s.step ? 800 : 600,
                            color: wizardStep === s.step ? "#ffffff" : "#6b7280",
                          }}
                        >
                          {s.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Error Banner */}
            {submissionError && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid #ef4444",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#fca5a5",
                  fontSize: "13.5px",
                  marginBottom: "20px",
                }}
              >
                {submissionError}
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW MODE 1: ALL-IN-ONE REGISTRATION (MATCHING SUPER ADMIN VIEW EXACTLY)  */}
            {/* ========================================================================= */}
            {formMode === "ALL_IN_ONE" && wizardStep !== 5 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* 1. Subscription Plan & Quotas */}
                <div style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "18px", padding: "20px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <CreditCard size={18} color="#c59dff" />
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 900, color: "#fff" }}>
                      1. Subscription Plan Tier & Tenant Quotas
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        Subscription Plan *
                      </label>
                      <select
                        value={schoolForm.plan_name}
                        onChange={(e) => {
                          const val = e.target.value;
                          let sLimit = 1500;
                          let stLimit = 80;
                          let price = 5000;
                          if (val.includes("Basic")) {
                            sLimit = 500;
                            stLimit = 50;
                            price = 2000;
                          } else if (val.includes("Premium")) {
                            sLimit = 5000;
                            stLimit = 250;
                            price = 10000;
                          }
                          setSelectedPlan({
                            ...selectedPlan,
                            name: val,
                            monthlyPrice: price,
                            annualPrice: price * 10,
                            studentLimit: sLimit,
                            staffLimit: stLimit,
                          });
                          setSchoolForm({
                            ...schoolForm,
                            plan_name: val,
                            student_limit: sLimit,
                            staff_limit: stLimit,
                          });
                        }}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "10px",
                          background: "#161924",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#fff",
                          fontSize: "13.5px",
                          outline: "none",
                        }}
                      >
                        <option value="Basic Plan">Basic Plan (₹2,000/mo - 500 Students)</option>
                        <option value="Standard Plan">Standard Plan (₹5,000/mo - 1,500 Students)</option>
                        <option value="Premium Plan">Premium Plan (₹10,000/mo - 5,000 Students)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        Billing Cycle *
                      </label>
                      <select
                        value={billingCycle}
                        onChange={(e: any) => setBillingCycle(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "10px",
                          background: "#161924",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#fff",
                          fontSize: "13.5px",
                          outline: "none",
                        }}
                      >
                        <option value="ANNUAL">Annual Billing (Save 20% - 2 Months Free)</option>
                        <option value="MONTHLY">Monthly Billing</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        Student Capacity Quota *
                      </label>
                      <input
                        type="number"
                        value={schoolForm.student_limit}
                        onChange={(e) => setSchoolForm({ ...schoolForm, student_limit: Number(e.target.value) })}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#fff",
                          fontSize: "13.5px",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        Staff & Faculty Quota *
                      </label>
                      <input
                        type="number"
                        value={schoolForm.staff_limit}
                        onChange={(e) => setSchoolForm({ ...schoolForm, staff_limit: Number(e.target.value) })}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#fff",
                          fontSize: "13.5px",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. School Profile & Crest Logo */}
                <div style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "18px", padding: "20px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <School size={18} color="#c59dff" />
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 900, color: "#fff" }}>
                      2. School Profile & Crest Logo
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        School / Institute Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Cambridge Court High School"
                        value={schoolForm.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSchoolForm({
                            ...schoolForm,
                            name: val,
                            code: schoolForm.code || val.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase(),
                          });
                        }}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#fff",
                          fontSize: "13.5px",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        Tenant Code *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="CCHS"
                        value={schoolForm.code}
                        onChange={(e) => setSchoolForm({ ...schoolForm, code: e.target.value.toUpperCase() })}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#fff",
                          fontSize: "13.5px",
                          fontFamily: "monospace",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        Official School Email *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="info@school.edu.in"
                        value={schoolForm.email}
                        onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value, admin_email: schoolForm.admin_email || e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#fff",
                          fontSize: "13.5px",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        Contact Phone *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="011-87654321"
                        value={schoolForm.phone}
                        onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#fff",
                          fontSize: "13.5px",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        City *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Jaipur"
                        value={schoolForm.city}
                        onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "13.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        State *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Rajasthan"
                        value={schoolForm.state}
                        onChange={(e) => setSchoolForm({ ...schoolForm, state: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "13.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        Institution Type
                      </label>
                      <select
                        value={schoolForm.institute_type}
                        onChange={(e: any) => setSchoolForm({ ...schoolForm, institute_type: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "#161924", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "13.5px" }}
                      >
                        <option value="SCHOOL">K-12 School</option>
                        <option value="COLLEGE">College / University</option>
                      </select>
                    </div>
                  </div>

                  {/* Logo Upload Box */}
                  <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px dashed rgba(197, 157, 255, 0.3)", borderRadius: "14px", padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                      <div style={{ width: "56px", height: "56px", borderRadius: "12px", border: "2px solid #c59dff", overflow: "hidden", background: "#07070a" }}>
                        <img src={schoolForm.logo_url} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "12px", fontWeight: 800, color: "#c59dff", marginBottom: "6px" }}>
                          🏫 Official School Crest / Logo
                        </div>
                        <input type="file" accept="image/*" id="logo-file-picker-all" onChange={handleLogoUpload} style={{ display: "none" }} />
                        <label
                          htmlFor="logo-file-picker-all"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "rgba(197, 157, 255, 0.15)",
                            color: "#c59dff",
                            border: "1px solid rgba(197, 157, 255, 0.3)",
                            padding: "6px 14px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          <Upload size={13} />
                          <span>Upload Custom Logo</span>
                        </label>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        {sampleLogos.map((s, idx) => (
                          <img
                            key={idx}
                            src={s.url}
                            alt={s.name}
                            onClick={() => setSchoolForm({ ...schoolForm, logo_url: s.url })}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              border: schoolForm.logo_url === s.url ? "2px solid #006eef" : "1px solid rgba(255,255,255,0.2)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Mandatory Legal & Compliance Certificates (Same as Super Admin) */}
                <div style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "18px", padding: "20px", border: "1px solid rgba(197, 157, 255, 0.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <Award size={18} color="#c59dff" />
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 900, color: "#fff" }}>
                      3. Mandatory Legal Affiliation & Compliance Certificates (All Required)
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        1. Affiliation Board & Code *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="CBSE/AFF/213084/2026"
                        value={schoolForm.affiliation_number}
                        onChange={(e) => setSchoolForm({ ...schoolForm, affiliation_number: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        2. Fire Safety NOC & Validity *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="FS-DEL-NOC-2026-994 (Valid 2028)"
                        value={schoolForm.fire_safety_noc}
                        onChange={(e) => setSchoolForm({ ...schoolForm, fire_safety_noc: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "12px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        3. Building Safety & Stability *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="PWD/STR/2025/4412"
                        value={schoolForm.building_safety_cert}
                        onChange={(e) => setSchoolForm({ ...schoolForm, building_safety_cert: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        4. Safe Water & Sanitation NOC *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="DJB/SAN/SAFE-881"
                        value={schoolForm.water_sanitation_cert}
                        onChange={(e) => setSchoolForm({ ...schoolForm, water_sanitation_cert: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "12px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        5. Society / Trust Deed Reg No. *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="REG-TRUST-DEL-1994-08"
                        value={schoolForm.society_trust_deed}
                        onChange={(e) => setSchoolForm({ ...schoolForm, society_trust_deed: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        6. State Education Dept NOC *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="EDN-STATE-NOC-2024-119"
                        value={schoolForm.state_govt_noc}
                        onChange={(e) => setSchoolForm({ ...schoolForm, state_govt_noc: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "12px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        7. Campus Land & Playground Area *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="2.85 Acres Campus Ground"
                        value={schoolForm.land_possession_cert}
                        onChange={(e) => setSchoolForm({ ...schoolForm, land_possession_cert: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        8. Compliance & Verification Status *
                      </label>
                      <select
                        value={schoolForm.compliance_status}
                        onChange={(e) => setSchoolForm({ ...schoolForm, compliance_status: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#10b981", fontSize: "12px", fontWeight: 800 }}
                      >
                        <option value="VERIFIED">100% Verified & Compliant</option>
                        <option value="IN_REVIEW">Under Document Verification</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Master Administrator Account & Modules */}
                <div style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "18px", padding: "20px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <ShieldCheck size={18} color="#c59dff" />
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 900, color: "#fff" }}>
                      4. Master Administrator Login & ERP Modules
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        Administrator / Principal Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Dr. Rajesh Mehta"
                        value={schoolForm.admin_name}
                        onChange={(e) => setSchoolForm({ ...schoolForm, admin_name: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "13.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        Admin Email (Master Login ID) *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="e.g. principal@school.edu"
                        value={schoolForm.admin_email}
                        onChange={(e) => setSchoolForm({ ...schoolForm, admin_email: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "13.5px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        Admin Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={schoolForm.admin_phone}
                        onChange={(e) => setSchoolForm({ ...schoolForm, admin_phone: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "13.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                        Master Password *
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          required
                          type={showPassword ? "text" : "password"}
                          placeholder="Create strong password"
                          value={schoolForm.admin_password}
                          onChange={(e) => setSchoolForm({ ...schoolForm, admin_password: e.target.value })}
                          style={{ width: "100%", padding: "10px 40px 10px 12px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "13.5px" }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer" }}
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Module Checkboxes */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#c59dff", marginBottom: "10px" }}>
                      ⚡ Active Modules for this School Tenant:
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px" }}>
                      {[
                        { key: "admissions", label: "Student Admissions" },
                        { key: "attendance", label: "Biometric Attendance" },
                        { key: "fees", label: "Online Fees & UPI" },
                        { key: "exams", label: "Exams & Marksheets" },
                        { key: "homework", label: "Homework Diary" },
                        { key: "transport", label: "Live GPS Bus Tracking" },
                        { key: "cleanliness", label: "Campus Hygiene (4.9★)" },
                        { key: "notices", label: "Official Notice Push" },
                      ].map((mod) => (
                        <label key={mod.key} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "#d1d5db", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={schoolForm.enabled_modules.includes(mod.key)}
                            onChange={() => toggleModule(mod.key)}
                            style={{ accentColor: "#c59dff" }}
                          />
                          <span>{mod.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Checkout & Submit Button */}
                <div style={{ background: "rgba(0, 110, 239, 0.12)", border: "1px solid rgba(0, 110, 239, 0.35)", borderRadius: "18px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#60a5fa" }}>
                        💳 Instant Gateway Checkout: ₹{billingCycle === "ANNUAL" ? selectedPlan.annualPrice.toLocaleString() : selectedPlan.monthlyPrice.toLocaleString()}
                      </div>
                      <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                        Instant cloud tenant creation, classes, academic year & admin credentials
                      </div>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 800, background: "#10b981", color: "#07070a", padding: "4px 12px", borderRadius: "12px" }}>
                      ✓ 100% Ready to Provision
                    </span>
                  </div>

                  <button
                    onClick={handleRegisterSchool}
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #c59dff 0%, #006eef 100%)",
                      color: "#07070a",
                      border: "none",
                      padding: "16px",
                      borderRadius: "14px",
                      fontWeight: 900,
                      fontSize: "16px",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      boxShadow: "0 0 35px rgba(197, 157, 255, 0.4)",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Provisioning School Tenant & Initializing System...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Register School Now</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW MODE 2: STEPPER WIZARD MODE                                          */}
            {/* ========================================================================= */}
            {formMode === "STEPPER" && wizardStep === 1 && (
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 6px 0" }}>
                  Select Subscription Plan & Student Quota
                </h2>
                <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "24px" }}>
                  Choose your cloud tenant tier and capacity limits (matching Super Admin master specifications).
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      Subscription Plan *
                    </label>
                    <select
                      value={schoolForm.plan_name}
                      onChange={(e) => {
                        const val = e.target.value;
                        let sLimit = 1500;
                        let stLimit = 80;
                        let price = 5000;
                        if (val.includes("Basic")) {
                          sLimit = 500;
                          stLimit = 50;
                          price = 2000;
                        } else if (val.includes("Premium")) {
                          sLimit = 5000;
                          stLimit = 250;
                          price = 10000;
                        }
                        setSelectedPlan({
                          ...selectedPlan,
                          name: val,
                          monthlyPrice: price,
                          annualPrice: price * 10,
                          studentLimit: sLimit,
                          staffLimit: stLimit,
                        });
                        setSchoolForm({
                          ...schoolForm,
                          plan_name: val,
                          student_limit: sLimit,
                          staff_limit: stLimit,
                        });
                      }}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: "#161924",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    >
                      <option value="Basic Plan">Basic Plan (₹2,000/mo - 500 Students)</option>
                      <option value="Standard Plan">Standard Plan (₹5,000/mo - 1,500 Students)</option>
                      <option value="Premium Plan">Premium Plan (₹10,000/mo - 5,000 Students)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      Billing Cycle *
                    </label>
                    <select
                      value={billingCycle}
                      onChange={(e: any) => setBillingCycle(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: "#161924",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    >
                      <option value="ANNUAL">Annual Billing (Save 20% - 2 Months Free)</option>
                      <option value="MONTHLY">Monthly Billing</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      Student Capacity Quota *
                    </label>
                    <input
                      type="number"
                      value={schoolForm.student_limit}
                      onChange={(e) => setSchoolForm({ ...schoolForm, student_limit: Number(e.target.value) })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      Staff & Faculty Quota *
                    </label>
                    <input
                      type="number"
                      value={schoolForm.staff_limit}
                      onChange={(e) => setSchoolForm({ ...schoolForm, staff_limit: Number(e.target.value) })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setWizardStep(2)}
                    style={{
                      background: "linear-gradient(135deg, #c59dff 0%, #006eef 100%)",
                      color: "#07070a",
                      border: "none",
                      padding: "12px 32px",
                      borderRadius: "12px",
                      fontWeight: 900,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>Proceed to School Profile</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SCHOOL PROFILE & LOGO (STEPPER) */}
            {formMode === "STEPPER" && wizardStep === 2 && (
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 6px 0" }}>
                  School Profile & Custom Logo Branding
                </h2>
                <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "20px" }}>
                  Enter school identity details and upload your crest logo for official ID cards and receipts.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      School / College Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Cambridge Court High School"
                      value={schoolForm.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSchoolForm({
                          ...schoolForm,
                          name: val,
                          code: schoolForm.code || val.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase(),
                        });
                      }}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      Tenant Code *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="CCHS"
                      value={schoolForm.code}
                      onChange={(e) => setSchoolForm({ ...schoolForm, code: e.target.value.toUpperCase() })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "14px",
                        fontFamily: "monospace",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      Official School Email *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="info@cambridgecourt.edu.in"
                      value={schoolForm.email}
                      onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value, admin_email: schoolForm.admin_email || e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      Contact Phone *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="011-87654321"
                      value={schoolForm.phone}
                      onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      City *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Jaipur"
                      value={schoolForm.city}
                      onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      State *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Rajasthan"
                      value={schoolForm.state}
                      onChange={(e) => setSchoolForm({ ...schoolForm, state: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      Institution Type
                    </label>
                    <select
                      value={schoolForm.institute_type}
                      onChange={(e: any) => setSchoolForm({ ...schoolForm, institute_type: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: "#161924",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    >
                      <option value="SCHOOL">K-12 School</option>
                      <option value="COLLEGE">College / University</option>
                    </select>
                  </div>
                </div>

                {/* SCHOOL LOGO UPLOAD & PREVIEW */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px dashed rgba(197, 157, 255, 0.3)",
                    borderRadius: "16px",
                    padding: "18px",
                    marginBottom: "24px",
                  }}
                >
                  <label style={{ fontSize: "12.5px", fontWeight: 800, color: "#c59dff", display: "block", marginBottom: "8px" }}>
                    🏫 Official School Crest / Logo Upload
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
                    <div
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "14px",
                        border: "2px solid #c59dff",
                        overflow: "hidden",
                        background: "#07070a",
                        boxShadow: "0 0 15px rgba(197, 157, 255, 0.3)",
                      }}
                    >
                      <img src={schoolForm.logo_url} alt="Logo Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <input type="file" accept="image/*" id="logo-file-picker" onChange={handleLogoUpload} style={{ display: "none" }} />
                      <label
                        htmlFor="logo-file-picker"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "rgba(197, 157, 255, 0.15)",
                          color: "#c59dff",
                          border: "1px solid rgba(197, 157, 255, 0.3)",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "12.5px",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        <Upload size={14} />
                        <span>Upload From Device</span>
                      </label>

                      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                        {sampleLogos.map((s, idx) => (
                          <img
                            key={idx}
                            src={s.url}
                            alt={s.name}
                            onClick={() => setSchoolForm({ ...schoolForm, logo_url: s.url })}
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              border: schoolForm.logo_url === s.url ? "2px solid #006eef" : "1px solid rgba(255,255,255,0.2)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button
                    onClick={() => setWizardStep(1)}
                    style={{ background: "rgba(255, 255, 255, 0.05)", border: "none", color: "#9ca3af", padding: "12px 24px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (!schoolForm.name.trim()) {
                        setSubmissionError("School name is required");
                        return;
                      }
                      setSubmissionError(null);
                      setWizardStep(3);
                    }}
                    style={{ background: "linear-gradient(135deg, #c59dff 0%, #006eef 100%)", color: "#07070a", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: 900, cursor: "pointer" }}
                  >
                    Proceed to Legal & Compliance Certificates →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: LEGAL CERTIFICATES (STEPPER) */}
            {formMode === "STEPPER" && wizardStep === 3 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <Award size={22} color="#c59dff" />
                  <h2 style={{ fontSize: "22px", fontWeight: 900, margin: 0 }}>
                    Mandatory Legal Affiliation & Compliance Certificates
                  </h2>
                </div>
                <p style={{ color: "#9ca3af", fontSize: "13.5px", marginBottom: "20px" }}>
                  Required for CBSE / ICSE / State Government recognition and multi-tenant audit verification (Same as Super Admin).
                </p>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(197, 157, 255, 0.2)", marginBottom: "24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        1. Affiliation Board & Code *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="CBSE/AFF/213084/2026"
                        value={schoolForm.affiliation_number}
                        onChange={(e) => setSchoolForm({ ...schoolForm, affiliation_number: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        2. Fire Safety NOC & Validity *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="FS-DEL-NOC-2026-994 (Valid 2028)"
                        value={schoolForm.fire_safety_noc}
                        onChange={(e) => setSchoolForm({ ...schoolForm, fire_safety_noc: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        3. Building Safety & Stability Certificate *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="PWD/STR/2025/4412"
                        value={schoolForm.building_safety_cert}
                        onChange={(e) => setSchoolForm({ ...schoolForm, building_safety_cert: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        4. Safe Water & Sanitation NOC *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="DJB/SAN/SAFE-881"
                        value={schoolForm.water_sanitation_cert}
                        onChange={(e) => setSchoolForm({ ...schoolForm, water_sanitation_cert: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        5. Society / Trust Deed Reg No. *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="REG-TRUST-DEL-1994-08"
                        value={schoolForm.society_trust_deed}
                        onChange={(e) => setSchoolForm({ ...schoolForm, society_trust_deed: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        6. State Education Dept NOC *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="EDN-STATE-NOC-2024-119"
                        value={schoolForm.state_govt_noc}
                        onChange={(e) => setSchoolForm({ ...schoolForm, state_govt_noc: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        7. Campus Land & Playground Area *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="2.85 Acres Campus Ground"
                        value={schoolForm.land_possession_cert}
                        onChange={(e) => setSchoolForm({ ...schoolForm, land_possession_cert: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: 800, color: "#c59dff", marginBottom: "4px" }}>
                        8. Compliance & Verification Status *
                      </label>
                      <select
                        value={schoolForm.compliance_status}
                        onChange={(e) => setSchoolForm({ ...schoolForm, compliance_status: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#161924", border: "1px solid rgba(255,255,255,0.15)", color: "#10b981", fontSize: "13px", fontWeight: 800 }}
                      >
                        <option value="VERIFIED">100% Verified & Compliant</option>
                        <option value="IN_REVIEW">Under Document Verification</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button
                    onClick={() => setWizardStep(2)}
                    style={{ background: "rgba(255, 255, 255, 0.05)", border: "none", color: "#9ca3af", padding: "12px 24px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setWizardStep(4)}
                    style={{ background: "linear-gradient(135deg, #c59dff 0%, #006eef 100%)", color: "#07070a", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: 900, cursor: "pointer" }}
                  >
                    Proceed to Admin & Modules →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: ADMIN CREDENTIALS & PAYMENT (STEPPER) */}
            {formMode === "STEPPER" && wizardStep === 4 && (
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 6px 0" }}>
                  Administrator Credentials & ERP Modules
                </h2>
                <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "20px" }}>
                  Configure your master administrator login and select the ERP modules to be activated on your cloud tenant.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      Administrator / Principal Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dr. Rajesh Mehta"
                      value={schoolForm.admin_name}
                      onChange={(e) => setSchoolForm({ ...schoolForm, admin_name: e.target.value })}
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      Admin Email (Master Login ID) *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. principal@school.edu"
                      value={schoolForm.admin_email}
                      onChange={(e) => setSchoolForm({ ...schoolForm, admin_email: e.target.value })}
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      Admin Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={schoolForm.admin_phone}
                      onChange={(e) => setSchoolForm({ ...schoolForm, admin_phone: e.target.value })}
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#d1d5db", marginBottom: "6px" }}>
                      Master Password *
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Create strong password"
                        value={schoolForm.admin_password}
                        onChange={(e) => setSchoolForm({ ...schoolForm, admin_password: e.target.value })}
                        style={{ width: "100%", padding: "12px 40px 12px 14px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "14px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer" }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ERP MODULES TOGGLE CHECKBOXES */}
                <div style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "16px", padding: "18px", border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 800, color: "#c59dff", marginBottom: "12px" }}>
                    ⚡ Active Tenant Modules:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                    {[
                      { key: "admissions", label: "Student Admissions" },
                      { key: "attendance", label: "Biometric Attendance" },
                      { key: "fees", label: "Online Fees & UPI" },
                      { key: "exams", label: "Exams & Marksheets" },
                      { key: "homework", label: "Homework Diary" },
                      { key: "transport", label: "Live GPS Bus Tracking" },
                      { key: "cleanliness", label: "Campus Hygiene (4.9★)" },
                      { key: "notices", label: "Official Notice Push" },
                    ].map((mod) => (
                      <label key={mod.key} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#d1d5db", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={schoolForm.enabled_modules.includes(mod.key)}
                          onChange={() => toggleModule(mod.key)}
                          style={{ accentColor: "#c59dff" }}
                        />
                        <span>{mod.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Instant Simulated Payment */}
                <div style={{ background: "rgba(0, 110, 239, 0.12)", border: "1px solid rgba(0, 110, 239, 0.35)", borderRadius: "16px", padding: "18px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#60a5fa" }}>
                        💳 Instant Gateway Checkout: ₹{billingCycle === "ANNUAL" ? selectedPlan.annualPrice.toLocaleString() : selectedPlan.monthlyPrice.toLocaleString()}
                      </div>
                      <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                        Instant webhook simulation via UPI QR / Razorpay gateway
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 800, background: "#10b981", color: "#07070a", padding: "4px 10px", borderRadius: "12px" }}>
                        ✓ Ready to Provision
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button
                    onClick={() => setWizardStep(3)}
                    disabled={isSubmitting}
                    style={{ background: "rgba(255, 255, 255, 0.05)", border: "none", color: "#9ca3af", padding: "12px 24px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleRegisterSchool}
                    disabled={isSubmitting}
                    style={{
                      background: "linear-gradient(135deg, #c59dff 0%, #006eef 100%)",
                      color: "#07070a",
                      border: "none",
                      padding: "14px 36px",
                      borderRadius: "12px",
                      fontWeight: 900,
                      fontSize: "15px",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxShadow: "0 0 30px rgba(197, 157, 255, 0.4)",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Creating Database Tenant & Academic Year...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Provision School</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 5: PROVISIONING SUCCESS & INSTANT HANDOVER                           */}
            {/* ========================================================================= */}
            {wizardStep === 5 && createdTenantData && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div
                  className="animate-pulse-scale"
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    boxShadow: "0 0 40px rgba(16, 185, 129, 0.4)",
                    marginBottom: "16px",
                  }}
                >
                  <CheckCircle2 size={40} />
                </div>

                <div style={{ fontSize: "12px", fontWeight: 900, letterSpacing: "0.08em", color: "#10b981", marginBottom: "6px" }}>
                  SUPER ADMIN LEVEL PROVISIONING COMPLETED
                </div>

                <h2 style={{ fontSize: "30px", fontWeight: 900, margin: "0 0 8px 0" }}>
                  School Registered & Provisioned Successfully!
                </h2>

                <p style={{ color: "#9ca3af", fontSize: "14.5px", maxWidth: "560px", margin: "0 auto 24px auto" }}>
                  Your school database tenant, compliance certificates, academic year, and administrator credentials have been created!
                </p>

                {/* THE OFFICIAL CREDENTIALS & HANDOVER CARD */}
                <div
                  className="animate-border-glow"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "2px solid #c59dff",
                    borderRadius: "20px",
                    padding: "24px",
                    textAlign: "left",
                    marginBottom: "24px",
                    boxShadow: "0 0 40px rgba(197, 157, 255, 0.2)",
                  }}
                >
                  {/* School Badge with Uploaded Logo */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "16px", marginBottom: "18px" }}>
                    <img
                      src={createdTenantData.data.logoUrl || schoolForm.logo_url}
                      alt="School Logo"
                      style={{ width: "56px", height: "56px", borderRadius: "14px", objectFit: "cover", border: "2px solid #c59dff" }}
                    />
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff" }}>
                        {createdTenantData.data.schoolName}
                      </div>
                      <div style={{ fontSize: "12.5px", color: "#c59dff", fontWeight: 700 }}>
                        {createdTenantData.data.plan.name} • {createdTenantData.data.plan.studentLimit} Students Quota • {schoolForm.affiliation_number}
                      </div>
                    </div>
                  </div>

                  {/* 1. Dedicated Portal URL */}
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ fontSize: "11.5px", color: "#9ca3af", fontWeight: 800, marginBottom: "4px" }}>
                      🔗 YOUR DEDICATED SCHOOL URL:
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0, 0, 0, 0.5)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "10px", padding: "10px 14px" }}>
                      <span style={{ fontSize: "13.5px", color: "#60a5fa", fontWeight: 700, fontFamily: "monospace" }}>
                        {createdTenantData.data.dedicatedUrl}
                      </span>
                      <button
                        onClick={() => copyToClipboard(createdTenantData.data.dedicatedUrl, "url")}
                        style={{ background: "transparent", border: "none", color: copiedField === "url" ? "#10b981" : "#c59dff", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 700 }}
                      >
                        {copiedField === "url" ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedField === "url" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. School Code & ID */}
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ fontSize: "11.5px", color: "#9ca3af", fontWeight: 800, marginBottom: "4px" }}>
                      🆔 SCHOOL TENANT CODE:
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0, 0, 0, 0.5)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "10px", padding: "10px 14px" }}>
                      <span style={{ fontSize: "15px", color: "#ffffff", fontWeight: 900, letterSpacing: "0.06em", fontFamily: "monospace" }}>
                        {createdTenantData.data.schoolCode}
                      </span>
                      <button
                        onClick={() => copyToClipboard(createdTenantData.data.schoolCode, "code")}
                        style={{ background: "transparent", border: "none", color: copiedField === "code" ? "#10b981" : "#c59dff", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 700 }}
                      >
                        {copiedField === "code" ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedField === "code" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Admin Login ID & Password */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "11.5px", color: "#9ca3af", fontWeight: 800, marginBottom: "4px" }}>
                        📧 ADMIN LOGIN ID:
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0, 0, 0, 0.5)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "10px", padding: "10px 12px" }}>
                        <span style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700 }}>
                          {createdTenantData.data.adminCredentials.email}
                        </span>
                        <button
                          onClick={() => copyToClipboard(createdTenantData.data.adminCredentials.email, "email")}
                          style={{ background: "transparent", border: "none", color: copiedField === "email" ? "#10b981" : "#c59dff", cursor: "pointer" }}
                        >
                          {copiedField === "email" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "11.5px", color: "#9ca3af", fontWeight: 800, marginBottom: "4px" }}>
                        🔑 PASSWORD:
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0, 0, 0, 0.5)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "10px", padding: "10px 12px" }}>
                        <span style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, fontFamily: "monospace" }}>
                          {createdTenantData.data.adminCredentials.password}
                        </span>
                        <button
                          onClick={() => copyToClipboard(createdTenantData.data.adminCredentials.password, "pass")}
                          style={{ background: "transparent", border: "none", color: copiedField === "pass" ? "#10b981" : "#c59dff", cursor: "pointer" }}
                        >
                          {copiedField === "pass" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant Actions */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      if (createdTenantData.token) {
                        onInstantLoginSuccess(
                          createdTenantData.token,
                          createdTenantData.user,
                          createdTenantData.institute
                        );
                      } else {
                        onNavigateToLogin("admin");
                      }
                    }}
                    style={{
                      background: "linear-gradient(135deg, #c59dff 0%, #006eef 100%)",
                      color: "#07070a",
                      border: "none",
                      padding: "15px 36px",
                      borderRadius: "14px",
                      fontWeight: 900,
                      fontSize: "16px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxShadow: "0 0 35px rgba(197, 157, 255, 0.4)",
                    }}
                  >
                    <span>🚀 Launch School Admin Panel Now</span>
                    <ArrowRight size={18} />
                  </button>

                  <button
                    onClick={() => window.print()}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                      padding: "15px 24px",
                      borderRadius: "14px",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Download size={16} />
                    <span>Download / Print Credentials</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
