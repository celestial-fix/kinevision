import React, { useState } from 'react';
import { useParams, Link, Navigate, useSearchParams } from 'react-router-dom';
import PoseTracker from '../components/PoseTracker';
import VoiceControl from '../components/VoiceControl';
import { ArrowLeft, Activity, Timer, Upload } from 'lucide-react';
import { EXERCISES } from '../data/exercises';

const SessionView = () => {
    const { id } = useParams();
    const exercise = EXERCISES.find(e => e.id === id);

    const [searchParams] = useSearchParams();
    const allowStorage = searchParams.get('storage') === 'true';
    const [mode, setMode] = useState('camera'); // 'camera' or 'upload'
    const [uploadedVideo, setUploadedVideo] = useState(null);

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
                        <PoseTracker onFeedback={handleFeedback} exerciseId={exercise.id} />
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
