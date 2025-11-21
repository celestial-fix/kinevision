import React, { useState } from 'react';
import { Upload, Star, Award, PlayCircle, DollarSign, TrendingUp, Home, Video, List } from 'lucide-react';
import TrainerLeaderboard from '../components/TrainerLeaderboard';
import Layout from '../components/Layout';

const TrainerDashboard = () => {
    // Mock User Data
    const [user] = useState({
        id: 1,
        name: "Pablo",
        type: "professional", // volunteer, professional, staff
        rank: "Expert",
        points: 12500,
        earnings: 450.50
    });

    // Mock Leaderboard Data
    const leaderboardData = [
        { id: 2, name: "Sarah Connor", points: 15400, rank: "Master", type: "volunteer" },
        { id: 1, name: "Pablo", points: 12500, rank: "Expert", type: "professional" },
        { id: 3, name: "Kyle Reese", points: 9800, rank: "Expert", type: "staff" },
        { id: 4, name: "T-800", points: 8200, rank: "Novice", type: "volunteer" },
        { id: 5, name: "John Doe", points: 5000, rank: "Novice", type: "volunteer" },
    ];

    const sidebarItems = [
        { label: 'Inicio', path: '/trainer', icon: <Home size={20} /> },
        { label: 'Subir Videos', path: '/trainer/upload', icon: <Upload size={20} /> },
        { label: 'Calificar', path: '/trainer/rate', icon: <Star size={20} /> },
        { label: 'Mis Videos', path: '/trainer/videos', icon: <Video size={20} /> },
    ];

    return (
        <Layout role="trainer" title="AI Trainer Studio" sidebarItems={sidebarItems}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Panel de Entrenador</h1>
                    <p className="text-slate-400">Ayuda a entrenar la IA de KineVision.</p>
                </div>
                <div className="flex items-center gap-4">
                    {user.type === 'professional' && (
                        <div className="bg-green-500/10 px-4 py-2 rounded-full flex items-center gap-2 border border-green-500/20">
                            <DollarSign size={18} className="text-green-400" />
                            <span className="font-semibold text-green-100">${user.earnings.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="bg-purple-500/10 px-4 py-2 rounded-full flex items-center gap-2 border border-purple-500/20">
                        <Award size={18} className="text-purple-400" />
                        <span className="font-semibold text-purple-100">{user.rank}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Actions & Stats */}
                <div className="space-y-6">
                    {/* Upload Section */}
                    <div className="card border-dashed border-2 border-slate-700 bg-slate-800/30 flex flex-col items-center justify-center py-12 cursor-pointer hover:border-purple-500/50 hover:bg-slate-800/50 transition-all group">
                        <div className="p-4 rounded-full bg-slate-800 group-hover:scale-110 transition-transform duration-300 mb-4">
                            <Upload size={32} className="text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Subir Video de Entrenamiento</h3>
                        <p className="text-slate-400 text-center max-w-xs text-sm">
                            Sube videos de ejercicios de alta calidad para contribuir al dataset.
                            {user.type === 'professional' && <span className="block text-green-400 mt-2 font-semibold">Gana hasta $5.00 por video aprobado.</span>}
                        </p>
                    </div>

                    {/* Leaderboard */}
                    <TrainerLeaderboard trainers={leaderboardData} currentUser={user} />
                </div>

                {/* Right Column: Rating Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Pendiente de Revisión</h2>
                        <div className="flex gap-2">
                            <button className="btn btn-secondary text-xs">Más Recientes</button>
                            <button className="btn btn-secondary text-xs">Mayor Prioridad</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="card group hover:border-purple-500/30 transition-all">
                                <div className="aspect-video bg-slate-900 rounded-lg mb-4 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle size={48} className="text-white" />
                                    </div>
                                    <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">0:45</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-white">Squat Form #{1280 + i}</h3>
                                        <p className="text-sm text-slate-500">Subido hace 2h • Alta Prioridad</p>
                                    </div>
                                    <button className="btn btn-primary text-sm py-1 px-3">Calificar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TrainerDashboard;
