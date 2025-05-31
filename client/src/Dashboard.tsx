import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-10 text-center">
          Welcome back to your StudyBuddy Dashboard!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Streak Counter */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-indigo-700 mb-2">🔥 Streak Counter</h2>
            <p className="text-gray-700">You're on a <strong>5-day streak</strong>! Keep it up!</p>
          </div>

          {/* Timer */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-indigo-700 mb-2">⏳ Timer</h2>
            <p className="text-gray-700">Start a Pomodoro session or track your study time.</p>
          </div>

          {/* Study Buddy Matching */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-indigo-700 mb-2">👥 Study Buddy Matching</h2>
            <p className="text-gray-700">Coming soon! Match with peers based on your goals and faculty.</p>
          </div>

          {/* Daily Goal Tracker */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-indigo-700 mb-2">🎯 Daily Goal Tracker</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Finish MA1508E revision</li>
              <li>Attend group meeting at 3PM</li>
              <li>Upload CS2100 notes</li>
            </ul>
          </div>

          {/* Progress Overview */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-indigo-700 mb-2">📈 Progress Overview</h2>
            <p className="text-gray-700">You’ve completed <strong>12/20 goals</strong> this week. Great work!</p>
          </div>

          {/* Motivational Quote */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-indigo-700 mb-2">💡 Motivational Quote</h2>
            <p className="italic text-gray-700">"The secret of getting ahead is getting started." – Mark Twain</p>
          </div>
        </div>
      </div>
    </div>
  );
}
