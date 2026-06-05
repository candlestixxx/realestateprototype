import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { type AnalyticsData } from '../types/api';
import { BarChart2, TrendingUp, Users, MousePointerClick } from 'lucide-react';

export const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await api.getAnalyticsData();
      setData(result);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Analytics Data...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="view-analytics">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Analytics Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track your generated content engagement and reach across platforms.</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} color="var(--accent)" />
            Total Impressions
          </h4>
          <div className="value">{data.impressions.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MousePointerClick size={16} color="var(--accent)" />
            Total Clicks
          </h4>
          <div className="value">{data.clicks.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={16} color="var(--accent)" />
            Conversions
          </h4>
          <div className="value">{data.conversions.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={16} color="var(--accent)" />
            Engagement Rate
          </h4>
          <div className="value">{((data.clicks / data.impressions) * 100).toFixed(2)}%</div>
        </div>
      </div>

      <div className="dashboard-info-card">
        <h3>Recent Campaign Performance</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          This data is currently mocked via the local API service until OAuth bindings are completed in Phase 3.
        </p>
        <div style={{ background: 'var(--bg-surface-alt)', padding: '2rem', borderRadius: '8px', textAlign: 'center', border: '1px dashed var(--border)' }}>
          <BarChart2 size={48} color="var(--border)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Interactive charts will be rendered here.</p>
        </div>
      </div>
    </div>
  );
};