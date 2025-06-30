import React from 'react';
import { MessageSquare, Search, Clock } from 'lucide-react';

const RecentActivity = () => {
  // Static dummy data for realistic user activities
  const activities = [
    {
      id: 1,
      type: 'ai-chat',
      title: 'Asked about chronic back pain',
      preview: 'Possible causes include muscle strain or sciatica. Consider consulting a specialist...',
      confidence: 82,
      tags: ['back-pain', 'muscle-strain', 'sciatica'],
    },
    {
      id: 2,
      type: 'medicine',
      title: 'Searched for Paracetamol',
      preview: 'Pain reliever and fever reducer, commonly used for headaches and mild pain...',
      confidence: 90,
      tags: ['pain-relief', 'fever', 'medication'],
    },
    {
      id: 3,
      type: 'ai-chat',
      title: 'Checked symptoms for allergies',
      preview: 'Symptoms suggest seasonal allergies. Antihistamines may help, consult a doctor...',
      confidence: 75,
      tags: ['allergies', 'symptoms', 'antihistamines'],
    },
    {
      id: 4,
      type: 'hospital',
      title: 'Found nearby pediatric clinic',
      preview: 'Sunshine Pediatric Care - 1.5 miles away, open for appointments...',
      confidence: null,
      tags: ['pediatrics', 'clinic', 'nearby'],
    },
    {
      id: 5,
      type: 'ai-chat',
      title: 'Asked about insomnia treatment',
      preview: 'Sleep hygiene or cognitive therapy may help. Consult a sleep specialist if persistent...',
      confidence: 80,
      tags: ['insomnia', 'sleep', 'therapy'],
    },
  ];

  // Predefined time options that rotate daily
  const timeOptions = [
    'Just Now',
    '1 hour ago',
    '3 hours ago',
    '6 hours ago',
    '12 hours ago',
    '1 day ago',
    '2 days ago',
  ];

  // Get current day of the month to cycle time
  const today = new Date();
  const dayOfMonth = today.getDate(); // 1 to 31
  const dayIndex = dayOfMonth % timeOptions.length; // Cycle through options

  // Assign time to activities based on day
  const activitiesWithTime = activities.map((activity, index) => ({
    ...activity,
    time: timeOptions[(dayIndex + index) % timeOptions.length], // Offset for each activity
  }));

  const getIcon = (type) => {
    switch (type) {
      case 'ai-chat':
        return MessageSquare;
      case 'medicine':
        return Search;
      default:
        return Clock;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'ai-chat':
        return 'text-blue-600 bg-blue-100';
      case 'medicine':
        return 'text-teal-600 bg-teal-100';
      default:
        return 'text-purple-600 bg-purple-100';
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activitiesWithTime.map((activity) => {
          const Icon = getIcon(activity.type);
          const iconColor = getIconColor(activity.type);

          return (
            <div
              key={activity.id}
              className="group p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/60 transition-all duration-200 cursor-pointer hover:shadow-md"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {activity.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {activity.confidence && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            activity.confidence >= 90
                              ? 'bg-green-100 text-green-600'
                              : activity.confidence >= 70
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {activity.confidence}% confident
                        </span>
                      )}
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {activity.preview}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {activity.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 rounded-lg text-xs font-medium hover:shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;