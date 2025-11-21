from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from models import engine, Session as DbSession
import shutil
import os
from analysis import VideoAnalyzer

# Dependency
def get_db():
    db = DbSession(bind=engine)
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

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
        print(f"❌ Failed to send email: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

# Auth Endpoints
@router.post("/auth/magic-link/request")
def request_magic_link(email: str, db: Session = Depends(get_db)):
    # 1. Check if user exists, if not create one (simplified for demo)
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        # Create a default user if not exists - in real app, might want a registration flow
        user = models.User(email=email, role="patient", full_name="New User")
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # 2. Generate a token (mocked for now, usually JWT or random string stored in Redis/DB)
    # In a real app, we'd sign this with a secret
    token = f"mock_token_for_{user.email}"
    
    # 3. Send email
    magic_link = f"http://localhost:5173/auth/verify?token={token}&email={email}"
    email_body = f"""
    <h1>Login to KineVision</h1>
    <p>Click the link below to sign in:</p>
    <a href="{magic_link}">Sign In</a>
    <p>If you didn't request this, ignore this email.</p>
    """
    
    send_email(email, "Your KineVision Login Link", email_body)
    
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
            "role": user.role,
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
