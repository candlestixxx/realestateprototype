import { useState, useEffect } from 'react';
import { 
  X,
  Trash2,
  Maximize2,
  Minimize2,
  CheckCircle2
} from 'lucide-react';
import './App.css';
import { InstructionsModal } from './components/InstructionsModal';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ReviewModal } from './components/ReviewModal';
import { Login } from './components/Login';
import { Analytics } from './components/Analytics';
import { ContentLibrary } from './components/ContentLibrary';
import { Settings } from './components/Settings';
import { PlanningHeader } from './components/PlanningHeader';
import { Dashboard } from './components/Dashboard';
import { Calendar } from './components/Calendar';
import { api } from './services/api';
import { useAppStore } from './store/context';
import { generateAIContent } from './services/openai';

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
  status?: 'scheduled' | 'published';
}

function App() {
  const { state, dispatch } = useAppStore();
  const { theme, user } = state;

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

  // Simulated Background Worker for Publishing
  useEffect(() => {
    if (scheduledEvents.length === 0) return;

    const interval = setInterval(async () => {
      let hasChanges = false;
      const now = new Date();

      const updatedEvents = scheduledEvents.map(event => {
        if (event.status !== 'published') {
          // Naive time parsing (e.g., "09:00 AM" to hours)
          const isPM = event.time.includes('PM');
          let hours = parseInt(event.time.split(':')[0], 10);
          if (isPM && hours < 12) hours += 12;
          if (!isPM && hours === 12) hours = 0;

          const eventDate = new Date(event.year, event.month, event.day, hours);

          if (eventDate <= now) {
            hasChanges = true;
            return { ...event, status: 'published' as const };
          }
        }
        return event;
      });

      if (hasChanges) {
        setScheduledEvents(updatedEvents);
        await api.saveEvents(updatedEvents);
        setNotification("Background worker published scheduled content.");
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [scheduledEvents, dispatch]);

  const handleAiGenerate = async () => {
    if (!aiSearchTopic) {
      setNotification("Please enter a topic for your content.");
      return;
    }
    
    setIsGenerating(true);
    const targetDates = selectedDates.length > 0 ? selectedDates : [new Date()];

    try {
      const response = await generateAIContent({
        topic: aiSearchTopic,
        businessType: state.businessType,
        targetDates: targetDates.map(d => d.toISOString()),
        attachmentsCount: 0
      });

      if (response.success && response.events) {
        // Enhance events with status before sending to review
        const enhancedEvents = response.events.map(event => ({
          ...event,
          status: 'scheduled' as const
        }));

        setDraftEvents(enhancedEvents);
        setShowReviewModal(true);
      } else {
        setNotification(response.error || "Failed to generate AI content.");
      }
    } catch (error) {
      console.error("AI Generation Error", error);
      setNotification("An unexpected error occurred during AI generation.");
    } finally {
      setIsGenerating(false);
    }
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
      type: type,
      status: 'scheduled'
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
            <Dashboard
              isLoadingData={isLoadingData}
              viewDate={viewDate}
              setViewDate={setViewDate}
              calendarView={calendarView}
              setCalendarView={setCalendarView}
              selectedDates={selectedDates}
              scheduledEvents={scheduledEvents}
              isCompressed={isCompressed}
              handleMouseDownOnDate={handleMouseDownOnDate}
              handleMouseEnterOnDate={handleMouseEnterOnDate}
            />
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
                  <Calendar
                    isDashboard={false}
                    viewDate={viewDate}
                    setViewDate={setViewDate}
                    calendarView={calendarView}
                    setCalendarView={setCalendarView}
                    selectedDates={selectedDates}
                    scheduledEvents={scheduledEvents}
                    isCompressed={isCompressed}
                    handleMouseDownOnDate={handleMouseDownOnDate}
                    handleMouseEnterOnDate={handleMouseEnterOnDate}
                  />
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
