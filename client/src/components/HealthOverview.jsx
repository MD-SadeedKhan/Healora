import React from 'react';
import { Bar } from 'react-chartjs-2';
import { MessageSquare, Search, Hospital } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HealthOverview = () => {
  const stats = [
    { label: 'AI Queries', value: '24', change: '+12%', icon: MessageSquare, color: 'text-blue-600' },
    { label: 'Medicine Searches', value: '8', change: '+5%', icon: Search, color: 'text-teal-600' },
    { label: 'Hospital Visits', value: '2', change: '0%', icon: Hospital, color: 'text-purple-600' }
  ];

  const recentSymptoms = ['Headache', 'Fatigue', 'Cough', 'Fever', 'Nausea'];
  const activityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Activity',
        data: [4, 7, 3, 8, 6, 2, 5],
        backgroundColor: 'rgba(90, 200, 250, 0.6)',
        borderColor: 'rgba(90, 200, 250, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Health Overview</h3>
        <div className="space-y-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-white/40 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-800">{stat.value}</span>
                  <span className={`text-xs ml-2 px-2 py-1 rounded-full ${
                    stat.change.includes('+') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Symptoms</h3>
        <div className="flex flex-wrap gap-2">
          {recentSymptoms.map((symptom, index) => (
            <span
              key={index}
              className="px-3 py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full text-sm font-medium hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {symptom}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Activity</h3>
        <Bar data={activityData} options={options} />
      </div>
    </div>
  );
};

export default HealthOverview;