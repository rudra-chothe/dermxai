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
    <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-white via-gray-50 to-blue-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-dermx-soft-blue to-dermx-soft-purple rounded-full opacity-20 animate-float-slow"></div>
        <div className="absolute top-20 -left-20 w-60 h-60 bg-gradient-to-br from-dermx-soft-purple to-dermx-lavender rounded-full opacity-15 animate-float-reverse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-dermx-teal to-dermx-glow-blue rounded-full opacity-20 animate-float-fast"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="text-gray-900">Democratizing Dermatological</span>
            <br />
            <span className="text-dermx-teal">Care Through AI Innovation</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed mb-12">
            Making professional-grade skin health analysis accessible to
            everyone, everywhere
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-dermx-teal hover:bg-dermx-teal/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Your Journey
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-dermx-teal text-dermx-teal hover:bg-dermx-teal hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                      >
              <Link to="/how-it-works">
              Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Mission Section
const MissionSection = () => {
  const missionRef = useRef(null);
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

    if (missionRef.current) {
      observer.observe(missionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="mission" className="py-20 bg-white" ref={missionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Breaking down barriers to dermatological care and making world-class
            skin health analysis accessible to everyone
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`space-y-6 ${
              isVisible ? "animate-fade-in-left" : "opacity-0 translate-x-20"
            }`}
          >
            <div className="text-6xl mb-6">🌍</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Global Healthcare Accessibility
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              In a world where over{" "}
              <strong>
                2 billion people lack access to specialized dermatological care
              </strong>
              , DermX-AI stands as a beacon of hope. Our mission is to
              democratize skin health by putting the power of advanced AI-driven
              dermatological analysis directly into the hands of those who need
              it most.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe that{" "}
              <strong>
                geographic location, economic status, or healthcare
                infrastructure should never determine the quality of skin health
                care
              </strong>{" "}
              a person receives. Through cutting-edge artificial intelligence,
              we're making world-class dermatological expertise available 24/7,
              anywhere in the world.
            </p>
          </div>
          <div
            className={`${
              isVisible ? "animate-fade-in-right" : "opacity-0 translate-x-20"
            }`}
          >
            <Card className="p-8 bg-gradient-to-br from-dermx-teal/10 to-dermx-purple/10 border-0 shadow-xl">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-dermx-teal to-dermx-purple rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                    🎯
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    Our Goal
                  </h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-dermx-teal rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      Universal access to professional skin analysis
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-dermx-teal rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      Early detection for everyone, everywhere
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-dermx-teal rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      Breaking down healthcare barriers
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-dermx-teal rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      AI-powered healthcare equity
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

// Vision Section
const VisionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Vision
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Transforming healthcare through technology and innovation
          </p>
        </div>

        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🚀</div>
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            "A world where early skin disease detection and prevention is
            accessible to every human being"
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              icon: "🔍",
              title: "Early Detection is Universal",
              description:
                "Every person has access to professional-grade skin analysis",
            },
            {
              icon: "🛡️",
              title: "Prevention is Prioritized",
              description: "Proactive skin health management becomes the norm",
            },
            {
              icon: "⚖️",
              title: "Healthcare is Equitable",
              description:
                "Quality dermatological care isn't limited by geography or resources",
            },
            {
              icon: "🤝",
              title: "AI Augments Human Expertise",
              description:
                "Technology empowers dermatologists to serve more patients better",
            },
            {
              icon: "🔒",
              title: "Privacy is Paramount",
              description:
                "Advanced healthcare AI operates with complete data privacy and security",
            },
          ].map((vision, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 bg-white border-0 shadow-lg"
            >
              <div className="text-4xl mb-4">{vision.icon}</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                {vision.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {vision.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Values Section
const ValuesSection = () => {
  const [activeTab, setActiveTab] = useState("accuracy");

  const values = {
    accuracy: {
      icon: "🎯",
      title: "Accuracy Above All",
      description: "Medical-grade precision with continuous improvement",
      points: [
        "Medical-Grade Precision - Our AI models achieve 95%+ accuracy, matching dermatologist-level diagnosis",
        "Continuous Improvement - We constantly refine our algorithms using the latest research and clinical data",
        "Transparent Limitations - We clearly communicate what our AI can and cannot do",
        "Evidence-Based Approach - Every feature is backed by peer-reviewed dermatological research",
      ],
    },
    trust: {
      icon: "🤝",
      title: "Trust & Transparency",
      description: "Open communication and clinical validation",
      points: [
        "Open Communication - Clear, honest information about AI capabilities and limitations",
        "Clinical Validation - All diagnoses include confidence scores and alternative possibilities",
        "Professional Standards - Adhering to the highest medical and ethical standards",
        "User Education - Empowering users with knowledge about their skin health",
      ],
    },
    privacy: {
      icon: "🔒",
      title: "Privacy & Security",
      description: "Data protection and user control",
      points: [
        "Data Protection First - Your images and health data are processed securely and never stored",
        "HIPAA Compliance - Meeting the strictest healthcare privacy standards",
        "User Control - You own your data and control how it's used",
        "Encrypted Everything - End-to-end encryption for all data transmission",
      ],
    },
    innovation: {
      icon: "🌟",
      title: "Innovation with Purpose",
      description: "Cutting-edge technology for human benefit",
      points: [
        "Cutting-Edge Technology - Leveraging the latest advances in AI and deep learning",
        "Human-Centered Design - Technology that serves people, not the other way around",
        "Sustainable Impact - Building solutions that create lasting positive change",
        "Research Partnership - Collaborating with medical institutions to advance dermatological AI",
      ],
    },
    accessibility: {
      icon: "♿",
      title: "Inclusive Accessibility",
      description: "Universal design and cultural sensitivity",
      points: [
        "Universal Design - Creating interfaces usable by people of all abilities",
        "Cultural Sensitivity - Training AI on diverse populations and skin types",
        "Economic Accessibility - Keeping essential features free and affordable",
        "Educational Focus - Promoting skin health awareness and prevention",
      ],
    },
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Values
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Core principles that drive our mission and shape our technology
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-12">
            <TabsTrigger value="accuracy" className="text-sm py-3">
              🎯 Accuracy
            </TabsTrigger>
            <TabsTrigger value="trust" className="text-sm py-3">
              🤝 Trust
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-sm py-3">
              🔒 Privacy
            </TabsTrigger>
            <TabsTrigger value="innovation" className="text-sm py-3">
              🌟 Innovation
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="text-sm py-3">
              ♿ Accessibility
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{values[activeTab].icon}</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {values[activeTab].title}
              </h3>
              <p className="text-xl text-gray-600">
                {values[activeTab].description}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {values[activeTab].points.map((point, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transform hover:scale-105 transition-all duration-500 bg-white border-0 shadow-md"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-dermx-teal rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">{point}</p>
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

// Impact Section
const ImpactSection = () => {
  const impactRef = useRef(null);
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

    if (impactRef.current) {
      observer.observe(impactRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const impactAreas = [
    {
      title: "For Patients",
      icon: "👥",
      color: "from-blue-500 to-cyan-500",
      benefits: [
        "Early Detection Saves Lives - Catching skin conditions before they become serious",
        "Reduced Healthcare Anxiety - Instant access to professional-grade analysis",
        "Educational Empowerment - Learning about skin health and prevention",
        "Time & Cost Savings - Avoiding unnecessary doctor visits for minor concerns",
        "Peace of Mind - Quick answers to skin health questions anytime, anywhere",
      ],
    },
    {
      title: "For Healthcare Professionals",
      icon: "👨‍⚕️",
      color: "from-green-500 to-emerald-500",
      benefits: [
        "Enhanced Diagnostic Accuracy - AI assistance reduces diagnostic errors",
        "Streamlined Workflows - Automated report generation saves valuable time",
        "Extended Reach - Serve more patients with AI-augmented practice",
        "Decision Support - Additional insights for complex or borderline cases",
        "Continuing Education - Access to latest dermatological research and patterns",
      ],
    },
    {
      title: "For Underserved Communities",
      icon: "🌍",
      color: "from-purple-500 to-pink-500",
      benefits: [
        "Healthcare Access - Bringing dermatological expertise to remote and rural areas",
        "Language Barriers Removed - Multi-language support for diverse populations",
        "Economic Relief - Reducing the financial burden of specialist consultations",
        "Community Health - Population-level insights for public health initiatives",
      ],
    },
  ];

  return (
    <section
      id="impact"
      className="py-20 bg-gradient-to-b from-purple-50 to-white"
      ref={impactRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming lives through technology and innovation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {impactAreas.map((area, index) => (
            <Card
              key={index}
              className={`p-8 hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-700 bg-white border-0 shadow-lg ${
                isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-20"
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-center mb-6">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}
                >
                  {area.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {area.title}
                </h3>
              </div>
              <div className="space-y-3">
                {area.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-dermx-teal rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {benefit}
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

// Team Section
const TeamSection = () => {
  const teamMembers = [
    {
      name: "Pranav Sanjay Nanegaonkar",
      role: "Team Leader & AI Architecture",
      category: "Student Research Team",
    },
    {
      name: "Aryan Ramchandra Mhetre",
      role: "Deep Learning & Model Development",
      category: "Student Research Team",
    },
    {
      name: "Rudra Rahul Chothe",
      role: "Backend Systems & API Development",
      category: "Student Research Team",
    },
    {
      name: "Vedika Mahendra Patil",
      role: "Frontend Development & UX Design",
      category: "Student Research Team",
    },
    {
      name: "Dr. P. B. Desai",
      role: "Project Guide & Medical AI Expert",
      category: "Academic Guidance",
    },
    {
      name: "Dr. S. S. Patil",
      role: "Head of Department, CSE-AIML",
      category: "Academic Guidance",
    },
    {
      name: "Mrs. S. P. Kakade",
      role: "Project In-charge & Technical Supervisor",
      category: "Academic Guidance",
    },
  ];

  const categories = ["Student Research Team", "Academic Guidance"];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Passionate innovators in healthcare AI from Rajarambapu Institute of
            Technology
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {category}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers
                  .filter((member) => member.category === category)
                  .map((member, index) => (
                    <Card
                      key={index}
                      className="p-6 text-center hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 bg-white border-0 shadow-lg"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-dermx-teal to-dermx-purple rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {member.name}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {member.role}
                      </p>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-br from-dermx-teal/10 to-dermx-purple/10 border-0 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Medical Advisory Board (Planned)
            </h3>
            <p className="text-gray-600 mb-4">
              We're building partnerships with board-certified dermatologists,
              medical AI researchers, digital health experts, and patient
              advocacy representatives.
            </p>
            <Button className="bg-dermx-teal hover:bg-dermx-teal/90 text-white">
              Join Our Advisory Board
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Commitment Section
const CommitmentSection = () => {
  const commitments = [
    {
      title: "To Patients",
      icon: "👥",
      promises: [
        "Never Replace Your Doctor - We supplement, never substitute professional medical care",
        "Always Transparent - Clear about AI limitations and when to seek human expertise",
        "Continuously Improving - Regular updates to enhance accuracy and features",
        "Privacy Protected - Your health data remains private and secure always",
      ],
    },
    {
      title: "To Healthcare Professionals",
      icon: "👨‍⚕️",
      promises: [
        "Evidence-Based Tools - All recommendations backed by peer-reviewed research",
        "Workflow Integration - Seamless fit into existing clinical practices",
        "Professional Standards - Meeting the highest medical and ethical standards",
        "Collaborative Development - Building features based on real clinical needs",
      ],
    },
    {
      title: "To the Global Community",
      icon: "🌍",
      promises: [
        "Open Research - Contributing to dermatological AI research and knowledge",
        "Sustainable Development - Building technology that serves humanity long-term",
        "Educational Mission - Promoting skin health awareness and prevention globally",
        "Digital Equity - Ensuring technology benefits reach underserved populations",
      ],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Commitment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Promises we make to our users and the world
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {commitments.map((commitment, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-700 bg-white border-0 shadow-lg"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{commitment.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {commitment.title}
                </h3>
              </div>
              <div className="space-y-3">
                {commitment.promises.map((promise, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-dermx-teal rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {promise}
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
            Join Our Mission
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Be part of the healthcare AI revolution that's making dermatological
            care accessible to everyone
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link to="/signup">
              <Button
                size="lg"
                className="w-full bg-white text-dermx-teal hover:bg-gray-100 px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                For Patients
              </Button>
            </Link>
            <Link to="/login" state={{ from: { pathname: "/diagnose" } }}>
              <Button
                size="lg"
                className="w-full bg-white text-dermx-teal hover:bg-gray-100 px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                For Healthcare
              </Button>
            </Link>
            <Link to="/features">
              <Button
                size="lg"
                className="w-full bg-white text-dermx-teal hover:bg-gray-100 px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                For Researchers
              </Button>
            </Link>
            <Link to="/about">
              <Button
                size="lg"
                className="w-full bg-white text-dermx-teal hover:bg-gray-100 px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                For Investors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Story Section
const StorySection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Story
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Born from real healthcare challenges at Rajarambapu Institute of
            Technology
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="text-6xl mb-6">🌱</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Born from Real Healthcare Challenges
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              DermX-AI was born from a simple yet powerful observation:{" "}
              <strong>
                too many people suffer from preventable skin conditions due to
                lack of access to dermatological care.
              </strong>
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our founding team, led by computer science students at Rajarambapu
              Institute of Technology, witnessed firsthand how delayed diagnosis
              and limited access to specialists led to worsened outcomes for
              patients. We saw how artificial intelligence could bridge this
              gap, providing instant, accurate analysis to anyone with a
              smartphone camera.
            </p>
          </div>

          <div>
            <Card className="p-8 bg-gradient-to-br from-dermx-teal/10 to-dermx-purple/10 border-0 shadow-xl">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Our Journey
              </h4>
              <div className="space-y-4">
                {[
                  {
                    phase: "Research Phase (2024)",
                    description:
                      "Extensive literature review and technology assessment",
                  },
                  {
                    phase: "Development Phase (2024-2025)",
                    description: "Building and training advanced AI models",
                  },
                  {
                    phase: "Clinical Validation",
                    description:
                      "Testing with real patient data and dermatologist feedback",
                  },
                  {
                    phase: "Community Beta",
                    description:
                      "Working with healthcare professionals to refine the platform",
                  },
                  {
                    phase: "Global Launch",
                    description:
                      "Making dermatological AI accessible worldwide",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-dermx-teal rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900">{step.phase}</h5>
                      <p className="text-gray-600 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const contactInfo = [
    {
      title: "Research Partnerships",
      email: "research@dermx-ai.com",
      description: "Medical institutions interested in AI collaboration",
      icon: "🔬",
    },
    {
      title: "Clinical Integration",
      email: "clinical@dermx-ai.com",
      description: "Hospitals and clinics wanting to pilot AI assistance",
      icon: "🏥",
    },
    {
      title: "Technology Partnerships",
      email: "partnerships@dermx-ai.com",
      description: "AI and cloud infrastructure providers",
      icon: "🔌",
    },
    {
      title: "Media & Press",
      email: "press@dermx-ai.com",
      description: "Journalists and media inquiries",
      icon: "📰",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Contact & Partnerships
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Let's build the future of dermatological care together
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 bg-white border-0 shadow-lg"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-dermx-teal to-dermx-purple rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                  {info.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{info.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-dermx-teal font-semibold">
                      Email:
                    </span>
                    <a
                      href={`mailto:${info.email}`}
                      className="text-dermx-teal hover:underline"
                    >
                      {info.email}
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="p-8 bg-gradient-to-br from-dermx-teal/10 to-dermx-purple/10 border-0 shadow-xl">
            <p className="text-gray-600 italic text-lg">
              DermX-AI is developed at Rajarambapu Institute of Technology,
              Rajaramnagar, as part of our commitment to advancing healthcare
              through artificial intelligence innovation.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Main Mission component
const Mission = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <MissionSection />
      <VisionSection />
      <ValuesSection />
      <ImpactSection />
      {/* <TeamSection /> */}
      <StorySection />
      <CommitmentSection />
      <CTASection />
      {/* <ContactSection /> */}
    </div>
  );
};

export default Mission;
