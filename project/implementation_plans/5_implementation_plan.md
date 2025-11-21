# Dashboard Enhancements & Multi-Role Support

## Goal Description
Enhance the user experience by adding personalization, program management, progress tracking, and messaging capabilities. This will allow professionals to assign programs to patients and patients to track their progress and communicate with their professionals.

## User Review Required
> [!IMPORTANT]
> **Database Schema Changes**: We will be adding several new tables (`Program`, `ProgramAssignment`, `Message`) and modifying `Patient` and `User` models. This will require a database migration (or reset in dev).

## Proposed Changes

### Backend

#### [MODIFY] [models.py](file:///c:/Users/Pablo/code/kinevision/backend/models.py)
- **User**: Add `profile_image_url`.
- **Patient**: Add `mobility_traits` (JSON), `recovery_goals` (JSON), `surgery_info` (JSON).
- **NEW Models**:
    - `Program`: Title, description, exercises (JSON list of IDs), created_by (Professional).
    - `ProgramAssignment`: Link between Patient and Program, with status and progress.
    - `Message`: Sender, receiver, content, timestamp, read_status.

#### [MODIFY] [api.py](file:///c:/Users/Pablo/code/kinevision/backend/api.py)
- **User Endpoints**:
    - `PUT /user/profile`: Update name, email, traits.
- **Program Endpoints**:
    - `POST /programs`: Create a new program (Professional).
    - `GET /programs`: List programs.
    - `POST /programs/assign`: Assign program to patient.
    - `GET /patient/program`: Get current assigned program.
- **Message Endpoints**:
    - `POST /messages`: Send message.
    - `GET /messages/{user_id}`: Get conversation.

### Frontend

#### [MODIFY] [PatientDashboard.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/pages/PatientDashboard.jsx)
- Add "My Program" section showing assigned exercises.
- Add "Profile" section to view/edit mobility traits.
- Add "Messages" widget or link.

#### [MODIFY] [ProfessionalDashboard.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/pages/ProfessionalDashboard.jsx)
- Add "Patient List" with ability to assign programs.
- Add "Program Builder" (simple UI to select exercises).
- Add "Messages" section.

#### [NEW] [ProfilePage.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/pages/ProfilePage.jsx)
- Detailed profile view/edit for patients.

#### [NEW] [MessagingComponent.jsx](file:///c:/Users/Pablo/code/kinevision/frontend/src/components/MessagingComponent.jsx)
- Reusable chat interface.

## Verification Plan

### Automated Tests
- Test API endpoints for creating programs and sending messages.

### Manual Verification
- **Professional Flow**:
    - Log in as Professional.
    - Create a "Knee Recovery" program.
    - Assign it to a Patient.
    - Send a message to the Patient.
- **Patient Flow**:
    - Log in as Patient.
    - Verify "Knee Recovery" program appears in dashboard.
    - Check profile and update mobility traits.
    - Reply to the message.
