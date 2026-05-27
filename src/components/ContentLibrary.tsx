import { type CalendarEvent } from '../App';
import { Database, FileText, Users, Calendar as CalendarIcon } from 'lucide-react';

interface ContentLibraryProps {
  events: CalendarEvent[];
}

export const ContentLibrary = ({ events }: ContentLibraryProps) => {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'listing': return <Database size={16} />;
      case 'report': return <FileText size={16} />;
      case 'social': return <Users size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="view-library">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Content Library</h1>
        <p style={{ color: 'var(--text-muted)' }}>Browse your historical and upcoming scheduled content.</p>
      </div>

      {events.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '12px' }}>
          No content has been generated or scheduled yet.
        </div>
      ) : (
        <div className="library-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {events.map((event) => (
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