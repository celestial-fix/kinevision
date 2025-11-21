export class AICoach {
    constructor(exerciseId) {
        this.exerciseId = exerciseId || 'squat';
        this.feedback = "Ready to start";
        this.repCount = 0;
        this.isRepInProgress = false;
        this.lastFeedbackTime = 0;
    }

    analyze(landmarks) {
        if (!landmarks) return { feedback: "No user detected", repCount: this.repCount };

        const now = Date.now();
        if (now - this.lastFeedbackTime > 1000) {
            if (this.exerciseId === 'squat') {
                this.analyzeSquat(landmarks);
            } else if (this.exerciseId === 'lateral_raise') {
                this.analyzeLateralRaise(landmarks);
            } else {
                this.feedback = "Exercise not supported yet";
            }
            this.lastFeedbackTime = now;
        }

        return {
            feedback: this.feedback,
            repCount: this.repCount,
            debug: { exercise: this.exerciseId }
        };
    }

    analyzeSquat(landmarks) {
        const leftHip = landmarks[23];
        const leftKnee = landmarks[25];
        const leftAnkle = landmarks[27];

        if (leftHip && leftKnee && leftAnkle) {
            const angle = this.calculateAngle(leftHip, leftKnee, leftAnkle);

            if (angle < 90) {
                this.feedback = "Good depth! Now stand up.";
                if (!this.isRepInProgress) {
                    this.isRepInProgress = true;
                }
            } else if (angle > 160) {
                this.feedback = "Stand straight. Prepare for next rep.";
                if (this.isRepInProgress) {
                    this.repCount++;
                    this.isRepInProgress = false;
                    this.feedback = "Rep completed!";
                }
            } else {
                this.feedback = "Lower your hips...";
            }
        }
    }

    analyzeLateralRaise(landmarks) {
        const leftShoulder = landmarks[11];
        const leftElbow = landmarks[13];
        const leftWrist = landmarks[15];
        const leftHip = landmarks[23];

        if (leftShoulder && leftElbow && leftHip) {
            // Angle between torso and arm
            const armAngle = this.calculateAngle(leftHip, leftShoulder, leftElbow);

            if (armAngle > 80 && armAngle < 100) {
                this.feedback = "Hold it there!";
                if (!this.isRepInProgress) {
                    this.isRepInProgress = true;
                }
            } else if (armAngle < 20) {
                this.feedback = "Lift your arms to the side.";
                if (this.isRepInProgress) {
                    this.repCount++;
                    this.isRepInProgress = false;
                    this.feedback = "Good rep!";
                }
            } else if (armAngle > 110) {
                this.feedback = "Too high! Lower slightly.";
            } else {
                this.feedback = "Keep lifting...";
            }
        }
    }

    calculateAngle(a, b, c) {
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs(radians * 180.0 / Math.PI);
        if (angle > 180.0) angle = 360 - angle;
        return angle;
    }
}
