import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { signOut } from "firebase/auth";


import {
  BarChart3,
  Calendar,
  Users,
  Bell,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Save,
  Camera,
  ArrowLeft,
  ListTodo,
  Upload,
  CheckCircle,
  Edit3,
  Sparkles,
  Shield,
  Palette,
  Globe
} from 'lucide-react';
import { SidebarLink } from './Tasks';

export default function SettingsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
    };

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
      }, []);

    const [privacySettings, setPrivacySettings] = useState({
        allowSearch: true,
        showStreak: true,
        showAchievements: false,
        allowDM: true,
        blockAnonDM: false,
    });

    const [notifSettings, setNotifSettings] = useState({
        taskReminders: true,
        pomodoroAlerts: true,
        friendRequests: true,
        directMessages: true,
        groupInvites: false,
        buddyActivity: true,
    });

    const toggle =(section:string, key:string) => {
        if (section === 'privacy') {
            setPrivacySettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof privacySettings]}));
            } 
        else {
            setNotifSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifSettings] }));
            }
    };
        
    return (
        <div className="min-h-screen flex font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-[15px]">
            {/* Sidebar */}
            <aside className="w-64 bg-white/80 backdrop-blur-xl p-6 shadow-2xl border-r border-white/20 flex flex-col">
                <div className="mb-10">
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        StudyBuddy
                    </h2>
                    <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2"></div>
                </div>

                <div className="space-y-3 mb-10">
                    <p className="text-sm font-semibold text-gray-500 uppercase">Menu</p>
                    <nav className="space-y-2 font-medium">
                        <SidebarLink icon={<BarChart3 />} label="Dashboard" onClick={() => navigate('/dashboard')} />
                        <SidebarLink icon={<ListTodo />} label="Tasks" onClick={() => navigate('/tasks')} />
                        <SidebarLink icon={<Users />} label="Start Searching" />
                        <SidebarLink icon={<Calendar />} label="Calendar" onClick={() => navigate('/calendar')} />
                        <SidebarLink icon={<BarChart3 />} label="Leaderboard" />
                    </nav>
                </div>

                <div className="mt-8 space-y-2">
                    <p className="text-sm font-semibold text-gray-500 uppercase">General</p>
                    <nav className="space-y-2 font-medium">
                        <SidebarLink icon={<Settings />} label="Settings" active />
                        <SidebarLink icon={<HelpCircle />} label="Help" onClick={() => navigate('/help')} />
                        <SidebarLink icon={<User />} label="Profile" onClick={() => navigate('/profile')} />
                        <button
                            onClick={() => setIsLogoutOpen(true)}
                            className="group cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-700 w-full text-left hover:shadow-md transform hover:-translate-y-0.5"
                        >
                            <span className="text-lg text-indigo-600 group-hover:text-red-700"><LogOut /></span>
                            <span className="text-base">Log Out</span>
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-200/30">
                    <p className="text-xs text-gray-500 mb-1">Current Time</p>
                    <p className="text-lg font-bold text-indigo-600">
                        {currentTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
            </aside>

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/30">
                <h1 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-3">
                    <Settings className="text-indigo-600" /> Settings
                </h1>
                {/* Account Settings */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-3">Account Settings</h2>
                    <div className="space-y-3">
                        <button className="w-full text-left bg-indigo-100 hover:bg-indigo-200 px-4 py-2 rounded-lg font-medium">Change Email</button>
                        <button className="w-full text-left bg-indigo-100 hover:bg-indigo-200 px-4 py-2 rounded-lg font-medium">Change Password</button>
                        <button className="w-full text-left bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg font-medium text-red-600">Delete Account</button>
                    </div>
                </section>
                {/* Privacy Settings */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-3">Privacy Settings</h2>
                    <div className="space-y-4">
                        {Object.entries(privacySettings).map(([key, value]) => (
                            <SettingToggle
                                key={key}
                                label={toLabel(key)}
                                enabled={value}
                                onToggle={() => toggle('privacy', key)}
                            />
                        ))}
                    </div>
                </section>

                {/* Notification Settings */}
                <section>
                    <h2 className="text-xl font-semibold text-indigo-600 mb-3">Notification Settings</h2>
                    <div className="space-y-4">
                        {Object.entries(notifSettings).map(([key, value]) => (
                            <SettingToggle
                                key={key}
                                label={toLabel(key)}
                                enabled={value}
                                onToggle={() => toggle('notif', key)}
                            />
                        ))}
                    </div>
                </section>
            </div>
      
                {/* Logout Modal */}
                {isLogoutOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setIsLogoutOpen(false)}
                    ></div>
                    <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 max-w-md w-full mx-4">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Ready to go?
                        </h3>
                        <p className="text-gray-600 mb-8">
                        You'll be signed out. Your settings are saved!
                        </p>
                        <div className="flex gap-4">
                        <button
                            onClick={() => setIsLogoutOpen(false)}
                            className="cursor-pointer flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
                        >
                            Stay
                        </button>
                        <button
                            onClick={handleLogout}
                            className="cursor-pointer flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
          )}
      </div>
    </div>
    
    );
}

function SettingToggle({
    label,
    enabled,
    onToggle,
}: {
    label: string;
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">{label}</span>
            <button
                onClick={onToggle}
                className={`w-14 h-7 flex items-center rounded-full p-1 duration-300 ${
                    enabled ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
            >
                <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                        enabled ? 'translate-x-7' : ''
                    }`}
                />
            </button>
        </div>
    );
}

function toLabel(key: string) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace('Dm', 'DM');
}