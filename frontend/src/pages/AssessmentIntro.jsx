import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Timer, Video, Calendar } from 'lucide-react';
import AssessmentLayout from '../components/AssessmentLayout';

import config from '../config';

const AssessmentIntro = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const startAssessment = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.API_URL}/api/assessment/start`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.session_id) {
                navigate(`/assessment/session/${data.session_id}`);
            }
        } catch (error) {
            console.error('Failed to start assessment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AssessmentLayout>
            <div className="max-w-2xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Evalúa tu Movilidad en Minutos
                    </h1>
                    <p className="text-xl text-slate-400">
                        Sin registro. Obtén feedback instantáneo sobre tu salud de movimiento usando solo tu cámara.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <Timer className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Rápido y Fácil</h3>
                        <p className="text-slate-400 text-sm">Toma menos de 5 minutos completar 3 ejercicios simples.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <ShieldCheck className="w-8 h-8 text-purple-400 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Privado</h3>
                        <p className="text-slate-400 text-sm">No necesitas cuenta. Tus datos se analizan de forma anónima.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Resultados Instantáneos</h3>
                        <p className="text-slate-400 text-sm">Recibe recomendaciones personalizadas al instante.</p>
                    </div>
                </div>

                <div className="pt-8 space-y-4">
                    <button
                        onClick={startAssessment}
                        disabled={loading}
                        className="w-full md:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? 'Iniciando...' : 'Iniciar Evaluación Gratuita'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 rounded-full ring-4 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all" />
                    </button>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-slate-400">
                        <button className="flex items-center gap-2 hover:text-white transition-colors">
                            <Video size={16} />
                            ¿Prefieres una sesión en vivo?
                        </button>
                        <span className="hidden md:inline">•</span>
                        <button className="flex items-center gap-2 hover:text-white transition-colors">
                            <Calendar size={16} />
                            Agendar con un profesional
                        </button>
                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                        Al iniciar, aceptas nuestros Términos de Servicio y Política de Privacidad.
                    </p>
                </div>
            </div>
        </AssessmentLayout>
    );
};

export default AssessmentIntro;
