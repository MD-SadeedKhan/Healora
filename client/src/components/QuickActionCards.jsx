import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Hospital, FileText } from 'lucide-react';

const QuickActionCards = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      title: 'Search Medicine',
      description: 'Find medications and their details',
      icon: Search,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50/50',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      path: '/medicine-search'
    },
    {
      id: 2,
      title: 'Ask AI Assistant',
      description: 'Get instant health advice',
      icon: MessageSquare,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50/50',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700',
      path: '/ai-assistant'
    },
    {
      id: 3,
      title: 'Find Hospitals',
      description: 'Locate nearby healthcare facilities',
      icon: Hospital,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50/50',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      path: '/hospitals'
    },
    {
      id: 4,
      title: 'Health Records',
      description: 'View your medical history',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50/50',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      path: '/health-records' // Change this route if you haven’t built it yet
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <div
            key={action.id}
            onClick={() => navigate(action.path)}
            className={`${action.bgColor} backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${action.color} ${action.hoverColor} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>

              <div className="w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickActionCards;
