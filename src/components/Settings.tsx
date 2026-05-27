import { useState } from 'react';
import { Share2, Globe, Link as LinkIcon, CheckCircle2, AlertCircle } from 'lucide-react';

export const Settings = () => {
  const [connections, setConnections] = useState({
    facebook: true,
    instagram: false,
    linkedin: true,
    twitter: false
  });

  const toggleConnection = (platform: keyof typeof connections) => {
    // In a real app, this would trigger an OAuth popup flow.
    // For this mock, we just toggle the boolean state.
    setConnections(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  return (
    <div className="view-settings">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Integration Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your OAuth 2.0 social media connections for automated publishing.</p>
      </div>

      <div className="settings-grid" style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>

        {/* Facebook */}
        <div className="setting-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#1877F2', padding: '12px', borderRadius: '8px', color: 'white' }}>
              <Globe size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>Facebook Pages</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Publish directly to your connected business pages.</p>
            </div>
          </div>
          <button
            className={`btn ${connections.facebook ? 'btn-outline' : 'btn-primary-gold'}`}
            onClick={() => toggleConnection('facebook')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', borderRadius: '8px', border: connections.facebook ? '1px solid var(--border)' : 'none', background: connections.facebook ? 'transparent' : 'var(--accent)', color: connections.facebook ? 'var(--text-dark)' : 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            {connections.facebook ? <><CheckCircle2 size={16} color="var(--success)" /> Connected</> : <><LinkIcon size={16} /> Connect</>}
          </button>
        </div>

        {/* Instagram */}
        <div className="setting-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', padding: '12px', borderRadius: '8px', color: 'white' }}>
              <Share2 size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>Instagram Business</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Auto-publish single images and carousels.</p>
            </div>
          </div>
          <button
            className={`btn ${connections.instagram ? 'btn-outline' : 'btn-primary-gold'}`}
            onClick={() => toggleConnection('instagram')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', borderRadius: '8px', border: connections.instagram ? '1px solid var(--border)' : 'none', background: connections.instagram ? 'transparent' : 'var(--accent)', color: connections.instagram ? 'var(--text-dark)' : 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            {connections.instagram ? <><CheckCircle2 size={16} color="var(--success)" /> Connected</> : <><LinkIcon size={16} /> Connect</>}
          </button>
        </div>

        {/* LinkedIn */}
        <div className="setting-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#0A66C2', padding: '12px', borderRadius: '8px', color: 'white' }}>
              <Share2 size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>LinkedIn Profile</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Share professional updates to your network.</p>
            </div>
          </div>
          <button
            className={`btn ${connections.linkedin ? 'btn-outline' : 'btn-primary-gold'}`}
            onClick={() => toggleConnection('linkedin')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', borderRadius: '8px', border: connections.linkedin ? '1px solid var(--border)' : 'none', background: connections.linkedin ? 'transparent' : 'var(--accent)', color: connections.linkedin ? 'var(--text-dark)' : 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            {connections.linkedin ? <><CheckCircle2 size={16} color="var(--success)" /> Connected</> : <><LinkIcon size={16} /> Connect</>}
          </button>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed var(--danger)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <AlertCircle size={24} color="var(--danger)" />
           <div>
             <h4 style={{ margin: 0, color: 'var(--danger)', fontSize: '0.95rem' }}>OAuth Connections are Mocked</h4>
             <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>This interface satisfies Phase 3 roadmap requirements visually. Actual token exchanges are disabled in this environment.</p>
           </div>
        </div>

      </div>
    </div>
  );
};