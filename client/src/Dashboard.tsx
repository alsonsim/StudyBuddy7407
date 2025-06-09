import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { signOut } from 'firebase/auth'
import { useAuth } from './AuthContext';
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
  ListTodo
} from 'lucide-react';
import dayjs from 'dayjs';

export default function Dashboard() {
  const { user } = useAuth();
  const [name, setName] = useState<string>('');
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const openLogoutModal = () => setIsLogoutOpen(true);
  const closeLogoutModal = () => setIsLogoutOpen(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user?.uid) {
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || 'Anonymous');
          setAvatarURL(data.avatarURL);

          const today = dayjs().startOf('day');
          const lastLogin = data.lastLogin ? dayjs(data.lastLogin.toDate()).startOf('day') : null;

          let updatedStreak = data.streak || 0;

          if (!lastLogin || today.diff(lastLogin, 'day') > 1) {
            updatedStreak = 1;
          } else if (today.diff(lastLogin, 'day') === 1) {
            updatedStreak += 1;
          }

          setStreak(updatedStreak);

          await setDoc(docRef, {
            ...data,
            lastLogin: new Date(),
            streak: updatedStreak
          });
        } else {
          console.warn("User doc not found");
        }
      }
    };
    fetchUserInfo();
  }, [user]);

  const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate('/login'); // make sure useNavigate is imported and used
  } catch (error) {
    console.error("Sign-out error:", error);
    alert("Error signing out");
  }
  };

  return (
    <div className="min-h-screen flex font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-[15px]">
      {/* Sidebar with Glass Effect */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl p-6 shadow-2xl border-r border-white/20 flex flex-col">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            StudyBuddy
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2"></div>
        </div>

        {/* Menu Section */}
        <div className="space-y-3 mb-10">
          <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Menu</p>
          <nav className="space-y-2 font-medium">
            <SidebarLink icon={<BarChart3 />} label="Dashboard" active />
            <SidebarLink icon={<ListTodo />} label="Tasks" />
            <SidebarLink icon={<Users />} label="Start Searching" />
            <SidebarLink icon={<Calendar />} label="Calendar" />
            <SidebarLink icon={<BarChart3 />} label="Leaderboard" />
          </nav>
        </div>

        {/* General Section */}
        <div className="mt-8 space-y-2">
          <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase">General</p>
          <nav className="space-y-2 font-medium">
            <SidebarLink icon={<Settings />} label="Settings" />
            <SidebarLink icon={<HelpCircle />} label="Help" />
            <SidebarLink icon={<User />} label="Profile" />
            <button
              onClick={openLogoutModal}
              className="group cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-700 w-full text-left hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span className="text-lg text-indigo-600 group-hover:text-red-700 transition-colors"><LogOut /></span>
              <span className="text-base">Log Out</span>
            </button>
          </nav>
        </div>

        {/* Time Display */}
        <div className="mt-auto p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-200/30">
          <p className="text-xs text-gray-500 mb-1">Current Time</p>
          <p className="text-lg font-bold text-indigo-600">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Topbar with Glass Effect */}
        <header className="flex justify-between items-center mb-6 bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="relative w-1/3">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 group-focus-within:text-indigo-500 group-focus-within:scale-110 z-10" 
              size={20} 
            />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-0 placeholder-gray-400 text-black bg-gray-100 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell className="text-gray-500 hover:text-indigo-600 cursor-pointer transition-colors" size={24} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4 bg-white/80 rounded-2xl p-3 shadow-md">
              <div className="relative">
                <img
                  src={avatarURL || '/default-avatar.png'}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full object-cover ring-3 ring-indigo-200"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="text-left">
                <p className="text-base font-semibold text-gray-900">{name || 'Anonymous'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              width: '100%',
              height: '100%'
            }}></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {name}! 👋</h1>
            <p className="text-lg opacity-90 mb-6">Ready to crush your goals today? Let's make it happen!</p>
            <div className="flex gap-4">
              <button className="cursor-pointer bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white/30 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg">
                <Plus size={16} /> Quick Task
              </button>
              <button className="cursor-pointer bg-white text-indigo-600 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg font-semibold">
                View Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
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
            value="24" 
            subtitle="this week" 
            color="green" 
            icon={<CheckCircle />}
            trend="+15% from last week"
          />
          <EnhancedStatCard 
            title="Study Hours" 
            value="32.5" 
            subtitle="this month" 
            color="purple" 
            icon={<Clock />}
            trend="+8.2hrs from last month"
          />
          <EnhancedStatCard 
            title="Active Goals" 
            value="5" 
            subtitle="in progress" 
            color="amber" 
            icon={<AlertTriangle />}
            trend="2 due this week"
          />
        </section>

        {/* Enhanced Widgets Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EnhancedWidgetCard 
            title="Pomodoro Timer" 
            description="Focus with 25-minute work sessions"
            emoji="⏱️"
            color="red"
            status="25:00 - Ready to start"
          />
          <EnhancedWidgetCard 
            title="Study Buddies" 
            description="Connect with peers in your field"
            emoji="👥"
            color="blue"
            status="12 online now"
          />
          <EnhancedWidgetCard 
            title="Chat Rooms" 
            description="Join active study discussions"
            emoji="💬"
            color="green"
            status="3 new messages"
          />
          <EnhancedWidgetCard 
            title="AI Tutor" 
            description="Get personalized study assistance"
            emoji="🤖"
            color="purple"
            status="Available 24/7"
          />
          <EnhancedWidgetCard 
            title="Progress Analytics" 
            description="Track your learning journey"
            emoji="📊"
            color="indigo"
            status="Weekly report ready"
          />
          <EnhancedWidgetCard 
            title="Achievements" 
            description="Unlock badges and rewards"
            emoji="🏆"
            color="yellow"
            status="2 badges earned today"
          />
        </section>
      </main>

      {/* Enhanced Modal */}
      {isLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeLogoutModal}></div>

          {/* Modal Content */}
          <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to go?</h3>
            <p className="text-gray-600 mb-8">
              You'll be signed out of StudyBuddy. Your progress is automatically saved!
            </p>
            <div className="flex gap-4">
              <button
                onClick={closeLogoutModal}
                className="cursor-pointer flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Stay Here
              </button>
              <button
                onClick={handleLogout}
                className="cursor-pointer flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: JSX.Element; label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 transform ${
        active
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105'
          : 'hover:bg-indigo-50 text-gray-700 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <span className={`text-lg transition-colors ${active ? 'text-white' : 'text-indigo-600'}`}>{icon}</span>
      <span className="text-base font-medium">{label}</span>
    </a>
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
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorMap[color]} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <TrendingUp className="text-green-500 text-sm" size={16} />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-gray-500 text-xs">{subtitle}</p>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-green-600 font-medium">{trend}</p>
      </div>
    </div>
  );
}

function EnhancedWidgetCard({ 
  title, 
  description, 
  emoji, 
  color, 
  status 
}: { 
  title: string; 
  description: string; 
  emoji: string; 
  color: string; 
  status: string; 
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
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{emoji}</div>
        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorMap[color]} animate-pulse`}></div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{status}</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-indigo-600 text-sm font-medium">Open →</span>
        </div>
      </div>
    </div>
  );
}