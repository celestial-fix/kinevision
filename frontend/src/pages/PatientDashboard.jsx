import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, Trophy, Video, Flame, TrendingUp, BrainCircuit, Stethoscope, Home, User, ShoppingBag } from 'lucide-react';
import { EXERCISES } from '../data/exercises';
import Layout from '../components/Layout';

const PatientDashboard = () => {
    const sidebarItems = [
        { label: 'Inicio', path: '/patient', icon: <Home size={20} /> },
        { label: 'Mis Ejercicios', path: '/patient/exercises', icon: <Activity size={20} /> },
        { label: 'Marketplace', path: '/patient/marketplace', icon: <ShoppingBag size={20} /> },
        { label: 'Progreso', path: '/patient/progress', icon: <TrendingUp size={20} /> },
        { label: 'Perfil', path: '/patient/profile', icon: <User size={20} /> },
    ];

    // Filter to show only unlocked exercises
    const unlockedExercises = EXERCISES.filter(ex => !ex.locked);

    return (
        <Layout role="patient" title="Panel de Paciente" sidebarItems={sidebarItems}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Bienvenido, Pablo</h1>
                <p className="text-slate-400">Continuemos tu viaje de recuperación.</p>
            </div>

            {/* Gamification Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 relative overflow-hidden shadow-2xl shadow-orange-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-orange-100 font-semibold">
                                <Flame size={20} className="animate-pulse" />
                                <span>Racha Actual</span>
                            </div>
                            <h2 className="text-5xl font-bold text-white mb-2">4 Días</h2>
                            <p className="text-orange-100/80">¡Estás en racha! Sigue así para alcanzar el rango Plata.</p>
                        </div>
                        <div className="hidden sm:block">
                            <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                                <span className="text-3xl font-bold text-white">🔥</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-sky-400 font-semibold">
                            <Activity size={20} />
                            <span>Puntaje de Movilidad</span>
                        </div>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-5xl font-bold text-white">85</span>
                            <span className="text-slate-400 mb-1">/ 100</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-sky-500 h-full w-[85%] rounded-full"></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">+5% desde la semana pasada</p>
                    </div>
                </div>
            </div>

            {/* Main Actions Grid */}
            <h2 className="text-xl font-bold text-white mb-4">Tu Plan de Hoy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {unlockedExercises.map((exercise) => (
                    <div key={exercise.id} className="card group hover:border-sky-500/50 transition-all duration-300">
                        <div className="aspect-video bg-slate-900 rounded-lg mb-4 relative overflow-hidden">
                            <img
                                src={exercise.thumbnail}
                                alt={exercise.title}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium">
                                {exercise.duration}
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{exercise.title}</h3>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{exercise.description}</p>

                        <div className="flex gap-2">
                            <Link
                                to={`/briefing/${exercise.id}`}
                                className="btn btn-primary flex-1 text-center text-sm py-2"
                            >
                                Iniciar Sesión
                            </Link>
                            <button className="btn btn-secondary px-3" title="Ver Tutorial">
                                <Video size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <BrainCircuit size={24} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-white">Revisar con IA</h3>
                        <p className="text-sm text-slate-400">Obtén un análisis detallado de tu progreso</p>
                    </div>
                </button>

                <button className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <Stethoscope size={24} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-white">Solicitar Revisión Profesional</h3>
                        <p className="text-sm text-slate-400">Envía tus datos a tu kinesiólogo</p>
                    </div>
                </button>
            </div>
        </Layout>
    );
};

export default PatientDashboard;
