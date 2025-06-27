import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarLink } from "../Tasks"; 
import { useAuth } from "../AuthContext";
import { LogOut, Calendar, BarChart3, ListTodo, Settings, HelpCircle, Users, User } from "lucide-react";
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Help(){
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLogoutOpen, setIsLogoutOpen] = React.useState(false);

    const [currentTime, setCurrentTime] = useState(new Date());
      useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
      }, []);

    const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };
    
    return (
        <div className="min-h-screen flex font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-[15px]">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-xl p-6 shadow-2xl border-r border-white/20 flex flex-col">
            <div className="mb-10">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StudyBuddy</h2>
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

            {/* General */}
            <div className="mt-8 space-y-2">
            <p className="text-sm font-semibold text-gray-500 uppercase">General</p>
            <nav className="space-y-2 font-medium">
                <SidebarLink icon={<Settings />} label="Settings" onClick={() => navigate('/settings')} />
                <SidebarLink icon={<HelpCircle />} label="Help" active/>
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
        <main className="flex-1 p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold text-indigo-700">Help & Support</h1>
            <p className="text-sm text-gray-500">Need assistance? Check the FAQs or contact us below.</p>
        </div>
        </div>

        {/* Help card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-3xl p-6 shadow-xl mb-10">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <HelpCircle className="w-6 h-6" /> Frequently Asked Questions
        </h2>
        <p className="text-sm">Browse some of the most commonly asked questions below.</p>
        </div>

        {/* FAQs */}
        <div className="grid gap-6">
        {[
            {
            q: "How do I track my tasks?",
            a: "Navigate to the Tasks tab where you can add, update, and check off completed items."
            },
            {
            q: "How do I reset my password?",
            a: "Navigate to the Settings page where you can edit your account details."
            },
            {
            q: "How do I connect my Google Calendar?",
            a: "Go to the Calendar page and sign in with your Google account to sync events."
            },
            {
            q: "How does the Pomodoro Timer work?",
            a: "It's a 25-minute focus session followed by short breaks. You can find it on the Dashboard."
            },
            {
            q: "Where can I change my avatar or info?",
            a: "Head to the Settings page where you can update your profile and export your data."
            }
            
        ].map(({ q, a }, idx) => (
            <details key={idx} className="group bg-white/80 backdrop-blur-xl border border-white/30 rounded-xl p-4 shadow transition hover:shadow-md">
            <summary className="cursor-pointer font-semibold text-indigo-700 group-hover:text-indigo-900 text-lg">
                {q}
            </summary>
            <p className="mt-2 text-gray-700 pl-1">{a}</p>
            </details>
        ))}
        </div>

        {/* Contact Box */}
        <div className="mt-12 bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-indigo-700 mb-2">📬 Still need help?</h2>
        <p className="text-gray-600 mb-4">Contact us at <a className="text-indigo-600 font-medium" href="mailto:studybuddy@support.com">studybuddy@support.com</a> and we’ll get back to you as soon as possible.</p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl transition duration-200 shadow-md">
            Submit Feedback
        </button>
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

