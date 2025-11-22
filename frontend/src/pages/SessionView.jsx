import React, { useState } from 'react';
import { useParams, Link, Navigate, useSearchParams } from 'react-router-dom';
import PoseTracker from '../components/PoseTracker';
import VoiceControl from '../components/VoiceControl';
import { ArrowLeft, Activity, Timer, Upload, Mic, Square, Play, RotateCcw } from 'lucide-react';
import { EXERCISES } from '../data/exercises';
import config from '../config';

const SessionView = () => {
    const { id } = useParams();
    const exercise = EXERCISES.find(e => e.id === id);

    const [searchParams] = useSearchParams();
    const allowStorage = searchParams.get('storage') === 'true';
    const [mode, setMode] = useState('camera'); // 'camera' or 'upload'
    const [uploadedVideo, setUploadedVideo] = useState(null);
    const [skeletonMode, setSkeletonMode] = useState('overlay'); // 'overlay', 'skeleton-only', 'video-only'

    const [feedback, setFeedback] = useState("Prepárate...");
    const [reps, setReps] = useState(0);
    const [debugInfo, setDebugInfo] = useState({});

    if (!exercise) return <Navigate to="/patient" replace />;

    const handleFeedback = (data) => {
        setFeedback(data.feedback);
        setReps(data.repCount);
        setDebugInfo(data.debug || {});
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setUploadedVideo(url);
        }
    };

    const [sessionStarted, setSessionStarted] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [feelingText, setFeelingText] = useState('');
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const audioRecorderRef = useRef(null);
    const timerRef = useRef(null);

    const startAudioRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            audioRecorderRef.current = mediaRecorder;
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecordingAudio(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("No se pudo acceder al micrófono.");
        }
    };

    const stopAudioRecording = () => {
        if (audioRecorderRef.current && isRecordingAudio) {
            audioRecorderRef.current.stop();
            setIsRecordingAudio(false);
            clearInterval(timerRef.current);
        }
    };

    const resetAudio = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingTime(0);
    };

    const handleStartSession = async () => {
        try {
            const formData = new FormData();
            formData.append('patient_email', "pablo@example.com"); // Mock email
            formData.append('exercise_id', exercise.id);
            if (feelingText) formData.append('feeling_text', feelingText);
            if (audioBlob) formData.append('audio_file', audioBlob, 'feeling.webm');

            const response = await fetch(`${config.API_URL}/api/sessions/start`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setSessionId(data.session_id);
                setSessionStarted(true);
            } else {
                console.error("Failed to start session");
                alert("Error al iniciar sesión. Intenta nuevamente.");
            }
        } catch (error) {
            console.error("Error starting session:", error);
            alert("Error de conexión.");
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVoiceCommand = (command) => {
        console.log("Voice Command:", command);
        if (command.includes('fácil') || command.includes('easy')) {
            setFeedback("¡Entendido! Aumentaremos la dificultad.");
        } else if (command.includes('difícil') || command.includes('hard') || command.includes('duele')) {
            setFeedback("¡Cuidado! Tómate un descanso si sientes dolor.");
        } else if (command.includes('cómo voy') || command.includes('status')) {
            setFeedback(`Llevas ${reps} repeticiones. ¡Sigue así!`);
        }
    };

    if (!sessionStarted) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] p-6 flex items-center justify-center">
                <div className="max-w-2xl w-full space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Antes de comenzar</h1>
                        <p className="text-slate-400">Cuéntanos cómo te sientes hoy para adaptar la sesión.</p>
                    </div>

                    <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 space-y-6">
                        {/* Text Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">¿Cómo te sientes? (Opcional)</label>
                            <textarea
                                value={feelingText}
                                onChange={(e) => setFeelingText(e.target.value)}
                                placeholder="Ej: Me duele un poco la rodilla derecha, pero estoy animado..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all min-h-[120px] resize-none"
                            />
                        </div>

                        {/* Audio Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">O graba un audio</label>
                            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                                {audioUrl ? (
                                    <div className="flex items-center gap-4 w-full">
                                        <audio src={audioUrl} controls className="w-full h-8" />
                                        <button
                                            onClick={resetAudio}
                                            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                                            title="Grabar de nuevo"
                                        >
                                            <RotateCcw size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 w-full">
                                        {!isRecordingAudio ? (
                                            <button
                                                onClick={startAudioRecording}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"
                                            >
                                                <Mic size={18} />
                                                Grabar Audio
                                            </button>
                                        ) : (
                                            <button
                                                onClick={stopAudioRecording}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-full transition-colors animate-pulse"
                                            >
                                                <Square size={18} fill="currentColor" />
                                                Detener ({formatTime(recordingTime)})
                                            </button>
                                        )}
                                        <span className="text-xs text-slate-500">
                                            {isRecordingAudio ? "Grabando..." : "Haz clic para grabar tu estado de ánimo"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleStartSession}
                                className="w-full btn btn-primary py-4 text-lg font-semibold shadow-lg shadow-sky-500/20"
                            >
                                Comenzar Sesión <Play size={20} fill="currentColor" className="ml-2" />
                            </button>
                        </div>
                    </div>

                    <Link to="/patient" className="block text-center text-slate-500 hover:text-slate-400 transition-colors text-sm">
                        Cancelar y volver
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] p-4 flex flex-col">
            <VoiceControl onCommand={handleVoiceCommand} />
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link to="/patient" className="btn btn-secondary text-sm">
                    <ArrowLeft size={18} /> Salir
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                        <button
                            onClick={() => setMode('camera')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${mode === 'camera' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Cámara
                        </button>
                        <button
                            onClick={() => setMode('upload')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${mode === 'upload' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Subir Video
                        </button>
                    </div>
                    {mode === 'camera' && (
                        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                            <button
                                onClick={() => setSkeletonMode('overlay')}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${skeletonMode === 'overlay' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
                                title="Video + Skeleton"
                            >
                                Overlay
                            </button>
                            <button
                                onClick={() => setSkeletonMode('skeleton-only')}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${skeletonMode === 'skeleton-only' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
                                title="Solo Skeleton"
                            >
                                Skeleton
                            </button>
                            <button
                                onClick={() => setSkeletonMode('video-only')}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${skeletonMode === 'video-only' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
                                title="Solo Video"
                            >
                                Video
                            </button>
                        </div>
                    )}
                    <div className="bg-slate-800 px-4 py-2 rounded-full flex items-center gap-2">
                        <Timer size={18} className="text-sky-400" />
                        <span className="text-white font-mono">00:45</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Feed */}
                <div className="lg:col-span-2 flex flex-col">
                    {mode === 'camera' ? (
                        <PoseTracker onFeedback={handleFeedback} exerciseId={exercise.id} skeletonMode={skeletonMode} />
                    ) : (
                        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex items-center justify-center">
                            {uploadedVideo ? (
                                <video src={uploadedVideo} controls className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-center p-8">
                                    <Upload size={48} className="mx-auto text-slate-500 mb-4" />
                                    <p className="text-slate-300 mb-4">Sube un video para análisis</p>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileUpload}
                                        className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-sky-500 file:text-white
                      hover:file:bg-sky-600
                    "
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Live Feedback Overlay */}
                    <div className="mt-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 text-center">
                        <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">{feedback}</h2>
                        <p className="text-slate-400">{exercise.briefing.goal}</p>
                    </div>
                </div>

                {/* Stats Panel */}
                <div className="space-y-6">
                    <div className="card bg-gradient-to-br from-indigo-600 to-blue-600 border-none">
                        <h3 className="text-indigo-100 text-sm font-medium mb-1">Repeticiones</h3>
                        <p className="text-6xl font-bold text-white">{reps}</p>
                    </div>

                    <div className="card">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Activity size={20} className="text-green-400" />
                            Métricas en Vivo
                        </h3>
                        <div className="space-y-4">
                            <MetricRow label="Ejercicio" value={exercise.title} />
                            <MetricRow label="Guardar" value={allowStorage ? "Sí" : "No"} />
                            <MetricRow label="Modo" value={mode === 'camera' ? "En Vivo" : "Subida"} />
                            <MetricRow label="Puntaje" value="92%" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricRow = ({ label, value }) => (
    <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-mono font-bold truncate max-w-[150px]">{value}</span>
    </div>
);

export default SessionView;
