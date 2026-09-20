# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2026-09-20

### Added
- **Native Light/Dark Mode:** Introduced a persistent and interactive theme toggle allowing users to switch between a premium dark aesthetic and a clean, "Apple Minimalist" light mode.
- **Modern Notification System:** Replaced intrusive browser alerts with sleek, non-blocking Toast notifications across all core tools.
- **Asynchronous Feedback:** Added global loading overlays and spinners to provide immediate, clear visual feedback during computationally heavy operations.

### Changed
- **Global UI/UX Overhaul:** Re-engineered the entire application interface (Home, ContourCreator, CloudGenerator, CloudViewer, and NeighborsCalculator) using Tailwind CSS to deliver a cohesive, modern, and responsive user experience.
- **Informational Pages Redesign:** Rebuilt the About, Examples, and Privacy Notice pages using a glassmorphic aesthetic and responsive grid layouts, adapting them perfectly to both light and dark themes.
- **Privacy & Compliance:** Substantially updated the Privacy Notice to explicitly outline compliance with international data protection frameworks (LFPDPPP, GDPR, ARCO rights) and AI model usage policies.
- **Internationalization (i18n):** Achieved 100% translation coverage for English and Spanish, resolving missing text nodes and modernizing the language selection dropdown.

### Technical & Architecture
- **CSS Architecture:** Migrated from monolithic, hardcoded legacy CSS files to a utility-first architecture utilizing semantic design tokens.
- **Cache-Busting Mechanism:** Implemented a global versioning strategy (`APP_VERSION`) to automatically invalidate stale browser caches for static assets upon new releases.
## [2.2.0] - 2026-09-16
### Changed
- **CloudGenerator UI Redesign**: Completely overhauled the workspace layout to match the ContourCreator workflow. Implemented a two-step process: Upload/Format card first, followed by a full-width Configuration Workspace upon successful upload.
- **CloudGenerator Forms Fix**: Reverted generic generated options form to match the actual original backend variables (`regionesInsideOption`, `generationMethodOption`, `densityMultiplierOption`) maintaining the new Bento-grid UI.
- **CloudGenerator State Fix**: Fixed bug preventing the transition from Upload state to Options state by using correct IDs and classes instead of deprecated inline styles.


### Added
- Integration with the core `mGFD` library for mathematical algorithms and spatial data structures.
- Interactive cloud visualization canvas and enhanced region management UI.
- Localized UI strings (i18n support) with translation templates.
- Personal ROADMAP and local CHANGELOG.
- Custom agent rules, documentation, and core design/UI skills configured in `.agents`.
- Proper registration of `main` module within `routes/__init__.py` to handle root level endpoints correctly.

### Changed
- Implemented modular blueprints and introduced base template inheritance for the Flask application.
- Upgraded contour smoothing to support precise point-count control.
- Improved contour accuracy using `CHAIN_APPROX_NONE` and replaced Douglas-Peucker with equidistant sampling.
- Optimized cloud data storage and regenerated visualization assets for all examples.
- Refactored `cloud_modules/` logic into separated and specialized directories (`analysis_modules/` and `contour_modules/`).
- Standardized inline comments in all `routes/` modules (`cloud.py`, `contour.py`, `main.py`, `neighbors.py`, `viewer.py`) with highly descriptive and meaningful messages.
- Updated file clean-up daemon and logging definitions in `app.py` to match the project's new commenting conventions.
- Improved serialization process in `routes/viewer.py` and `routes/neighbors.py` to safely handle JSON serialization of `numpy.ndarray` objects by converting them to native python lists (`.tolist()`).

### Removed
- Removed the deprecated `cloud_modules/` directory completely from the repository root.
- Cleaned up obsolete temporary scratch and formatting scripts (e.g., `format_all.py`, `check_comments.py`, `fix_syntax.py`) from the workspace.
- Removed deprecated region card rendering logic and placeholder scripts.
- Removed `vercel.json`, `.vercelignore`, and all Vercel serverless environment bindings in `app.py`, as the project exceeds AWS Lambda limits and is moving to containerized PaaS/VPS hosting.

### Fixed
- Fixed `ModuleNotFoundError: No module named 'cloud_modules.data_processing'` in `routes/viewer.py` by pointing to the newly refactored `read_cloud_data` function in `analysis_modules.neighbors`.
- Fixed `ValueError: The truth value of an array with more than one element is ambiguous` in `routes/viewer.py` when verifying NumPy arrays in boolean logic statements (now checks `if points is None or len(points) == 0`).
- Fixed HTTP 404 error on the homepage (`/`) by correcting the empty `main_bp` blueprint registration in `routes/__init__.py`.

### Security
- Upgraded `Werkzeug` to `3.1.8` to patch a Dependabot security alert (`safe_join()` vulnerability on Windows).

### Dependencies
- Upgraded `Flask` to `3.1.3`.
- Upgraded `opencv-python-headless` to `5.0.0.93`.
- Upgraded `numpy` to `2.5.3`.
- Upgraded `scipy` to `1.18.1`.
- Upgraded `matplotlib` to `3.11.2`.
