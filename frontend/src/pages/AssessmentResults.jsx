import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Award, ArrowRight, Activity } from 'lucide-react';
import AssessmentLayout from '../components/AssessmentLayout';

const AssessmentResults = () => {
    const { sessionId } = useParams();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/assessment/${sessionId}/results`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Failed to fetch results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [sessionId]);

    if (loading) {
        return (
            <AssessmentLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-400">Generando tu reporte personalizado...</p>
                    </div>
                </div>
            </AssessmentLayout>
        );
    }

    if (!results) {
        return (
            <AssessmentLayout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">Resultados no encontrados</h2>
                    <Link to="/assessment" className="text-blue-400 hover:underline">Iniciar Nueva Evaluación</Link>
                </div>
            </AssessmentLayout>
        );
    }

    return (
        <AssessmentLayout>
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                        <Award className="w-8 h-8 text-green-400" />
                    </div>
                    <h1 className="text-4xl font-bold">¡Evaluación Completada!</h1>
                    <p className="text-xl text-slate-400">
                        Aquí está tu desglose de movilidad personalizado.
                    </p>
                </div>

                {/* Recommendation Card */}
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <h2 className="text-2xl font-bold mb-2">Programa Recomendado</h2>
                    <div className="text-3xl font-bold text-blue-400 mb-4">{results.recommendation}</div>
                    <p className="text-slate-300 mb-6 max-w-xl">
                        Basado en tus patrones de movimiento, recomendamos comenzar con este programa para mejorar tu rango de movimiento y estabilidad.
                    </p>

                    <Link
                        to={results.cta.link}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        {results.cta.text}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Exercise Breakdown */}
                <div className="grid gap-4">
                    <h3 className="text-xl font-semibold ml-1">Análisis de Ejercicios</h3>
                    {results.exercises.map((ex, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                            <div className="p-3 bg-slate-800 rounded-xl">
                                <Activity className="w-6 h-6 text-slate-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-lg capitalize">{ex.exercise_id.replace('_', ' ')}</h4>
                                <p className="text-sm text-slate-400">
                                    {ex.results.reps_completed} repeticiones completadas
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-emerald-400 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Completado
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AssessmentLayout>
    );
};

export default AssessmentResults;
