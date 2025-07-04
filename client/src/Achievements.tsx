import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';
import {
  Award, Lock, Trophy, Star, Target, Zap, BookOpen, Clock, Users, Flame,
  Calendar, CheckCircle, TrendingUp, Medal, Crown, Sparkles, ShieldCheck,
  Heart, Rocket, LogOut, BarChart3, ListTodo, Settings, HelpCircle, User
} from 'lucide-react';

export default function AchievementsPage() {
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    setAnimateStats(true);
  }, []);


  const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate('/login');
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first study session",
      icon: <BookOpen className="w-6 h-6" />,
      unlocked: true,
      category: "beginner",
      rarity: "common",
      points: 10,
      unlockedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Streak Master",
      description: "Maintain a 7-day study streak",
      icon: <Flame className="w-6 h-6" />,
      unlocked: true,
      category: "streak",
      rarity: "rare",
      points: 50,
      unlockedDate: "2024-01-22"
    },
    {
      id: 3,
      title: "Time Warrior",
      description: "Study for 100 hours total",
      icon: <Clock className="w-6 h-6" />,
      unlocked: false,
      category: "time",
      rarity: "epic",
      points: 100,
      progress: 67
    },
    {
      id: 4,
      title: "Social Butterfly",
      description: "Add 10 study buddies",
      icon: <Users className="w-6 h-6" />,
      unlocked: true,
      category: "social",
      rarity: "uncommon",
      points: 25,
      unlockedDate: "2024-01-20"
    },
    {
      id: 5,
      title: "Task Crusher",
      description: "Complete 50 tasks",
      icon: <Target className="w-6 h-6" />,
      unlocked: false,
      category: "tasks",
      rarity: "rare",
      points: 75,
      progress: 32
    },
    {
      id: 6,
      title: "Speed Demon",
      description: "Complete 5 tasks in one day",
      icon: <Zap className="w-6 h-6" />,
      unlocked: true,
      category: "tasks",
      rarity: "uncommon",
      points: 30,
      unlockedDate: "2024-01-18"
    },
    {
      id: 7,
      title: "Knowledge Seeker",
      description: "Study 10 different subjects",
      icon: <Star className="w-6 h-6" />,
      unlocked: false,
      category: "learning",
      rarity: "epic",
      points: 150,
      progress: 60
    },
    {
      id: 8,
      title: "Legendary Scholar",
      description: "Reach 1000 study hours",
      icon: <Crown className="w-6 h-6" />,
      unlocked: false,
      category: "time",
      rarity: "legendary",
      points: 500,
      progress: 12
    },
    {
      id: 9,
      title: "Perfect Week",
      description: "Complete all daily goals for a week",
      icon: <CheckCircle className="w-6 h-6" />,
      unlocked: true,
      category: "goals",
      rarity: "rare",
      points: 60,
      unlockedDate: "2024-01-25"
    }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: <Award className="w-4 h-4" /> },
    { id: 'beginner', label: 'Beginner', icon: <Rocket className="w-4 h-4" /> },
    { id: 'streak', label: 'Streaks', icon: <Flame className="w-4 h-4" /> },
    { id: 'time', label: 'Time', icon: <Clock className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <Target className="w-4 h-4" /> },
    { id: 'learning', label: 'Learning', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'goals', label: 'Goals', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'uncommon': return 'from-green-400 to-green-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-yellow-400 to-yellow-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'uncommon': return 'border-green-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl p-6 shadow-2xl border-r border-white/20 flex flex-col">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            StudyBuddy
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2" />
        </div>

        <div className="space-y-3 mb-10">
          <p className="text-sm font-semibold text-gray-500 uppercase">Menu</p>
          <nav className="space-y-2 font-medium">
            <SidebarLink icon={<BarChart3 />} label="Dashboard" onClick={() => navigate("/dashboard")} />
            <SidebarLink icon={<ListTodo />} label="Tasks" onClick={() => navigate("/tasks")} />
            <SidebarLink icon={<Users />} label="Start Searching" onClick={() => navigate("/match")} />
            <SidebarLink icon={<Calendar />} label="Calendar" onClick={() => navigate("/calendar")} />
            <SidebarLink icon={<Award />} label="Achievements" active />
          </nav>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500 uppercase">General</p>
          <nav className="space-y-2 font-medium">
            <SidebarLink icon={<Settings />} label="Settings" onClick={() => navigate("/settings")} />
            <SidebarLink icon={<HelpCircle />} label="Help" onClick={() => navigate("/help")} />
            <SidebarLink icon={<User />} label="Profile" onClick={() => navigate("/profile")} />
            <SidebarLink icon={<LogOut />} label="Log Out" onClick={() => setIsLogoutOpen(true)} />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl text-white shadow-lg">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Achievements</h1>
              <p className="text-gray-600 text-lg">Track your progress and celebrate milestones</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unlocked</p>
                  <p className={`text-2xl font-bold text-gray-900 transition-all duration-1000 ${
                    animateStats ? 'transform scale-110' : ''
                  }`}>
                    {unlockedCount}/{achievements.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className={`text-2xl font-bold text-gray-900 transition-all duration-1000 ${
                    animateStats ? 'transform scale-110' : ''
                  }`}>
                    {totalPoints}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Medal className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completion</p>
                  <p className={`text-2xl font-bold text-gray-900 transition-all duration-1000 ${
                    animateStats ? 'transform scale-110' : ''
                  }`}>
                    {Math.round((unlockedCount / achievements.length) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/20">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {category.icon}
                  <span className="font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 ${
                  achievement.unlocked
                    ? `bg-white shadow-lg ${getRarityBorder(achievement.rarity)} hover:shadow-2xl`
                    : "bg-gray-100/60 border-gray-300 hover:bg-gray-200/60"
                }`}
              >
                {/* Rarity Indicator */}
                {achievement.unlocked && (
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} flex items-center justify-center shadow-lg`}>
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg ${
                  achievement.unlocked 
                    ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}` 
                    : "bg-gray-400"
                }`}>
                  {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6" />}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold ${
                      achievement.unlocked ? "text-gray-900" : "text-gray-500"
                    }`}>
                      {achievement.title}
                    </h3>
                    {achievement.unlocked && (
                      <span className="text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 rounded-full">
                        +{achievement.points}
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-sm ${
                    achievement.unlocked ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {achievement.description}
                  </p>

                  {/* Progress Bar for Locked Achievements */}
                  {!achievement.unlocked && achievement.progress && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Unlock Date */}
                  {achievement.unlocked && achievement.unlockedDate && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No achievements found in this category</p>
            </div>
          )}
        </div>
      </div>
    </main>

      {/* Logout Modal */}
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
                                        You'll be signed out. Your details are saved!
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
    </div>
  );
}

function SidebarLink({
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
      className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 transform w-full text-left ${
        active
          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105"
          : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      <span className={`text-lg ${active ? "text-white" : "text-indigo-600"}`}>{icon}</span>
      <span className="text-base font-medium">{label}</span>
    </button>
  );
}
