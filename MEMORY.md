# Internal Architectural Observations & Memories

## Codebase Traits
*   **Framework Stack:** The application is built using Vite, React 19, and TypeScript.
*   **Styling:** Custom CSS (`App.css` and `index.css`) is used heavily, with a distinct color palette (Primary: Navy `#0A192F`, Accent: Gold `#C5A059`).
*   **Icons:** The project relies heavily on `lucide-react` for its iconography.
*   **State Management:** Currently utilizing standard React Hooks (`useState`, `useEffect`) and basic prop drilling. No external state management library (like Redux or Zustand) is implemented yet, though it may be needed as the app scales.

## Design Preferences & Patterns
*   **Component Structure:** The application currently resides mostly in a monolithic `App.tsx` file. As features expand, this will need to be aggressively refactored into smaller, modular components (e.g., `<Sidebar />`, `<Calendar />`, `<DashboardStats />`).
*   **Dynamic Data Configuration:** We recently migrated from hardcoded UI elements to a configuration-driven approach (e.g., `businessTypes` object). This pattern should be replicated for other extensible areas (like social media platform connectors).
*   **Persistence:** The app relies on `localStorage` for lightweight persistence (e.g., saving calendar events, tracking if the user has seen the instructions modal).

## Notes for Successor Models
*   When editing the `App.tsx` file, be mindful of the large size and ensure Git merge diffs target the exact lines required to avoid conflicts.
*   The instruction modal is absolutely positioned, so when interacting with it via Playwright, `force=True` on clicks is necessary due to viewport considerations.