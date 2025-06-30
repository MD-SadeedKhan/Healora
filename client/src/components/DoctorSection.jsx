import React from 'react';
import { User, Calendar } from 'lucide-react';

const DoctorSection = () => {
  // Static dummy data for real doctors
  const doctors = [
    { id: 1, name: 'Dr. Priya Sharma', specialty: 'Cardiology' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurology' },
    { id: 3, name: 'Dr. Aisha Khan', specialty: 'Pediatrics' },
    { id: 4, name: 'Dr. James Patel', specialty: 'Orthopedics' },
    { id: 5, name: 'Dr. Emily Nguyen', specialty: 'Dermatology' },
  ];

  // Predefined availability options that rotate daily
  const availabilityOptions = [
    'Available Now',
    'Tomorrow 9 AM',
    'Tomorrow 2 PM',
    'Available in 2 Days',
    'Not Available',
  ];

  // Get current day of the month to cycle availability
  const today = new Date();
  const dayOfMonth = today.getDate(); // 1 to 31
  const dayIndex = dayOfMonth % availabilityOptions.length; // Cycle through options

  // Assign availability to doctors based on day
  const doctorsWithAvailability = doctors.map((doctor, index) => ({
    ...doctor,
    availability: availabilityOptions[(dayIndex + index) % availabilityOptions.length], // Offset for each doctor
  }));

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Find a Doctor</h3>
      <div className="space-y-4">
        {doctorsWithAvailability.map((doctor) => (
          <div
            key={doctor.id}
            className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/30 hover:bg-white/60 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{doctor.name}</h4>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{doctor.availability}</p>
              <button className="mt-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-xl hover:from-blue-600 hover:to-teal-500 transition-all duration-200">
                <Calendar className="w-4 h-4 mr-2 inline" /> Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorSection;