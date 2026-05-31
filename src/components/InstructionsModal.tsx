interface InstructionsModalProps {
  showInstructions: boolean;
  dontShowAgain: boolean;
  setDontShowAgain: (value: boolean) => void;
  handleCloseInstructions: () => void;
}

export const InstructionsModal = ({
  showInstructions,
  dontShowAgain,
  setDontShowAgain,
  handleCloseInstructions,
}: InstructionsModalProps) => {
  if (!showInstructions) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content instructions-modal">
        <div className="modal-header">
          <h2>Welcome to AI Content Planner</h2>
        </div>
        <div className="instructions-body">
          <p>
            Welcome! This tool helps you plan and generate social media content
            across various platforms automatically.
          </p>
          <ul>
            <li>
              <strong>1. Select Your Business Type:</strong> Use the dropdown in
              the top bar to tailor content generation to your industry.
            </li>
            <li>
              <strong>2. Pick Dates:</strong> Click on the calendar to select
              single or multiple days for scheduling content.
            </li>
            <li>
              <strong>3. Provide a Topic:</strong> Enter your focus topic or
              strategy in the input box above.
            </li>
            <li>
              <strong>4. Generate:</strong> Hit "Generate" or "Bulk Schedule" to
              let the AI create engaging posts for you!
            </li>
            <li>
              <strong>5. Quick Tools:</strong> Use the quick tools at the bottom
              for industry-specific content templates.
            </li>
          </ul>
        </div>
        <div className="modal-footer">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            Don't show this again
          </label>
          <button
            className="btn-primary-gold"
            onClick={handleCloseInstructions}
            disabled={!dontShowAgain}
            style={{ opacity: !dontShowAgain ? 0.5 : 1, cursor: !dontShowAgain ? 'not-allowed' : 'pointer' }}
          >
            Got it, Let's go!
          </button>
        </div>
      </div>
    </div>
  );
};