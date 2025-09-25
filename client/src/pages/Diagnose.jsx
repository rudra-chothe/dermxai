import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "@/components/ui/card";

const Diagnose = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { currentUser, getIdToken } = useAuth();
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result);
      }
    };
    setSelectedFile(file);
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Find the file from input if not present in state
      const input = document.getElementById("file-upload");
      const file = selectedFile ?? (input?.files && input.files[0]);
      if (!file) {
        throw new Error("Please select an image file to analyze");
      }

      const formData = new FormData();
      formData.append("image", file);

      let token = null;
      try {
        token = await getIdToken();
      } catch (e) { }

      const response = await fetch("/api/diagnosis/analyze", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });



      if (!response.ok) {
        const errText = await response.text();
        throw new Error(
          errText || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      console.log(response);
      console.log(data);
      setResult(data.result);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    setSelectedFile(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 pb-20 md:pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Skin Condition Diagnosis
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          Upload an image of your skin condition for AI-powered analysis and
          diagnosis.
        </p>

        {!image && (
          <div
            className={`border-2 border-dashed rounded-xl h-64 sm:h-80 flex flex-col items-center justify-center p-4 sm:p-6 transition-colors ${isDragging
              ? "border-dermx-teal bg-dermx-teal/5"
              : "border-gray-300"
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-3 sm:mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm sm:text-base text-gray-500 text-center mb-3 sm:mb-4 px-4">
              Drag and drop your image here, or click to browse
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="file-upload"
              onChange={handleFileInput}
              ref={fileInputRef}
            />
            <Button
              className="bg-dermx-teal hover:bg-dermx-teal/90 text-sm sm:text-base"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
          </div>
        )}

        {image && !result && (
          <div className="space-y-4 sm:space-y-6">
            <div className="relative rounded-xl overflow-hidden h-64 sm:h-80 bg-gray-100">
              <img
                src={image}
                alt="Uploaded skin condition"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
              <Button
                variant="outline"
                onClick={resetAnalysis}
                className="text-sm sm:text-base"
              >
                Upload Different Image
              </Button>
              <Button
                className="bg-dermx-teal hover:bg-dermx-teal/90 text-sm sm:text-base"
                onClick={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Image"
                )}
              </Button>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </div>
        )}

        {/* {console.log(result)} */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 animate-scale">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-dermx-teal">
                  {result.condition}
                </h2>
                <div className="flex items-center">
                  <span className="text-sm sm:text-base text-gray-600 mr-2">
                    Confidence:
                  </span>
                  <div className="bg-gray-200 h-2 w-24 sm:w-32 rounded-full overflow-hidden">
                    <div
                      className="bg-dermx-teal h-full"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium text-sm sm:text-base">
                    {result.confidence}%
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAnalysis}
                className="text-sm"
              >
                New Analysis
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <img
                  src={image}
                  alt="Analyzed skin condition"
                  className="rounded-lg w-full object-cover"
                />
              </div>
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    Description
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {result.description}
                  </p>
                </div>
                {Array.isArray(result.top3) && result.top3.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">
                      Top Predictions
                    </h3>
                    <div className="space-y-2">
                      {result.top3.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700">{t.class}</span>
                          <span className="text-gray-600">
                            {t.confidence.toFixed
                              ? t.confidence.toFixed(2)
                              : t.confidence}
                            %
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5 text-dermx-teal mr-2 flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm sm:text-base text-gray-600">
                          {rec}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <Button className="w-full bg-dermx-lavender hover:bg-dermx-lavender/90 text-sm sm:text-base">
                Generate Full Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diagnose;
