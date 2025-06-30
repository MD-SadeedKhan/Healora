import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/useAuth';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Helmet } from 'react-helmet-async'; // For SEO

const Landing = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://i.pinimg.com/736x/f2/1a/37/f21a37f9ee61cc531882725113e99213.jpg", // Replace with local or CDN-hosted images
    "https://i.pinimg.com/736x/82/3b/dd/823bdd79208fdf7e1ada2287b60852cb.jpg",
    "https://i.pinimg.com/736x/b6/96/ee/b696ee610d8aac5441d3d68cf64f6242.jpg",
  ];

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleProtectedLink = (path, name) => {
    if (!user) {
      toast({
        title: "Please Log In",
        description: `You need to be logged in to access ${name}.`,
        variant: "destructive",
      });
      navigate("/register");
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen font-['Manrope',sans-serif] flex flex-col">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Healora | Your AI-Powered Health Companion</title>
        <meta
          name="description"
          content="Get instant medical insights, symptom analysis, and personalized health guidance with Healora's advanced AI technology, available 24/7."
        />
      </Helmet>

      {/* Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 w-[90%] max-w-6xl bg-navbar-bg backdrop-blur-lg border border-white/30 shadow-lg rounded-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2 h-14">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Healora Logo - AI-Powered Health Companion"
              className="h-8 w-auto shadow-lg"
              onError={(e) => (e.target.src = "/fallback-logo.png")} // Fallback image
            />
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            {[
              {
                name: "Sign Up",
                icon: (
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/15754/15754186.png"
                    alt="Sign Up Icon"
                    className="w-6 h-6 group-hover:scale-110 transition-transform"
                  />
                ),
                path: "/register",
                ariaLabel: "Sign up for Healora",
              },
              {
                name: "AI Assistant",
                icon: (
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/12529/12529348.png"
                    alt="AI Assistant Icon"
                    className="w-6 h-6 group-hover:scale-110 transition-transform"
                  />
                ),
                path: "/ai-assistant",
                ariaLabel: "Access AI Assistant",
              },
              {
                name: "Medicine Search",
                icon: (
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/15698/15698506.png"
                    alt="Medicine Search Icon"
                    className="w-6 h-6 group-hover:scale-110 transition-transform"
                  />
                ),
                path: "/medicine-search",
                ariaLabel: "Search Medicines",
              },
              {
                name: "Hospitals",
                icon: (
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/33/33777.png"
                    alt="Hospitals Icon"
                    className="w-6 h-6 group-hover:scale-110 transition-transform"
                  />
                ),
                path: "/hospitals",
                ariaLabel: "Find Hospitals",
              },
            ].map((link) => (
              <Link
                key={link.name}
                to={user || link.path === "/register" ? link.path : "#"}
                onClick={() =>
                  user || link.path === "/register"
                    ? null
                    : handleProtectedLink(link.path, link.name)
                }
                className="group flex items-center space-x-2 px-3 py-2 text-[#0D1B2A] hover:text-[#5AC8FA] hover:scale-105 transition-all duration-200 text-sm sm:text-base font-medium rounded-full hover:bg-white/30"
                aria-label={link.ariaLabel}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="flex space-x-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 bg-transparent border border-[#000000] text-[#0a0a0a] hover:bg-[#5AC8FA] hover:text-white rounded-full text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105"
                    aria-label="Go to Dashboard"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 bg-transparent border border-[#000000] text-[#0a0a0a] hover:bg-[#5AC8FA] hover:text-white rounded-full text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105"
                    aria-label="Log out"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 bg-transparent border border-[#000000] text-[#0a0a0a] hover:bg-[#5AC8FA] hover:text-white rounded-full text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105"
                    aria-label="Log in to Healora"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 bg-transparent border border-[#000000] text-[#0a0a0a] hover:bg-[#5AC8FA] hover:text-white rounded-full text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105"
                    aria-label="Get started with Healora"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section
          id="hero"
          className="pt-40 pb-24 bg-transparent overflow-hidden min-h-[100vh] flex items-center relative"
          style={{
            backgroundImage: 'url("background.jpeg")', // Local asset
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              <div className="space-y-8 animate-fade-in-left">
                <div className="space-y-6">
                  <span className="inline-flex items-center px-4 py-2 bg-[#A4B5C4]/40 text-[#2A114B] border-[#A4B5C4]/30 rounded-lg text-sm font-bold shadow-sm">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    HIPAA Compliant & Secure
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-['Sora',sans-serif] text-[#2A114B] tracking-tight drop-shadow-lg">
                    Your AI-Powered
                    <span className="bg-gradient-to-r from-[#40C4B6] to-[#006D77] bg-clip-text text-transparent block text-4xl sm:text-5xl lg:text-6xl">
                      Health Companion
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg text-[#2a1a31] font-semibold leading-relaxed max-w-xl drop-shadow-md">
                    Get instant medical insights, symptom analysis, and personalized health guidance powered by advanced AI technology. Available 24/7 for your peace of mind.
                  </p>
                </div>
                <div className="flex items-center space-x-4 sm:space-x-8 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-[#382759] group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span className="font-bold text-[#223342] drop-shadow-sm">Users</span>
                    <span className="font-bold text-[#222f3b] drop-shadow-sm">50,000+ users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 fill-[#ffcd05] text-[#3c486b] group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.783 1.4 8.162L12 18.897l-7.334 3.858 1.4-8.162L.132 9.21l8.2-1.192L12 .587z" />
                    </svg>
                    <span className="font-bold text-[#344758] drop-shadow-sm">Star</span>
                    <span className="font-bold text-[#34495b] drop-shadow-sm">4.9/5 rating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-[#2A114B] group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="font-bold text-[#394d5f] drop-shadow-sm">Availability</span>
                    <span className="font-bold text-[#354655] drop-shadow-sm">24/7 Available</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <button
                      className="text-base sm:text-lg px-6 sm:px-8 py-3 bg-gradient-to-r from-[#40C4B6] to-[#006D77] text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
                      aria-label="Start your health journey with Healora"
                    >
                      Start Your Health Journey
                      <svg
                        className="ml-2 h-5 w-5 inline"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </button>
                  </Link>
                  <a
                    href="https://youtu.be/g632EG9s1Mc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg px-6 sm:px-8 py-3 border-2 bg-gradient-to-r from-[#8c5ea2] to-[#905fbb] border-[#A4B5C4] text-[#fefcff] hover:bg-[#A4B5C4] hover:text-[#2A114B] rounded-xl transition font-medium drop-shadow-sm"
                    aria-label="Watch Healora demo video"
                  >
                    <svg
                      className="mr-2 h-5 w-5 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Watch Demo
                  </a>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-bold text-[#3c314a] mb-4 drop-shadow-xl">
                    Trusted by leading healthcare providers
                  </p>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                    <div className="text-sm font-bold text-[#3a2e49] drop-shadow-xl">MedCenter+</div>
                    <div className="text-sm font-bold text-[#3e344b] drop-shadow-xl">HealthFirst</div>
                    <div className="text-sm font-bold text-[#3e334d] drop-shadow-xl">CareNet</div>
                    <div className="text-sm font-bold text-[#352d43] drop-shadow-xl">WellnessHub</div>
                  </div>
                </div>
              </div>
              <div className="relative animate-fade-in-right">
                <div className="relative w-full max-w-[610px] mx-auto">
                  <div className="relative h-[300px] sm:h-[400px] lg:h-[460px] rounded-2xl overflow-hidden">
                    {slides.map((slide, index) => (
                      <img
                        key={index}
                        src={slide}
                        alt={`Healthcare Slide ${index + 1} - AI-Powered Health Insights`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                          index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                        onError={(e) => (e.target.src = "/images/fallback-slide.jpg")} // Fallback image
                      />
                    ))}
                    <div className="absolute inset-0 bg-[#2A114B]/10"></div>
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                      <h3 className="text-lg sm:text-2xl font-bold font-['Sora',sans-serif] tracking-tight">
                        {currentSlide === 0
                          ? "Empowering Healthcare with AI"
                          : currentSlide === 1
                          ? "AI-Driven Medical Insights"
                          : "Personalized Patient Care"}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setCurrentSlide(
                        currentSlide === 0 ? slides.length - 1 : currentSlide - 1
                      )
                    }
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-[#A4B5C4] transition hover:scale-105"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSlide(
                        currentSlide === slides.length - 1 ? 0 : currentSlide + 1
                      )
                    }
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-[#A4B5C4] transition hover:scale-105"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentSlide ? "bg-[#40C4B6]" : "bg-white/50"
                        } hover:scale-110 transition-transform`}
                        aria-label={`Go to slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 bg-[#F5F7FA] shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-20 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-['Sora',sans-serif] text-[#2A114B] tracking-tight">
                Powerful Features for Your Health
              </h2>
              <p className="text-base sm:text-lg text-[#2d363d] max-w-3xl mx-auto leading-relaxed">
                Healora combines cutting-edge AI technology with medical expertise to provide comprehensive health assistance tailored to your unique needs.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-[#40C4B6] group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                  ),
                  title: "AI Symptom Checker",
                  description:
                    "Advanced AI analyzes your symptoms and provides preliminary assessments based on verified medical knowledge and databases.",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-[#40C4B6] group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  ),
                  title: "Health Monitoring",
                  description:
                    "Track vital signs, medications, and health metrics with intelligent insights and personalized recommendations.",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-[#40C4B6] group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  ),
                  title: "24/7 AI Consultation",
                  description:
                    "Get instant answers to your health questions anytime through our intelligent AI assistant, available round the clock.",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-[#40C4B6] group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11c0-1.104-.896-2-2-2H6c-1.104 0-2 .896-2 2v6c0 1.104.896 2 2 2h4c1.104 0 2-.896 2-2v-2m6-4c0-1.104-.896-2-2-2h-4c-1.104 0-2 .896-2 2v6c0 1.104.896 2 2 2h4c1.104 0 2-.896 2-2v-6zm-6-6v2m4-2v2"
                      />
                    </svg>
                  ),
                  title: "HIPAA Compliant",
                  description:
                    "Your health data is protected with enterprise-grade security, full HIPAA compliance, and encrypted storage.",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-[#40C4B6] group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  title: "Instant Results",
                  description:
                    "Get immediate health insights and recommendations without waiting for appointments or long queues.",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-[#40C4B6] group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  title: "Mobile Ready",
                  description:
                    "Access your health companion on any device, anywhere, with our responsive and intuitive design.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-[#D3E3F1] rounded-xl p-6 shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.7)] transition-transform duration-300 hover:-translate-y-2 hover:bg-[#A4B5C4]"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#40C4B6] to-[#006D77] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:bg-white/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-['Sora',sans-serif] mb-2 group-hover:text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-[#2A114B] group-hover:text-white/90">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8 sm:mt-12 gap-4 sm:gap-6 flex-wrap">
              {["Verified Sources", "HIPAA/GDPR Compliant", "Doctor-Reviewed"].map((badge) => (
                <div key={badge} className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-[#006D77] group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-[#2A114B] text-sm sm:text-base font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 sm:py-24 bg-[#FFFFFF] shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-24 animate-fade-in-up">
              <span className="inline-flex items-center mb-6 text-sm sm:text-base px-4 py-2 bg-[#A4B5C4]/10 text-[#0D1B2A] border-[#A4B5C4]/20 rounded-lg">
                How It Works
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-['Sora',sans-serif] text-[#0D1B2A] tracking-tight">
                Simple Steps to Better Health
              </h2>
              <p className="text-base sm:text-lg text-[#34495E] max-w-3xl mx-auto leading-relaxed">
                Getting health insights with Healora is as easy as having a conversation. Our AI guides you through each step of your health journey.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-16 relative">
              {[
                {
                  step: "01",
                  icon: (
                    <svg
                      className="w-12 sm:w-16 h-12 sm:h-16 text-white group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8L12 22L16 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H15.17L14 17.17L12 19.17L10 17.17L8.83 16H4V4H20V16ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9ZM16 6H8V8H16V6Z" />
                    </svg>
                  ),
                  title: "Describe Your Symptoms",
                  description:
                    "Tell Healora about your health concerns, symptoms, or questions in natural language through our intuitive interface.",
                },
                {
                  step: "02",
                  icon: (
                    <svg
                      className="w-12 sm:w-16 h-12 sm:h-16 text-white group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H7V20C7 21.1 7.9 22 9 22H15C16.1 22 17 21.1 17 20V18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM15 20H9V18H15V20ZM20 16H4V4H20V16ZM12 6C9.24 6 7 8.24 7 11C7 12.31 7.53 13.5 8.38 14.38C8.15 15.17 7.57 15.82 7.29 16.58C7.16 16.94 7.4 17.32 7.78 17.38C8.5 17.5 9.21 17.18 9.72 16.76C10.47 17.16 11.32 17.38 12.22 17.38C15 17.38 17.25 15.13 17.25 12.38C17.25 9.63 15 7.38 12.22 7.38V6Z" />
                    </svg>
                  ),
                  title: "AI Analysis",
                  description:
                    "Our advanced AI processes your information using verified medical databases and cutting-edge machine learning algorithms.",
                },
                {
                  step: "03",
                  icon: (
                    <svg
                      className="w-12 sm:w-16 h-12 sm:h-16 text-white group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM10 14.17L16.59 7.58L18 9L10 17L6 13L7.41 11.59L10 14.17Z" />
                    </svg>
                  ),
                  title: "Get Recommendations",
                  description:
                    "Receive personalized health insights, evidence-based recommendations, and clear next steps for your healthcare journey.",
                },
              ].map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="relative mb-8">
                    <div className="w-20 sm:w-28 h-20 sm:h-28 bg-gradient-to-br from-[#40C4B6] to-[#006D77] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      {step.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 bg-white border-2 border-[#40C4B6] font-bold text-[#40C4B6] px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm sm:text-base">
                      {step.step}
                    </span>
                    {index < 2 && (
                      <div className="hidden md:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-[#40C4B6] to-[#006D77] transform translate-x-4">
                        <svg
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 w-6 sm:w-8 h-6 sm:h-8 text-[#006D77]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-[#0D1B2A] font-['Sora',sans-serif] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#34495E] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 sm:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-20 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-['Sora',sans-serif] text-[#2A114B] tracking-tight">
                Trusted by Healthcare Professionals
              </h2>
              <p className="text-base sm:text-lg text-[#334351] max-w-3xl mx-auto leading-relaxed">
                See what doctors, nurses, and healthcare managers are saying about their experience with Healora.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  role: "Family Physician",
                  content:
                    "Healora has transformed how my patients approach their health. The AI insights are remarkably accurate and help patients make informed decisions about their care.",
                  image: "SJ",
                  rating: 5,
                },
                {
                  name: "Michael Chen",
                  role: "Healthcare Manager",
                  content:
                    "I was skeptical at first, but Healora correctly identified concerning symptoms and recommended I see a specialist. The early detection was invaluable.",
                  image: "MC",
                  rating: 5,
                },
                {
                  name: "Lisa Rodriguez",
                  role: "Nurse Practitioner",
                  content:
                    "The 24/7 availability gives my patients peace of mind. They can get reliable health information anytime, reducing unnecessary emergency visits.",
                  image: "LR",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-[#FFFFFF] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                >
                  <svg
                    className="w-8 sm:w-10 h-8 sm:h-10 text-[#40C4B6]/30 mb-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12c0 1.66-1.34 3-3 3S3 13.66 3 12c0-1.54 1.16-2.79 2.65-2.97L5 6H2v9h3v-3h1.5c2.48 0 4.5-2.02 4.5-4.5 0-.82-.22-1.58-.59-2.24L9 6H6v3h1.5c-.83 0-1.5.67-1.5 1.5S6.67 12 5.5 12zm12 0c0 1.66-1.34 3-3 3s-3-1.34-3-3c0-1.54 1.16-2.79 2.65-2.97L17 6h-3v9h3v-3h1.5c2.48 0 4.5-2.02 4.5-4.5 0-.82-.22-1.58-.59-2.24L21 6h-3v3h1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5z" />
                  </svg>
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 sm:w-6 h-5 sm:h-6 fill-[#FFD700] text-[#FFD700] group-hover:scale-110 transition-transform"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.783 1.4 8.162L12 18.897l-7.334 3.858 1.4-8.162L.132 9.21l8.2-1.192L12 .587z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-[#34495E] mb-8 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-[#40C4B6] to-[#006D77] rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-bold text-[#2A114B] text-base sm:text-lg font-['Sora',sans-serif] tracking-tight">
                        {testimonial.name}
                      </div>
                      <div className="text-xs sm:text-sm text-[#34495E]">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Security Section */}
        <section id="security" className="py-16 sm:py-24 bg-[#FFFFFF] shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-20 animate-fade-in-up">
              <span className="inline-flex items-center mb-6 text-sm sm:text-base px-4 py-2 bg-[#A4B5C4]/10 text-[#2A114B] border-[#A4B5C4]/20 rounded-lg">
                Trust & Security
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-['Sora',sans-serif] text-[#2A114B] tracking-tight">
                Your Health Data is Safe
              </h2>
              <p className="text-base sm:text-lg text-[#34495E] max-w-3xl mx-auto leading-relaxed">
                We maintain the highest standards of security and privacy to protect your sensitive health information with enterprise-grade protection.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {[
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-white group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  title: "HIPAA Compliant",
                  description:
                    "Full compliance with healthcare privacy regulations and data protection standards.",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-white group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-2.209 0-4 1.791-4 4v1h8v-1c0-2.209-1.791-4-4-4z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 8h4m-4 4h6m-6 4h8"
                      />
                    </svg>
                  ),
                  title: "End-to-End Encryption",
                  description:
                    "All data transmissions are encrypted to ensure your information remains private.",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-white group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                      />
                    </svg>
                  ),
                  title: "Secure Data Storage",
                  description:
                    "Your health data is stored securely with regular audits and monitoring.",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-white group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  title: "Regular Audits",
                  description:
                    "We conduct frequent security audits to maintain the highest standards.",
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#40C4B6] to-[#006D77] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    {item.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-['Sora',sans-serif] mb-2 text-[#2A114B] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#34495E] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
              {["SOC 2 Certified", "ISO 27001", "GDPR Compliant"].map((cert) => (
                <div key={cert} className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-[#006D77] group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-[#2A114B] text-sm sm:text-base font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section id="statistics" className="py-16 sm:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-20 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-['Sora',sans-serif] text-[#2A114B] tracking-tight">
                Impacting Lives Globally
              </h2>
              <p className="text-base sm:text-lg text-[#273643] max-w-3xl mx-auto leading-relaxed">
                Healora is trusted by thousands worldwide, delivering meaningful health insights and improving lives every day.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
              {[
                {
                  value: "50K+",
                  label: "Active Users",
                  icon: (
                    <svg
                      className="w-10 h-10 text-[#40C4B6] group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ),
                },
                {
                  value: "1M+",
                  label: "Health Queries",
                  icon: (
                    <svg
                      className="w-10 h-10 text-[#40C4B6] group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-2a2 2 0 012-2h10a2 2 0 012 2v2h-4m-6 0h6"
                      />
                    </svg>
                  ),
                },
                {
                  value: "99.9%",
                  label: "Uptime",
                  icon: (
                    <svg
                      className="w-10 h-10 text-[#40C4B6] group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  ),
                },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">{stat.icon}</div>
                  <h3 className="text-4xl sm:text-5xl font-bold text-[#2A114B] font-['Sora',sans-serif] mb-2 tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-base sm:text-lg text-[#A4B5C4]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section
          id="cta"
          className="py-16 sm:py-24 bg-gradient-to-r from-[#40C4B6] to-[#006D77] text-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-['Sora',sans-serif] animate-fade-in-up tracking-tight">
              Take Control of Your Health Today
            </h2>
            <p className="text-base sm:text-lg mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Join thousands of users who trust Healora for smarter, faster, and more secure health insights. Your journey to better health starts here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up">
              <Link to={user ? "/dashboard" : "/register"} aria-label={user ? "Go to Dashboard" : "Get started with Healora"}>
                <button className="text-base sm:text-lg px-6 sm:px-8 py-3 bg-[#FFFFFF] text-[#2A114B] rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium">
                  Get Started Now
                  <svg
                    className="ml-2 h-5 w-5 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </button>
              </Link>
              <Link to="/contact-us" aria-label="Contact Healora Support">
                <button className="text-base sm:text-lg px-6 sm:px-8 py-3 border-2 border-[#FFFFFF] text-[#FFFFFF] hover:bg-[#A4B5C4] hover:border-[#A4B5C4] hover:text-[#2A114B] rounded-xl transition font-medium">
                  Contact Us
                  <svg
                    className="ml-2 h-5 w-5 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-[#2A114B] text-white py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <img
                    src="/logo.png"
                    alt="Healora Logo - AI-Powered Health Companion"
                    className="h-10 w-auto"
                    onError={(e) => (e.target.src = "/fallback-logo.png")}
                  />
                </div>
                <p className="text-sm sm:text-base text-[#A4B5C4] leading-relaxed">
                  Empowering your health with AI-driven insights and personalized care, available 24/7.
                </p>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold font-['Sora',sans-serif] mb-4 tracking-tight">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  {["Dashboard", "AI Assistant", "Medicine Search", "Hospitals"].map((link) => (
                    <li key={link}>
                      <Link
                        to={user || link === "Sign Up" ? `/${link.toLowerCase().replace(" ", "-")}` : "#"}
                        onClick={() =>
                          user || link === "Sign Up"
                            ? null
                            : handleProtectedLink(`/${link.toLowerCase().replace(" ", "-")}`, link)
                        }
                        className="text-sm sm:text-base text-[#A4B5C4] hover:text-[#5AC8FA] transition-colors"
                        aria-label={`Go to ${link}`}
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold font-['Sora',sans-serif] mb-4 tracking-tight">
                  Support
                </h4>
                <ul className="space-y-2">
                  {["FAQ", "Privacy Policy", "About Us", "Support Center"].map((link) => (
                    <li key={link}>
                      <Link
                        to={`/${link.toLowerCase().replace(" ", "-")}`}
                        className="text-sm sm:text-base text-[#A4B5C4] hover:text-[#5AC8FA] transition-colors"
                        aria-label={`Go to ${link}`}
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold font-['Sora',sans-serif] mb-4 tracking-tight">
                  Connect With Us
                </h4>
                <div className="flex space-x-4">
                  {[
                    {
                      name: "Twitter",
                      icon: (
                        <svg
                          className="w-6 sm:w-7 h-6 sm:h-7 group-hover:scale-110 transition-transform"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ),
                      url: "https://x.com/SadeedKhan42070?t=8_R_-uGMlNh2pK1i9EKU7Q&s=08", // Replace with official Healora account
                    },
                    {
                      name: "Facebook",
                      icon: (
                        <svg
                          className="w-6 sm:w-7 h-6 sm:h-7 group-hover:scale-110 transition-transform"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                      ),
                      url: "https://www.facebook.com/share/1AnHpoRyP8/", // Replace with official Healora account
                    },
                    {
                      name: "Instagram",
                      icon: (
                        <svg
                          className="w-6 sm:w-7 h-6 sm:h-7 group-hover:scale-110 transition-transform"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.266-.058 1.646-.07 4.85-.07m0-2.163c-3.259 0-3.667.014-4.947.072-1.406.062-2.713.332-3.927 1.546S2.64 4.12 2.578 5.526c-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.062 1.406.332 2.713 1.546 3.927s2.521 1.484 3.927 1.546c1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.406-.062 2.713-.332 3.927-1.546s1.484-2.521 1.546-3.927c.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.062-1.406-.332-2.713-1.546-3.927s-2.521-1.484-3.927-1.546c-1.28-.058-1.688-.072-4.947-.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.345a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                        </svg>
                      ),
                      url: "https://www.instagram.com/yooo_sadeed?igsh=MXBhcXNkZHpkYXU4cA==", // Replace with official Healora account
                    },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className="group text-[#A4B5C4] hover:text-[#5AC8FA] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow Healora on ${social.name}`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 sm:mt-12 pt-8 border-t border-[#A4B5C4]/20 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm sm:text-base text-[#A4B5C4]">
                © 2025 Healora. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/privacy-policy"
                  className="text-sm sm:text-base text-[#A4B5C4] hover:text-[#5AC8FA] transition-colors"
                  aria-label="View Privacy Policy"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/about-us"
                  className="text-sm sm:text-base text-[#A4B5C4] hover:text-[#5AC8FA] transition-colors"
                  aria-label="Learn About Us"
                >
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Landing;