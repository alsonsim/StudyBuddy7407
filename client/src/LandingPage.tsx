import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans">

      {/* Hero */}
      <section className="bg-indigo-500 text-white px-8 py-12 rounded-xl mx-6 md:mx-16 lg:mx-32 flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 inria-font">Track your goals. <br />Plan smarter. Study better.</h1>
          <p className="text-sm md:text-base mb-6">
            Built for NUS students, StudyBuddy helps you connect with like-minded peers to study together, stay accountable, and boost your academic performance. Whether you're revising for finals or building a consistent study routine, we’ve got you covered.
          </p>
          <p className="text-sm md:text-base mb-6">Sign up today and find your perfect study match.</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-indigo-600 font-medium px-5 py-2 rounded hover:bg-gray-100 transition"
          >
            Get Started
          </button>
        </div>
        <div className="md:w-1/2">
          <img src="/study.svg" alt="Hero illustration" className="w-full max-w-md mx-auto" />
        </div>
      </section>

      {/* Tools Section */}
      <section className="text-center py-16 px-4">
        <h2 className="text-xl font-semibold text-indigo-700 mb-10">The tools for your goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Pomodoro */}
          <div className="bg-indigo-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <div className="text-indigo-600 text-3xl mb-2">⏱️</div>
            <h3 className="text-indigo-700 font-semibold mb-2">Pomodoro</h3>
            <p className="text-sm text-gray-700">
              Stay focused with the Pomodoro technique. Work in short bursts with timed breaks to boost productivity.
            </p>
          </div>

          {/* User Matching */}
          <div className="bg-indigo-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <div className="text-indigo-600 text-3xl mb-2">👥</div>
            <h3 className="text-indigo-700 font-semibold mb-2">User Matching</h3>
            <p className="text-sm text-gray-700">
              Find the perfect study buddy based on your major, modules, goals, and schedule. Stay motivated together.
            </p>
          </div>

          {/* Leaderboard */}
          <div className="bg-indigo-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <div className="text-indigo-600 text-3xl mb-2">🏆</div>
            <h3 className="text-indigo-700 font-semibold mb-2">Leaderboard</h3>
            <p className="text-sm text-gray-700">
              Track your progress and climb the leaderboard as you complete tasks and build good study habits.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-500 text-white text-center py-4 text-xs">
        © 2025 StudyBuddy. All rights reserved.
      </footer>
    </div>
  );
}
