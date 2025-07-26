/// <reference types="gapi.client.calendar" />

import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuth } from "../AuthContext";
import { SidebarLink } from "../Tasks";
import {
  LogOut,
  Calendar,
  BarChart3,
  ListTodo,
  Settings,
  HelpCircle,
  Users,
  User,
  Search,
  Bell,
  Clock,
  CalendarDays,
  TrendingUp,
  CheckCircle,
  Award,
  AlertTriangle,
} from "lucide-react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import type { CalendarApi } from "@fullcalendar/core";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

export default function GoogleCalendar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showIntegrationPrompt, setShowIntegrationPrompt] = useState(true);
  const [name, setName] = useState("");
  const [avatarURL, setAvatarURL] = useState("");

  const calendarRef = useRef<CalendarApi | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const data = userDoc.exists() ? userDoc.data() : {};
          setName(data.name || user.displayName || "User");
          setAvatarURL(data.avatarURL || user.photoURL || "/default-avatar.png");
        } catch (e) {
          console.error("Failed to fetch user", e);
        }
      }
    };
    loadUserData();
  }, [user]);

  useEffect(() => {
    gapi.load("client", async () => {
      await gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: DISCOVERY_DOCS,
      });
    });
  }, []);

  const handleIntegrationConfirm = () => {
    const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (tokenResponse: any) => {
        if (tokenResponse?.access_token) {
          setShowIntegrationPrompt(false);
          loadEvents();
        }
      },
    });

    tokenClient.requestAccessToken();
  };

  const loadEvents = async () => {
    try {
      const res = await gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 50,
        orderBy: "startTime",
      });

      const items = res.result.items || [];
      const formatted = items.map((item) => ({
        title: item.summary,
        start: item.start?.dateTime || item.start?.date,
        end: item.end?.dateTime || item.end?.date,
      }));
      setEvents(formatted);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const filteredEvents = searchQuery
    ? events.filter((e: any) => e.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : events;

  const today = new Date();
  const calendarStats = {
    totalEvents: events.length,
    todayEvents: events.filter((e: any) =>
      new Date(e.start).toDateString() === today.toDateString()
    ).length,
    thisWeekEvents: events.filter((e: any) => {
      const date = new Date(e.start);
      return date >= today && date <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    }).length,
    upcomingEvents: events.length,
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
            <SidebarLink icon={<BarChart3 />} label="Dashboard" onClick={() => navigate("/dashboard")} />
            <SidebarLink icon={<ListTodo />} label="Tasks" onClick={() => navigate("/tasks")} />
            <SidebarLink icon={<Users />} label="Start Searching" onClick={() => navigate("/match")} />
            <SidebarLink icon={<Calendar />} label="Calendar" active />
            <SidebarLink icon={<Award />} label="Achievements" onClick={() => navigate("/achievements")} />
          </nav>
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-sm font-semibold text-gray-500 uppercase">General</p>
          <nav className="space-y-2 font-medium">
            <SidebarLink icon={<Settings />} label="Settings" onClick={() => navigate("/settings")} />
            <SidebarLink icon={<HelpCircle />} label="Help" onClick={() => navigate("/help")} />
            <SidebarLink icon={<User />} label="Profile" onClick={() => navigate("/profile")} />
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
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="relative w-1/3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
            <input
              type="text"
              placeholder="Search calendar events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-0 placeholder-gray-400 text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-6">
            <Bell className="text-gray-500 hover:text-indigo-600 cursor-pointer" size={24} />
            <div className="flex items-center gap-4 bg-white/80 rounded-2xl p-3 shadow-md">
              <img src={avatarURL} alt="Avatar" className="w-12 h-12 rounded-full object-cover ring-3 ring-indigo-200" />
              <div className="text-left">
                <p className="text-base font-semibold text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative">
          <h1 className="text-3xl font-bold mb-2">📅 Your Schedule Dashboard</h1>
          <p className="text-lg opacity-90 mb-6">Stay organized and never miss an important event</p>
          <div className="flex gap-4">
            <button onClick={handleIntegrationConfirm} className="flex items-center gap-2 cursor-pointer bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:bg-white/30 hover:-translate-y-1 hover:shadow-md active:scale-95">
              <CalendarDays size={16} /> Sync Calendar
            </button>
            <button onClick={() => navigate("/tasks")} className="cursor-pointer bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:bg-gray-100 hover:-translate-y-1 hover:shadow-md active:scale-95">
              Manage Tasks
            </button>
          </div>
        </div>

        {/* Calendar Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <EnhancedStatCard title="Total Events" value={`${calendarStats.totalEvents}`} subtitle="in your calendar" color="indigo" icon={<Calendar />} trend={`${calendarStats.upcomingEvents} upcoming`} />
          <EnhancedStatCard title="Today's Events" value={`${calendarStats.todayEvents}`} subtitle="scheduled today" color="green" icon={<CheckCircle />} trend={calendarStats.todayEvents > 0 ? "Stay on track!" : "Free day ahead"} />
          <EnhancedStatCard title="This Week" value={`${calendarStats.thisWeekEvents}`} subtitle="events this week" color="purple" icon={<Clock />} trend="Plan accordingly" />
          <EnhancedStatCard title="Calendar Status" value={events.length > 0 ? "Synced" : "Empty"} subtitle="sync status" color="amber" icon={<AlertTriangle />} trend={events.length > 0 ? "Up to date" : "No events found"} />
        </section>

        {/* Calendar Widget */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
              <Calendar size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Google Calendar</h2>
              <p className="text-gray-600">Manage your schedule and stay organized</p>
            </div>
          </div>
          <FullCalendar
            ref={(el) => {
              if (el) calendarRef.current = el.getApi();
            }}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={filteredEvents}
            height="auto"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            eventColor="#6366f1"
            eventTextColor="#ffffff"
            dayHeaderClassNames="text-gray-600 font-semibold"
            eventClassNames="rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          />
        </div>
      </main>

      {/* Logout Modal */}
      {isLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsLogoutOpen(false)} />
          <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <LogOut className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to go?</h3>
              <p className="text-gray-600">You'll be signed out. Your events are saved!</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsLogoutOpen(false)} className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50">
                Stay
              </button>
              <button onClick={handleLogout} className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Integration Prompt */}
      {showIntegrationPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6 border border-white/20 mx-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white mx-auto w-fit">
              <Calendar size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Integrate Google Calendar?</h2>
              <p className="text-gray-600">Sync your Google Calendar to view and manage all your events in one place</p>
            </div>
            <div className="flex gap-4">
              <button onClick={handleIntegrationConfirm} className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold">
                Yes, Integrate
              </button>
              <button onClick={() => setShowIntegrationPrompt(false)} className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EnhancedStatCard({
  title,
  value,
  subtitle,
  color,
  icon,
  trend,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: "indigo" | "green" | "purple" | "amber";
  icon: JSX.Element;
  trend: string;
}) {
  const colorMap = {
    indigo: "from-indigo-500 to-blue-600",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-pink-600",
    amber: "from-amber-500 to-orange-600",
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
