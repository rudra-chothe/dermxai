import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 pb-20 md:pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            About DermX-AI
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Transforming dermatological care with advanced artificial
            intelligence
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-12 sm:mb-16 animate-fade-in">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gradient-to-br from-dermx-teal to-dermx-lavender p-6 sm:p-8 lg:p-12 flex items-center">
                <div className="text-white">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                    Our Mission
                  </h2>
                  <p className="mb-4 sm:mb-6 text-sm sm:text-base">
                    We're on a mission to make expert dermatological care
                    accessible to everyone through cutting-edge AI technology.
                    By combining medical expertise with artificial intelligence,
                    we aim to democratize skin health knowledge and improve
                    outcomes for people around the world.
                  </p>
                  <p className="text-sm sm:text-base">
                    DermX-AI is built on the vision that everyone deserves
                    access to fast, accurate, and personalized skin health
                    information when they need it most.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 p-6 sm:p-8 lg:p-12">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  Our Approach
                </h2>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-dermx-soft-purple flex items-center justify-center mr-3 sm:mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-dermx-purple"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        Medical Expertise
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Developed in collaboration with board-certified
                        dermatologists to ensure accuracy and clinical
                        relevance.
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-dermx-soft-purple flex items-center justify-center mr-3 sm:mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-dermx-purple"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        Advanced AI
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Utilizing state-of-the-art computer vision and natural
                        language processing technologies.
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-dermx-soft-purple flex items-center justify-center mr-3 sm:mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-dermx-purple"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        Continuous Learning
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Our AI models improve over time through ongoing training
                        and validation with diverse skin types and conditions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-12 sm:mb-16 animate-fade-in">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
            Our Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-dermx-soft-blue rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Computer Vision
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Our image analysis algorithms can detect and classify over 200
                skin conditions with high accuracy across diverse skin tones.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-dermx-soft-green rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-green-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Natural Language Processing
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Our Q&A system understands complex medical queries and provides
                evidence-based answers sourced from peer-reviewed literature.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-dermx-soft-orange rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-orange-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Document Analysis
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Extract insights from medical documents, research papers, and
                clinical guidelines with context-aware understanding.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="mb-12 sm:mb-16 animate-fade-in">
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              Your Privacy Matters
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              At DermX-AI, we take your privacy and data security seriously. All
              images and personal information are protected with
              industry-leading encryption and security practices.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-dermx-teal mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">
                    End-to-End Encryption
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    All data transmitted to and from our servers is encrypted
                    using AES-256 encryption.
                  </p>
                </div>
              </div>
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-dermx-teal mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">
                    Data Retention Control
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    You control how long your data is stored with flexible
                    retention policies.
                  </p>
                </div>
              </div>
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-dermx-teal mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">
                    HIPAA Compliant
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Our platform adheres to healthcare privacy standards and
                    best practices.
                  </p>
                </div>
              </div>
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-dermx-teal mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">
                    Consent Controls
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Clear, granular consent options for how your data is used
                    and processed.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                className="text-dermx-teal border-dermx-teal text-sm sm:text-base"
              >
                View Privacy Policy
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 animate-fade-in">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                Get in Touch
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Have questions or feedback about DermX-AI? We'd love to hear
                from you! Our team is available to assist with any inquiries.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-dermx-teal mr-3 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">Email</h4>
                    <p className="text-dermx-teal text-sm sm:text-base">
                      support@dermx-ai.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-dermx-teal mr-3 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">Phone</h4>
                    <p className="text-dermx-teal text-sm sm:text-base">
                      +1 (800) 555-0123
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-dermx-teal mr-3 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">
                      Address
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      123 Innovation Drive, Suite 400
                      <br />
                      San Francisco, CA 94103
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className="w-full rounded-md border border-gray-300 focus:border-dermx-teal focus:ring focus:ring-dermx-teal/20 p-3 text-gray-700 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      className="w-full rounded-md border border-gray-300 focus:border-dermx-teal focus:ring focus:ring-dermx-teal/20 p-3 text-gray-700 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Message subject"
                    className="w-full rounded-md border border-gray-300 focus:border-dermx-teal focus:ring focus:ring-dermx-teal/20 p-3 text-gray-700 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Your message"
                    className="w-full rounded-md border border-gray-300 focus:border-dermx-teal focus:ring focus:ring-dermx-teal/20 p-3 text-gray-700 text-sm sm:text-base"
                  ></textarea>
                </div>
                <Button className="w-full bg-dermx-teal hover:bg-dermx-teal/90 text-sm sm:text-base">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
