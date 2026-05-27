import { useState, useEffect } from 'react';
import { 
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Maximize2,
  Minimize2,
  CheckCircle2
} from 'lucide-react';
import './App.css';
import { businessTypes } from './constants';
import { InstructionsModal } from './components/InstructionsModal';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ReviewModal } from './components/ReviewModal';
import { Login } from './components/Login';
import { Analytics } from './components/Analytics';
import { ContentLibrary } from './components/ContentLibrary';
import { Settings } from './components/Settings';
import { PlanningHeader } from './components/PlanningHeader';
import { api } from './services/api';
import { useAppStore } from './store/context';

// Types
export interface CalendarEvent {
  id: string;
  day: number;
  month: number;
  year: number;
  time: string;
  title: string;
  type: 'listing' | 'report' | 'social';
  content?: string;
  approved?: boolean;
}

function App() {
  const { state, dispatch } = useAppStore();
  const { businessType, theme, user } = state;

  // Initialize Auth state from Mock API on mount
  useEffect(() => {
    const cachedUser = api.getCurrentUser();
    if (cachedUser && !user) {
      dispatch({ type: 'SET_USER', payload: cachedUser });
    }
  }, [dispatch, user]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showInstructions, setShowInstructions] = useState(() => {
    return localStorage.getItem('hide_instructions') !== 'true';
  });
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isCompressed, setIsCompressed] = useState(false);
  const [aiSearchTopic, setAiSearchTopic] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftEvents, setDraftEvents] = useState<CalendarEvent[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const [viewDate, setViewDate] = useState(new Date());
  // Global Theme Side Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [scheduledEvents, setScheduledEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoadingData(true);
      const data = await api.fetchEvents();
      setScheduledEvents(data);
      setIsLoadingData(false);
    };
    loadEvents();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAiGenerate = async () => {
    if (!aiSearchTopic) {
      setNotification("Please enter a topic for your content.");
      return;
    }
    
    setIsGenerating(true);
    const targetDates = selectedDates.length > 0 ? selectedDates : [new Date()];

    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newEvents: CalendarEvent[] = targetDates.map(date => {
      const concepts = [
        `Here is an insightful update regarding ${aiSearchTopic}. The market is showing strong positive indicators this quarter.`,
        `Don't miss out on this week's highlights! We're focusing heavily on ${aiSearchTopic} to drive engagement.`,
        `Did you know? Our latest data on ${aiSearchTopic} reveals a 20% increase in user interaction.`
      ];

      return {
        id: Math.random().toString(36).substr(2, 9),
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        time: "09:00 AM",
        title: `AI: ${aiSearchTopic}`,
        type: 'social',
        content: concepts[Math.floor(Math.random() * concepts.length)]
      };
    });

    setDraftEvents(newEvents);
    setShowReviewModal(true);
    setIsGenerating(false);
  };

  const handleApproveDrafts = async () => {
    const updatedEvents = [...scheduledEvents, ...draftEvents];
    setScheduledEvents(updatedEvents);
    await api.saveEvents(updatedEvents);

    setAiSearchTopic('');
    setAttachments([]);
    setNotification(`Successfully scheduled ${draftEvents.length} new post(s).`);
    setSelectedDates([]);
    setShowReviewModal(false);
    setDraftEvents([]);
  };


  const handleCancelDrafts = () => {
    setShowReviewModal(false);
    setDraftEvents([]);
    setNotification("Drafts discarded.");
  };

  const handleQuickTool = async (title: string, type: 'listing' | 'report' | 'social') => {
    const targetDates = selectedDates.length > 0 ? selectedDates : [new Date()];
    const newEvents: CalendarEvent[] = targetDates.map(date => ({
      id: Math.random().toString(36).substr(2, 9),
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      time: "10:00 AM",
      title: title,
      type: type
    }));

    const updatedEvents = [...scheduledEvents, ...newEvents];
    setScheduledEvents(updatedEvents);
    await api.saveEvents(updatedEvents);

    setNotification(`${title} scheduled for ${targetDates.length} day(s).`);
    setSelectedDates([]);
  };

  const isDateSelected = (date: Date) => {
    return !!selectedDates.find(d =>
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );
  };

  const setDateSelectedState = (date: Date, selected: boolean) => {
    setSelectedDates(prev => {
      const exists = prev.find(d => 
        d.getDate() === date.getDate() && 
        d.getMonth() === date.getMonth() && 
        d.getFullYear() === date.getFullYear()
      );

      if (selected && !exists) {
        return [...prev, date];
      } else if (!selected && exists) {
        return prev.filter(d => d !== exists);
      }
      return prev;
    });
  };

  const handleMouseDownOnDate = (date: Date) => {
    setIsDragging(true);
    const currentlySelected = isDateSelected(date);
    const newMode = currentlySelected ? 'deselect' : 'select';
    setDragMode(newMode);
    setDateSelectedState(date, newMode === 'select');
  };

  const handleMouseEnterOnDate = (date: Date) => {
    if (isDragging) {
      setDateSelectedState(date, dragMode === 'select');
    }
  };

  const handleCloseInstructions = () => {
    if (dontShowAgain) {
      localStorage.setItem('hide_instructions', 'true');
    }
    setShowInstructions(false);
  };

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const renderCalendarGrid = (isDashboard = false) => {
    if (calendarView === 'week' && !isDashboard) {
      // Week View Logic
      const startOfWeek = new Date(viewDate);
      startOfWeek.setDate(viewDate.getDate() - viewDate.getDay());
      
      return (
        <div className="calendar-grid week-view">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const isSelected = !!selectedDates.find(d => 
              d.getDate() === date.getDate() && 
              d.getMonth() === date.getMonth() && 
              d.getFullYear() === date.getFullYear()
            );
            const events = scheduledEvents.filter(e => 
              e.day === date.getDate() && 
              e.month === date.getMonth() && 
              e.year === date.getFullYear()
            );

            return (
              <div key={day} className="calendar-column">
                <div className="calendar-day-head">{day} {date.getDate()}</div>
                <div 
                  className={`calendar-day week-day ${isSelected ? 'selected' : ''}`}
                  onMouseDown={() => handleMouseDownOnDate(new Date(date))}
                  onMouseEnter={() => handleMouseEnterOnDate(new Date(date))}
                  onClick={() => {}}
                  style={{ userSelect: 'none' }}
                >
                  <div className="day-events-container">
                    {events.map((e, ei) => (
                      <div key={ei} className={`calendar-event ${e.type}`} title={e.title}>
                        <div className="event-time">{e.time}</div>
                        <div className="event-title">{e.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Month View Logic (Original but with multi-select)
    const firstDay = firstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear());
    const totalDays = daysInMonth(viewDate.getMonth(), viewDate.getFullYear());
    
    return (
      <div className={`calendar-grid ${isDashboard ? 'dashboard-grid' : ''}`}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-head">{day}</div>
        ))}
        {Array.from({ length: 42 }).map((_, i) => {
          const dayNum = i - firstDay + 1;
          const isCurrentMonth = dayNum > 0 && dayNum <= totalDays;
          const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum);
          const isSelected = !!selectedDates.find(d => 
            d.getDate() === dayNum && 
            d.getMonth() === viewDate.getMonth() && 
            d.getFullYear() === viewDate.getFullYear()
          );
          
          const events = scheduledEvents.filter(e => e.day === dayNum && e.month === viewDate.getMonth() && e.year === viewDate.getFullYear());
          
          return (
            <div 
              key={i} 
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isCompressed ? 'compressed' : ''} ${isSelected ? 'selected' : ''}`}
              onMouseDown={() => isCurrentMonth && handleMouseDownOnDate(date)}
              onMouseEnter={() => isCurrentMonth && handleMouseEnterOnDate(date)}
              onClick={() => {}}
              style={{ userSelect: 'none' }}
            >
              {isCurrentMonth && (
                <>
                  <span className="day-number">{dayNum}</span>
                  <div className="day-events-container">
                    {events.map((e, ei) => (
                      <div key={ei} className={`calendar-event ${e.type}`} title={e.title}>
                        {isDashboard ? '' : e.title}
                      </div>
                    ))}
                  </div>
                  {isDashboard && events.length > 0 && (
                    <span className="event-count-badge">{events.length}</span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCalendarHeader = (isDashboard = false) => (
    <div className="calendar-header">
      <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
        <h2 style={{fontSize: '1.25rem', fontWeight: 800, color: '#0A192F'}}>
          {calendarView === 'month' || isDashboard
            ? viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })
            : `Week of ${new Date(viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate() - viewDate.getDay()).toLocaleDateString('default', { month: 'short', day: 'numeric' })}`}
        </h2>
        <div style={{display: 'flex', gap: '0.25rem', background: '#F1F5F9', padding: '4px', borderRadius: '8px'}}>
          <button className="btn btn-outline" style={{padding: '0.4rem'}} onClick={handlePrevMonth}><ChevronLeft size={16} /></button>
          <button className="btn btn-outline" style={{padding: '0.4rem'}} onClick={handleNextMonth}><ChevronRight size={16} /></button>
        </div>
      </div>
      
      {!isDashboard && (
        <div className="view-switcher">
          <button 
            className={`view-btn ${calendarView === 'month' ? 'active' : ''}`}
            onClick={() => setCalendarView('month')}
          >
            Month
          </button>
          <button 
            className={`view-btn ${calendarView === 'week' ? 'active' : ''}`}
            onClick={() => setCalendarView('week')}
          >
            Week
          </button>
        </div>
      )}
    </div>
  );

  if (!user) {
    return <Login onLoginSuccess={(u) => dispatch({ type: 'SET_USER', payload: u })} />;
  }

  return (
    <div className="dashboard-layout">
      {showReviewModal && (
        <ReviewModal
          draftEvents={draftEvents}
          setDraftEvents={setDraftEvents}
          onApprove={handleApproveDrafts}
          onCancel={handleCancelDrafts}
        />
      )}
      <InstructionsModal
        showInstructions={showInstructions}
        dontShowAgain={dontShowAgain}
        setDontShowAgain={setDontShowAgain}
        handleCloseInstructions={handleCloseInstructions}
      />
      {notification && (
        <div className="notification-toast">
          <span>{notification}</span>
          <button className="btn-close-toast" onClick={() => setNotification(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopBar
          setShowInstructions={setShowInstructions}
          setNotification={setNotification}
        />

        <PlanningHeader
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          aiSearchTopic={aiSearchTopic}
          setAiSearchTopic={setAiSearchTopic}
          attachments={attachments}
          setAttachments={setAttachments}
          isGenerating={isGenerating}
          handleAiGenerate={handleAiGenerate}
          handleQuickTool={handleQuickTool}
        />

        <div className="page-container" style={{paddingTop: 0}}>
          {activeTab === 'dashboard' && (
            <div className="view-dashboard">
              <div className="page-header" style={{marginBottom: '1rem'}}>
                <h1>Command Center</h1>
                <p style={{color: '#64748B'}}>Overview of your authority footprint.</p>
              </div>
              <div className="dashboard-content-layout">
                <div className="dashboard-stats-column">
                  <div className="stats-grid" style={{marginBottom: '2rem'}}>
                    {businessTypes[businessType].stats.map((s, i) => (
                      <div key={i} className="stat-card">
                        <h4>{s.l}</h4>
                        <div className="value">{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="dashboard-info-card">
                    <h3>Quick Tips ({businessTypes[businessType].label})</h3>
                    <ul>
                      {businessTypes[businessType].tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="dashboard-calendar-column">
                  <div className="calendar-container mini-calendar">
                    {isLoadingData ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading...
                      </div>
                    ) : (
                      <>
                        {renderCalendarHeader(true)}
                        {renderCalendarGrid(true)}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="view-calendar">
              <div className="calendar-actions-bar" style={{marginTop: '-1rem'}}>
                <button className="action-btn danger" onClick={async () => {
                  if (window.confirm("Are you sure you want to clear all content for this month? This action cannot be undone.")) {
                    const updatedEvents = scheduledEvents.filter(e => e.month !== viewDate.getMonth());
                    setScheduledEvents(updatedEvents);
                    await api.saveEvents(updatedEvents);
                    setNotification("Month cleared.");
                  }
                }}>
                  <Trash2 size={16} /> Clear Content
                </button>
                <button className="action-btn" onClick={() => setIsCompressed(!isCompressed)}>
                  {isCompressed ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                  {isCompressed ? 'Expand View' : 'Compress View'}
                </button>
                <button className="action-btn success" onClick={() => setNotification("Strategy approved.")}>
                  <CheckCircle2 size={16} /> Approve Content
                </button>
              </div>

              <div className="calendar-container">
                {isLoadingData ? (
                  <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading Calendar Data...
                  </div>
                ) : (
                  <>
                    {renderCalendarHeader(false)}
                    {renderCalendarGrid(false)}
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <ContentLibrary events={scheduledEvents} />
          )}

          {activeTab === 'analytics' && <Analytics />}

          {activeTab === 'settings' && <Settings />}
        </div>
      </main>

      <style>{`
        .sidebar { transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </div>
  );
}

export default App;
