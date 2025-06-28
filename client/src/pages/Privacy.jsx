const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 font-['Sora',sans-serif] text-[#2A114B]">
          Privacy Policy
        </h1>
        <p className="text-lg text-[#334351] mb-6">
          Last updated: June 17, 2025
        </p>
        <p className="text-[#334351] mb-4">
          At Healora, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.
        </p>
        <h2 className="text-2xl font-semibold mb-4 text-[#2A114B]">
          Information We Collect
        </h2>
        <p className="text-[#334351] mb-4">
          We collect information you provide directly, such as your name, email, and health-related data, to deliver personalized health insights.
        </p>
        <h2 className="text-2xl font-semibold mb-4 text-[#2A114B]">
          How We Use Your Information
        </h2>
        <p className="text-[#334351] mb-4">
          Your information is used to provide and improve our services, comply with legal obligations, and communicate with you.
        </p>
        {/* Add more sections as needed */}
      </div>
    </div>
  );
};

export default Privacy;