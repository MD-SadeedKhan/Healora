import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#40C4B6] to-[#006D77] py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold font-['Sora',sans-serif] mb-4">
            About Healora
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            Empowering your health with AI-driven insights and personalized care, available 24/7.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-[#2A114B] font-['Sora',sans-serif] mb-6">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At Healora, our mission is to make healthcare accessible, personalized, and proactive. We leverage cutting-edge AI technology to provide users with actionable health insights, helping them take control of their well-being from anywhere, at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-[#2A114B] font-['Sora',sans-serif] mb-6">
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We envision a world where everyone has the tools and knowledge to lead a healthier life. By combining AI innovation with compassionate care, Healora aims to bridge the gap between technology and human wellness, creating a future where health is truly in your hands.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-[#2A114B] font-['Sora',sans-serif] text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Thompson",
                role: "Chief Medical Officer",
                bio: "With over 15 years of experience in healthcare, Dr. Thompson leads our medical strategy to ensure Healora delivers accurate and reliable health insights.",
              },
              {
                name: "Alex Rivera",
                role: "Head of AI Development",
                bio: "Alex spearheads our AI initiatives, bringing expertise in machine learning to create innovative tools for personalized health management.",
              },
              {
                name: "Emily Chen",
                role: "Director of User Experience",
                bio: "Emily ensures that Healora is intuitive and user-friendly, focusing on creating a seamless experience for all our users.",
              },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-xl font-semibold text-[#2A114B] mb-2">
                  {member.name}
                </h3>
                <p className="text-[#38BDF8] mb-4">{member.role}</p>
                <p className="text-gray-700">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-[#F5F6F8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-[#2A114B] font-['Sora',sans-serif] mb-6">
            Join Us on Our Journey
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Ready to take control of your health with Healora? Get started today or reach out to learn more about how we can support you.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <button className="text-lg px-8 py-3 bg-gradient-to-r from-[#40C4B6] to-[#006D77] text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium">
                Get Started
              </button>
            </Link>
            <Link to="/contact-us">
              <button className="text-lg px-8 py-3 border-2 border-[#A4B5C4] text-[#2A114B] hover:bg-[#A4B5C4] hover:text-white rounded-xl transition font-medium">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Back to Home Link */}
      <div className="text-center py-8">
        <Link
          to="/"
          className="text-[#38BDF8] hover:underline text-lg font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AboutUs;