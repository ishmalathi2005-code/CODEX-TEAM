import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlayCircle,
  History,
  TrendingUp,
  User,
  X,
  Sparkles,
  Award
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Start Interview', path: '/setup', icon: PlayCircle },
    { name: 'Interview History', path: '/history', icon: History },
    { name: 'Skill Improvement', path: '/skill-improvement', icon: TrendingUp },
    { name: 'Candidate Profile', path: '/profile', icon: User },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111827] border-r border-gray-800/80 w-64 p-4">
      {/* Mobile Close Button */}
      <div className="flex items-center justify-between lg:hidden mb-4 pb-3 border-b border-gray-800">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</span>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold shadow-inner'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`
              }
            >
              <IconComponent className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* AI Readiness Banner */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/20 text-center">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2">
          <Sparkles className="w-4 h-4" />
        </div>
        <h5 className="text-xs font-bold text-white mb-1">AI Performance Tracking</h5>
        <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
          Simulate real-world technical and HR rounds with instant scoring.
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-indigo-300 font-mono font-medium">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Readiness Score: 84%</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-[61px] h-[calc(100vh-61px)] z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 w-64 h-full shadow-2xl animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
