# Implementation Plan: AI Coach Enhancements and Exercise Marketplace

## Overview

The user has identified several gaps in the current KineVision implementation:
1. Missing tutorial videos for exercises
2. Untested AI coach functionality during live sessions
3. Missing skeleton wireframe toggle for video assessment
4. Need for an exercise marketplace

**Current State Analysis:**
- ✅ MediaPipe pose detection is integrated via `PoseTracker.jsx`
- ✅ AICoach logic exists in `logic/AICoach.js` with squat and lateral raise analysis
- ✅ Backend has `VideoAnalyzer` class in `analysis.py` with MediaPipe
- ❌ No tutorial video URLs in exercise data
- ❌ No skeleton wireframe toggle option
- ❌ No exercise marketplace component
- ❌ Theme inconsistencies (partially fixed in Landing page)

## User Review Required

> [!IMPORTANT]
> **Tutorial Videos**: We need video URLs for exercise tutorials. Options:
> 1. Use placeholder videos from a CDN (e.g., sample exercise videos)
> 2. Generate AI-created demonstration videos
> 3. Wait for you to provide actual video URLs
> 
> **Recommendation**: I'll add placeholder video URLs that can be easily replaced later.

> [!IMPORTANT]
> **MediaPipe Models**: The frontend uses MediaPipe via CDN (`https://cdn.jsdelivr.net/npm/@mediapipe/pose/`). The backend has `mediapipe` imported but needs to be installed via pip. Should I add it to `pyproject.toml`?

## Proposed Changes

### Component 1: Exercise Data Enhancement

#### [MODIFY] [exercises.js](file:///c:/Users/Pablo/code/kinevision/frontend/src/data/exercises.js)

Add tutorial video URLs and enhanced metadata to each exercise:
- Add `tutorialVideo` field with placeholder URLs
- Add `thumbnailImage` field for marketplace display
- Add `price` field for marketplace (free for basic, paid for premium)
- Add `tags` for filtering

---

### Component 2: Video Assessment Panel with Skeleton Toggle

#### [NEW] [VideoAssessmentPanel.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/components/VideoAssessmentPanel.jsx)

Create a new component that wraps `PoseTracker` with additional controls:
- Toggle for skeleton wireframe overlay (show/hide)
- Toggle for video feed visibility (show skeleton only mode)
- Recording controls for trainers/professionals
- Analysis metrics display

#### [MODIFY] [PoseTracker.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/components/PoseTracker.jsx)

Add props to control skeleton visibility:
- `showSkeleton` prop (default: true)
- `showVideo` prop (default: true)
- `skeletonColor` prop for customization
- Export skeleton drawing as separate function for reuse

---

### Component 3: Dashboard Integration

#### [MODIFY] [ProfessionalDashboard.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/pages/ProfessionalDashboard.jsx)

Add video assessment section:
- Integrate `VideoAssessmentPanel` component
- Add patient video review interface
- Add skeleton toggle controls

#### [MODIFY] [TrainerDashboard.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/pages/TrainerDashboard.jsx)

Add video rating interface with assessment panel:
- Integrate `VideoAssessmentPanel` for video review
- Add skeleton overlay for quality checking
- Add rating controls

---

### Component 4: Exercise Marketplace

#### [NEW] [ExerciseMarketplace.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/pages/ExerciseMarketplace.jsx)

Create marketplace page with:
- Grid layout of exercise cards
- Search bar for exercise names
- Filter by category (Legs, Arms, Core, etc.)
- Filter by difficulty (Beginner, Intermediate, Advanced)
- Filter by price (Free, Premium)
- Sort options (Popular, Newest, Price)

#### [NEW] [ExerciseCard.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/components/ExerciseCard.jsx)

Create reusable exercise card component:
- Thumbnail image
- Exercise title and category
- Difficulty badge
- Price tag
- Preview button (shows tutorial video modal)
- Add to routine button

#### [MODIFY] [App.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/App.jsx)

Add marketplace routes:
- `/marketplace` - public marketplace view
- `/patient/marketplace` - patient marketplace view
- `/professional/marketplace` - professional marketplace view

#### [MODIFY] [PatientDashboard.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/pages/PatientDashboard.jsx)

Add marketplace link to sidebar navigation

---

### Component 5: Backend Dependencies

#### [MODIFY] [pyproject.toml](file:///c:/Users/Pablo/code/kinevision/backend/pyproject.toml)

Ensure MediaPipe is included in dependencies:
- Add `mediapipe` package
- Add `opencv-python` package
- Add `numpy` package (likely already present)

## Verification Plan

### Automated Tests

No existing automated tests found. Manual verification will be required.

### Manual Verification

#### 1. Theme Consistency Test
1. Start the frontend dev server: `cd frontend && npm run dev`
2. Open browser to `http://localhost:5173`
3. Test theme switcher on Landing page
4. Switch between Dark, Light, and High Contrast themes
5. Verify all colors change appropriately without hardcoded values
6. Navigate to `/patient`, `/professional`, `/trainer` dashboards
7. Verify theme persists across navigation

#### 2. AI Coach Live Feedback Test
1. Ensure backend is running: `cd backend && uvicorn main:app --reload`
2. Navigate to `/patient` dashboard
3. Click on an exercise (e.g., "Bodyweight Squat")
4. Click "Comenzar" to start session
5. Grant camera permissions when prompted
6. Perform squat movements in front of camera
7. **Expected**: 
   - Skeleton overlay appears on video feed
   - Live feedback updates ("Lower your hips...", "Good depth!", etc.)
   - Rep counter increments when completing full reps
   - Feedback appears in the overlay below video

#### 3. Skeleton Wireframe Toggle Test
1. Navigate to `/professional` dashboard
2. Scroll to video assessment panel
3. Click "Toggle Skeleton" button
4. **Expected**: Skeleton overlay disappears, only video shows
5. Click again to re-enable
6. **Expected**: Skeleton overlay reappears
7. Repeat test in `/trainer` dashboard

#### 4. Exercise Marketplace Test
1. Navigate to `/marketplace` or `/patient/marketplace`
2. Verify exercise cards display with thumbnails
3. Test search functionality by typing "squat"
4. **Expected**: Only squat exercises show
5. Test category filter by selecting "Legs"
6. **Expected**: Only leg exercises show
7. Test difficulty filter by selecting "Beginner"
8. Click "Preview" on an exercise card
9. **Expected**: Modal opens with tutorial video playing
10. Click "Add to Routine" button
11. **Expected**: Exercise added to patient's routine (or shows success message)

#### 5. Tutorial Video Test
1. Navigate to `/briefing/squat`
2. **Expected**: Tutorial video player shows with placeholder video
3. Click play on video
4. **Expected**: Video plays smoothly
5. Verify video controls work (pause, seek, volume)
