import React, { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import { AICoach } from '../logic/AICoach';

const PoseTracker = ({ onFeedback, exerciseId }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const coachRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);

    useEffect(() => {
        coachRef.current = new AICoach(exerciseId);

        const pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        pose.onResults(onResults);

        let camera = null;

        if (videoRef.current) {
            camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    await pose.send({ image: videoRef.current });
                },
                width: 1280,
                height: 720
            });
            camera.start();
            setCameraActive(true);
        }

        return () => {
            if (camera) camera.stop();
            pose.close();
        };
    }, [exerciseId]);

    const onResults = (results) => {
        if (!canvasRef.current) return;

        const canvasCtx = canvasRef.current.getContext('2d');
        const { width, height } = canvasRef.current;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, width, height);

        // Draw video frame - optional, we can just show the video element below
        // canvasCtx.drawImage(results.image, 0, 0, width, height); 

        // Draw landmarks
        if (results.poseLandmarks) {
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                { color: '#0ea5e9', lineWidth: 4 });
            drawLandmarks(canvasCtx, results.poseLandmarks,
                { color: '#f8fafc', lineWidth: 2 });

            // AI Coach Analysis
            if (coachRef.current) {
                const analysis = coachRef.current.analyze(results.poseLandmarks);
                if (onFeedback) onFeedback(analysis);
            }
        }
        canvasCtx.restore();
    };

    return (
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                    Initializing Camera...
                </div>
            )}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }} // Mirror effect
            />
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                width={1280}
                height={720}
                style={{ transform: 'scaleX(-1)' }} // Mirror effect
            />
        </div>
    );
};

export default PoseTracker;
