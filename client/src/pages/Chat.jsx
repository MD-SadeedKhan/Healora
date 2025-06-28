import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Mic } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MessageBubble from '../components/ui/MessageBubble';
import TypingIndicator from '../components/ui/TypingIndicator';
import ChatHeader from '../components/ui/ChatHeader';
import { toast } from 'react-hot-toast';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: "Hello! I'm Healora, your intelligent health companion. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
      provider: 'system',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const recognition = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => setIsListening(false);
      recognition.current.onend = () => setIsListening(false);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    console.log('📤 [Chat] Sending prompt:', inputMessage);
    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('🔑 [Chat] Token:', token ? token.substring(0, 10) + '...' : 'Not found');
      if (!token) {
        toast.error('Please log in to use the AI Assistant');
        throw new Error('No token found');
      }

      const response = await axios.post(
        'http://localhost:5000/api/ai-response',
        { prompt: inputMessage },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      console.log('📥 [Chat] AI Response:', response.data);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response.data.response || 'No valid response received.',
        sender: 'ai',
        timestamp: new Date(),
        provider: response.data.provider || 'unavailable',
      };

      setMessages((prev) => [...prev, aiMessage]);
      toast.success('Query processed successfully!');
    } catch (error) {
      console.error('❌ [Chat] Error fetching AI response:', error.response?.data || error.message);
      toast.error(
        error.message === 'No token found' || error.response?.status === 401
          ? 'Session expired. Please log in again.'
          : 'Failed to get AI response. Try again later.'
      );
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: 'Error: Could not fetch AI response. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
          provider: 'error',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      try {
        recognition.current.start();
      } catch (error) {
        console.error('🎤 [Chat] Voice recognition failed:', error);
        setIsListening(false);
        toast.error('Voice recognition failed. Try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <ChatHeader />
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
          <div className="flex items-end space-x-3 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your health concerns..."
                className="w-full pr-12 py-3 text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                disabled={isLoading}
              />
              <Button
                onClick={startListening}
                size="sm"
                variant="ghost"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2 transition-all duration-200 ${
                  isListening
                    ? 'bg-red-100 text-red-600 animate-pulse'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                disabled={isLoading}
              >
                <Mic size={18} />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="rounded-full p-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Send size={20} className="text-white" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2 max-w-3xl mx-auto">
            Healora provides general health information. Always consult with healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;