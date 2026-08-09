import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, LogOut, User, Menu, Bell, Play } from 'lucide-react';
import Button from './Button';

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F19]/90 backdrop-blur-md border-b border-gray-800/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left branding & Mobile toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-wide flex items-center gap-1">
                CODEX
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded font-mono font-normal">
                  AI v2.4
                </span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-wider font-mono">INTERVIEW SIMULATOR</span>
            </div>
          </Link>
        </div>

        {/* Right side navigation & user status */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="primary"
                size="sm"
                icon={Play}
                onClick={() => navigate('/setup')}
                className="hidden sm:inline-flex"
              >
                New Interview
              </Button>

              <div className="h-6 w-px bg-gray-800 hidden sm:block" />

              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-800/60 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {user?.name || 'Candidate'}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                      {user?.email || 'user@codex.ai'}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
