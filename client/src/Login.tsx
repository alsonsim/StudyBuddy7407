import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const persistenceType = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;

      await setPersistence(auth, persistenceType);
      await signInWithEmailAndPassword(auth, email, password);

      toast.success('Signed in successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-2 text-indigo-600">Sign In</h2>
      <p className="text-sm text-gray-500 mb-6">Your StudyBuddy is waiting!</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded text-indigo-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded text-indigo-600 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="cursor-pointer absolute right-2 top-2 text-indigo-500 hover:scale-110 transition"
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
            <span className="text-gray-700 text-sm">Remember me</span>
          </label>

          <Link to="/forgot-password" className="text-indigo-500 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
        >
          Sign In
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        Don’t have an account?{' '}
        <Link to="/register" className="text-indigo-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;
