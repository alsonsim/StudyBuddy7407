import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {/* Illustration */}
      <img
        src="/study.svg"
        alt="Study Illustration"
        className="w-64 h-auto mb-6 animate-fadeInUp"
      />

      {/* Title */}
      <h1 className="text-5xl font-bold text-indigo-700 mb-4">
        Welcome to StudyBuddy 👋
      </h1>

      {/* Tagline */}
      <p className="text-lg text-gray-700 max-w-xl mb-6">
        Track your goals. Plan smarter. Study better.
      </p>

      {/* Features */}
      <ul className="text-gray-600 space-y-2 mb-6">
        <li>✅ Personalized study plans</li>
        <li>📊 Visual progress tracking</li>
        <li>🧠 Focused learning sessions</li>
        <li>👥 Study with friends or groups</li>
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/register')}
        className="cursor-pointer px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 hover:scale-105 transition duration-300"
      >
        Get Started
      </button>
    </div>
  );
}
