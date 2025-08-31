import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DocumentInsights = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResponse, setQueryResponse] = useState(null);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate file upload with timeout
    setTimeout(() => {
      setIsUploading(false);
      setIsUploaded(true);
    }, 2000);
  };

  const handleQuery = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsQuerying(true);
    // Simulate query processing with timeout
    setTimeout(() => {
      setQueryResponse({
        answer: "Studies show that for moderate to severe psoriasis, biologics targeting IL-17 and IL-23 pathways have demonstrated high efficacy rates with 75-90% improvement in PASI scores for most patients. These treatments have a favorable safety profile compared to older systemic medications.",
        sources: [
          { title: "Advances in Psoriasis Treatment Options, 2023", page: "Page 42" },
          { title: "Comparative Analysis of Biologic Therapies for Psoriasis", page: "Pages 127-129" }
        ],
        relatedSections: [
          { title: "Efficacy Metrics in Clinical Trials", content: "Clinical trials for psoriasis treatments typically use the Psoriasis Area and Severity Index (PASI) to measure efficacy. A PASI 75 response indicates 75% improvement from baseline." },
          { title: "Long-term Safety Considerations", content: "Long-term safety data for newer biologics is still accumulating. Current evidence suggests low rates of serious adverse events, though monitoring for infections is recommended." },
          { title: "Treatment Selection Criteria", content: "Factors influencing treatment selection include disease severity, comorbidities, prior treatment response, contraindications, cost considerations, and patient preferences." }
        ]
      });
      setIsQuerying(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Document Insights</h1>
        <p className="text-gray-600 mb-8">
          Upload medical documents and extract insights with our AI-powered document analysis
        </p>

        {!isUploaded ? (
          <div className="bg-white rounded-xl shadow-md p-8 animate-scale">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-dermx-soft-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dermx-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Upload Your Document</h2>
              <p className="text-gray-600 mb-6">
                Support for PDF, DOCX, and TXT files up to 20MB
              </p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="document-upload"
                className="hidden"
                accept=".pdf,.docx,.txt"
              />
              <label htmlFor="document-upload" className="block cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-500 mb-2">Drag and drop your file here, or click to browse</p>
                <p className="text-gray-400 text-sm">Max file size: 20MB</p>
              </label>
            </div>
            
            <div className="mt-8 text-center">
              <Button 
                className="bg-dermx-teal hover:bg-dermx-teal/90 w-full sm:w-auto"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload Document"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Document Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-dermx-soft-blue rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold">Current Advances in Dermatological Treatments.pdf</h2>
                    <p className="text-sm text-gray-500">42 pages · Uploaded just now</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-dermx-teal border-dermx-teal">
                  Upload New
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-dermx-soft-green p-3 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">Processing Complete</p>
                </div>
                <div className="bg-dermx-soft-purple p-3 rounded-lg">
                  <p className="text-sm text-dermx-purple font-medium">184 Citations Found</p>
                </div>
                <div className="bg-dermx-soft-blue p-3 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">12 Key Insights</p>
                </div>
              </div>
            </div>
            
            {/* Q&A Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Ask Questions About Your Document</h2>
              
              <form onSubmit={handleQuery} className="mb-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Ask something about your document..."
                    className="w-full pl-4 pr-16 py-3 rounded-lg border border-gray-300"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button 
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 bg-dermx-teal hover:bg-dermx-teal/90"
                    disabled={isQuerying}
                  >
                    {isQuerying ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    )}
                  </Button>
                </div>
              </form>
              
              {/* Sample question buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button 
                  onClick={() => setQuery("What are the latest treatments for psoriasis?")}
                  className="text-sm bg-dermx-soft-purple text-dermx-purple px-3 py-1 rounded-full"
                >
                  What are the latest treatments for psoriasis?
                </button>
                <button 
                  onClick={() => setQuery("Summarize the efficacy of biologic drugs")}
                  className="text-sm bg-dermx-soft-purple text-dermx-purple px-3 py-1 rounded-full"
                >
                  Summarize the efficacy of biologic drugs
                </button>
                <button 
                  onClick={() => setQuery("What side effects are mentioned for JAK inhibitors?")}
                  className="text-sm bg-dermx-soft-purple text-dermx-purple px-3 py-1 rounded-full"
                >
                  What side effects are mentioned for JAK inhibitors?
                </button>
              </div>
              
              {/* Response */}
              {queryResponse && (
                <div className="animate-scale">
                  <div className="bg-dermx-soft-blue/30 p-4 rounded-lg mb-4">
                    <p className="text-gray-800">{queryResponse.answer}</p>
                  </div>
                  
                  {/* Sources */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Sources:</h3>
                    <div className="space-y-1">
                      {queryResponse.sources.map((source, index) => (
                        <div key={index} className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-dermx-teal mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">{source.title}</span> · {source.page}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Related Sections */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Related Sections:</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {queryResponse.relatedSections.map((section, index) => (
                        <AccordionItem key={index} value={`section-${index}`}>
                          <AccordionTrigger className="text-sm font-medium text-gray-700">
                            {section.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-gray-600">{section.content}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentInsights;