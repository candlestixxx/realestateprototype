# Granular Tasks and Immediate Bug Fixes

## Pending Architecture & Integration (Phase 2 & 3)
*   [x] Connect the front-end to a live OpenAI/Claude endpoint for actual dynamic post generation.
*   [x] Establish secure user authentication and profile management (Implemented via Backend SQLite and JWT Tokens).
*   [x] Integrate OAuth 2.0 flows for major social media platforms (Implemented frontend-to-backend API pipeline).

## Pending Architecture & Integration (Phase 4 Refactoring)
*   [x] Migrate local component states in `App.tsx` (like active user, theme, and selected business type) to rely entirely on the newly created Global Context provider and reducer dispatches.
*   [x] De-couple structural header and dashboard views from `App.tsx` into modular files (`PlanningHeader.tsx`, `Dashboard.tsx`, `Calendar.tsx`).
*   [x] Implement GitHub Actions CI/CD Pipeline.
*   [x] Establish Node.js API backend to decouple secret logic (like OpenAI keys) from the frontend build.

## UI/UX Enhancements
*   [x] Enhance Content Library with filtering and sorting capabilities.
*   [x] Build out the Content Library view to display scheduled/approved events.
*   [x] Implement confirmation dialogue before executing destructive actions like clearing calendar events.
*   [x] Add manual dismiss functionality to the notification toast overlay.
*   [x] Extract the `InstructionsModal` into its own component file to declutter `App.tsx`.
*   [x] Enhance the calendar drag-and-drop capability. Currently, selecting multiple dates is click-based; implement a click-and-drag bounding box.
*   [x] Add a dark mode toggle and implement CSS variables for a true dark theme.

## Immediate Bug Fixes
*   [x] Resolve any strict mode double-render quirks causing notifications to flash twice in development.
*   [x] Address the ESLint warning regarding exporting constants alongside components in `App.tsx` (Move `businessTypes` to a separate `config.ts` or `constants.ts` file).

## Backend Integration Preparation
*   [x] Draft the TypeScript interfaces for the API payloads expected during "AI Generation".
*   [x] Implement a loading state spinner while the app simulates API generation delays.
*   [x] Build a Draft Review UI layer intercepting AI generation before calendar placement.