import React from 'react';
import { Bot, Heart } from 'lucide-react';

const ChatHeader = () => {
  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              Healora <Heart className="w-5 h-5 text-red-500" />
            </h1>
            <p className="text-sm text-gray-600">Your Intelligent Health Companion</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 font-medium">Online</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;