import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from './AuthContext';
import PomodoroTimer from './components/PomodoroTimer';

import {
  BarChart3,
  Calendar,
  Users,
  Bell,
  Plus,
  Clock,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Search,
  Flame,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ListTodo,
  Zap,
  Award
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: string;
  createdAt: string;
  userId: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [streak, setStreak] = useState(0); 
  const [streakContinued, setStreakContinued] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [lastStreakDate, setLastStreakDate] = useState<string | null>(null); // In-memory storage
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load user data from Firebase
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.name || user.displayName || 'User');
            setAvatarURL(userData.avatarURL || user.photoURL);
            setStreak(userData.streak || 0);
          } else {
            // Set default values if no document exists
            setName(user.displayName || 'User');
            setAvatarURL(user.photoURL);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setName(user.displayName || 'User');
          setAvatarURL(user.photoURL);
        }
      }
    };

    loadUserData();
  }, [user]);

  // Check if streak was already continued today (using in-memory storage)
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastStreakDate === today) {
      setStreakContinued(true);
    }
  }, [lastStreakDate]);

  useEffect(() => {
  if (!user) return;

  const savedTasks = localStorage.getItem(`tasks_${user.uid}`);
  if (savedTasks) {
    try {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks);
    } catch (error) {
      console.error('Error parsing saved tasks:', error);
      setTasks([]);
    }
  }
}, [user]);

const handleContinueStreak = async () => {
  if (streakContinued || !user) return;

  const newStreak = streak + 1;
  const today = new Date().toDateString();
  const userRef = doc(db, 'users', user.uid);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // Merge into existing data
      await setDoc(userRef, {
        ...userSnap.data(),
        streak: newStreak,
        lastStreakDate: today
      }, { merge: true });
    } else {
      console.warn('User document not found.');
    }

    setStreak(newStreak);
    setStreakContinued(true);
    setShowStreakAnimation(true);
    setLastStreakDate(today);

    setTimeout(() => setShowStreakAnimation(false), 3000);
  } catch (err) {
    console.error('Error updating streak:', err);
  }
};

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const getTaskStats = () => {
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const todayTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate).toDateString() === new Date().toDateString();
  }).length;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  return { completedCount, pendingCount, todayTasks, overdueTasks };
};

const taskStats = getTaskStats();

  return (
    <div className="min-h-screen flex font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-[15px]">
      {/* Animated Fire Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-orange-400 opacity-20 animate-bounce">
          <Flame size={32} />
        </div>
        <div className="absolute top-40 right-20 text-red-400 opacity-15 animate-pulse">
          <Flame size={24} />
        </div>
        <div className="absolute bottom-32 left-1/4 text-yellow-400 opacity-10 animate-bounce" style={{animationDelay: '1s'}}>
          <Flame size={28} />
        </div>
        <div className="absolute top-1/2 right-1/3 text-orange-300 opacity-10 animate-pulse" style={{animationDelay: '2s'}}>
          <Flame size={20} />
        </div>
      </div>

      {/* Streak Achievement Popup */}
      {showStreakAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce">
            <div className="flex items-center gap-4">
              <div className="animate-spin">
                <Flame size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Streak Continued! 🔥</h3>
                <p className="text-lg opacity-90">{streak} days and counting!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl p-6 shadow-2xl border-r border-white/20 flex flex-col">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StudyBuddy</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2"></div>
        </div>

        {/* Menu */}
        <div className="space-y-3 mb-10">
          <p className="text-sm font-semibold text-gray-500 uppercase">Menu</p>
          <nav className="space-y-2 font-medium">
            <SidebarLink icon={<BarChart3 />} label="Dashboard" active />
            <SidebarLink 
              icon={<ListTodo />} 
              label="Tasks" 
              onClick={() => navigate('/tasks')} 
            />
            <SidebarLink icon={<Users />} label="Start Searching" onClick={() => navigate('/match')}/>
            <SidebarLink 
              icon={<Calendar />} 
              label="Calendar"
              onClick={() => navigate('/calendar')}
            />
            
            <SidebarLink icon={<Award />} label="Achievements" onClick={() => navigate("/achievements")}/>
          </nav>
        </div>

        {/* General */}
        <div className="mt-8 space-y-2">
          <p className="text-sm font-semibold text-gray-500 uppercase">General</p>
          <nav className="space-y-2 font-medium">
            <SidebarLink icon={<Settings />} label="Settings" onClick={() => navigate('/settings')} />
            <SidebarLink icon={<HelpCircle />} label="Help" onClick={() => navigate('/help')}/>
            <SidebarLink icon={<User />} label="Profile" onClick={() => navigate('/profile')}/>
            <button
              onClick={() => setIsLogoutOpen(true)}
              className="group cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-700 w-full text-left hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span className="text-lg text-indigo-600 group-hover:text-red-700"><LogOut /></span>
              <span className="text-base">Log Out</span>
            </button>
          </nav>
        </div>

        {/* Clock */}
        <div className="mt-auto p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-200/30">
          <p className="text-xs text-gray-500 mb-1">Current Time</p>
          <p className="text-lg font-bold text-indigo-600">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6 bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="relative w-1/3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-0 placeholder-gray-400 text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-6">
            <Bell className="text-gray-500 hover:text-indigo-600 cursor-pointer" size={24} />
            <div className="flex items-center gap-4 bg-white/80 rounded-2xl p-3 shadow-md">
              <img
                src={avatarURL || '/default-avatar.png'}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover ring-3 ring-indigo-200"
              />
              <div className="text-left">
                <p className="text-base font-semibold text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {name}! 👋</h1>
          <p className="text-lg opacity-90 mb-6">Ready to crush your goals today?</p>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 cursor-pointer bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:bg-white/30 hover:-translate-y-1 hover:shadow-md active:scale-95" onClick={() => navigate('/tasks')}>
              <Plus size={16} /> Quick Task
            </button>
            <button className="cursor-pointer bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:bg-gray-100 hover:-translate-y-1 hover:shadow-md active:scale-95" onClick={() => navigate('/calendar')}>
              View Schedule
            </button>
          </div>
        </div>

        {/* Streak Action Card */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Flame className="text-yellow-300" size={48} />
          </div>
          <div className="absolute top-4 left-4 animate-pulse">
            <Zap className="text-yellow-300" size={24} />
          </div>
          <div className="absolute bottom-2 right-16 animate-pulse" style={{animationDelay: '0.5s'}}>
            <Flame className="text-orange-200" size={20} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="animate-spin" style={{animationDuration: '3s'}}>
                <Flame size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Daily Streak</h2>
                <p className="text-sm opacity-90">Keep the momentum going!</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-extrabold mb-1">{streak}</p>
                <p className="text-sm opacity-75">days in a row</p>
              </div>
              <button
                onClick={handleContinueStreak}
                disabled={streakContinued}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                  streakContinued
                    ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
                    : 'cursor-pointer bg-white text-orange-600 hover:bg-gray-50 hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {streakContinued ? '✅ Streak Continued!' : '🔥 Continue Streak'}
              </button>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <EnhancedStatCard 
            title="Daily Streak" 
            value={String(streak)} 
            subtitle="days in a row!" 
            color="indigo" 
            icon={<Flame />} 
            trend="+2 from yesterday" 
          />
          <EnhancedStatCard 
            title="Completed Tasks" 
            value={String(taskStats.completedCount)} 
            subtitle="total completed" 
            color="green" 
            icon={<CheckCircle />} 
            trend={taskStats.completedCount > 0 ? `+${taskStats.completedCount} done` : "No tasks yet"} 
          />
          <EnhancedStatCard 
            title="Pending Tasks" 
            value={String(taskStats.pendingCount)} 
            subtitle="to complete" 
            color="purple" 
            icon={<Clock />} 
            trend={taskStats.todayTasks > 0 ? `${taskStats.todayTasks} due today` : "No due dates set"} 
          />
          <EnhancedStatCard 
            title="Task Status" 
            value={String(tasks.length)} 
            subtitle="total tasks" 
            color="amber" 
            icon={<AlertTriangle />} 
            trend={taskStats.overdueTasks > 0 ? `${taskStats.overdueTasks} overdue!` : "All up to date"} 
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EnhancedWidgetCard 
            title="Pomodoro Timer" 
            description="Focus with 25-minute work sessions" 
            emoji="⏱️" 
            color="red" 
            status="25:00 - Ready" 
            onClick={() => setIsPomodoroOpen(true)} 
          />
          <EnhancedWidgetCard 
            title="My Tasks" 
            description="Manage your to-do list and stay organized" 
            emoji="📝" 
            color="blue" 
            status={`${taskStats.pendingCount} pending`}
            onClick={() => navigate('/tasks')}
          />
          <EnhancedWidgetCard 
            title="Study Buddies" 
            description="Connect with peers in your field" 
            emoji="👥" 
            color="green" 
            status="12 online"
            onClick={() => navigate('/match')} 
          />
          <EnhancedWidgetCard 
            title="Chat Rooms" 
            description="Join study discussions" 
            emoji="💬" 
            color="purple" 
            status="3 new messages" 
          />
          <EnhancedWidgetCard 
            title="AI Tutor" 
            description="Get personalized study assistance"
            emoji="🤖"
            color="indigo"
            status="Available 24/7"
          />
          <EnhancedWidgetCard 
            title="Achievements" 
            description="Unlock badges and rewards"
            emoji="🏆"
            color="yellow"
            status="2 badges earned today"
            onClick={() => navigate("/achievements")}
          />
        </section>
      </main>

      {isLogoutOpen && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center">
                          <div
                              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                              onClick={() => setIsLogoutOpen(false)}
                          ></div>
                          <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                              <div className="text-center mb-6">
                                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                                      <LogOut className="w-8 h-8 text-white" />
                                  </div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                  Ready to go?
                                  </h3>
                                  <p className="text-gray-600">
                                  You'll be signed out. Your progress are saved!
                                  </p>
                              </div>
                              <div className="flex gap-4">
                                  <button
                                      onClick={() => setIsLogoutOpen(false)}
                                      className="cursor-pointer flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                                  >
                                      Stay
                                  </button>
                                  <button
                                      onClick={handleLogout}
                                      className="cursor-pointer flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                                  >
                                      Sign Out
                                  </button>
                              </div>
                          </div>
                      </div>
                )}

      {isPomodoroOpen && (
        <PomodoroTimer isOpen={isPomodoroOpen} onClose={() => setIsPomodoroOpen(false)} />
      )}
    </div>
  );
}

export function SidebarLink({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: JSX.Element;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 transform ${
        active
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105'
          : 'cursor-pointer hover:bg-indigo-50 text-gray-700 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <span className={`text-lg ${active ? 'text-white' : 'text-indigo-600'}`}>{icon}</span>
      <span className="text-base font-medium">{label}</span>
    </button>
  );
}

function EnhancedStatCard({
  title,
  value,
  subtitle,
  color,
  icon,
  trend
}: {
  title: string;
  value: string;
  subtitle: string;
  color: 'indigo' | 'green' | 'purple' | 'amber';
  icon: JSX.Element;
  trend: string;
}) {
  const colorMap = {
    indigo: 'from-indigo-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600',
    amber: 'from-amber-500 to-orange-600',
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorMap[color]} text-white shadow-lg group-hover:scale-110 transition-transform`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <TrendingUp className="text-green-500 text-sm" size={16} />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-gray-500 text-xs">{subtitle}</p>
      <p className="mt-3 pt-3 border-t border-gray-200 text-xs text-green-600 font-medium">{trend}</p>
    </div>
  );
}

function EnhancedWidgetCard({
  title,
  description,
  emoji,
  color,
  status,
  onClick
}: {
  title: string;
  description: string;
  emoji: string;
  color: string;
  status: string;
  onClick?: () => void;
}) {
  const colorMap: { [key: string]: string } = {
    red: 'from-red-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-teal-500',
    purple: 'from-purple-500 to-indigo-500',
    indigo: 'from-indigo-500 to-purple-500',
    yellow: 'from-yellow-500 to-orange-500',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl group-hover:scale-110 transition-transform">{emoji}</div>
        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorMap[color]} animate-pulse`}></div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{status}</span>
        <span className="opacity-0 group-hover:opacity-100 text-indigo-600 text-sm font-medium transition-opacity">Open →</span>
      </div>
    </div>
  );
}