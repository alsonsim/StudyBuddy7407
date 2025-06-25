import React, {useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { LogOut, Calendar, BarChart3, ListTodo, Settings, HelpCircle, Users, User } from "lucide-react";

import { SidebarLink } from "../Tasks"; 


export default function GoogleCalendar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);



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
            <SidebarLink icon={<Calendar />} label="Calendar" active />
            <SidebarLink icon={<BarChart3 />} label="Leaderboard" />
          </nav>
        </div>

        {/* General */}
        <div className="mt-8 space-y-2">
          <p className="text-sm font-semibold text-gray-500 uppercase">General</p>
          <nav className="space-y-2 font-medium">
            <SidebarLink icon={<Settings />} label="Settings" onClick={() => navigate('/settings')} />
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

      {/* Calendar Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">📅 Google Synced Calendar</h1>
        <div className="bg-white/80 rounded-2xl shadow-xl p-6 border border-white/20">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, googleCalendarPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="auto"
            googleCalendarApiKey={import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY}
            events={{ googleCalendarId: "primary" }}
            eventClick={(info) => window.open(info.event.url, "_blank")}
          />
        </div>
      </main>
    </div>
  );
}

