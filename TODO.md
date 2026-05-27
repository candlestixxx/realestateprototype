# Granular Tasks and Immediate Bug Fixes

## UI/UX Enhancements
*   [ ] Extract the `InstructionsModal` into its own component file to declutter `App.tsx`.
*   [ ] Enhance the calendar drag-and-drop capability. Currently, selecting multiple dates is click-based; implement a click-and-drag bounding box.
*   [ ] Add a dark mode toggle and implement CSS variables for a true dark theme.

## Immediate Bug Fixes
*   [ ] Resolve any strict mode double-render quirks causing notifications to flash twice in development.
*   [ ] Address the ESLint warning regarding exporting constants alongside components in `App.tsx` (Move `businessTypes` to a separate `config.ts` or `constants.ts` file).

## Backend Integration Preparation
*   [ ] Draft the TypeScript interfaces for the API payloads expected during "AI Generation".
*   [ ] Implement a loading state spinner while the app simulates API generation delays.