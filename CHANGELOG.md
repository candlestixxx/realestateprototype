# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - OAuth Integration Settings Mockup
### Added
- **Settings View**: Created `src/components/Settings.tsx` to handle OAuth platform toggling (Facebook, Instagram, LinkedIn).
- **Sidebar Integration**: Added a "Settings" tab to the main navigation menu using the `Settings2` icon.

## [1.0.0] - Content Filtering & V1 Stable Release
### Added
- **Content Library Filtering**: Added a filter bar to the Content Library allowing users to instantly sort historical and upcoming posts by category type (`all`, `listing`, `report`, `social`).
- **Baseline Feature Complete**: All core UI mocks, routing, user authentication simulation, AI draft generation tracking, and document governance directives are complete.

## [0.9.0] - Content Library Integration
### Added
- **Content Library View**: Created a grid-based interface (`src/components/ContentLibrary.tsx`) to display all approved and scheduled events.
- **Historical Tracking**: Integrated the `scheduledEvents` payload to stream populated content seamlessly into the library component.

## [0.8.0] - Phase 3 Analytics Preview
### Added
- **Analytics Dashboard**: Created `Analytics.tsx` providing a UI layout for campaign tracking (Impressions, Clicks, Conversions, Engagement Rate).
- **Sidebar Integration**: Added a dedicated `Analytics` tab to the primary sidebar navigation.
- **Mock Metrics API**: Extended `src/services/api.ts` with `getAnalyticsData()` to simulate fetching performance metrics.

## [0.7.0] - Authentication Flow Mock
### Added
- **Mock Login Service**: Added `login` and `logout` actions to `api.ts` with delayed simulated networking.
- **Login Screen UI**: Created a new isolated `Login.tsx` view with robust CSS styling and error handling states.
- **Session State**: Wrapped `App.tsx` behind an `isAuthenticated` check tying back to local storage, and introduced a Logout feature into the Top Bar.

## [0.6.0] - AI Draft Review System
### Added
- **Content Review Modal**: Intercepts AI content generation, presenting the user with editable drafts.
- **Draft Event Content**: Updated `CalendarEvent` to optionally hold simulated AI post copy.
- **Discard/Approve Flow**: Added approval loop preventing unverified posts from hitting the global schedule.

## [0.5.0] - UI Safety & Notification Polish
### Added
- **Destructive Action Safety**: Implemented a `window.confirm` dialogue on the "Clear Content" button to prevent accidental event loss.
- **Dismissible Notifications**: Added an interactive "X" close button to the notification toast, allowing users to manually dismiss alerts.

## [0.4.0] - Component De-coupling & Clean Up
### Changed
- Removed deprecated Legacy Tour logic and guided overlays, preventing state conflicts with the new Instructions Modal.
- Aggressively refactored `App.tsx` by extracting the `<Sidebar />` and `<TopBar />` components into the `src/components/` directory, satisfying Phase 4 Roadmap goals.

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