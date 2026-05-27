# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - Initial Universal Pivot
### Added
- **Universal Business Sector Logic**: Introduced dynamic UI rendering based on the selected business type (Real Estate, E-Commerce, Restaurant, General).
- **Instructions Modal**: Implemented a mandatory on-boarding modal with a "Don't show this again" capability persisting via `localStorage`.
- **Core Documentation Structure**: Created VISION.md, MEMORY.md, DEPLOY.md, IDEAS.md, CHANGELOG.md, ROADMAP.md, TODO.md, HANDOFF.md, and VERSION.md to enforce strict version control and architecture governance.

### Changed
- Refactored hardcoded UI elements in `App.tsx` to dynamically parse from the `businessTypes` configuration array.
- Redesigned the top navigation bar to elegantly accommodate the new business selector dropdown menu.