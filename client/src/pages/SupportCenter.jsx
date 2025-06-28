import { Link } from 'react-router-dom';

const SupportCenter = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#2A114B] font-['Sora',sans-serif] text-center mb-8">
          Support Center
        </h1>
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-[#2A114B] mb-4">
              How Can We Help You?
            </h2>
            <p className="text-gray-700">
              Welcome to Healora’s Support Center. Here you can find resources, FAQs, and contact options to assist you with any issues or questions.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#2A114B] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-700">
              Check out our{' '}
              <Link to="/faq" className="text-[#38BDF8] hover:underline">
                FAQ page
              </Link>{' '}
              for answers to common questions about using Healora.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#2A114B] mb-4">
              Contact Support
            </h2>
            <p className="text-gray-700">
              Need further assistance? Reach out to our support team via the{' '}
              <Link to="/contact-us" className="text-[#38BDF8] hover:underline">
                Contact Us
              </Link>{' '}
              page.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#2A114B] mb-4">
              Account Issues
            </h2>
            <p className="text-gray-700">
              Having trouble with your account? Visit our{' '}
              <Link to="/forgot-password" className="text-[#38BDF8] hover:underline">
                Forgot Password
              </Link>{' '}
              page to reset your password, or contact us for further help.
            </p>
          </section>
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

export default SupportCenter;