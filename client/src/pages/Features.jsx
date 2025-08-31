"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

// Custom hook for smooth scrolling
const useSmoothScroll = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      document.documentElement.style.setProperty("--scroll-y", `${scrolled}px`);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-[50vh] flex items-center bg-gradient-to-br from-white via-gray-50 to-blue-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-dermx-soft-blue to-dermx-soft-purple rounded-full opacity-20 animate-float-slow"></div>
        <div className="absolute top-20 -left-20 w-60 h-60 bg-gradient-to-br from-dermx-soft-purple to-dermx-lavender rounded-full opacity-15 animate-float-reverse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-dermx-teal to-dermx-glow-blue rounded-full opacity-20 animate-float-fast"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="text-gray-900">Advanced AI-Powered</span>
            <br />
            <span className="text-dermx-teal">Skin Disease Detection</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed mb-12">
            Professional-grade dermatological analysis powered by cutting-edge
            deep learning technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-dermx-teal hover:bg-dermx-teal/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link to="/login" state={{ from: { pathname: "/diagnose" } }}>Try AI Analysis</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-dermx-teal text-dermx-teal hover:bg-dermx-teal hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              View Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Core Features Section
const CoreFeaturesSection = () => {
  const featuresRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const coreFeatures = [
    {
      icon: "🔬",
      title: "AI-Powered Disease Classification",
      subtitle: "Advanced EfficientNet Deep Learning Model",
      description:
        "95%+ diagnostic accuracy matching dermatologist-level precision with multi-class detection for 15+ skin conditions.",
      highlights: [
        "95%+ Diagnostic Accuracy",
        "Multi-Class Detection (15+ conditions)",
        "Real-Time Analysis (< 10 seconds)",
        "Confidence Scoring",
        "Multi-Angle Support",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "📋",
      title: "Automated Medical Reporting",
      subtitle: "Comprehensive Clinical Documentation",
      description:
        "Professional medical reports with detailed diagnostics, risk assessment, and instant PDF generation.",
      highlights: [
        "Detailed Diagnostic Reports",
        "Instant PDF Generation",
        "Medical Terminology",
        "Time-Stamped Analysis",
        "EMR System Compatible",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "🤖",
      title: "Intelligent Q&A System",
      subtitle: "RAG-Powered Medical Knowledge Base",
      description:
        "Interactive medical assistant with context-aware responses and evidence-based answers.",
      highlights: [
        "Interactive Medical Assistant",
        "Context-Aware Responses",
        "Evidence-Based Answers",
        "Treatment Guidance",
        "Multi-Language Support",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "🛡️",
      title: "Advanced Image Processing",
      subtitle: "Medical-Grade Image Enhancement",
      description:
        "Automatic enhancement with noise reduction, quality assessment, and multiple format support.",
      highlights: [
        "Automatic Enhancement",
        "Quality Assessment",
        "Multiple Format Support",
        "Secure Processing",
        "Batch Analysis",
      ],
      color: "from-orange-500 to-red-500",
    },
    {
      icon: "📊",
      title: "Clinical Decision Support",
      subtitle: "Evidence-Based Medical Assistance",
      description:
        "Risk stratification, treatment recommendations, and referral guidance for comprehensive care.",
      highlights: [
        "Risk Stratification",
        "Treatment Recommendations",
        "Referral Guidance",
        "Progress Tracking",
        "Clinical Alerts",
      ],
      color: "from-teal-500 to-blue-500",
    },
    {
      icon: "🔒",
      title: "Enterprise-Grade Security",
      subtitle: "Medical Data Protection Standards",
      description:
        "HIPAA and GDPR compliant with AES-256 encryption and zero data retention policies.",
      highlights: [
        "HIPAA Compliance",
        "GDPR Compliant",
        "AES-256 Encryption",
        "Zero Data Retention",
        "Multi-Factor Authentication",
      ],
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section id="core-features" className="py-20 bg-white" ref={featuresRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Core Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cutting-edge technology designed to provide professional-grade
            dermatological analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {coreFeatures.map((feature, index) => (
            <Card
              key={index}
              className={`p-8 hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-700 bg-white border-0 shadow-lg group cursor-pointer ${
                isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-20"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start space-x-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-all duration-500`}
                >
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-dermx-teal transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-dermx-teal font-semibold mb-3">
                    {feature.subtitle}
                  </p>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-dermx-teal rounded-full"></div>
                        <span className="text-sm text-gray-700">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Advanced Capabilities Section
const AdvancedCapabilitiesSection = () => {
  const [activeTab, setActiveTab] = useState("detection");

  const detectionModules = [
    {
      title: "Cancer Screening Module",
      icon: "🎯",
      features: [
        "Melanoma Detection - Advanced neural networks trained on dermoscopic images",
        "ABCDE Analysis - Automated assessment of Asymmetry, Border, Color, Diameter, Evolution",
        "Suspicious Lesion Flagging - Immediate alerts for potentially malignant conditions",
        "Comparison Analysis - Side-by-side evaluation of multiple moles or lesions",
      ],
    },
    {
      title: "Pediatric Dermatology",
      icon: "👶",
      features: [
        "Child-Safe Analysis - Specialized models for pediatric skin conditions",
        "Common Childhood Conditions - Eczema, diaper rash, birthmarks, viral exanthems",
        "Age-Appropriate Recommendations - Treatment suggestions suitable for children",
        "Parent-Friendly Reports - Easy-to-understand explanations for caregivers",
      ],
    },
    {
      title: "Chronic Condition Monitoring",
      icon: "📈",
      features: [
        "Progress Tracking - Monitor psoriasis, eczema, or acne improvement over time",
        "Flare-Up Prediction - AI identifies patterns that may indicate condition worsening",
        "Treatment Response - Assess effectiveness of current treatments",
        "Trigger Identification - Correlate condition changes with lifestyle factors",
      ],
    },
  ];

  const integrationFeatures = [
    {
      title: "Healthcare System Integration",
      icon: "🏥",
      features: [
        "EMR Compatibility - Direct integration with Epic, Cerner, and other major systems",
        "FHIR Support - Standard healthcare data exchange protocols",
        "Telehealth Integration - Seamless connection with telemedicine platforms",
        "Clinical Workflow - Fits naturally into existing dermatology practice workflows",
      ],
    },
    {
      title: "Research & Analytics",
      icon: "📊",
      features: [
        "Anonymized Data Insights - Contribute to dermatological research (with consent)",
        "Population Health Analytics - Trends and patterns in skin health data",
        "Treatment Outcome Tracking - Long-term follow-up on recommended treatments",
        "Clinical Decision Analytics - Insights for improving diagnostic accuracy",
      ],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Advanced Capabilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Specialized modules and integrations designed for comprehensive
            dermatological care
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-12">
            <TabsTrigger value="detection" className="text-lg py-4">
              Detection Modules
            </TabsTrigger>
            <TabsTrigger value="integration" className="text-lg py-4">
              Integration Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detection" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {detectionModules.map((module, index) => (
                <Card
                  key={index}
                  className="p-8 hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-700 bg-white border-0 shadow-lg"
                >
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-dermx-teal to-dermx-purple rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                      {module.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {module.title}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {module.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-dermx-teal rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="integration" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {integrationFeatures.map((integration, index) => (
                <Card
                  key={index}
                  className="p-8 hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-700 bg-white border-0 shadow-lg"
                >
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-dermx-purple to-dermx-teal rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                      {integration.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {integration.title}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {integration.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-dermx-purple rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

// Performance & Accessibility Section
const PerformanceSection = () => {
  const performanceMetrics = [
    {
      metric: "Sub-10 Second",
      label: "Analysis Time",
      icon: "⚡",
      color: "from-green-500 to-emerald-500",
    },
    {
      metric: "99.9%",
      label: "Uptime",
      icon: "🔄",
      color: "from-blue-500 to-cyan-500",
    },
    {
      metric: "100+",
      label: "Concurrent Users",
      icon: "👥",
      color: "from-purple-500 to-pink-500",
    },
    {
      metric: "WCAG 2.1 AA",
      label: "Accessibility",
      icon: "♿",
      color: "from-orange-500 to-red-500",
    },
  ];

  const accessibilityFeatures = [
    "Mobile-Responsive Design",
    "Touch-Friendly Interface",
    "High Contrast Mode",
    "Screen Reader Compatible",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Performance & Accessibility
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enterprise-ready infrastructure with inclusive design for all users
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Performance Metrics */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {performanceMetrics.map((metric, index) => (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-500 bg-white border-0 shadow-lg"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${metric.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg`}
                  >
                    {metric.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {metric.metric}
                  </div>
                  <div className="text-gray-600">{metric.label}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Accessibility Features */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Accessibility Features
            </h3>
            <div className="space-y-4">
              {accessibilityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                >
                  <div className="w-8 h-8 bg-dermx-teal rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Platform Availability Section
const PlatformSection = () => {
  const platforms = [
    {
      title: "Web Application",
      icon: "🌐",
      features: [
        "Desktop Browser - Full-featured experience on Windows, macOS, Linux",
        "Progressive Web App - Install on desktop or mobile for app-like experience",
        "Real-Time Sync - Access your analysis history across all devices",
      ],
      status: "Available Now",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Mobile Applications",
      icon: "📱",
      features: [
        "iOS App - Native iPhone and iPad application",
        "Android App - Optimized for Android smartphones and tablets",
        "Camera Integration - Direct photo capture with quality guidance",
        "Offline Mode - Core analysis features work without internet",
      ],
      status: "Coming Q2 2025",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "API & Integrations",
      icon: "🔌",
      features: [
        "RESTful API - For healthcare systems and third-party developers",
        "SDK Packages - Easy integration for mobile app developers",
        "Webhook Support - Real-time notifications for system integrations",
        "White-Label Solutions - Custom branding for healthcare organizations",
      ],
      status: "Available Now",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Platform Availability
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access DermX-AI across all your devices and integrate with your
            existing systems
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-700 bg-white border-0 shadow-lg"
            >
              <div className="text-center mb-6">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}
                >
                  {platform.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {platform.title}
                </h3>
                <Badge
                  variant={
                    platform.status === "Available Now"
                      ? "default"
                      : "secondary"
                  }
                  className="text-sm"
                >
                  {platform.status}
                </Badge>
              </div>
              <div className="space-y-3">
                {platform.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-dermx-teal rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-dermx-teal to-dermx-purple relative overflow-hidden">
      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/20 rounded-full animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/20 rounded-full animate-float-fast"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Experience Advanced AI Dermatology?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join healthcare professionals and patients worldwide who trust
            DermX-AI for accurate, instant skin analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-dermx-teal hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link to="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Features component
const Features = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <CoreFeaturesSection />
      <AdvancedCapabilitiesSection />
      <PerformanceSection />
      <PlatformSection />
      <CTASection />
    </div>
  );
};

export default Features;
