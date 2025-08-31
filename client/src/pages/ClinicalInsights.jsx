import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClinicalInsights = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data
  const insightsData = [
    {
      id: 1,
      title: "Atopic Dermatitis (Eczema)",
      description: "A chronic skin condition characterized by itchy, inflamed skin.",
      symptoms: ["Dry, itchy skin", "Red to brownish-gray patches", "Small raised bumps", "Thickened, cracked skin"],
      treatments: ["Moisturizers", "Topical corticosteroids", "Light therapy", "Antihistamines"],
      guidelines: "Regular skin care routine with gentle, fragrance-free products. Identify and avoid triggers.",
      research: "Recent studies show promising results with JAK inhibitors for moderate to severe cases."
    },
    {
      id: 2,
      title: "Psoriasis",
      description: "An immune-mediated disease causing raised, red, scaly patches on the skin.",
      symptoms: ["Red patches with thick, silvery scales", "Dry, cracked skin", "Itching or burning", "Thickened or ridged nails"],
      treatments: ["Topical treatments", "Light therapy", "Oral or injected medications", "Biologics"],
      guidelines: "Regular moisturizing, avoiding triggers like stress and alcohol. Sun exposure in moderation may help.",
      research: "New IL-23 inhibitors show high efficacy with less frequent dosing requirements."
    },
    {
      id: 3,
      title: "Acne Vulgaris",
      description: "A skin condition that occurs when hair follicles become plugged with oil and dead skin cells.",
      symptoms: ["Whiteheads", "Blackheads", "Papules", "Pustules", "Nodules"],
      treatments: ["Topical retinoids", "Benzoyl peroxide", "Antibiotics", "Hormone therapy"],
      guidelines: "Gentle cleansing twice daily, non-comedogenic products, avoid picking or squeezing.",
      research: "Microbiome-based treatments targeting P. acnes show promising early results."
    }
  ];

  // Filter data based on search term
  const filteredData = searchTerm
    ? insightsData.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : insightsData;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Clinical Insights</h1>
        <p className="text-gray-600 mb-8">
          Evidence-based information on dermatological conditions, treatments, and guidelines
        </p>

        {/* Search Bar */}
        <div className="relative mb-8 animate-scale">
          <Input
            type="text"
            placeholder="Search for a skin condition or treatment..."
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:border-dermx-teal focus:ring focus:ring-dermx-teal/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="w-full mb-8">
          <TabsList className="w-full grid grid-cols-4 bg-dermx-soft-purple/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredData.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold text-dermx-teal mb-2">{item.title}</h2>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  
                  <h3 className="font-medium text-gray-900 mb-2">Common Symptoms:</h3>
                  <ul className="mb-4 space-y-1">
                    {item.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-dermx-teal mt-1.5 mr-2"></span>
                        <span className="text-gray-600">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="font-medium text-gray-900 mb-2">Treatment Options:</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.treatments.map((treatment, index) => (
                      <span key={index} className="bg-dermx-soft-blue text-blue-800 text-xs px-3 py-1 rounded-full">
                        {treatment}
                      </span>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-dermx-teal hover:bg-dermx-teal/90 mt-2">
                    View Full Details
                  </Button>
                </div>
              ))}
            </div>
            
            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found for "{searchTerm}"</p>
                <Button 
                  variant="link" 
                  className="mt-2 text-dermx-teal"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Guidelines Tab */}
          <TabsContent value="guidelines" className="mt-6 animate-fade-in">
            <div className="space-y-6">
              {filteredData.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold text-dermx-teal mb-3">{item.title} Guidelines</h2>
                  <p className="text-gray-600">{item.guidelines}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Research Tab */}
          <TabsContent value="research" className="mt-6 animate-fade-in">
            <div className="space-y-6">
              {filteredData.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold text-dermx-teal mb-3">Latest Research: {item.title}</h2>
                  <p className="text-gray-600 mb-4">{item.research}</p>
                  <Button variant="outline" className="text-dermx-teal border-dermx-teal">
                    View Studies
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* FAQs Tab */}
          <TabsContent value="faqs" className="mt-6 animate-fade-in">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-dermx-teal mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">What's the difference between eczema and psoriasis?</h3>
                  <p className="text-gray-600">Eczema typically causes itchy, inflamed skin while psoriasis presents as defined, scaly patches. Eczema tends to appear in body folds, while psoriasis commonly affects extensor surfaces like knees and elbows.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">How accurate is AI diagnosis for skin conditions?</h3>
                  <p className="text-gray-600">Modern AI systems can achieve high accuracy rates, often between 80-95% for common skin conditions. However, they should be used as a tool to support clinical decision-making rather than replacing medical professional evaluation.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Can lifestyle changes help manage skin conditions?</h3>
                  <p className="text-gray-600">Yes, many skin conditions respond well to lifestyle modifications such as stress management, diet improvements, adequate hydration, regular exercise, and proper skincare routines. Identifying and avoiding triggers is also important.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">When should I seek in-person medical care for a skin issue?</h3>
                  <p className="text-gray-600">You should seek medical attention if you have severe or rapidly worsening symptoms, widespread rash, signs of infection, skin changes accompanied by other symptoms like fever, or if a skin condition significantly impacts your daily life.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClinicalInsights;