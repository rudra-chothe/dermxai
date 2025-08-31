"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  Camera,
  Brain,
  FileText,
  MessageSquare,
  CheckCircle,
  Shield,
  Zap,
  Users,
  BookOpen,
  ArrowRight,
  Play,
  Download,
  Upload,
  Smartphone,
  Monitor,
  Database,
  Lock,
  Eye,
  Target,
  TrendingUp,
} from "lucide-react";

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
            <span className="text-gray-900">Advanced AI Dermatology</span>
            <br />
            <span className="text-dermx-teal">in 4 Simple Steps</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed mb-12">
            From photo to professional analysis in under 60 seconds
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/diagnose">
              <Button
                size="lg"
                className="bg-dermx-teal hover:bg-dermx-teal/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Analysis
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-dermx-teal text-dermx-teal hover:bg-dermx-teal hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Step Component
const StepCard = ({
  step,
  title,
  description,
  icon: Icon,
  children,
  isActive = false,
}) => {
  return (
    <Card
      className={`p-8 transition-all duration-500 hover:shadow-xl ${
        isActive ? "ring-2 ring-dermx-teal shadow-lg" : "hover:shadow-lg"
      }`}
    >
      <div className="flex items-start space-x-4 mb-6">
        <div
          className={`p-3 rounded-full ${
            isActive ? "bg-dermx-teal text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <Badge variant="secondary" className="mb-2">
            Step {step}
          </Badge>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </Card>
  );
};

// Step 1: Capture or Upload
const Step1Section = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StepCard
          step={1}
          title="Capture or Upload Your Image"
          description="Professional-Quality Photo Made Simple"
          icon={Camera}
          isActive={true}
        >
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Photo Capture Options
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-dermx-teal" />
                  <span className="text-gray-700">
                    Direct Camera Capture - Use your smartphone camera with
                    real-time quality guidance
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Upload className="w-5 h-5 text-dermx-teal" />
                  <span className="text-gray-700">
                    Upload from Device - Select existing photos from your
                    gallery or computer
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-dermx-teal" />
                  <span className="text-gray-700">
                    Batch Upload - Analyze multiple areas or track progress over
                    time
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-dermx-teal" />
                  <span className="text-gray-700">
                    Live Preview - See what the AI sees before taking the photo
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                AI-Powered Photo Assistance
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Real-Time Quality Check - Instant feedback on lighting,
                    focus, and composition
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-dermx-teal" />
                  <span className="text-gray-700">
                    Smart Framing Guide - Visual overlay to help position the
                    area of concern
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">
                    Lighting Optimization - Suggestions for better illumination
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-dermx-teal" />
                  <span className="text-gray-700">
                    Distance Guidance - Optimal camera distance recommendations
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Supported Formats & Specifications
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-2">
                  📋 Technical Requirements:
                </p>
                <ul className="space-y-1 text-gray-600">
                  <li>• File Formats: JPG, PNG, HEIC, RAW</li>
                  <li>• Maximum Size: 10MB per image</li>
                  <li>• Minimum Resolution: 720p (1280x720)</li>
                  <li>• Recommended: 1080p or higher</li>
                  <li>
                    • Aspect Ratio: Any (AI automatically crops and focuses)
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">
                  Quality Enhancement Features:
                </p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Automatic Enhancement - AI improves image quality</li>
                  <li>
                    • Color Correction - Ensures accurate color representation
                  </li>
                  <li>
                    • Noise Reduction - Removes grain and digital artifacts
                  </li>
                  <li>
                    • Smart Cropping - Automatically focuses on areas of
                    interest
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </StepCard>
      </div>
    </section>
  );
};

// Step 2: AI Analysis
const Step2Section = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StepCard
          step={2}
          title="Advanced AI Analysis"
          description="EfficientNet Deep Learning in Action"
          icon={Brain}
          isActive={true}
        >
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 bg-white rounded-xl border">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Stage 1: Image Preprocessing (2-3 seconds)
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>1. Image validation and format conversion</li>
                <li>2. Noise reduction and enhancement</li>
                <li>3. Color normalization for consistent analysis</li>
                <li>4. Resolution optimization for model input</li>
                <li>5. Quality assessment and scoring</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-xl border">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Stage 2: Deep Learning Classification (3-5 seconds)
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Base Model: EfficientNet-B7 (88M parameters)</li>
                <li>• Training Data: 100,000+ dermatological images</li>
                <li>• Accuracy: 95.3% on validation dataset</li>
                <li>• Speed: 4.2 seconds average analysis time</li>
                <li>• Conditions Detected: 15+ skin condition categories</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-xl border">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Stage 3: Confidence Scoring (1-2 seconds)
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Model certainty assessment</li>
                <li>• Alternative condition probabilities</li>
                <li>• Risk level classification</li>
                <li>• Urgency score determination</li>
                <li>• Quality-adjusted confidence rating</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Visual Pattern Recognition
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-dermx-teal rounded-full"></div>
                  <span className="text-gray-700">
                    Color Patterns - Pigmentation, redness, discoloration
                    analysis
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-dermx-teal rounded-full"></div>
                  <span className="text-gray-700">
                    Texture Analysis - Surface roughness, scaling, smoothness
                    assessment
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-dermx-teal rounded-full"></div>
                  <span className="text-gray-700">
                    Shape & Size - Lesion geometry, asymmetry detection
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-dermx-teal rounded-full"></div>
                  <span className="text-gray-700">
                    Border Analysis - Edge definition, irregularity assessment
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Clinical Feature Detection
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">
                    Inflammatory Markers - Redness, swelling, heat patterns
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">
                    Scaling & Texture - Dry skin, flaking, rough patches
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">
                    Pigmentation Changes - Hyperpigmentation, hypopigmentation
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">
                    Vascular Patterns - Blood vessel visibility and patterns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </StepCard>
      </div>
    </section>
  );
};

// Step 3: Report Generation
const Step3Section = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StepCard
          step={3}
          title="Comprehensive Report Generation"
          description="Medical-Grade Documentation with RAG Technology"
          icon={FileText}
          isActive={true}
        >
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Primary Diagnosis Section
              </h4>
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Primary Condition:</span>
                  <span className="text-gray-600">Most likely diagnosis</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Confidence Score:</span>
                  <span className="text-gray-600">AI certainty percentage</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Risk Level:</span>
                  <span className="text-gray-600">
                    Low/Moderate/High classification
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Severity Assessment:</span>
                  <span className="text-gray-600">
                    Mild/Moderate/Severe rating
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Alternative Conditions
              </h4>
              <div className="space-y-3 p-4 bg-yellow-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Secondary possibilities:</span>
                  <span className="text-gray-600">With probabilities</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Similar conditions:</span>
                  <span className="text-gray-600">To consider</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Distinguishing factors:</span>
                  <span className="text-gray-600">For each condition</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              RAG-Enhanced Knowledge Integration
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-700 mb-3">
                  Real-Time Medical Literature
                </h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Clinical Guidelines - Latest treatment protocols</li>
                  <li>
                    • Research Papers - Recent studies relevant to condition
                  </li>
                  <li>
                    • Treatment Options - Evidence-based therapy suggestions
                  </li>
                  <li>
                    • Epidemiological Data - Population statistics and
                    prevalence
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-3">
                  Contextual Information Retrieval
                </h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>1. Query medical knowledge database</li>
                  <li>2. Retrieve relevant clinical information</li>
                  <li>3. Contextualize findings to specific case</li>
                  <li>4. Generate evidence-based recommendations</li>
                  <li>5. Cite sources and confidence levels</li>
                </ul>
              </div>
            </div>
          </div>
        </StepCard>
      </div>
    </section>
  );
};

// Step 4: Interactive Q&A
const Step4Section = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StepCard
          step={4}
          title="Interactive Q&A and Prevention Guidance"
          description="Personalized Healthcare Assistant"
          icon={MessageSquare}
          isActive={true}
        >
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Intelligent Question Answering
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-dermx-teal" />
                  <span className="text-gray-700">
                    Conversational Interface - Ask questions in plain English
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-dermx-teal" />
                  <span className="text-gray-700">
                    Context Awareness - AI remembers your specific analysis
                    results
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-dermx-teal" />
                  <span className="text-gray-700">
                    Medical Knowledge Base - Access to comprehensive
                    dermatological information
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-dermx-teal" />
                  <span className="text-gray-700">
                    Multi-Language Support - Available in English, Hindi, and
                    Marathi
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Common Question Categories
              </h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-white rounded-lg border">
                  <span className="text-gray-700">
                    "What caused this condition?"
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <span className="text-gray-700">"How serious is this?"</span>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <span className="text-gray-700">
                    "What treatments are available?"
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <span className="text-gray-700">
                    "How can I prevent it from getting worse?"
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <span className="text-gray-700">
                    "When should I see a doctor?"
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl border">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Immediate Care (24-48 hours)
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Symptom management strategies</li>
                <li>• Over-the-counter treatment options</li>
                <li>• Lifestyle modifications to implement immediately</li>
                <li>• Warning signs to watch for</li>
                <li>• When to seek emergency care</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-xl border">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Short-Term Management (1-4 weeks)
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Daily skincare routine recommendations</li>
                <li>• Product suggestions and ingredients to avoid</li>
                <li>• Dietary considerations and anti-inflammatory foods</li>
                <li>• Environmental factor modifications</li>
                <li>• Progress monitoring guidelines</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-xl border">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Long-Term Prevention (1-6 months)
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Comprehensive lifestyle optimization</li>
                <li>• Stress management techniques</li>
                <li>• Nutritional support strategies</li>
                <li>• Exercise and wellness recommendations</li>
                <li>• Regular monitoring and check-up schedule</li>
              </ul>
            </div>
          </div>
        </StepCard>
      </div>
    </section>
  );
};

// Technology Deep Dive Section
const TechnologySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Advanced Technology Deep Dive
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            The cutting-edge science behind DermX-AI's exceptional performance
          </p>
        </div>

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="ai">AI Architecture</TabsTrigger>
            <TabsTrigger value="rag">RAG System</TabsTrigger>
            <TabsTrigger value="security">Security & Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-8">
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                EfficientNet-B7 Model
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Model Specifications
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>
                      • Architecture: Compound scaling with depth, width, and
                      resolution
                    </li>
                    <li>• Parameters: 88 million trainable parameters</li>
                    <li>
                      • Training Data: 100,000+ clinically validated images
                    </li>
                    <li>• Validation Accuracy: 95.3%</li>
                    <li>• Processing Speed: 4.2 seconds average</li>
                    <li>• Memory Usage: 2.4GB GPU memory</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Training Process
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>
                      1. Data Collection: Curated dermatological image datasets
                    </li>
                    <li>
                      2. Data Augmentation: Rotation, scaling, color adjustment
                    </li>
                    <li>
                      3. Transfer Learning: Pre-trained on ImageNet, fine-tuned
                      on medical data
                    </li>
                    <li>
                      4. Cross-Validation: 5-fold validation for robust
                      performance
                    </li>
                    <li>
                      5. Clinical Validation: Testing with practicing
                      dermatologists
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rag" className="space-y-8">
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                RAG (Retrieval-Augmented Generation) System
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Knowledge Base Sources
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Clinical Practice Guidelines (AAD, BAD, EADV)</li>
                    <li>• Peer-Reviewed Research Papers (PubMed, Cochrane)</li>
                    <li>• Dermatology Textbooks and References</li>
                    <li>• Treatment Protocols and Drug Information</li>
                    <li>• Case Studies and Clinical Experiences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Information Retrieval Process
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>1. Query Analysis: Understanding user questions</li>
                    <li>
                      2. Semantic Search: Finding relevant medical information
                    </li>
                    <li>
                      3. Context Ranking: Prioritizing most applicable sources
                    </li>
                    <li>
                      4. Response Generation: Creating coherent, accurate
                      answers
                    </li>
                    <li>
                      5. Source Citation: Providing references for all claims
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-8">
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Security & Privacy Architecture
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Data Protection Measures
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>
                      • Encryption: AES-256 for data in transit and at rest
                    </li>
                    <li>
                      • Authentication: Multi-factor authentication for
                      professionals
                    </li>
                    <li>
                      • Access Control: Role-based permissions
                      (patient/doctor/admin)
                    </li>
                    <li>
                      • Audit Logging: Complete activity tracking and monitoring
                    </li>
                    <li>
                      • Compliance: HIPAA, GDPR, and SOC 2 Type II certified
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Privacy-First Design
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>
                      • Zero Data Retention: Images deleted immediately after
                      analysis
                    </li>
                    <li>• Local Processing: Option for on-device analysis</li>
                    <li>
                      • Anonymized Analytics: No personally identifiable
                      information stored
                    </li>
                    <li>
                      • User Control: Complete data ownership and deletion
                      rights
                    </li>
                    <li>
                      • Transparent Policies: Clear, readable privacy
                      documentation
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

// Quality Assurance Section
const QualityAssuranceSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Quality Assurance
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Ensuring medical-grade reliability through continuous validation and
            safety measures
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Continuous Model Validation
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-dermx-teal" />
                <span className="text-gray-700">
                  Performance Monitoring - Real-time accuracy tracking and
                  alerts
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-dermx-teal" />
                <span className="text-gray-700">
                  Regular Retraining - Monthly model updates with new clinical
                  data
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-dermx-teal" />
                <span className="text-gray-700">
                  Expert Review - Ongoing validation by practicing
                  dermatologists
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-dermx-teal" />
                <span className="text-gray-700">
                  Outcome Tracking - Long-term follow-up on AI recommendations
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-dermx-teal" />
                <span className="text-gray-700">
                  Bias Detection - Ensuring fair performance across all
                  demographics
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Clinical Safety Measures
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">
                  High-Risk Flagging - Immediate alerts for potentially serious
                  conditions
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">
                  Automatic Referrals - Clear guidance on when to seek immediate
                  medical care
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700">
                  Disclaimer Integration - Clear communication about AI
                  limitations
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">
                  Human Oversight - Regular review by medical professionals
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">
                  Emergency Protocols - Clear escalation paths for urgent cases
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Getting Started Section
const GettingStartedSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Getting Started
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Ready to experience DermX-AI? Choose your path to get started
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:shadow-xl transition-shadow">
            <Users className="w-16 h-16 text-dermx-teal mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              For Individual Users
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-gray-700">
                  Visit our website or download the mobile app
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-gray-700">
                  Upload your skin image with guided photo assistance
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-gray-700">
                  Wait 10 seconds for comprehensive AI analysis
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <span className="text-gray-700">
                  Review your results and personalized prevention plan
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <span className="text-gray-700">
                  Ask questions using our intelligent Q&A system
                </span>
              </div>
            </div>
            <Link to="/signup" className="mt-6 inline-block">
              <Button className="w-full bg-dermx-teal hover:bg-dermx-teal/90">
                Start Free Analysis
              </Button>
            </Link>
          </Card>

          <Card className="p-8 text-center hover:shadow-xl transition-shadow">
            <Users className="w-16 h-16 text-dermx-teal mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              For Healthcare Professionals
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-gray-700">
                  Create professional account with medical credentials
                  verification
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-gray-700">
                  Integrate with EMR using our healthcare APIs
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-gray-700">
                  Train your team with comprehensive user guides
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <span className="text-gray-700">
                  Start analyzing patient images with AI assistance
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <span className="text-gray-700">
                  Track outcomes and workflow improvements
                </span>
              </div>
            </div>
            <Button className="w-full mt-6 bg-dermx-teal hover:bg-dermx-teal/90">
              Contact Sales
            </Button>
          </Card>

          <Card className="p-8 text-center hover:shadow-xl transition-shadow">
            <Users className="w-16 h-16 text-dermx-teal mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              For Healthcare Organizations
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-gray-700">
                  Contact our team for enterprise consultation
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-gray-700">
                  Custom integration planning and development
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-gray-700">
                  Staff training and change management support
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <span className="text-gray-700">
                  Pilot program implementation and monitoring
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dermx-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <span className="text-gray-700">
                  Full deployment with ongoing support and updates
                </span>
              </div>
            </div>
            <Button className="w-full mt-6 bg-dermx-teal hover:bg-dermx-teal/90">
              Schedule Demo
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Support & Resources Section
const SupportSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Support & Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Comprehensive learning center and support for all users
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8">
            <BookOpen className="w-12 h-12 text-dermx-teal mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              User Guides
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>• Mobile App Tutorial - Step-by-step usage guide</li>
              <li>• Web Platform Guide - Desktop interface walkthrough</li>
              <li>• Photography Best Practices - Getting the best results</li>
              <li>• Understanding Reports - How to read AI analysis</li>
            </ul>
          </Card>

          <Card className="p-8">
            <Users className="w-12 h-12 text-dermx-teal mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Medical Professionals
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                • Clinical Integration Guide - Incorporating AI into practice
              </li>
              <li>
                • API Documentation - Technical integration specifications
              </li>
              <li>• Troubleshooting Guide - Common issues and solutions</li>
              <li>
                • ROI Calculator - Measuring practice efficiency improvements
              </li>
            </ul>
          </Card>

          <Card className="p-8">
            <TrendingUp className="w-12 h-12 text-dermx-teal mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Research & Development
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>• Technical Papers - Published research and methodologies</li>
              <li>
                • Clinical Studies - Validation studies and performance metrics
              </li>
              <li>
                • Model Architecture - Deep learning technical specifications
              </li>
              <li>
                • Dataset Information - Training data sources and preparation
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Main Component
const HowItWorks = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <Step1Section />
      <Step2Section />
      <Step3Section />
      <Step4Section />
      <TechnologySection />
      <QualityAssuranceSection />
      <GettingStartedSection />
      <SupportSection />
    </div>
  );
};

export default HowItWorks;
