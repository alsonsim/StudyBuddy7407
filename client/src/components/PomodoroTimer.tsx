import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Settings, X, Coffee, Briefcase } from 'lucide-react';
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { auth, db } from "../firebase";

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ isOpen, onClose }) => {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [showSettings, setShowSettings] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work'
    ? ((workDuration * 60 - time) / (workDuration * 60)) * 100
    : ((breakDuration * 60 - time) / (breakDuration * 60)) * 100;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      if (mode === "work") {
        // Only update progress if it was a work session
        updateStudyProgress(workDuration);
      }

      const newMode = mode === 'work' ? 'break' : 'work';
      const newTime = newMode === 'work' ? workDuration * 60 : breakDuration * 60;

      setMode(newMode);
      setTime(newTime);
      setIsRunning(false);

      document.body.style.background = newMode === 'work' ? '#3730a3' : '#059669';
      setTimeout(() => {
        document.body.style.background = '';
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, time, mode, workDuration, breakDuration]);

  const resetTimer = () => {
    setIsRunning(false);
    setTime(mode === 'work' ? workDuration * 60 : breakDuration * 60);
  };

  const skipPhase = () => {
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    setTime(newMode === 'work' ? workDuration * 60 : breakDuration * 60);
    setIsRunning(false);
  };

  const applySettings = () => {
    setIsRunning(false);
    setTime(mode === 'work' ? workDuration * 60 : breakDuration * 60);
    setShowSettings(false);
  };

  const updateStudyProgress = async (minutes: number) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();

    const hoursToAdd = minutes / 60;

    await updateDoc(userRef, {
      studyHours: increment(hoursToAdd),
    });

    console.log(`✅ Added ${hoursToAdd} hours to ${user.uid}`);

}
  if (!isOpen) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 overflow-y-auto">
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`relative p-8 text-center transition-all duration-700 ${
            mode === 'work'
              ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800'
              : 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700'
          }`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:rotate-90 transition-all duration-300 cursor-pointer"
            >
              <X size={24} />
            </button>

            <div className="mb-4 flex justify-center">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm transition-all duration-500 hover:scale-110">
                {mode === 'work'
                  ? <Briefcase size={32} className="text-white" />
                  : <Coffee size={32} className="text-white" />}
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">
              {mode === 'work' ? 'Focus Time' : 'Break Time'}
            </h2>
            <p className="text-white/80 text-sm font-medium">
              {mode === 'work' ? 'Time to be productive' : 'Time to recharge'}
            </p>
          </div>

          {/* Main Content: Timer + Settings Side-by-Side */}
          <div className="p-8 bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Timer Section */}
              <div className="flex-1">
                <div className="relative flex justify-center mb-8">
                  <div className="relative w-64 h-64">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-200" />
                      <circle
                        cx="50" cy="50" r="45"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                        className={`transition-all duration-1000 ${mode === 'work' ? 'text-indigo-500' : 'text-emerald-500'}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-4xl font-bold transition-all duration-500 ${mode === 'work' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                          {formatTime(time)}
                        </div>
                        <div className="text-xs text-gray-500 mt-2 font-medium">
                          {Math.round(progress)}% complete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mb-6">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`p-4 rounded-full transition-all duration-300 shadow-lg ${
                      mode === 'work'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                    } cursor-pointer`}
                  >
                    {isRunning ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
                  </button>

                  <button
                    onClick={resetTimer}
                    className="p-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg cursor-pointer"
                  >
                    <div className="w-6 h-6 border-2 border-white rounded-full relative">
                      <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
                    </div>
                  </button>

                  <button
                    onClick={skipPhase}
                    className="p-4 rounded-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 transition-all duration-300 shadow-lg cursor-pointer"
                  >
                    <SkipForward size={24} className="text-white" />
                  </button>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`flex items-center gap-2 mx-auto px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                      showSettings
                        ? (mode === 'work' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700')
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Settings size={18} className={`transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`} />
                    <span className="font-medium">Settings</span>
                  </button>
                </div>
              </div>

              {/* Settings Panel */}
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                showSettings ? 'w-[320px] opacity-100' : 'w-0 opacity-0'
              }`}>
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 rounded-xl h-full shadow-inner">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Timer Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Work Duration</label>
                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={workDuration}
                        onChange={(e) => setWorkDuration(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-indigo"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 min</span>
                        <span className="font-bold text-indigo-600">{workDuration} min</span>
                        <span>60 min</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Break Duration</label>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={breakDuration}
                        onChange={(e) => setBreakDuration(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 min</span>
                        <span className="font-bold text-emerald-600">{breakDuration} min</span>
                        <span>30 min</span>
                      </div>
                    </div>

                    <button
                      onClick={applySettings}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
                    >
                      Apply Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider-indigo::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }
        .slider-emerald::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #06b6d4);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        @keyframes animate-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: animate-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PomodoroTimer;