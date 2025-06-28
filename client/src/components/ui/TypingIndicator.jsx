import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex items-start space-x-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-teal-500 to-green-500 shadow-sm">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm relative">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <div className="absolute left-0 top-4 w-0 h-0 border-r-8 border-t-8 border-r-white border-t-transparent" />
      </div>
      <div className="text-xs text-gray-500 self-end pb-1">Healora is typing...</div>
    </div>
  );
};

export default TypingIndicator;