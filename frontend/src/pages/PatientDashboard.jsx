import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, Trophy, Video, Flame, TrendingUp, BrainCircuit, Stethoscope, Home, User, ShoppingBag, MessageSquare, ClipboardList } from 'lucide-react';
import { EXERCISES } from '../data/exercises';
import Layout from '../components/Layout';
import MessagingComponent from '../components/MessagingComponent';
import config from '../config';

const PatientDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [program, setProgram] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock user data for now - in real app would come from auth context
    const userEmail = "pablo@example.com";
    const professionalEmail = "pro@example.com"; // Mock professional

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Program
                const progRes = await fetch(`${config.API_URL}/api/patient/program?email=${userEmail}`);
                if (progRes.ok) {
                    const progData = await progRes.json();
                    setProgram(progData);
                }

                // Fetch Profile (using magic link verify response structure or separate endpoint)
                // For now, we'll mock or just use local state if endpoint isn't ready for full profile fetch
                // setProfile(profileData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const sidebarItems = [
        { label: 'Inicio', id: 'dashboard', icon: <Home size={20} />, onClick: () => setActiveTab('dashboard') },
        { label: 'Mi Programa', id: 'program', icon: <ClipboardList size={20} />, onClick: () => setActiveTab('program') },
        { label: 'Mensajes', id: 'messages', icon: <MessageSquare size={20} />, onClick: () => setActiveTab('messages') },
        { label: 'Perfil', id: 'profile', icon: <User size={20} />, onClick: () => setActiveTab('profile') },
        { label: 'Marketplace', path: '/patient/marketplace', icon: <ShoppingBag size={20} /> }, // Keep as link
    ];

    // Filter to show only unlocked exercises
    const unlockedExercises = EXERCISES.filter(ex => !ex.locked);

    const renderContent = () => {
        switch (activeTab) {
            case 'program':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Mi Programa Asignado</h2>
                        {program ? (
                            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                                <h3 className="text-xl font-bold mb-2">{program.program_title}</h3>
                                <p className="text-slate-400 mb-6">{program.description}</p>

                                <div className="space-y-4">
                                    {program.exercises.map((exId, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl">
                                            <span className="font-medium capitalize">{exId.replace('_', ' ')}</span>
                                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors">
                                                Iniciar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed">
                                <ClipboardList className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                <p className="text-slate-400">No tienes un programa asignado actualmente.</p>
                            </div>
                        )}
                    </div>
                );
            case 'messages':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Mensajes</h2>
                        <MessagingComponent
                            currentUserEmail={userEmail}
                            otherUserEmail={professionalEmail}
                            otherUserName="Dr. Kine"
                        />
                    </div>
                );
            case 'profile':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Mi Perfil</h2>
                        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-3xl font-bold">
                                    P
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Pablo</h3>
                                    <p className="text-slate-400">{userEmail}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Rasgos de Movilidad</label>
                                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 min-h-[100px]">
                                        <p className="text-slate-500 italic">No hay rasgos registrados.</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Metas de Recuperación</label>
                                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 min-h-[100px]">
                                        <p className="text-slate-500 italic">No hay metas registradas.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <>
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
                    </>
                );
        }
    };

    return (
        <Layout role="patient" title="Panel de Paciente" sidebarItems={sidebarItems}>
            {renderContent()}
        </Layout>
    );
};

export default PatientDashboard;
