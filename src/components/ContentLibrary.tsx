import { useState } from 'react';
import { type CalendarEvent } from '../App';
import { Database, FileText, Users, Calendar as CalendarIcon, Filter } from 'lucide-react';

interface ContentLibraryProps {
  events: CalendarEvent[];
}

type FilterOption = 'all' | 'listing' | 'report' | 'social';

export const ContentLibrary = ({ events }: ContentLibraryProps) => {
  const [filter, setFilter] = useState<FilterOption>('all');

  const getIconForType = (type: string) => {
    switch (type) {
      case 'listing': return <Database size={16} />;
      case 'report': return <FileText size={16} />;
      case 'social': return <Users size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const filteredEvents = events.filter(e => filter === 'all' || e.type === filter);

  return (
    <div className="view-library">
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Content Library</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse your historical and upcoming scheduled content.</p>
        </div>

        {events.length > 0 && (
          <div className="library-filters" style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface-alt)', padding: '4px', borderRadius: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', color: 'var(--text-muted)' }}>
              <Filter size={16} />
            </span>
            {(['all', 'listing', 'report', 'social'] as FilterOption[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: filter === f ? 'var(--bg-surface)' : 'transparent',
                  color: filter === f ? 'var(--primary)' : 'var(--text-muted)',
                  borderRadius: '7px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: filter === f ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                  textTransform: 'capitalize'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '12px' }}>
          No content has been generated or scheduled yet.
        </div>
      ) : filteredEvents.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '12px' }}>
          No events match the selected filter.
        </div>
      ) : (
        <div className="library-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredEvents.map((event) => (
            <div key={event.id} className="library-card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className={`draft-badge ${event.type}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {getIconForType(event.type)}
                  {event.type.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                  <CalendarIcon size={14} />
                  {event.month + 1}/{event.day}/{event.year}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>{event.title}</h3>
              {event.content && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
                  {event.content}
                </p>
              )}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                Scheduled for {event.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};