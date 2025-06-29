import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import { useAuth } from "./AuthContext";
import Terms from './terms';
import Tasks from './Tasks';
import ProfilePage from './Profile'; 
import GoogleCalendar from "./components/GoogleCalendar";
import Help from './components/Help';
import Match from './Match';
import SettingsPage from "./Settings"; 

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected dashboard route */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
      <Route path="/tasks" element={user ? <Tasks /> : <Login />} />
      <Route path="/profile" element={user ? <ProfilePage /> : <Login />} />
      <Route path="/calendar" element={user ? <GoogleCalendar /> : <Login />} />
      <Route path="/Help" element={user ? <Help /> : <Login />} />
      <Route path="/match" element={user ? <Match /> : <Login />} />
      <Route path="/settings" element={user ? <SettingsPage /> : <Login />} />

      {/*terms n condition*/}
      <Route path="/terms" element={<Terms />} />


    </Routes>
  );
}