import { Search, Briefcase, Moon, Sun, Sparkles, Bell, LogOut } from 'lucide-react';
import { businessTypes, type BusinessTypeKey } from '../constants';
import { useAppStore } from '../store/context';
import { api } from '../services/api';

interface TopBarProps {
  setShowInstructions: (show: boolean) => void;
  setNotification: (message: string) => void;
}

export const TopBar = ({
  setShowInstructions,
  setNotification
}: TopBarProps) => {
  const { state, dispatch } = useAppStore();
  const { businessType, theme, user } = state;
  const isDarkMode = theme === 'dark';

  const handleLogout = async () => {
    await api.logout();
    dispatch({ type: 'SET_USER', payload: null });
  };
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
          value={businessType}
          onChange={(e) => dispatch({ type: 'SET_BUSINESS_TYPE', payload: e.target.value as BusinessTypeKey })}
        >
          {Object.entries(businessTypes).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      <div className="user-profile">
        <button
          className="theme-toggle-btn"
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
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

        {user && (
          <div className="avatar" title={user.name}>
            {user.avatar}
          </div>
        )}
        <button
          className="theme-toggle-btn"
          onClick={handleLogout}
          title="Log out"
          style={{ marginLeft: '-0.5rem' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};