import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#2A114B] font-['Sora',sans-serif] text-center mb-8">
          Contact Us
        </h1>
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-[#2A114B] mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-700">
              Have questions or need assistance? Reach out to our team, and we’ll get back to you as soon as possible.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#2A114B] mb-4">
              Email Us
            </h2>
            <p className="text-gray-700">
              Email: <a href="mailto:support@healora.com" className="text-[#38BDF8] hover:underline">support@healora.com</a>
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#2A114B] mb-4">
              Follow Us
            </h2>
            <p className="text-gray-700">
              Stay updated by following us on our social media channels:
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline ml-1">Twitter</a>,
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline ml-1">Facebook</a>,
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline ml-1">Instagram</a>.
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

export default Contact;