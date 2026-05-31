import React, { useRef } from 'react';
import { Calendar as CalendarIcon, X, Sparkles, Upload, Database, Users, FileText } from 'lucide-react';
import { businessTypes } from '../constants';
import { useAppStore } from '../store/context';

interface PlanningHeaderProps {
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
  aiSearchTopic: string;
  setAiSearchTopic: (topic: string) => void;
  attachments: File[];
  setAttachments: React.Dispatch<React.SetStateAction<File[]>>;
  isGenerating: boolean;
  handleAiGenerate: () => void;
  handleQuickTool: (title: string, type: 'listing' | 'report' | 'social') => void;
}

export const PlanningHeader = ({
  selectedDates,
  setSelectedDates,
  aiSearchTopic,
  setAiSearchTopic,
  attachments,
  setAttachments,
  isGenerating,
  handleAiGenerate,
  handleQuickTool
}: PlanningHeaderProps) => {
  const { state } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="planning-section">
      <div className="planning-header-text">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Let's plan your Social Media Content</h1>
            <p>Harness the power of AI to compile market trends, local listings, and your unique brand voice into a winning strategy.</p>
          </div>
          {selectedDates.length > 0 && (
            <div className="selected-date-badge multi">
              <CalendarIcon size={16} />
              <span><strong>{selectedDates.length}</strong> Days Selected</span>
              <button className="clear-date" onClick={() => setSelectedDates([])}><X size={14} /></button>
            </div>
          )}
        </div>
      </div>

      <div className="ai-search-container">
        <div className="ai-input-wrapper">
          <Sparkles size={20} style={{position: 'absolute', left: '1.25rem', top: '1.25rem', color: '#C5A059'}} />
          <input
            type="text"
            className="ai-input"
            placeholder={selectedDates.length > 0 ? `Schedule content for ${selectedDates.length} days...` : "What would you like your content to focus on this week?"}
            value={aiSearchTopic}
            onChange={(e) => setAiSearchTopic(e.target.value)}
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*"
          style={{ display: 'none' }}
        />

        <button className="btn-attachment" onClick={triggerFileUpload}>
          <Upload size={18} />
          {attachments.length > 0 ? `${attachments.length} Attached` : 'Add attachment'}
        </button>
        <button
          className={`btn-generate-green ${isGenerating ? 'loading' : ''}`}
          onClick={handleAiGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : (selectedDates.length > 0 ? 'Bulk Schedule' : 'Generate')}
        </button>
      </div>

      {attachments.length > 0 && (
        <div className="attachments-preview">
          {attachments.map((file, idx) => (
            <div key={idx} className="attachment-chip">
              <span>{file.name}</span>
              <X
                size={12}
                onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
              />
            </div>
          ))}
        </div>
      )}

      <div className="quick-tools-grid">
        {businessTypes[state.businessType].tools.map((tool, idx) => {
          const IconComponent = { Database, Users, FileText }[tool.icon as 'Database' | 'Users' | 'FileText'] || Database;
          return (
            <button key={idx} className="quick-tool-btn" onClick={() => handleQuickTool(tool.title, tool.type as 'listing' | 'report' | 'social')}>
              <IconComponent size={16} />
              Create {tool.title}
            </button>
          );
        })}
      </div>
    </section>
  );
};