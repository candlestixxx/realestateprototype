# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - Mock API & Data Plumbing
### Added
- **Mock API Service**: Created `src/services/api.ts` to wrap localStorage with simulated network latency, acting as a mock database.
- **Data Loading States**: Introduced an `isLoadingData` state to display loading indicators across the Dashboard and Calendar views while data is fetched asynchronously.

### Changed
- Refactored `App.tsx` calendar event management from synchronous local storage reads/writes to async API calls.

## [0.2.0] - UI Enhancement & Backend Prep
### Added
- **Dark Mode**: Implemented full CSS variable tokenization for a complete Dark Mode theme toggled via the top bar and persisted in `localStorage`.
- **Drag-to-Select Calendar**: Upgraded the calendar interface to allow seamless drag selection and deselection of dates without individual clicks.
- **Loading States**: Introduced a simulated 2-second timeout and spinner UI during AI Generation to mimic realistic API calls.
- **API Types**: Created `AIGenerationRequest` and `AIGenerationResponse` TypeScript interfaces.

### Changed
- Abstracted the notification toast inline styles to `App.css` to fix animation glitching.
- Separated components and constants out of `App.tsx` into modular files (`constants.ts`, `InstructionsModal.tsx`).

## [0.1.0] - Initial Universal Pivot
### Added
- **Universal Business Sector Logic**: Introduced dynamic UI rendering based on the selected business type (Real Estate, E-Commerce, Restaurant, General).
- **Instructions Modal**: Implemented a mandatory on-boarding modal with a "Don't show this again" capability persisting via `localStorage`.
- **Core Documentation Structure**: Created VISION.md, MEMORY.md, DEPLOY.md, IDEAS.md, CHANGELOG.md, ROADMAP.md, TODO.md, HANDOFF.md, and VERSION.md to enforce strict version control and architecture governance.

### Changed
- Refactored hardcoded UI elements in `App.tsx` to dynamically parse from the `businessTypes` configuration array.
- Redesigned the top navigation bar to elegantly accommodate the new business selector dropdown menu.