import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Upload, AlertCircle, StopCircle, Eye, EyeOff } from 'lucide-react';
import AssessmentLayout from '../components/AssessmentLayout';
import { Pose } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

const EXERCISES = [
    {
        id: 'squat',
        title: 'Sentadilla Profunda',
        description: 'Párate con los pies al ancho de los hombros. Baja las caderas lo más profundo posible manteniendo el pecho erguido.',
        duration: '5 repeticiones'
    },
    {
        id: 'side_reach',
        title: 'Alcance Lateral',
        description: 'Párate derecho. Levanta un brazo sobre la cabeza e inclínate hacia el lado opuesto. Repite en ambos lados.',
        duration: '3 repeticiones por lado'
    }
];

const AssessmentSession = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);
    const [showWireframe, setShowWireframe] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [poseDetected, setPoseDetected] = useState(false);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const poseRef = useRef(null);
    const animationFrameRef = useRef(null);

    const currentExercise = EXERCISES[currentStep];
    const isLastExercise = currentStep === EXERCISES.length - 1;

    // Initialize camera and pose detection on mount
    useEffect(() => {
        console.log('Component mounted, initializing camera and pose');
        initializeCamera();
        initializePose();
        return () => {
            console.log('Component unmounting, cleaning up');
            stopCamera();
            cleanupPose();
        };
    }, []);

    // Start pose detection loop when camera is ready
    useEffect(() => {
        if (cameraReady && videoRef.current) {
            console.log('Camera ready, starting pose detection loop');
            detectPose();
        }
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [cameraReady]);

    const initializePose = () => {
        console.log('Initializing MediaPipe Pose...');
        const pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        pose.onResults(onPoseResults);
        poseRef.current = pose;
        console.log('MediaPipe Pose initialized');
    };

    const cleanupPose = () => {
        if (poseRef.current) {
            poseRef.current.close();
            poseRef.current = null;
        }
    };

    const onPoseResults = (results) => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.poseLandmarks) {
            console.log('Pose detected! Drawing', results.poseLandmarks.length, 'landmarks');
            setPoseDetected(true);

            // Draw connections
            drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
                color: '#00FF00',
                lineWidth: 4
            });

            // Draw landmarks
            drawLandmarks(ctx, results.poseLandmarks, {
                color: '#FF0000',
                lineWidth: 2,
                radius: 6
            });
        } else {
            setPoseDetected(false);
        }

        ctx.restore();
    };

    const detectPose = async () => {
        if (!poseRef.current || !videoRef.current || !cameraReady) return;

        const video = videoRef.current;

        if (video.readyState === 4) {
            try {
                await poseRef.current.send({ image: video });
            } catch (err) {
                console.error('Pose detection error:', err);
            }
        }

        animationFrameRef.current = requestAnimationFrame(detectPose);
    };

    const initializeCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: false
            });
            setMediaStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraReady(true);
            setError(null);
            console.log('Camera initialized successfully');
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("No se pudo acceder a la cámara. Por favor verifica los permisos o intenta subir un video.");
            setCameraReady(false);
        }
    };

    const stopCamera = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
        setCameraReady(false);
    };

    const startRecording = () => {
        if (!mediaStream) {
            setError("Cámara no disponible. Intenta recargar la página.");
            return;
        }

        try {
            const mediaRecorder = new MediaRecorder(mediaStream, {
                mimeType: 'video/webm;codecs=vp8'
            });
            mediaRecorderRef.current = mediaRecorder;

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                handleUpload(blob, 'recording.webm');
            };

            mediaRecorder.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            console.error("Error starting recording:", err);
            setError("No se pudo iniciar la grabación. Intenta nuevamente.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleUpload(file, file.name);
        }
    };

    const handleUpload = async (fileBlob, filename) => {
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', fileBlob, filename);

        try {
            const response = await fetch(`http://localhost:8000/api/assessment/${sessionId}/submit?exercise_id=${currentExercise.id}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            // Move to next step or finish
            if (isLastExercise) {
                navigate(`/assessment/results/${sessionId}`);
            } else {
                setCurrentStep(prev => prev + 1);
            }
        } catch (err) {
            setError('Falló la subida del video. Por favor intenta nuevamente.');
            console.error(err);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [mediaStream]);

    return (
        <AssessmentLayout>
            <div className="max-w-2xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Ejercicio {currentStep + 1} de {EXERCISES.length}</span>
                        <span>{Math.round(((currentStep) / EXERCISES.length) * 100)}% Completado</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${((currentStep) / EXERCISES.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{currentExercise.title}</h2>
                                <p className="text-slate-400 text-lg">{currentExercise.description}</p>
                            </div>
                            <div className="bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full text-sm font-medium">
                                {currentExercise.duration}
                            </div>
                        </div>

                        {/* Video Preview Area */}
                        <div className="aspect-video bg-black rounded-2xl mb-4 border border-white/10 overflow-hidden relative">
                            {cameraReady ? (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover transform scale-x-[-1]"
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute inset-0 w-full h-full pointer-events-none transform scale-x-[-1]"
                                        style={{ opacity: showWireframe ? 1 : 0 }}
                                    />

                                    {/* Recording Indicator */}
                                    {isRecording && (
                                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                                            GRABANDO
                                        </div>
                                    )}

                                    {/* Pose Detection Status */}
                                    {showWireframe && (
                                        <div className={`absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${poseDetected
                                            ? 'bg-green-500/80 text-white'
                                            : 'bg-yellow-500/80 text-white'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full ${poseDetected ? 'bg-white' : 'bg-white animate-pulse'}`} />
                                            {poseDetected ? 'Pose detectada' : 'Buscando pose...'}
                                        </div>
                                    )}

                                    {/* Wireframe Toggle */}
                                    <button
                                        onClick={() => setShowWireframe(!showWireframe)}
                                        className={`absolute top-4 right-4 p-3 rounded-full transition-all backdrop-blur-sm ${showWireframe
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-black/60 hover:bg-black/80 text-white'
                                            }`}
                                        title={showWireframe ? "Ocultar esqueleto" : "Mostrar esqueleto"}
                                    >
                                        {showWireframe ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center p-6">
                                        <Camera className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                        <p className="text-slate-400 mb-4">
                                            Iniciando cámara...
                                        </p>
                                        <button
                                            onClick={initializeCamera}
                                            className="text-blue-400 hover:text-blue-300 underline"
                                        >
                                            Reintentar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Recording Controls */}
                            {!isRecording ? (
                                <button
                                    onClick={startRecording}
                                    disabled={uploading || !cameraReady}
                                    className="bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                                >
                                    <div className="w-4 h-4 bg-white rounded-full" />
                                    Iniciar Grabación
                                </button>
                            ) : (
                                <button
                                    onClick={stopRecording}
                                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 animate-pulse"
                                >
                                    <StopCircle className="w-5 h-5" />
                                    Detener y Enviar
                                </button>
                            )}

                            {/* Upload Fallback */}
                            <input
                                type="file"
                                accept="video/*"
                                capture="environment"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading || isRecording}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analizando...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Subir Video
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AssessmentLayout>
    );
};

export default AssessmentSession;
