import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../context/useAuth'; // Updated import to useAuth.js

const WelcomeSection = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const healthTips = [
    "💧 Drink at least 8 glasses of water daily for optimal health",
    "🏃‍♂️ Take a 10-minute walk after meals to aid digestion",
    "🧘‍♀️ Practice 5 minutes of deep breathing to reduce stress",
    "🥗 Include colorful vegetables in every meal for better nutrition",
    "😴 Maintain a consistent sleep schedule for better rest"
  ];

  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];

  // Construct full name from firstName and lastName
  const fullName = `${user?.firstName || 'User'} ${user?.lastName || ''}`.trim();
  console.log('WelcomeSection - userName:', fullName); // Moved debug log here

  return (
    <div className="bg-gradient-to-r from-blue-500/10 via-white/60 to-teal-400/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-400 rounded-3xl flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Good morning, <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">{fullName}!</span>
            </h1>
            <p className="text-gray-600 mt-1">Ready to take charge of your health today?</p>
          </div>
        </div>

        <div className="relative">
          <Bell className="w-6 h-6 text-blue-500 animate-pulse" />
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse" />
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">💡 Daily Health Tip</h3>
            <p className="text-sm text-gray-600">{randomTip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;