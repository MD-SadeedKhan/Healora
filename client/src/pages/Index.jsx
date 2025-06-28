import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import WelcomeSection from '../components/WelcomeSection';
import QuickActionCards from '../components/QuickActionCards';
import HealthOverview from '../components/HealthOverview';
import RecentActivity from '../components/RecentActivity';
import SavedMedicines from '../components/SavedMedicines';
import SettingsModal from '../components/SettingsModal';
import DoctorSection from '../components/DoctorSection';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/useAuth'; // Updated import to useAuth.js

const Index = () => {
  const { darkMode, setDarkMode } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const { user } = useAuth();

  // Debug log to confirm user state
  useEffect(() => {
    console.log('Index - User:', user);
  }, [user]);

  // Construct full name from firstName and lastName
  const fullName = `${user?.firstName || 'Guest'} ${user?.lastName || ''}`.trim();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-teal-50'} transition-all duration-300`}>
      <div className="flex w-full">
        <Sidebar onSettingsClick={() => setShowSettings(true)} />
        
        <div className="flex-1 flex flex-col">
          <Header darkMode={darkMode} userName={fullName} />
          
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <WelcomeSection userName={fullName} />
              
              <QuickActionCards />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <RecentActivity />
                  <SavedMedicines />
                </div>
                <div className="space-y-6">
                  <HealthOverview />
                  <DoctorSection />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {showSettings && (
        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
    </div>
  );
};

export default Index;