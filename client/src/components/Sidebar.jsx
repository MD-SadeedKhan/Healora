import React, { useState } from 'react';
import {
  Bell,
  Search,
  Settings,
  LogOut,
  FileText,
  Hospital,
  MessageSquare,
  BookUser,
  User,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Bell, path: '/dashboard' },
    { id: 'ai-assistant', label: 'AI Chat', icon: MessageSquare, path: '/ai-assistant' },
    { id: 'medicine', label: 'Medicine Search', icon: Search, path: '/medicine-search' },
    { id: 'hospitals', label: 'Nearby Hospitals', icon: Hospital, path: '/hospitals' },
    { id: 'health-records', label: 'Health Records', icon: FileText, path: '/health-records' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSettingsClick = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const currentPath = location.pathname;

  return (
    <div
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-white/70 backdrop-blur-xl border-r border-white/20 shadow-xl transition-all duration-300 flex flex-col h-screen sticky top-0`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg">
            <BookUser className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Healora
              </h1>
              <p className="text-xs text-gray-500">Your Intelligent Health Companion</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-white/50 hover:shadow-md hover:scale-105'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'
                } transition-colors`}
              />
              {!isCollapsed && (
                <span className={`font-medium ${isActive ? 'text-white' : 'group-hover:text-gray-700'}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={handleSettingsClick}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-white/50 hover:shadow-md hover:scale-105 transition-all duration-200 group"
        >
          <Settings className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
          {!isCollapsed && <span className="font-medium group-hover:text-gray-700">Settings</span>}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 hover:shadow-md hover:scale-105 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:scale-110 transition-all duration-200"
      >
        <div
          className={`w-2 h-2 bg-gray-400 rounded-full transform transition-transform ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
};

export default Sidebar;
