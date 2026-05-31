import { businessTypes } from '../constants';
import { useAppStore } from '../store/context';
import { Calendar } from './Calendar';
import { type CalendarEvent } from '../App';

interface DashboardProps {
  isLoadingData: boolean;
  viewDate: Date;
  setViewDate: (date: Date) => void;
  calendarView: 'month' | 'week';
  setCalendarView: (view: 'month' | 'week') => void;
  selectedDates: Date[];
  scheduledEvents: CalendarEvent[];
  isCompressed: boolean;
  handleMouseDownOnDate: (date: Date) => void;
  handleMouseEnterOnDate: (date: Date) => void;
}

export const Dashboard = ({
  isLoadingData,
  viewDate,
  setViewDate,
  calendarView,
  setCalendarView,
  selectedDates,
  scheduledEvents,
  isCompressed,
  handleMouseDownOnDate,
  handleMouseEnterOnDate
}: DashboardProps) => {
  const { state } = useAppStore();
  const { businessType } = state;

  return (
    <div className="view-dashboard">
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h1>Command Center</h1>
        <p style={{ color: 'var(--text-muted)' }}>Overview of your authority footprint.</p>
      </div>
      <div className="dashboard-content-layout">
        <div className="dashboard-stats-column">
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
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
              <Calendar
                isDashboard={true}
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
      </div>
    </div>
  );
};