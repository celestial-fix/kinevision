from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from models import engine, SessionLocal
from pydantic import BaseModel
import models
import shutil
import os
from analysis import VideoAnalyzer

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

# Pydantic models for request bodies
class MagicLinkRequest(BaseModel):
    email: str

class MagicLinkVerify(BaseModel):
    token: str
    email: str

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    file_path = os.path.join(upload_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Run Analysis
    analyzer = VideoAnalyzer()
    results = analyzer.analyze_video(file_path)
    
    # Clean up (optional, depending on privacy pref - for now keep for review)
    # os.remove(file_path) 
    
    return {"filename": file.filename, "analysis": results}

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email: str, subject: str, body: str):
    """Send email via SMTP or print to console in dev mode."""
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    # Dev mode: print to console
    if not smtp_user or not smtp_password:
        print("\n" + "="*80)
        print("📧 MAGIC LINK EMAIL (Dev Mode - SMTP not configured)")
        print("="*80)
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"\n{body}\n")
        print("="*80)
        print("ℹ️  To enable real emails, set SMTP_USER and SMTP_PASSWORD in .env")
        print("="*80 + "\n")
        return

    # Production mode: send real email
    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print(f"✅ Email sent successfully to {to_email}")
    except Exception as e:
        # Fall back to dev mode if SMTP fails
        print(f"⚠️  SMTP Error: {e}")
        print("\n" + "="*80)
        print("📧 MAGIC LINK EMAIL (Fallback - SMTP failed)")
        print("="*80)
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"\n{body}\n")
        print("="*80)
        print("ℹ️  SMTP failed. Common issues:")
        print("   - Gmail: Use an App Password, not your regular password")
        print("   - Enable 'Less secure app access' or use OAuth2")
        print("   - Check SMTP_SERVER and SMTP_PORT settings")
        print("="*80 + "\n")

# Auth Endpoints
@router.post("/auth/magic-link/request")
def request_magic_link(request: MagicLinkRequest, db: Session = Depends(get_db)):
    # 1. Check if user exists, if not create one (simplified for demo)
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        # Create a default user with all roles for development
        # In production, you'd assign roles based on registration type
        user = models.User(
            email=request.email, 
            roles="patient,professional,trainer,admin",  # All roles for dev
            full_name="New User"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # 2. Generate a token (mocked for now, usually JWT or random string stored in Redis/DB)
    # In a real app, we'd sign this with a secret
    token = f"mock_token_for_{user.email}"
    
    # 3. Send email
    magic_link = f"http://localhost:5173/auth/verify?token={token}&email={request.email}"
    email_body = f"""
    <h1>Login to KineVision</h1>
    <p>Click the link below to sign in:</p>
    <a href="{magic_link}">Sign In</a>
    <p>If you didn't request this, ignore this email.</p>
    """
    
    send_email(request.email, "Your KineVision Login Link", email_body)
    
    return {"message": "Magic link sent"}

@router.post("/auth/magic-link/verify")
def verify_magic_link(token: str, email: str, db: Session = Depends(get_db)):
    # 1. Verify token (mocked)
    expected_token = f"mock_token_for_{email}"
    if token != expected_token:
        raise HTTPException(status_code=400, detail="Invalid token")
    
    # 2. Get user
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 3. Return user info + "session" token (mocked)
    return {
        "token": "mock_jwt_session_token",
        "user": {
            "id": user.id,
            "email": user.email,
            "roles": user.get_roles_list(),  # Return array of roles
            "name": user.full_name
        }
    }

@router.post("/auth/register")
def register():
    return {"message": "Register endpoint"}

@router.post("/auth/login")
def login():
    return {"message": "Login endpoint"}

# Placeholder for Session endpoints
@router.post("/sessions/start")
def start_session():
    return {"message": "Session started"}

@router.post("/sessions/end")
def end_session():
    return {"message": "Session ended"}

# Placeholder for Dashboard endpoints
@router.get("/dashboard/professional")
def get_professional_dashboard():
    return {"message": "Professional dashboard data"}

@router.get("/dashboard/patient")
def get_patient_dashboard():
    return {"message": "Patient dashboard data"}

@router.get("/dashboard/trainer")
def get_trainer_dashboard():
    return {"message": "Trainer dashboard data"}

# Marketplace Endpoints
@router.get("/exercises")
def get_all_exercises(db: Session = Depends(get_db)):
    """Get all available exercises with their locked status."""
    exercises = db.query(models.Exercise).all()
    return {"exercises": [
        {
            "id": ex.id,
            "exercise_id": ex.exercise_id,
            "title": ex.title,
            "category": ex.category,
            "difficulty": ex.difficulty,
            "price": ex.price,
            "locked": ex.locked_by_default
        } for ex in exercises
    ]}

@router.get("/user/exercises")
def get_user_exercises(user_email: str, db: Session = Depends(get_db)):
    """Get exercises unlocked by a specific user."""
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    unlocked = db.query(models.UserExercise).filter(models.UserExercise.user_id == user.id).all()
    exercise_ids = [ue.exercise_id for ue in unlocked]
    
    return {"unlocked_exercise_ids": exercise_ids}

@router.post("/exercises/{exercise_id}/unlock")
def unlock_exercise(exercise_id: str, user_email: str, db: Session = Depends(get_db)):
    """Unlock an exercise for a user."""
    # Get user
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get exercise
    exercise = db.query(models.Exercise).filter(models.Exercise.exercise_id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    # Check if already unlocked
    existing = db.query(models.UserExercise).filter(
        models.UserExercise.user_id == user.id,
        models.UserExercise.exercise_id == exercise.id
    ).first()
    
    if existing:
        return {"message": "Exercise already unlocked"}
    
    # Create unlock record
    user_exercise = models.UserExercise(user_id=user.id, exercise_id=exercise.id)
    db.add(user_exercise)
    db.commit()
    
    return {"message": f"Exercise {exercise_id} unlocked successfully"}

