import React from 'react';
import { Bot, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  const formatTime = (date) =>
    new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }).format(new Date(date));

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      toast.success('Response copied to clipboard!');
    }).catch((err) => {
      console.error('❌ [MessageBubble] Copy failed:', err);
      toast.error('Failed to copy response.');
    });
  };

  return (
    <div
      className={`flex items-start space-x-3 animate-fade-in ${
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
            : 'bg-gradient-to-r from-teal-500 to-green-500'
        }`}
      >
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${isUser ? 'ml-auto' : 'mr-auto'}`}
      >
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-sm backdrop-blur-sm border transition-all duration-200 hover:shadow-md ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-300/50 rounded-br-md'
              : 'bg-white/90 text-gray-800 border-gray-200/50 rounded-bl-md'
          }`}
        >
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          {!isUser && (
            <div className="text-right mt-1">
              <button
                onClick={handleCopy}
                className="text-xs text-blue-500 hover:underline focus:outline-none"
              >
                Copy Response
              </button>
              {message.provider && message.provider !== 'system' && (
                <div className="text-xs text-gray-400 italic mt-1">
                  Powered by {message.provider}
                </div>
              )}
            </div>
          )}
          <div
            className={`absolute w-0 h-0 ${
              isUser
                ? 'right-0 top-4 border-l-8 border-t-8 border-l-blue-500 border-t-transparent'
                : 'left-0 top-4 border-r-8 border-t-8 border-r-white border-t-transparent'
            }`}
          />
        </div>
        <div className={`mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp || new Date())}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;