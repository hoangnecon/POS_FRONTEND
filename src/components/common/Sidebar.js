import React from 'react';
import {
  Home,
  UtensilsCrossed,
  BarChart3,
  Settings,
  LogOut,
  User,
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, handleLogout }) => {
  return (
    <div className="w-20 sidebar-gradient flex flex-col items-center py-8 shadow-2xl">
      {/* Main Navigation */}
      <div className="flex flex-col space-y-4 mb-10">
        <button
          onClick={() => setActiveSection('tables')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            activeSection === 'tables'
              ? 'text-white shadow-lg'
              : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <Home size={22} />
          {activeSection === 'tables' && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveSection('menu')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            activeSection === 'menu'
              ? 'text-white shadow-lg'
              : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <UtensilsCrossed size={22} />
          {activeSection === 'menu' && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveSection('dashboard')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            activeSection === 'dashboard'
              ? 'text-white shadow-lg'
              : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <BarChart3 size={22} />
          {activeSection === 'dashboard' && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full" />
          )}
        </button>
      </div>

      {/* Secondary Navigation */}
      <div className="flex-1 flex flex-col justify-end space-y-4">
        <button
          onClick={handleLogout}
          className="w-14 h-14 rounded-2xl text-white/50 hover:text-white/80 hover:bg-primary-highlight flex items-center justify-center transition-all duration-300"
        >
          <LogOut size={22} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;