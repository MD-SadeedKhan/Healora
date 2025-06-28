import React from 'react';
import { CheckCircle } from 'lucide-react'; // Assuming you're using lucide-react

const SuccessMessage = ({ message }) => {
  const [header, subtext] = message.split('|');
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 text-center shadow-2xl animate-fade-in">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white font-['Poppins'] mb-2">{header}</h3>
        <p className="text-white/90 mb-4">{subtext}</p>
        <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default SuccessMessage;