import React, { useState } from 'react';
import { Bell, User, Search } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = ({ darkMode }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth(); // Make sure logout function exists in your context
  const navigate = useNavigate();

  const fullName = `${user?.firstName || 'User'} ${user?.lastName || ''}`.trim();

  const notifications = [
    { id: 1, text: 'AI Health tip: Stay hydrated!', time: '2 min ago', unread: true },
    { id: 2, text: 'Medicine reminder: Take your vitamins', time: '1 hour ago', unread: true },
    { id: 3, text: 'New hospital added to your area', time: '3 hours ago', unread: false },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleNavigate = (path) => {
    setShowProfile(false);
    navigate(path);
  };

  const handleSignOut = () => {
    setShowProfile(false);
    logout(); // Optional: clear token, user info
    navigate('/login');
  };

  return (
    <header className={`bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm sticky top-0 z-40 ${
      darkMode ? 'bg-gray-800/70 text-white' : 'text-gray-800'
    }`}>
      <div className="px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          
          {/* Welcome Text */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Welcome back, {fullName}!</h2>
            <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-500'}`}>{currentDate}</p>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search medicines, symptoms, or hospitals..."
                className={`w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-200 ${
                  darkMode ? 'text-white placeholder-gray-300' : 'text-gray-800 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 ${
                  darkMode ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                } rounded-2xl transition-all duration-200 hover:scale-110`}
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </button>

              {showNotifications && (
                <div className={`absolute right-0 top-12 w-80 ${
                  darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-800'
                } backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50`}>
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 border-b ${
                        darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-50 hover:bg-blue-50/50'
                      } ${notification.unread ? 'bg-blue-50/30' : ''}`}>
                        <p className="text-sm">{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className={`flex items-center space-x-2 p-2 rounded-2xl ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'
                } transition-all duration-200 hover:scale-105`}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{fullName}</p>
                </div>
              </button>

              {showProfile && (
                <div className={`absolute right-0 top-12 w-48 ${
                  darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-700'
                } backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50`}>
                  <div className="p-2">
                    <button
                      onClick={() => handleNavigate('/profile')}
                      className={`w-full text-left px-3 py-2 text-sm ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-blue-50'
                      } rounded-xl transition-colors`}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className={`w-full text-left px-3 py-2 text-sm ${
                        darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'
                      } rounded-xl transition-colors`}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
