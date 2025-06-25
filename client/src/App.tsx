import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import { useAuth } from "./AuthContext";
import Terms from './terms';
import Tasks from './Tasks';
import SettingsPage from './Settings';
import GoogleCalendar from "./components/GoogleCalendar";


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
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/settings" element={user ? <SettingsPage /> : <Login />} />

      {/*terms n condition*/}
      <Route path="/terms" element={<Terms />} />

      <Route path="/calendar" element={user ? <GoogleCalendar /> : <Login />} />

    </Routes>
  );
}
