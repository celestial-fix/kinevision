import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Play, Info, Target, BrainCircuit } from 'lucide-react';
import { EXERCISES } from '../data/exercises';

const ExerciseBriefing = () => {
    const { id } = useParams();
    const exercise = EXERCISES.find(e => e.id === id);
    const [allowStorage, setAllowStorage] = React.useState(
        localStorage.getItem('kinevision_storage_pref') === 'true'
    );

    const handleStorageToggle = () => {
        const newValue = !allowStorage;
        setAllowStorage(newValue);
        localStorage.setItem('kinevision_storage_pref', newValue);
    };

    if (!exercise) return <Navigate to="/patient" replace />;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] p-6 flex items-center justify-center">
            <div className="max-w-4xl w-full">
                <Link to="/patient" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} /> Volver al Panel
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Info */}
                    <div className="space-y-6">
                        <div>
                            <span className="text-sky-400 font-semibold tracking-wider text-sm uppercase">{exercise.category}</span>
                            <h1 className="text-4xl font-bold text-white mt-2 mb-4">{exercise.title}</h1>
                            <div className="flex gap-3">
                                <Badge text={exercise.difficulty} color="purple" />
                                <Badge text={exercise.duration} color="slate" />
                            </div>
                        </div>

                        <div className="card bg-slate-800/50 border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Target className="text-sky-400" /> Objetivo
                            </h3>
                            <p className="text-slate-300 leading-relaxed">{exercise.briefing.goal}</p>
                        </div>

                        <div className="card bg-slate-800/50 border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <BrainCircuit className="text-purple-400" /> Enfoque IA
                            </h3>
                            <p className="text-slate-300 leading-relaxed">{exercise.briefing.ai_instructions}</p>
                            <ul className="mt-4 space-y-2">
                                {exercise.briefing.focus.map((point, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Action */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="aspect-video bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <Play size={64} className="text-white/50 group-hover:text-white transition-colors relative z-10" />
                            <p className="absolute bottom-4 text-slate-400 text-sm">Vista Previa</p>
                        </div>

                        {/* Privacy Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${allowStorage ? 'bg-sky-500' : 'bg-slate-600'}`} onClick={handleStorageToggle}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${allowStorage ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="text-slate-300 text-sm font-medium">Guardar video para revisión</span>
                            </div>
                            <Info size={16} className="text-slate-500 cursor-help" title="Permite a los profesionales revisar el video de tu sesión para darte mejor feedback." />
                        </div>

                        <Link
                            to={`/session/${exercise.id}?storage=${allowStorage}`}
                            className="btn btn-primary text-lg py-4 justify-center shadow-lg shadow-sky-500/20"
                        >
                            Comenzar Sesión <Play size={20} fill="currentColor" />
                        </Link>

                        <p className="text-center text-slate-500 text-sm">
                            Asegúrate de tener buena iluminación y que tu cuerpo completo sea visible.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Badge = ({ text, color }) => (
    <span className={`px-3 py-1 rounded-full bg-${color}-500/10 text-${color}-400 text-sm font-medium border border-${color}-500/20`}>
        {text}
    </span>
);

export default ExerciseBriefing;
