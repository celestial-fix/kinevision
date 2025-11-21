import React, { useState } from 'react';
import { Users, Calendar, Activity, Settings, Home, Plus, MessageSquare, ClipboardList, Search } from 'lucide-react';
import Layout from '../components/Layout';
import MessagingComponent from '../components/MessagingComponent';
import { EXERCISES } from '../data/exercises';

const ProfessionalDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Mock data
    const professionalEmail = "pro@example.com";
    const patients = [
        { id: 1, name: "Pablo", email: "pablo@example.com", status: "Active", lastSession: "2024-03-20" },
        { id: 2, name: "Maria Garcia", email: "maria@example.com", status: "Recovery", lastSession: "2024-03-19" },
    ];

    const sidebarItems = [
        { label: 'Inicio', id: 'dashboard', icon: <Home size={20} />, onClick: () => setActiveTab('dashboard') },
        { label: 'Pacientes', id: 'patients', icon: <Users size={20} />, onClick: () => setActiveTab('patients') },
        { label: 'Crear Programa', id: 'builder', icon: <ClipboardList size={20} />, onClick: () => setActiveTab('builder') },
        { label: 'Mensajes', id: 'messages', icon: <MessageSquare size={20} />, onClick: () => setActiveTab('messages') },
        { label: 'Agenda', path: '/professional/schedule', icon: <Calendar size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'patients':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Mis Pacientes</h2>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                                <Plus size={20} /> Nuevo Paciente
                            </button>
                        </div>
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/50 text-slate-400">
                                    <tr>
                                        <th className="p-4">Nombre</th>
                                        <th className="p-4">Estado</th>
                                        <th className="p-4">Última Sesión</th>
                                        <th className="p-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {patients.map(patient => (
                                        <tr key={patient.id} className="hover:bg-slate-700/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium text-white">{patient.name}</div>
                                                <div className="text-sm text-slate-400">{patient.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                                                    {patient.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-300">{patient.lastSession}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPatient(patient);
                                                        setActiveTab('messages');
                                                    }}
                                                    className="text-blue-400 hover:text-blue-300 mr-3"
                                                >
                                                    Mensaje
                                                </button>
                                                <button className="text-slate-400 hover:text-white">Ver Perfil</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'builder':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Constructor de Programas</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                    <h3 className="font-bold mb-4">Detalles del Programa</h3>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Título del Programa"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                        />
                                        <textarea
                                            placeholder="Descripción..."
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 h-32"
                                        />
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                    <h3 className="font-bold mb-4">Ejercicios Seleccionados</h3>
                                    <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
                                        Arrastra ejercicios aquí o selecciona de la lista
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-fit">
                                <h3 className="font-bold mb-4">Biblioteca de Ejercicios</h3>
                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                    {EXERCISES.map(ex => (
                                        <div key={ex.id} className="p-3 bg-slate-900 rounded-xl border border-slate-700 hover:border-blue-500 cursor-pointer transition-colors">
                                            <div className="font-medium text-sm">{ex.title}</div>
                                            <div className="text-xs text-slate-400">{ex.category} • {ex.difficulty}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'messages':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Mensajes</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                                <div className="p-4 border-b border-slate-700">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar..."
                                            className="w-full bg-slate-900 border-none rounded-lg pl-9 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-700">
                                    {patients.map(patient => (
                                        <button
                                            key={patient.id}
                                            onClick={() => setSelectedPatient(patient)}
                                            className={`w-full p-4 text-left hover:bg-slate-700/50 transition-colors ${selectedPatient?.id === patient.id ? 'bg-blue-500/10 border-l-4 border-blue-500' : ''}`}
                                        >
                                            <div className="font-medium text-white">{patient.name}</div>
                                            <div className="text-xs text-slate-400 truncate">Último mensaje...</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-3">
                                {selectedPatient ? (
                                    <MessagingComponent
                                        currentUserEmail={professionalEmail}
                                        otherUserEmail={selectedPatient.email}
                                        otherUserName={selectedPatient.name}
                                    />
                                ) : (
                                    <div className="h-[500px] bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center text-slate-400">
                                        Selecciona un paciente para ver el chat
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white">Panel de Kinesiólogo</h1>
                            <p className="text-slate-400">Gestiona tus pacientes y sesiones.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    </>
                );
        }
    };

    return (
        <Layout role="professional" title="Panel Profesional" sidebarItems={sidebarItems}>
            {renderContent()}
        </Layout>
    );
};

export default ProfessionalDashboard;
