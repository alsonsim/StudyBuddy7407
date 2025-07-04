import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { signOut } from "firebase/auth";
import { auth } from './firebase'; 
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
  Globe,
  Award,
  Lock,
  Mail,
  Key,
  Trash2,
  Eye,
  MessageSquare,
  Zap,
  UserPlus,
  MessageCircle,
  UserCheck,
  Activity
} from 'lucide-react';
// Mock SidebarLink component for demo
function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <div 
            onClick={onClick}
            className={`group cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 ${
                active 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
        >
            <span className={`text-lg ${active ? 'text-white' : 'text-indigo-600'}`}>{icon}</span>
            <span className="text-base font-medium">{label}</span>
        </div>
    );
}

export default function SettingsPage() {
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate("/login"); // Redirect to login page
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};


    const navigate = useNavigate();

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
                        <SidebarLink icon={<Award />} label="Achievements" onClick={() => navigate("/achievements")} />
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

        <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white">
                            <Settings className="w-8 h-8" />
                        </div>
                        Settings
                    </h1>
                    <p className="text-gray-600 text-lg">Customize your StudyBuddy experience</p>
                </div>

                <div className="grid gap-8">
                    {/* Account Settings */}
                    <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
                                <User className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <SettingCard 
                                icon={<Mail className="w-5 h-5" />}
                                title="Change Email"
                                description="Update your email address"
                                variant="primary"
                            />
                            <SettingCard 
                                icon={<Key className="w-5 h-5" />}
                                title="Change Password"
                                description="Update your password"
                                variant="primary"
                            />
                            <SettingCard 
                                icon={<Trash2 className="w-5 h-5" />}
                                title="Delete Account"
                                description="Permanently remove account"
                                variant="danger"
                            />
                        </div>
                    </section>

                    {/* Privacy Settings */}
                    <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg text-white">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {Object.entries(privacySettings).map(([key, value]) => (
                                <EnhancedSettingToggle
                                    key={key}
                                    icon={getPrivacyIcon(key)}
                                    label={toLabel(key)}
                                    description={getPrivacyDescription(key)}
                                    enabled={value}
                                    onToggle={() => toggle('privacy', key)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Notification Settings */}
                    <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
                                <Bell className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {Object.entries(notifSettings).map(([key, value]) => (
                                <EnhancedSettingToggle
                                    key={key}
                                    icon={getNotificationIcon(key)}
                                    label={toLabel(key)}
                                    description={getNotificationDescription(key)}
                                    enabled={value}
                                    onToggle={() => toggle('notif', key)}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
      
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
                            You'll be signed out. Your settings are saved!
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
    </div>
    
    );
}

function SettingCard({
    icon,
    title,
    description,
    variant = 'primary'
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    variant?: 'primary' | 'danger';
}) {
    const baseClasses = "group cursor-pointer p-6 rounded-xl border transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1";
    const variantClasses = variant === 'danger' 
        ? "bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300"
        : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300";

    return (
        <div className={`${baseClasses} ${variantClasses}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                variant === 'danger' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-indigo-500 text-white'
            }`}>
                {icon}
            </div>
            <h3 className={`font-semibold mb-1 ${
                variant === 'danger' ? 'text-red-700' : 'text-indigo-700'
            }`}>
                {title}
            </h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}

function EnhancedSettingToggle({
    icon,
    label,
    description,
    enabled,
    onToggle,
}: {
    icon: React.ReactNode;
    label: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md bg-white/50">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    enabled ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                    {icon}
                </div>
                <div>
                    <span className="text-gray-900 font-semibold block">{label}</span>
                    <span className="text-gray-500 text-sm">{description}</span>
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`cursor-pointer w-16 h-8 flex items-center rounded-full p-1 duration-300 shadow-inner ${
                    enabled 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-indigo-200' 
                        : 'bg-gray-300 shadow-gray-200'
                }`}
            >
                <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
                        enabled ? 'translate-x-8' : ''
                    }`}
                />
            </button>
        </div>
    );
}

function getPrivacyIcon(key: string) {
    const icons: Record<string, React.ReactNode> = {
        allowSearch: <Globe className="w-5 h-5" />,
        showStreak: <Zap className="w-5 h-5" />,
        showAchievements: <Award className="w-5 h-5" />,
        allowDM: <MessageCircle className="w-5 h-5" />,
        blockAnonDM: <Eye className="w-5 h-5" />,
    };
    return icons[key] || <Shield className="w-5 h-5" />;
}

function getNotificationIcon(key: string) {
    const icons: Record<string, React.ReactNode> = {
        taskReminders: <CheckCircle className="w-5 h-5" />,
        pomodoroAlerts: <Zap className="w-5 h-5" />,
        friendRequests: <UserPlus className="w-5 h-5" />,
        directMessages: <MessageSquare className="w-5 h-5" />,
        groupInvites: <Users className="w-5 h-5" />,
        buddyActivity: <Activity className="w-5 h-5" />,
    };
    return icons[key] || <Bell className="w-5 h-5" />;
}

function getPrivacyDescription(key: string) {
    const descriptions: Record<string, string> = {
        allowSearch: 'Let others find you in search results',
        showStreak: 'Display your study streak publicly',
        showAchievements: 'Show your achievements to others',
        allowDM: 'Allow others to message you directly',
        blockAnonDM: 'Block messages from anonymous users',
    };
    return descriptions[key] || 'Manage your privacy settings';
}

function getNotificationDescription(key: string) {
    const descriptions: Record<string, string> = {
        taskReminders: 'Get notified about upcoming tasks',
        pomodoroAlerts: 'Receive alerts during study sessions',
        friendRequests: 'Get notified of new friend requests',
        directMessages: 'Receive notifications for new messages',
        groupInvites: 'Get notified when invited to groups',
        buddyActivity: 'See updates from your study buddies',
    };
    return descriptions[key] || 'Manage your notification preferences';
}

function toLabel(key: string) {
    const customLabels: Record<string, string> = {
        allowDM: 'Allow Direct Messages',
        blockAnonDM: 'Block Anonymous DMs',
        taskReminders: 'Task Reminders',
        pomodoroAlerts: 'Pomodoro Alerts',
        friendRequests: 'Friend Requests',
        directMessages: 'Direct Messages',
        groupInvites: 'Group Invites',
        buddyActivity: 'Buddy Activity',
        allowSearch: 'Allow Search',
        showStreak: 'Show Streak',
        showAchievements: 'Show Achievements',
    };

    return customLabels[key] || key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
}