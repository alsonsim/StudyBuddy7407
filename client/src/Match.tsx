import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";
import {
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  orderBy,
  getDocs
} from "firebase/firestore";
import { 
  Users, 
  Search, 
  Flame, 
  Zap, 
  Heart, 
  UserPlus,
  Globe,
  Clock,
  Star,
  BarChart3,
  Calendar,
  Bell,
  Settings,
  HelpCircle,
  User,
  LogOut,
  ListTodo
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export default function Match() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [searchDuration, setSearchDuration] = useState(0);
  const [name, setName] = useState('');
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchDetails, setMatchDetails] = useState<{ name: string; avatar: string }>({ name: '', avatar: '' });
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  // Timer for current time
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

  // Timer for search duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSearching) {
      interval = setInterval(() => {
        setSearchDuration(prev => prev + 1);
      }, 1000);
    } else {
      setSearchDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSearching]);

    const toggleSearching = async () => {
    if (!user) return;
    const docRef = doc(db, "matchQueue", user.uid);

      if (isSearching) {
        await deleteDoc(docRef);
        setIsSearching(false);
      } else {
        setShowLoadingModal(true); // Show loading
        await setDoc(docRef, {
          uid: user.uid,
          name,
          avatarURL,
          timestamp: serverTimestamp(),
        });
        setIsSearching(true);
        await checkForMatch();
        setShowLoadingModal(false); // Hide after match check
      }
};

  const checkForMatch = async () => {
    const queueRef = collection(db, "matchQueue");
    const q = query(queueRef, orderBy("timestamp"));
    const snapshot = await getDocs(q);

    const waitingUsers = snapshot.docs.filter(docSnap => docSnap.id !== user.uid);

    if (waitingUsers.length > 0) {
      const partnerDoc = waitingUsers[0];
      const partner = partnerDoc.data();
      const partnerId = partnerDoc.id;

      await deleteDoc(doc(db, "matchQueue", user.uid));
      await deleteDoc(doc(db, "matchQueue", partnerId));

      const matchData = {
        users: [user.uid, partnerId],
        names: [name, partner.name],
        avatars: [avatarURL, partner.avatarURL],
        timestamp: serverTimestamp()
      };

      await setDoc(doc(db, "matches", `${user.uid}_${partnerId}`), matchData);
      await setDoc(doc(db, "matches", user.uid), matchData);
      await setDoc(doc(db, "matches", partnerId), matchData);

      setMatchDetails({
        name: partner.name,
        avatar: partner.avatarURL
      });
      setShowMatchModal(true);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "matchQueue", user.uid), (docSnap) => {
      setIsSearching(docSnap.exists());
    });
    return () => unsub();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-[15px]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-blue-400 opacity-20 animate-bounce">
          <Users size={32} />
        </div>
        <div className="absolute top-40 right-20 text-indigo-400 opacity-15 animate-pulse">
          <Heart size={24} />
        </div>
        <div className="absolute bottom-32 left-1/4 text-purple-400 opacity-10 animate-bounce" style={{animationDelay: '1s'}}>
          <UserPlus size={28} />
        </div>
        <div className="absolute top-1/2 right-1/3 text-cyan-300 opacity-10 animate-pulse" style={{animationDelay: '2s'}}>
          <Globe size={20} />
        </div>
        {/* Floating particles for searching state */}
        {isSearching && (
          <>
            <div className="absolute top-1/4 left-1/2 text-green-400 opacity-30 animate-ping">
              <Search size={16} />
            </div>
            <div className="absolute top-3/4 left-1/3 text-blue-400 opacity-25 animate-ping" style={{animationDelay: '0.5s'}}>
              <Search size={12} />
            </div>
            <div className="absolute top-1/2 right-1/4 text-purple-400 opacity-20 animate-ping" style={{animationDelay: '1s'}}>
              <Search size={14} />
            </div>
          </>
        )}
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
            <SidebarLink 
              icon={<BarChart3 />} 
              label="Dashboard" 
              onClick={() => navigate('/dashboard')} 
            />
            <SidebarLink 
              icon={<ListTodo />} 
              label="Tasks" 
              onClick={() => navigate('/tasks')} 
            />
            <SidebarLink icon={<Users />} label="Start Searching" active />
            <SidebarLink 
              icon={<Calendar />} 
              label="Calendar"
              onClick={() => navigate('/calendar')}
            />
            <SidebarLink icon={<BarChart3 />} label="Leaderboard" />
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

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header with Search and Profile */}
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

        {/* Main Match Content */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center relative overflow-hidden">
              {/* Header with animated icons */}
              <div className="relative mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="animate-bounce">
                    <Users className="text-indigo-600" size={40} />
                  </div>
                  <div className="animate-pulse" style={{animationDelay: '0.5s'}}>
                    <Heart className="text-pink-500" size={32} />
                  </div>
                  <div className="animate-bounce" style={{animationDelay: '1s'}}>
                    <UserPlus className="text-purple-600" size={36} />
                  </div>
                </div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  Find Your Study Partner
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
              </div>

              {/* Status Section */}
              {isSearching ? (
                <div className="mb-8">
                  {/* Searching Animation */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto mb-4 relative">
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
                      <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                      <Search className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg inline-block">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="font-semibold">Searching for partners...</span>
                      </div>
                    </div>
                  </div>

                  {/* Search Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-200/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="text-indigo-600" size={16} />
                        <span className="text-sm font-medium text-gray-600">Search Time</span>
                      </div>
                      <p className="text-2xl font-bold text-indigo-600">{formatTime(searchDuration)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-200/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="text-green-600" size={16} />
                        <span className="text-sm font-medium text-gray-600">Status</span>
                      </div>
                      <p className="text-lg font-semibold text-green-600">Active</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 text-lg">
                    We're looking for the perfect study partner for you! 
                    <br />
                    <span className="text-sm text-gray-500">You'll be notified when a match is found.</span>
                  </p>
                </div>
              ) : (
                <div className="mb-8">
                  {/* Welcome State */}
                  <div className="mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Search className="text-white" size={32} />
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Connect with fellow students who share your academic interests and study goals. 
                      <br />
                      <span className="font-medium text-indigo-600">Start your search to find your perfect study companion!</span>
                    </p>
                  </div>

                  {/* Feature Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
                      <Star className="text-blue-600 mx-auto mb-2" size={24} />
                      <h3 className="font-semibold text-blue-900 mb-1">Smart Matching</h3>
                      <p className="text-xs text-blue-700">AI-powered compatibility</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200/50">
                      <Zap className="text-purple-600 mx-auto mb-2" size={24} />
                      <h3 className="font-semibold text-purple-900 mb-1">Instant Connect</h3>
                      <p className="text-xs text-purple-700">Real-time matching</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50">
                      <Heart className="text-green-600 mx-auto mb-2" size={24} />
                      <h3 className="font-semibold text-green-900 mb-1">Study Together</h3>
                      <p className="text-xs text-green-700">Collaborative learning</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={toggleSearching}
                className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl active:scale-95 cursor-pointer ${
                  isSearching
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isSearching ? (
                    <>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Cancel Search</span>
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      <span>Start Searching</span>
                    </>
                  )}
                </div>
              </button>

              {/* Floating decoration elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-15 animate-bounce"></div>
              <div className="absolute top-1/2 -left-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-10 animate-ping"></div>
            </div>

            {/* Additional Info Card */}
            <div className="mt-6 bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Flame className="text-white" size={16} />
                </div>
                <h3 className="font-bold text-gray-900">Pro Tip</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The best matches happen when both users are actively searching. 
                Keep your search active and be patient - your perfect study partner might join any moment!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      {isLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsLogoutOpen(false)}></div>
          <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to go?</h3>
            <p className="text-gray-600 mb-8">You'll be signed out. Your progress is saved!</p>
            <div className="flex gap-4">
              <button onClick={() => setIsLogoutOpen(false)} className="cursor-pointer flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50">Stay</button>
              <button onClick={handleLogout} className="cursor-pointer flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700">Sign Out</button>
            </div>
          </div>
        </div>
      )}
      <LoadingModal
            visible={showLoadingModal}
            onBackdropClick={() => setShowCancelPrompt(true)}
          />

          <ConfirmCancelModal
            visible={showCancelPrompt}
            onConfirm={async () => {
              if (user) {
                await deleteDoc(doc(db, "matchQueue", user.uid));
              }
              setIsSearching(false);
              setShowLoadingModal(false);
              setShowCancelPrompt(false);
            }}
            onCancel={() => {
              setShowCancelPrompt(false);
              setShowLoadingModal(false); // 👈 Add this
            }}
          />

          <MatchFoundModal
            visible={showMatchModal}
            partnerName={matchDetails.name}
            partnerAvatar={matchDetails.avatar}
            onClose={() => setShowMatchModal(false)}
          />
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

function LoadingModal({
  visible,
  onBackdropClick
}: {
  visible: boolean;
  onBackdropClick: () => void;
}) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onBackdropClick}
    >
      <div
        className="bg-white rounded-3xl p-8 shadow-2xl text-center w-80 relative"
        onClick={(e) => e.stopPropagation()} // prevent click bubbling
      >
        {/* Close button */}
        <button
          onClick={onBackdropClick}
          className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-red-500"
        >
          ✕
        </button>

        <div className="mb-4 animate-spin mx-auto w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Searching...</h2>
        <p className="text-gray-500 text-sm">Looking for a study partner, hang tight!</p>
      </div>
    </div>
  );
}

function ConfirmCancelModal({
  visible,
  onConfirm,
  onCancel
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 shadow-2xl text-center w-96">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Cancel Searching?</h2>
        <p className="text-gray-700 mb-6">You'll stop looking for a match and can switch tabs.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors duration-200"
          >
            Continue Searching
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 cursor-pointer px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium transition-colors duration-200"
          >
            Cancel Search
          </button>
        </div>
      </div>
    </div>
  );
}

function MatchFoundModal({
  visible,
  partnerName,
  partnerAvatar,
  onClose
}: {
  visible: boolean;
  partnerName: string;
  partnerAvatar: string;
  onClose: () => void;
}) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 shadow-2xl text-center w-96">
        <img src={partnerAvatar || '/default-avatar.png'} alt="Matched Avatar" className="w-20 h-20 rounded-full mx-auto mb-4 ring-4 ring-indigo-300" />
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">🎉 You’re matched!</h2>
        <p className="text-gray-700 text-lg mb-6">Meet <span className="font-semibold">{partnerName}</span>, your new study buddy!</p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
}
