import { Link } from 'react-router-dom';

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#2A114B] font-['Sora',sans-serif] text-center mb-8">
          Frequently Asked Questions
        </h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-[#2A114B] mb-2">
              What is Healora?
            </h2>
            <p className="text-gray-700">
              Healora is an AI-powered health companion that provides instant medical insights, symptom analysis, and personalized health guidance, available 24/7.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-[#2A114B] mb-2">
              Is my data secure with Healora?
            </h2>
            <p className="text-gray-700">
              Yes, Healora is HIPAA compliant and uses advanced security measures to protect your data.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-[#2A114B] mb-2">
              How do I contact support?
            </h2>
            <p className="text-gray-700">
              You can reach out to our support team via the{' '}
              <Link to="/contact" className="text-[#38BDF8] hover:underline">
                Contact Us
              </Link>{' '}
              page.
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-[#38BDF8] hover:underline text-lg font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;