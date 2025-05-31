import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main content */}
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-indigo-500 text-white px-8 py-12 rounded-xl mx-6 md:mx-16 lg:mx-32 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 pl-8 md:pl-40">
            <h1 className="text-3xl md:text-4xl font-semibold mb-6 inria-font">
              Track your goals. <br />Plan smarter. Study better.
            </h1>
            <p className="text-sm md:text-base mb-6">
              Built for NUS students, StudyBuddy helps you connect with like-minded peers to study together, stay accountable, and boost your academic performance. Whether you're revising for finals or building a consistent study routine, we’ve got you covered.
            </p>
            <p className="text-sm md:text-base mb-8">
              Sign up today and find your perfect study match!
            </p>
            <button
              onClick={() => navigate('/register')}
              className="cursor-pointer bg-white text-indigo-600 font-semibold text-lg px-8 py-4 rounded-lg hover:scale-105 hover:bg-gray-100 transition transform duration-200"
            >
              Get Started
            </button>
          </div>
          <div className="md:w-1/2">
            <img src="/study.svg" alt="Hero illustration" className="w-full max-w-md mx-auto animate-bounce-slow" />
          </div>
        </section>

        {/* Tools */}
        <section className="text-center py-16 px-4">
          <h2 className="text-xl md:text-3xl font-semibold text-indigo-700 mb-10 inria-font">The tools for your goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-bounce-slow">
            <div className="bg-indigo-50 p-6 rounded-lg shadow hover:shadow-md transition">
              <img src="/icons/timer.svg" alt="Pomodoro" className="w-14 h-14 mb-4 mx-auto filter-indigo transition-transform duration-200 hover:scale-110" />
              <h3 className="text-indigo-700 font-semibold mb-2">Pomodoro</h3>
              <p className="text-sm text-gray-700">
                Stay focused with the Pomodoro technique. Work in short bursts with timed breaks to boost productivity.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg shadow hover:shadow-md transition">
              <img src="/icons/friend-search.svg" alt="User Matching" className="w-14 h-14 mb-4 mx-auto filter-indigo transition-transform duration-200 hover:scale-110" />
              <h3 className="text-indigo-700 font-semibold mb-2">User Matching</h3>
              <p className="text-sm text-gray-700">
                Find the perfect study buddy based on your major, modules, goals, and schedule. Stay motivated together.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg shadow hover:shadow-md transition">
              <img src="/icons/leaderboard.svg" alt="Leaderboard" className="w-14 h-14 mb-4 mx-auto filter-indigo transition-transform duration-200 hover:scale-110" />
              <h3 className="text-indigo-700 font-semibold mb-2">Leaderboard</h3>
              <p className="text-sm text-gray-700">
                Track your progress and climb the leaderboard as you complete tasks and build good study habits.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
