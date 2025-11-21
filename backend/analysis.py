import cv2
import mediapipe as mp
import numpy as np

class VideoAnalyzer:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=2,
            enable_segmentation=False,
            min_detection_confidence=0.5
        )

    def analyze_video(self, video_path: str):
        cap = cv2.VideoCapture(video_path)
        frames_processed = 0
        reps = 0
        feedback_log = []
        
        # State for squat counting
        is_squatting = False
        prev_angle = 180

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Convert to RGB
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(image)

            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark
                
                # Get coordinates
                hip = landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value]
                knee = landmarks[self.mp_pose.PoseLandmark.LEFT_KNEE.value]
                ankle = landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value]

                # Calculate angle
                angle = self.calculate_angle(hip, knee, ankle)

                # Simple Squat Logic (Server Side)
                if angle < 90:
                    if not is_squatting:
                        is_squatting = True
                        feedback_log.append(f"Frame {frames_processed}: Good depth reached ({int(angle)}°)")
                elif angle > 160:
                    if is_squatting:
                        reps += 1
                        is_squatting = False
                        feedback_log.append(f"Frame {frames_processed}: Rep {reps} completed")

            frames_processed += 1

        cap.release()
        
        return {
            "total_frames": frames_processed,
            "reps_completed": reps,
            "feedback_log": feedback_log,
            "status": "completed"
        }

    def calculate_angle(self, a, b, c):
        a = np.array([a.x, a.y])
        b = np.array([b.x, b.y])
        c = np.array([c.x, c.y])

        radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
        angle = np.abs(radians*180.0/np.pi)

        if angle > 180.0:
            angle = 360-angle

        return angle
