// src/Settings.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
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

const faculties = [
  'Arts & Social Sciences', 'Business', 'Computing', 'Dentistry',
  'Design & Engineering', 'Law', 'Medicine', 'Nursing', 'Science',
  'Music', 'Yong Loo Lin School of Medicine', 'Yong Siew Toh Conservatory of Music',
  'Public Health', 'Public Policy',
];

const genders = ['Male', 'Female', 'Prefer not to say'];

export default function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [form, setForm] = useState({
    name: '', faculty: '', major: '', gender: '', dob: '', avatarURL: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load user data for header
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.name || user.displayName || 'User');
            setAvatarURL(userData.avatarURL || user.photoURL);
          } else {
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

  // Load form data
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            name: data.name || '',
            faculty: data.faculty || '',
            major: data.major || '',
            gender: data.gender || '',
            dob: data.dob || '',
            avatarURL: data.avatarURL || '',
          });
          setAvatarPreview(data.avatarURL || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, { 
      method: 'POST', 
      body: formData 
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    let avatarURL = form.avatarURL;
    
    if (avatarFile) {
      try {
        toast.loading('Uploading image...', { id: 'upload' });
        avatarURL = await uploadAvatar(avatarFile);
        toast.success('Image uploaded successfully', { id: 'upload' });
      } catch (error) {
        toast.error('Avatar upload failed', { id: 'upload' });
        setSaving(false);
        return;
      }
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), { ...form, avatarURL });
      toast.success('Profile updated successfully! 🎉');
      
      // Update local state for header
      setName(form.name);
      setAvatarURL(avatarURL);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-indigo-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-[15px]">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-purple-400 opacity-20 animate-bounce">
          <Settings size={32} />
        </div>
        <div className="absolute top-40 right-20 text-indigo-400 opacity-15 animate-pulse">
          <User size={24} />
        </div>
        <div className="absolute bottom-32 left-1/4 text-pink-400 opacity-10 animate-bounce" style={{animationDelay: '1s'}}>
          <Sparkles size={28} />
        </div>
        <div className="absolute top-1/2 right-1/3 text-blue-300 opacity-10 animate-pulse" style={{animationDelay: '2s'}}>
          <Edit3 size={20} />
        </div>
      </div>

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
            <SidebarLink icon={<BarChart3 />} label="Dashboard" onClick={() => navigate('/dashboard')} />
            <SidebarLink icon={<ListTodo />} label="Tasks" onClick={() => navigate('/tasks')} />
            <SidebarLink icon={<Users />} label="Start Searching" />
            <SidebarLink icon={<Calendar />} label="Calendar" onClick={() => navigate('/calendar') }/>
            <SidebarLink icon={<BarChart3 />} label="Leaderboard" />
          </nav>
        </div>

        {/* General */}
        <div className="mt-8 space-y-2">
          <p className="text-sm font-semibold text-gray-500 uppercase">General</p>
          <nav className="space-y-2 font-medium">
            <SidebarLink icon={<Settings />} label="Settings" active />
            <SidebarLink icon={<HelpCircle />} label="Help" />
            <SidebarLink icon={<User />} label="Profile" />
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

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="cursor-pointer p-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your profile and preferences</p>
            </div>
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

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative">
          <h1 className="text-3xl font-bold mb-2">Profile Settings ⚙️</h1>
          <p className="text-lg opacity-90 mb-6">Customize your StudyBuddy experience</p>
          <div className="flex gap-4">
            <button 
              onClick={() => document.getElementById('avatar-input')?.click()}
              className="cursor-pointer bg-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/30 flex items-center gap-2"
            >
              <Camera size={16} /> Change Avatar
            </button>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-gray-50 font-semibold">
              Export Data
            </button>
          </div>
        </div>

        {/* Settings Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <img 
                  src={avatarPreview || '/default-avatar.png'} 
                  alt="Profile Avatar" 
                  className="w-32 h-32 rounded-full object-cover mx-auto ring-4 ring-indigo-200 shadow-xl"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('avatar-input')?.click()}
                  className="cursor-pointer absolute bottom-2 right-2 bg-indigo-500 text-white p-3 rounded-full hover:bg-indigo-600 shadow-lg transform hover:scale-110 transition-all"
                >
                  <Camera size={16} />
                </button>
              </div>
              <input 
                id="avatar-input"
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden" 
              />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
                <p className="text-sm text-gray-500">Click the camera icon to change your avatar</p>
                <p className="text-xs text-gray-400 mt-1">Supported: JPG, PNG (Max 5MB)</p>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <User size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input 
                    name="name" 
                    value={form.name} 
                    onChange={handleInput} 
                    placeholder="Enter your full name" 
                    className="text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select 
                    name="gender" 
                    value={form.gender} 
                    onChange={handleInput} 
                    className="cursor-pointer text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50"
                  >
                    <option value="">Select Gender</option>
                    {genders.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    name="dob" 
                    value={form.dob} 
                    onChange={handleInput} 
                    className="text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50"
                  />
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Globe size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Academic Information</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faculty</label>
                  <select 
                    name="faculty" 
                    value={form.faculty} 
                    onChange={handleInput} 
                    className="cursor-pointer text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50"
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Major / Course of Study</label>
                  <input 
                    name="major" 
                    value={form.major} 
                    onChange={handleInput} 
                    placeholder="e.g., Computer Science, Business Administration" 
                    className="text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="cursor-pointer flex-1 px-6 py-4 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !form.name.trim()}
                className="cursor-pointer flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            icon={<Shield />}
            title="Privacy Settings"
            description="Manage your privacy preferences"
            color="green"
          />
          <QuickActionCard
            icon={<Bell />}
            title="Notifications"
            description="Configure notification settings"
            color="blue"
          />
          <QuickActionCard
            icon={<Palette />}
            title="Appearance"
            description="Customize app theme"
            color="purple"
          />
        </div>
      </main>

      {/* Logout Modal */}
      {isLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsLogoutOpen(false)}></div>
          <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to go?</h3>
            <p className="text-gray-600 mb-8">You'll be signed out. Your settings are saved!</p>
            <div className="flex gap-4">
              <button onClick={() => setIsLogoutOpen(false)} className="cursor-pointer flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50">Stay</button>
              <button onClick={handleLogout} className="cursor-pointer flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: JSX.Element; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 transform w-full text-left ${
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

function QuickActionCard({
  icon,
  title,
  description,
  color
}: {
  icon: JSX.Element;
  title: string;
  description: string;
  color: 'green' | 'blue' | 'purple';
}) {
  const colorMap = {
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-indigo-600',
    purple: 'from-purple-500 to-pink-600',
  };

  return (
    <div className="cursor-pointer bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className={`p-3 rounded-xl bg-gradient-to-r ${colorMap[color]} text-white shadow-lg group-hover:scale-110 transition-transform mb-4 w-fit`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}