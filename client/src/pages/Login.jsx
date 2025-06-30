import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('📝 [Login] Response status:', response.status);
      const data = await response.json();
      console.log('📥 [Login] Response data:', data);
      console.log('📤 [Login] Request body:', { email, password });

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }

      if (data.success) {
        console.log('✅ [Login] Successful, storing token:', data.token);
        const userData = {
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          id: data.user.id,
          email: data.user.email,
          token: data.token,
        };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        login(userData);
        console.log('✅ [Login] Auth state updated, navigating to /dashboard');
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      if (err.message.includes('Invalid credentials')) {
        setError('Invalid email or password. Please register or verify your email.');
      } else if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Failed to connect to the server. Please check your network.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('❌ [Login] Error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#38BDF8] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-24 h-24 bg-white/5 rounded-full blur-xl sm:w-32 sm:h-32"></div>
        <div className="absolute bottom-32 right-20 w-20 h-20 bg-white/10 rounded-full blur-xl sm:w-24 sm:h-24"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full blur-lg sm:w-16 sm:h-16"></div>
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md">
        <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center sm:w-12 sm:h-12">
                <Heart className="w-6 h-6 text-white sm:w-8 sm:h-8" />
              </div>
              <h1 className="text-xl font-bold text-[#4682B4] font-['Poppins'] sm:text-2xl">Healora</h1>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 font-['Poppins'] drop-shadow-sm sm:text-3xl">
              Welcome Back to Healora
            </h2>
            <p className="text-white/90 text-xs sm:text-sm">
              Login to continue your intelligent healthcare journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="p-2 bg-red-500/20 text-red-200 rounded-xl text-xs sm:p-3 sm:text-sm">
                {error}
              </div>
            )}
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="text-white font-medium drop-shadow-sm text-sm sm:text-base">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-white/70 sm:top-3 sm:h-5 sm:w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 backdrop-blur-sm text-sm sm:text-base py-2 sm:py-3"
                  required
                  aria-label="Email address"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password" className="text-white font-medium drop-shadow-sm text-sm sm:text-base">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-white/70 sm:top-3 sm:h-5 sm:w-5" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 backdrop-blur-sm text-sm sm:text-base py-2 sm:py-3"
                  required
                  aria-label="Password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-white/70 hover:text-white transition-colors sm:top-3"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-white/90 hover:text-white transition-colors underline drop-shadow-sm sm:text-sm"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 sm:py-3"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center sm:mt-6">
            <p className="text-white/90 text-xs drop-shadow-sm sm:text-sm">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-white font-semibold hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/30 sm:mt-8 sm:pt-6">
            <div className="flex items-center justify-center gap-4 text-xs text-white/80 sm:gap-6">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Secure Login
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                HIPAA Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;