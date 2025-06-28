import React from 'react';
import { User, Calendar } from 'lucide-react';

const DoctorSection = () => {
  const doctors = [
    { id: 1, name: 'Dr. Sarah Lee', specialty: 'Cardiology', availability: 'Available Now' },
    { id: 2, name: 'Dr. John Kim', specialty: 'Neurology', availability: 'Tomorrow 10 AM' },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Find a Doctor</h3>
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/30 hover:bg-white/60 transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{doctor.name}</h4>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-xl hover:from-blue-600 hover:to-teal-500 transition-all duration-200">
              <Calendar className="w-4 h-4 mr-2 inline" /> Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorSection;