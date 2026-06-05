import { ChevronLeft, ChevronRight, LayoutDashboard, Calendar as CalendarIcon, Library, BarChart2, Settings2 } from 'lucide-react';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  activeTab,
  setActiveTab
}: SidebarProps) => {
  return (
    <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-collapse-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      <div className="sidebar-logo">{isSidebarCollapsed ? <span>L1</span> : <>LEGACY<span>ONE</span></>}</div>
      <nav className="nav-menu">
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <LayoutDashboard size={20} />{!isSidebarCollapsed && <span>Dashboard</span>}
        </div>
        <div className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
          <CalendarIcon size={20} />{!isSidebarCollapsed && <span>Content Calendar</span>}
        </div>
        <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
          <Library size={20} />{!isSidebarCollapsed && <span>Content Library</span>}
        </div>
        <div className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          <BarChart2 size={20} />{!isSidebarCollapsed && <span>Analytics</span>}
        </div>
        <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <Settings2 size={20} />{!isSidebarCollapsed && <span>Settings</span>}
        </div>
      </nav>
      <div className="sidebar-footer">
        <div className="plan-badge">LEGACY PRO</div>
      </div>
    </aside>
  );
};