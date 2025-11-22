from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text, Enum
from sqlalchemy.orm import relationship, declarative_base, sessionmaker
from sqlalchemy import create_engine
import enum
from datetime import datetime

import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kinevision_v2.db")

# Fix for Vercel/Heroku Postgres using postgres:// which SQLAlchemy doesn't support
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

# Create sessionmaker for SQLAlchemy 2.0
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class UserRole(str, enum.Enum):
    PATIENT = "patient"
    PROFESSIONAL = "professional"
    TRAINER = "trainer"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    roles = Column(String, default="patient") # comma-separated roles: "patient,professional,trainer"
    full_name = Column(String)
    profile_image_url = Column(String, nullable=True)
    
    def has_role(self, role: str) -> bool:
        """Check if user has a specific role"""
        if not self.roles:
            return False
        return role in self.roles.split(',')
    
    def get_roles_list(self) -> list:
        """Get list of user roles"""
        if not self.roles:
            return []
        return [r.strip() for r in self.roles.split(',')]
    
    # Relationships
    patient_profile = relationship("Patient", back_populates="user", uselist=False)
    professional_profile = relationship("Professional", back_populates="user", uselist=False)
    trainer_profile = relationship("AITrainer", back_populates="user", uselist=False)
    unlocked_exercises = relationship("UserExercise", back_populates="user")

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    professional_id = Column(Integer, ForeignKey("professionals.id"), nullable=True)
    
    # JSON fields for detailed profile
    mobility_traits = Column(Text, nullable=True) # JSON: ["limited_rom_left_arm", "recent_surgery"]
    recovery_goals = Column(Text, nullable=True) # JSON: ["walk_without_pain", "lift_arm_90_deg"]
    surgery_info = Column(Text, nullable=True) # JSON: {"date": "2024-01-01", "type": "ACL Reconstruction"}

    user = relationship("User", back_populates="patient_profile")
    professional = relationship("Professional", back_populates="patients")
    sessions = relationship("Session", back_populates="patient")
    gamification_stats = relationship("GamificationStats", back_populates="patient", uselist=False)

class Professional(Base):
    __tablename__ = "professionals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="professional_profile")
    patients = relationship("Patient", back_populates="professional")

class TrainerType(str, enum.Enum):
    VOLUNTEER = "volunteer"
    PROFESSIONAL = "professional"
    STAFF = "staff"

class AITrainer(Base):
    __tablename__ = "ai_trainers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    rank_score = Column(Integer, default=0)
    
    # Gamification & Roles
    trainer_type = Column(String, default=TrainerType.VOLUNTEER)
    points = Column(Integer, default=0)
    rank = Column(String, default="Novice") # Novice, Expert, Master
    earnings = Column(Float, default=0.0) # For professionals
    
    user = relationship("User", back_populates="trainer_profile")
    uploaded_videos = relationship("Video", back_populates="uploader")
    ratings = relationship("VideoRating", back_populates="trainer")

class Video(Base):
    __tablename__ = "videos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    url = Column(String)
    uploader_id = Column(Integer, ForeignKey("ai_trainers.id"))
    
    uploader = relationship("AITrainer", back_populates="uploaded_videos")
    ratings = relationship("VideoRating", back_populates="video")

class VideoRating(Base):
    __tablename__ = "video_ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"))
    trainer_id = Column(Integer, ForeignKey("ai_trainers.id"))
    rating = Column(Integer)
    comment = Column(Text, nullable=True)
    
    video = relationship("Video", back_populates="ratings")
    trainer = relationship("AITrainer", back_populates="ratings")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    summary = Column(Text, nullable=True)
    pre_session_feeling = Column(Text, nullable=True)
    pre_session_audio_url = Column(String, nullable=True)
    
    patient = relationship("Patient", back_populates="sessions")
    metrics = relationship("CVMetric", back_populates="session")

class CVMetric(Base):
    __tablename__ = "cv_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    metric_type = Column(String) # e.g., "knee_angle", "rep_count"
    value = Column(Float)
    
    session = relationship("Session", back_populates="metrics")

class GamificationStats(Base):
    __tablename__ = "gamification_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    current_streak = Column(Integer, default=0)
    total_sessions = Column(Integer, default=0)
    points = Column(Integer, default=0)
    
    patient = relationship("Patient", back_populates="gamification_stats")

class Exercise(Base):
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(String, unique=True, index=True)  # e.g., 'squat', 'plank'
    title = Column(String)
    category = Column(String)  # e.g., 'Legs', 'Core', 'Shoulders'
    difficulty = Column(String)  # 'Beginner', 'Intermediate', 'Advanced'
    price = Column(Float, default=0.0)
    locked_by_default = Column(Boolean, default=True)
    
    user_exercises = relationship("UserExercise", back_populates="exercise")

class UserExercise(Base):
    __tablename__ = "user_exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    unlocked_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="unlocked_exercises")
    exercise = relationship("Exercise", back_populates="user_exercises")

class AnonymousAssessment(Base):
    __tablename__ = "anonymous_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    exercises_data = Column(Text) # JSON string of exercises performed and results
    final_feedback = Column(Text, nullable=True)

class Program(Base):
    __tablename__ = "programs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    created_by_id = Column(Integer, ForeignKey("professionals.id"))
    exercises_json = Column(Text) # JSON list of exercise IDs: ["squat", "plank"]
    
    created_by = relationship("Professional", back_populates="created_programs")
    assignments = relationship("ProgramAssignment", back_populates="program")

class ProgramAssignment(Base):
    __tablename__ = "program_assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    program_id = Column(Integer, ForeignKey("programs.id"))
    assigned_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="active") # active, completed, archived
    progress_json = Column(Text, default="{}") # JSON: {"squat": {"completed": 5, "last_done": "..."}}
    
    patient = relationship("Patient", back_populates="program_assignments")
    program = relationship("Program", back_populates="assignments")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    read = Column(Boolean, default=False)
    
    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])

# Update relationships
Professional.created_programs = relationship("Program", back_populates="created_by")
Patient.program_assignments = relationship("ProgramAssignment", back_populates="patient")
