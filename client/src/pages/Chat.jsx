import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Send, Mic } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MessageBubble from '../components/ui/MessageBubble';
import TypingIndicator from '../components/ui/TypingIndicator';
import ChatHeader from '../components/ui/ChatHeader';
import { toast } from 'react-hot-toast';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-100">
          <div className="text-center p-4">
            <h1 className="text-2xl font-bold text-red-600">Oops! Something went wrong.</h1>
            <p className="text-gray-600 mt-2">Error: {this.state.error?.message || 'Unknown error'}</p>
            <Link
              to="/"
              className="mt-4 inline-block text-blue-500 underline"
              aria-label="Go back to home page"
            >
              Go back home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      if (SpeechGrammarList) {
        const grammar = '#JSGF V1.0; grammar health; public <health> = health | doctor | medicine | appointment ;';
        const speechRecognitionList = new SpeechGrammarList();
        try {
          if (speechRecognitionList.addFromString) {
            console.log('🎤 [Chat] Adding speech grammar');
            speechRecognitionList.addFromString(grammar, 1);
            recognition.current.grammars = speechRecognitionList;
          } else {
            console.warn('⚠️ [Chat] SpeechGrammarList.addFromString not supported');
          }
        } catch (error) {
          console.error('❌ [Chat] Error adding speech grammar:', error.message);
          toast.error('Failed to initialize speech recognition grammar.');
        }
      } else {
        console.warn('⚠️ [Chat] SpeechGrammarList not supported in this browser');
      }

      recognition.current.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        console.log('🎤 [Chat] Speech recognized:', transcript);
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = (error) => {
        console.error('🎤 [Chat] Speech recognition error:', error);
        setIsListening(false);
        toast.error('Speech recognition failed. Please try again.');
      };

      recognition.current.onend = () => {
        console.log('🎤 [Chat] Speech recognition ended');
        setIsListening(false);
      };
    } else {
      console.warn('⚠️ [Chat] SpeechRecognition not supported in this browser');
      toast.error('Voice input is not supported in this browser.');
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
        'https://healora-backend.onrender.com/api/ai-response',
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
        console.log('🎤 [Chat] Starting speech recognition');
        recognition.current.start();
      } catch (error) {
        console.error('🎤 [Chat] Voice recognition failed:', error);
        setIsListening(false);
        toast.error('Voice recognition failed. Try again.');
      }
    } else {
      console.warn('⚠️ [Chat] Speech recognition not available or already active');
      toast.error('Voice input not available.');
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 font-['Manrope',sans-serif] flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 sm:px-4">
          <ChatHeader />
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-2 py-4 space-y-4 sm:px-4 sm:py-6"
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 sm:p-4">
            <div className="flex items-end space-x-2 max-w-3xl mx-auto sm:space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your health concerns..."
                  className="w-full pr-10 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent sm:pr-12 sm:py-3 sm:text-base"
                  disabled={isLoading}
                  aria-label="Enter your health query"
                />
                <Button
                  onClick={startListening}
                  size="sm"
                  variant="ghost"
                  className={`absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full p-2 transition-all duration-200 sm:right-2 ${
                    isListening
                      ? 'bg-red-100 text-red-600 animate-pulse'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  disabled={isLoading || !recognition.current}
                  aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                >
                  <Mic size={16} className="sm:size-18" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="rounded-full p-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg sm:p-3"
                aria-label="Send message"
              >
                <Send size={18} className="text-white sm:size-20" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2 max-w-3xl mx-auto">
              Healora provides general health information. Always consult with healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Chat;