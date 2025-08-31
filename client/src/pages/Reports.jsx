import { Button } from "@/components/ui/button";

const Reports = () => {
  // Sample reports data
  const reports = [
    {
      id: 1,
      date: "2023-04-15",
      condition: "Eczema",
      confidence: 87,
      summary:
        "Mild eczema on the inner elbow area with typical dryness and redness.",
      treatments: [
        "Regular moisturizing",
        "Avoid triggers",
        "Hydrocortisone cream",
      ],
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=200",
    },
    {
      id: 2,
      date: "2023-03-22",
      condition: "Psoriasis",
      confidence: 92,
      summary:
        "Moderate psoriasis patches on the knees with scaling and defined borders.",
      treatments: ["Topical corticosteroids", "Light therapy", "Moisturizing"],
      image:
        "https://images.unsplash.com/photo-1579165466741-7f35e4755169?auto=format&fit=crop&q=80&w=300&h=200",
    },
    {
      id: 3,
      date: "2023-02-10",
      condition: "Acne",
      confidence: 95,
      summary: "Inflammatory acne on the cheeks with pustules and papules.",
      treatments: [
        "Benzoyl peroxide",
        "Salicylic acid cleanser",
        "Avoid oily products",
      ],
      image:
        "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&q=80&w=300&h=200",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Analysis Reports</h1>
            <p className="text-gray-600">
              View and manage your skin condition analysis history
            </p>
          </div>
          <Button className="bg-dermx-teal hover:bg-dermx-teal/90">
            New Analysis
          </Button>
        </div>

        <div className="space-y-6">
          {reports.map((report, index) => (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-md overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 bg-gray-100">
                  <img
                    src={report.image}
                    alt={report.condition}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {report.condition}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {new Date(report.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center bg-dermx-soft-green px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-green-800">
                        {report.confidence}% confidence
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{report.summary}</p>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Recommended Treatments:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {report.treatments.map((treatment, i) => (
                        <span
                          key={i}
                          className="bg-dermx-soft-purple text-dermx-purple text-xs px-3 py-1 rounded-full"
                        >
                          {treatment}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dermx-teal text-dermx-teal hover:bg-dermx-teal/10"
                    >
                      Download PDF
                    </Button>
                    <Button
                      size="sm"
                      className="bg-dermx-lavender hover:bg-dermx-lavender/90"
                    >
                      Ask AI Assistant
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
