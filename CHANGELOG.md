# Changelog

All notable changes to this project will be documented in this file.

## [1.16.0] - JWT Authentication & User Profiles
### Added
- **JWT Authentication Flow**: Implemented fully functional user authentication via `/api/auth/register` and `/api/auth/login`.
- **Database Persistence**: Implemented a SQLite database (`server/src/db/index.ts`) storing users and events persistently instead of relying exclusively on `localStorage`.
- **Protected Endpoints**: Locked down `/api/events` and `/api/generate` routes behind `authenticateToken` middleware.
- **Client Auth Integration**: Updated frontend `api.ts` to store JWTs and attach an `Authorization` header to requests. `Login.tsx` now sends real credentials to the backend.

### Changed
- Refactored frontend API calls to handle 401 Unauthorized responses to seamlessly clear tokens and manage session state.

## [1.15.0] - Backend Server Integration (Node.js/Express)
### Added
- **Full-Stack Architecture**: Initialized a Node.js/Express backend server within the `server/` directory.
- **API Endpoints**: Created `/api/events` (GET/POST) and `/api/generate` (POST) to serve data.
- **Security**: Migrated the OpenAI API integration from the client-side browser logic to the secure backend server, hiding API keys from network traces.
- **Proxy Configuration**: Updated `vite.config.ts` to proxy frontend `/api` requests to the local `http://localhost:3001` Express server during development.

## [1.14.0] - OAuth Service Shell & CI/CD Pipeline
### Added
- **Mock OAuth Service**: Implemented `src/services/oauth/index.ts` to simulate asynchronous token handshakes and store connection states securely in `localStorage`.
- **Settings UI Polish**: Upgraded the `Settings.tsx` components to interact with the new OAuth service. Buttons now display loading spinners (`Loader2` from Lucide) during connection handshakes and trigger global success/error notifications upon completion.
- **Continuous Integration**: Established a GitHub Actions pipeline (`.github/workflows/ci.yml`) to automatically enforce linting, building, and Vitest test suite execution on all branch pushes and PRs.

## [1.13.0] - Live AI Content Generation Integration
### Added
- **OpenAI API Service**: Created `src/services/openai/index.ts` to connect directly to the OpenAI API for actual, dynamic text generation instead of hardcoded mock timeouts.
- **Dynamic Prompting**: The system now dynamically structures a prompt based on the user's selected business type, input topic, and number of requested calendar dates, returning exactly the right amount of JSON-structured draft events.

## [1.12.0] - Automated Publishing Engine Shell
### Added
- **Mock Background Worker**: Implemented a `setInterval` worker inside `App.tsx` that simulates background processing. It automatically polls `scheduledEvents` every 10 seconds and transitions posts from "scheduled" to "published" once their simulated timestamp matches the current time.
- **Event Status Tracking**: Extended the `CalendarEvent` interface with a new `status: 'scheduled' | 'published'` state.
- **UI Content Badges**: The `<ContentLibrary />` now dynamically renders visual badges (a Check Circle or an Alarm Clock icon) clearly indicating a post's real-time publication status.

## [1.11.0] - Global Notification Queue System
### Added
- **Global `NotificationToast`**: Extracted the toast popup from `App.tsx` into a robust `NotificationToast.tsx` component.
- **Reducer Driven Toasts**: Fired events (like generating posts or saving state) now dispatch `SET_NOTIFICATION` to the global context shell instead of maintaining isolated local states.

## [1.10.0] - Calendar & Dashboard Component Extraction
### Added
- **Core View Abstraction**: Extracted the final large UI chunks from `App.tsx` into `src/components/Calendar.tsx` and `src/components/Dashboard.tsx`.
- **Expanded Test Coverage**: Authored `Calendar.test.tsx` and `Dashboard.test.tsx` to handle the grid generation and mock state interactions securely.

## [1.9.0] - Planning Header Component Extraction
### Added
- **Planning Header**: Extracted the `PlanningHeader` logic and UI out of `App.tsx` into a dedicated component.
- **Component Tests**: Authored `PlanningHeader.test.tsx` to verify component rendering states based on `selectedDates` and `isGenerating` props.

## [1.8.0] - State Migration & Cleanup
### Changed
- **App.tsx State Refactor**: Migrated `currentUser`, `selectedBusinessType`, and `isDarkMode` local states entirely into the newly built Global App Context.
- **TopBar Prop Drilling**: Cleaned up the `<TopBar />` component by removing verbose prop-drilling, reading its authentication and layout dependencies directly from `useAppStore()`.

## [1.7.0] - Global State Reducers
### Added
- **Global `appReducer`**: Created `src/store/reducer.ts` to implement the logic for managing core state transitions (`SET_USER`, `SET_BUSINESS_TYPE`, `TOGGLE_THEME`).
- **Context Initialization**: Initialized the `useReducer` hook inside `AppProvider.tsx`, wiring the state engine to the React component tree.

## [1.6.0] - React Context Global Shells
### Added
- **Global `AppProvider`**: Integrated the global state shell natively into `src/main.tsx` providing context access via the `useAppStore` hook to the entire component tree.
- **Analytics Testing**: Added `Analytics.test.tsx` utilizing `vi.mock` to confidently test both async network delay loading states and numeric metric formatting (e.g. Engagement Rate math).

## [1.5.0] - Architecture Prep & TopBar Tests
### Added
- **Global State Shell**: Created `src/store/index.ts` to lay the groundwork for React Context, preparing the app to move away from prop-drilling in future refactors.
- **TopBar Testing**: Added `TopBar.test.tsx` to explicitly test the `businessTypes` dropdown logic and the user avatar UI.

## [1.4.0] - Content Library Sorting & Test Expansion
### Added
- **Chronological Sorting**: Users can now toggle between ascending and descending chronological sorting in the Content Library using the new arrow UI.
- **Library Unit Tests**: Created `ContentLibrary.test.tsx` to ensure zero states, filtering states, and base list rendering works robustly.

## [1.3.0] - Expanded Component Test Coverage
### Added
- **Component Tests**: Created robust Vitest unit tests for the `Sidebar` and `InstructionsModal` components evaluating rendering states and event fires.
- **Global Setup**: Implemented a global `setupTests.ts` configuration to provide `@testing-library/jest-dom` assertions universally across all test suites.

## [1.2.0] - Unit Testing Infrastructure
### Added
- **Vitest & RTL Integration**: Configured `vitest`, `jsdom`, and `@testing-library/react` for robust component unit testing.
- **TypeScript Test Tooling**: Added global test types to TS configurations to avoid import requirements.
- **Login Component Tests**: Created an initial `Login.test.tsx` file demonstrating rendering and validation logic.

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