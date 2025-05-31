import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useAuth } from './AuthContext';

function Layout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-white to-indigo-100 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-700">StudyBuddy</Link>
        <div className="flex items-center gap-x-8">
          {!user ? (
            <>
              <Link to="/login" className="hover:text-indigo-700">Sign In</Link>
              <Link to="/register" className="hover:text-indigo-700">Register</Link>
            </>
          ) : (
            <>
              <span className="text-indigo-600 font-medium">{user.email}</span>
              <button
                onClick={handleLogout}
                className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow p-6 w-full">
        <Outlet />
      </main>

      {/* Footer (edge-to-edge) */}
      <footer className="bg-indigo-700 text-grey text-sm py-4 w-full">
        <div className="px-24 flex justify-between items-center w-full">
          <div className="font-semibold text-base">StudyBuddy</div>
          <div className="text-base">© 2025 StudyBuddy. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
