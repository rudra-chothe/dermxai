"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

// Hero Section matching the exact design from the image
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-blue-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-dermx-soft-blue to-dermx-soft-purple rounded-full opacity-20 animate-float-slow"></div>
        <div className="absolute top-20 -left-20 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-br from-dermx-soft-purple to-dermx-lavender rounded-full opacity-15 animate-float-reverse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-br from-dermx-teal to-dermx-glow-blue rounded-full opacity-20 animate-float-fast"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text and CTA */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Main Title */}
            <div className="space-y-6 sm:space-y-15">
              <h1 className="text-3xl sm:text-7xl md:text-7xl lg:text-6xl font-bold leading-tight gap-8 sm:gap-15">
                <span className="text-gray-900 font-bold w-full text-3xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl mb-4 sm:mb-10">
                  AI-Powered
                </span>
                <br />
                <span className="text-dermx-teal relative w-full h-2 sm:h-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 sm:mb-10">
                  Dermatology
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-dermx-purple to-dermx-teal rounded-full mt-4 sm:mt-10"></div>
                </span>
                <br />
                <span className="text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-4 sm:mt-10">
                  Analysis
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Revolutionary AI technology that provides instant, accurate
              dermatological analysis. Upload your skin concerns and receive
              professional-grade insights powered by advanced machine learning.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-dermx-teal hover:bg-dermx-teal/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link to="/login">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-dermx-teal text-dermx-teal hover:bg-dermx-teal hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Link to="/how-it-works">Explore Knowledge</Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Medical Consultation Image */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-700 animate-float-slow">
              <img
                src="/hero-medical.png"
                alt="AI-powered dermatology analysis"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-600/20 to-transparent hover:from-teal-600/30 transition-all duration-300"></div>
            </div>

            {/* Glowing Background */}
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-400 to-purple-400 rounded-2xl blur-2xl opacity-20 -z-10 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section
function FeaturesSection() {
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

  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 017.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: "AI Diagnosis",
      description:
        "Advanced machine learning algorithms analyze skin conditions with medical-grade accuracy and provide instant results.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 001.414 0l-.548-.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: "Detailed Reports",
      description:
        "Comprehensive analysis reports with treatment recommendations, risk assessments, and follow-up guidance.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 01-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Clinical Q&A",
      description:
        "Interactive consultation system that answers your dermatology questions with evidence-based responses.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Document Analysis",
      description:
        "Upload and analyze existing medical reports, lab results, and dermatological documentation for insights.",
    },
  ];

  return (
    <section
      id="features"
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-purple-50"
      ref={featuresRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Advanced Features
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Cutting-edge AI technology meets medical expertise to deliver
            unprecedented dermatological analysis capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`p-4 sm:p-6 text-center hover:shadow-2xl transform hover:-translate-y-2 sm:hover:-translate-y-6 hover:rotate-2 transition-all duration-700 bg-white border-0 shadow-lg group cursor-pointer magnetic-hover hover:scale-105 hover:bg-gradient-to-br hover:from-white hover:to-teal-40 ${
                isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-20"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-teal-500/50 group-hover:bg-gradient-to-br group-hover:from-teal-100 group-hover:to-teal-200">
                <div className="group-hover:animate-bounce">{feature.icon}</div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-all duration-500 group-hover:scale-110">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-all duration-300">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400/0 to-purple-400/0 group-hover:from-teal-400/5 group-hover:to-purple-400/5 transition-all duration-700 pointer-events-none"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const sectionRef = useRef(null);
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: "1",
      title: "Upload",
      description:
        "Securely upload high-quality images of your skin concern using our HIPAA-compliant platform.",
    },
    {
      number: "2",
      title: "Analyze",
      description:
        "Our advanced AI algorithms process your images using deep learning models trained on millions of dermatological cases.",
    },
    {
      number: "3",
      title: "Review",
      description:
        "Receive comprehensive analysis results with treatment recommendations and guidance for next steps.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 lg:py-20 bg-white"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Get professional dermatological insights in three simple steps with
            our streamlined AI-powered analysis process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className={`p-6 sm:p-8 text-center hover:shadow-2xl transform hover:-translate-y-4 sm:hover:-translate-y-8 hover:scale-110 hover:rotate-1 transition-all duration-700 bg-white border-0 shadow-lg group cursor-pointer magnetic-hover hover:bg-gradient-to-br hover:from-white hover:to-purple-50 relative overflow-hidden ${
                isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-pink-400/0 to-purple-600/0 group-hover:from-purple-400/5 group-hover:via-pink-400/3 group-hover:to-purple-600/5 transition-all duration-700"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-lg sm:text-2xl font-bold shadow-lg group-hover:scale-125 group-hover:animate-pulse transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/50 group-hover:rotate-12">
                  <span className="group-hover:animate-bounce">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 group-hover:text-purple-600 transition-all duration-500 group-hover:scale-110">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-all duration-300">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-transparent group-hover:from-purple-600 transition-all duration-500"></div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-dermx-teal to-dermx-purple relative overflow-hidden">
      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 bg-white/20 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 sm:w-24 sm:h-24 bg-white/20 rounded-full animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 sm:w-20 sm:h-20 bg-white/20 rounded-full animate-float-fast"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Experience the Future of Dermatology?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-4">
            Join thousands of users who trust DermX-AI for accurate, instant
            skin analysis
          </p>
          <Button
            size="lg"
            className="bg-white text-dermx-teal hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Ready to Get Started?
          </Button>
        </div>
      </div>
    </section>
  );
};

// Animated Footer
const AnimatedFooter = () => {
  return (
    <footer className="relative bg-gray-50 py-16 sm:py-24 md:py-40 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="group">
          <div className="text-[2rem] xs:text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[12rem] 2xl:text-[16rem] font-bold text-gray-200/60 select-none leading-none whitespace-nowrap transform scale-75 xs:scale-90 sm:scale-100 transition-all duration-500 group-hover:animate-pulse">
            DermX AI
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Home component
const Home = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      {/* <AnimatedFooter /> */}
    </div>
  );
};

export default Home;
