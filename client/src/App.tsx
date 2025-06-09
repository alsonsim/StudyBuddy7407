import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Login from "./Login";
import Register from "./Register";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import { useAuth } from "./AuthContext";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
  {/* Public pages inside Layout */}
  <Route element={<Layout />}>
    <Route index element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Route>

  {/* Protected dashboard route (no Layout) */}
  <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
</Routes>

  );
}
