# KineVision Feature Enhancements Implementation Plan

## Overview

This plan covers three major feature enhancements for KineVision:
1. **Theme System Fixes** - Ensure CSS variables work consistently across all pages
2. **Skeleton Wireframe Toggle** - Add visualization controls for pose tracking
3. **Exercise Marketplace** - Create a marketplace for discovering and unlocking exercises

---

## Proposed Changes

### Feature 1: Theme System Fixes

#### [MODIFY] [Landing.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/pages/Landing.jsx)

**Issue**: The Landing page has hardcoded colors (e.g., `bg-slate-950`, `bg-slate-900`) that don't respect theme variables.

**Changes**:
- Replace all hardcoded Tailwind color classes with CSS variable-based inline styles
- Update sections at lines 154, 182, 222, 254, 292, 302 to use `var(--bg-secondary)`, `var(--bg-card)`, etc.
- Ensure all text colors use `var(--text-primary)` and `var(--text-secondary)`

---

### Feature 2: Skeleton Wireframe Toggle

#### [MODIFY] [SessionView.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/pages/SessionView.jsx)

**Changes**:
- Add state for skeleton visibility mode: `'overlay'` (default), `'skeleton-only'`, `'video-only'`
- Add toggle button group in header (lines 56-75) with three options
- Pass visibility mode to `PoseTracker` component
- Style toggle to match existing mode switcher design

#### [MODIFY] [PoseTracker.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/components/PoseTracker.jsx)

**Changes**:
- Accept `skeletonMode` prop
- Conditionally render video element based on mode:
  - `'overlay'`: Show video + skeleton (current behavior)
  - `'skeleton-only'`: Hide video, show skeleton on solid background
  - `'video-only'`: Show video, hide skeleton canvas
- Update canvas background color for skeleton-only mode
- Adjust z-index and visibility CSS

---

### Feature 3: Exercise Marketplace

#### [NEW] [MarketplacePage.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/pages/MarketplacePage.jsx)

**Purpose**: New page for browsing and unlocking exercises

**Features**:
- Grid layout showing all available exercises
- Filter by category (Legs, Shoulders, Core, etc.)
- Filter by difficulty (Beginner, Intermediate, Advanced)
- Show locked/unlocked status
- "Unlock" button for locked exercises (free for now, payment integration later)
- Visual indicators: lock icon, difficulty badges, category tags

#### [MODIFY] [exercises.js](file:///c:/Users/Pablo/code/kinevision/frontend/src/data/exercises.js)

**Changes**:
- Add more exercises (expand from 3 to ~12 exercises)
- Add `locked` property (boolean)
- Add `price` property (number, 0 for free)
- Add `thumbnail` property (placeholder image URLs or generate with AI)
- Add `category` tags for filtering

#### [MODIFY] [PatientDashboard.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/pages/PatientDashboard.jsx)

**Changes**:
- Add "Marketplace" navigation item to sidebar
- Filter exercises to show only unlocked ones
- Add "Browse More Exercises" CTA card linking to marketplace

#### [MODIFY] [App.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/App.jsx)

**Changes**:
- Add route for `/patient/marketplace`
- Import and configure `MarketplacePage` component

#### [MODIFY] [models.py](file:///c:/Users/Pablo/code/kinevision/backend/models.py)

**Changes**:
- Add `Exercise` table with fields: `id`, `exercise_id` (string), `title`, `category`, `difficulty`, `price`, `locked`
- Add `UserExercise` junction table for tracking unlocked exercises per user
- Add relationship between `Patient` and `Exercise` through `UserExercise`

#### [MODIFY] [api.py](file:///c:/Users/Pablo/code/kinevision/backend/api.py)

**New Endpoints**:
- `GET /api/exercises` - List all exercises with locked status for current user
- `POST /api/exercises/{exercise_id}/unlock` - Unlock an exercise for current user
- `GET /api/user/exercises` - Get only unlocked exercises for current user

---

## Verification Plan

### Automated Tests

```bash
# Start backend
cd backend
uv run uvicorn main:app --reload --port 8000

# Start frontend
cd frontend
npm run dev
```

### Manual Verification

#### Theme System
1. Open Landing page
2. Switch between Dark, Light, and High Contrast themes
3. Verify all sections (Features, Pricing, Trainers) update colors correctly
4. Check that no hardcoded colors remain visible

#### Skeleton Wireframe Toggle
1. Navigate to Patient Dashboard
2. Start an exercise session
3. Test all three skeleton modes:
   - **Overlay**: Video + skeleton visible
   - **Skeleton Only**: Only skeleton on dark background
   - **Video Only**: Only video feed, no skeleton
4. Verify toggle persists during session
5. Check that rep counting works in all modes

#### Exercise Marketplace
1. Navigate to `/patient/marketplace`
2. Verify all exercises display with correct locked/unlocked status
3. Test category and difficulty filters
4. Click "Unlock" on a locked exercise
5. Verify exercise appears in Patient Dashboard after unlock
6. Verify backend API returns correct exercise list
7. Check database for `UserExercise` entry after unlock
