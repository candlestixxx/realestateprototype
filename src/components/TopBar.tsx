import { Search, Briefcase, Moon, Sun, Sparkles, Bell, LogOut } from 'lucide-react';
import { businessTypes, type BusinessTypeKey } from '../constants';
import { type User } from '../types/api';

interface TopBarProps {
  selectedBusinessType: BusinessTypeKey;
  setSelectedBusinessType: (type: BusinessTypeKey) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  setShowInstructions: (show: boolean) => void;
  setNotification: (message: string) => void;
  currentUser: User;
  onLogout: () => void;
}

export const TopBar = ({
  selectedBusinessType,
  setSelectedBusinessType,
  isDarkMode,
  setIsDarkMode,
  setShowInstructions,
  setNotification,
  currentUser,
  onLogout
}: TopBarProps) => {
  return (
    <header className="top-bar">
      <div className="search-bar">
        <Search size={16} />
        <input type="text" placeholder="Search strategy..." />
      </div>

      <div className="business-selector">
        <Briefcase size={16} className="business-icon" />
        <select
          className="business-select"
          value={selectedBusinessType}
          onChange={(e) => setSelectedBusinessType(e.target.value as BusinessTypeKey)}
        >
          {Object.entries(businessTypes).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      <div className="user-profile">
        <button
          className="theme-toggle-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          className="help-btn"
          onClick={() => { setShowInstructions(true); setNotification("Showing instructions..."); }}
          title="Show Instructions"
        >
          <Sparkles size={18} />
          <span>Help</span>
        </button>
        <Bell size={20} />

        <div className="avatar" title={currentUser.name}>
          {currentUser.avatar}
        </div>
        <button
          className="theme-toggle-btn"
          onClick={onLogout}
          title="Log out"
          style={{ marginLeft: '-0.5rem' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};