import React from 'react';
import { Users, Calendar, Activity, Settings, Home } from 'lucide-react';
import Layout from '../components/Layout';

const ProfessionalDashboard = () => {
    const sidebarItems = [
        { label: 'Inicio', path: '/professional', icon: <Home size={20} /> },
        { label: 'Pacientes', path: '/professional/patients', icon: <Users size={20} /> },
        { label: 'Agenda', path: '/professional/schedule', icon: <Calendar size={20} /> },
        { label: 'Configuración', path: '/professional/settings', icon: <Settings size={20} /> },
    ];

    return (
        <Layout role="professional" title="Panel Profesional" sidebarItems={sidebarItems}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Panel de Kinesiólogo</h1>
                <p className="text-slate-400">Gestiona tus pacientes y sesiones.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats cards placeholder */}
                <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Pacientes Activos</p>
                            <h3 className="text-2xl font-bold text-white">12</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Citas Hoy</p>
                            <h3 className="text-2xl font-bold text-white">4</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Sesiones Completadas</p>
                            <h3 className="text-2xl font-bold text-white">156</h3>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfessionalDashboard;
