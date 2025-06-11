import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const persistenceType = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;

      await setPersistence(auth, persistenceType);
      await signInWithEmailAndPassword(auth, email, password);

      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans flex flex-col justify-between">
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div
            className={`flex justify-between items-center transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
            }`}
          >
            <div
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <BookOpen className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                StudyBuddy
              </h2>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500">
              Log in to StudyBuddy and continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-indigo-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-inner"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-indigo-600 pr-10 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-indigo-500 hover:scale-110 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="cursor-pointer appearance-none w-5 h-5 border border-gray-300 rounded-sm bg-white checked:bg-indigo-600 checked:border-indigo-600 transition peer"
                  />
                  <svg
                    className="absolute top-[2px] left-[2px] w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Remember me</span>
              </label>

              <Link to="/forgot-password" className="text-indigo-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-md"
            >
              Sign In
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register" className="text-indigo-500 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/20 bg-white/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <div className="flex items-center justify-center gap-3 mb-4 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <BookOpen className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              StudyBuddy
            </span>
          </div>
          <p className="text-sm hover:text-gray-800 transition-colors duration-300">
            Built with ❤️ for NUS students • © 2025 StudyBuddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Login;
