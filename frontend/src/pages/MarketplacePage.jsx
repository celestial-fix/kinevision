import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Unlock, Filter, Search, TrendingUp, Award } from 'lucide-react';
import { EXERCISES } from '../data/exercises';
import Layout from '../components/Layout';

const MarketplacePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');

    const categories = ['All', ...new Set(EXERCISES.map(e => e.category))];
    const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    const filteredExercises = EXERCISES.filter(exercise => {
        const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty;
        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    const handleUnlock = (exerciseId) => {
        // TODO: Implement unlock logic with backend API
        alert(`Unlocking ${exerciseId}...`);
    };

    const sidebarItems = [
        { label: 'Inicio', path: '/patient', icon: <TrendingUp size={20} /> },
        { label: 'Marketplace', path: '/patient/marketplace', icon: <Award size={20} /> },
    ];

    return (
        <Layout role="patient" title="Exercise Marketplace" sidebarItems={sidebarItems}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Marketplace de Ejercicios</h1>
                <p className="text-slate-400">Descubre y desbloquea nuevos ejercicios para tu recuperación</p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar ejercicios..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors appearance-none cursor-pointer"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Difficulty Filter */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors appearance-none cursor-pointer"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                    >
                        {difficulties.map(diff => (
                            <option key={diff} value={diff}>{diff}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Exercise Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map((exercise) => (
                    <div key={exercise.id} className={`card group hover:border-sky-500/50 transition-all duration-300 ${exercise.locked ? 'opacity-75' : ''}`}>
                        <div className="aspect-video bg-slate-900 rounded-lg mb-4 relative overflow-hidden">
                            <img
                                src={exercise.thumbnail}
                                alt={exercise.title}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                            />
                            {exercise.locked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                    <Lock size={48} className="text-slate-400" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium">
                                {exercise.duration}
                            </div>
                            <div className="absolute top-2 left-2 flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${exercise.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                        exercise.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                            'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                    {exercise.difficulty}
                                </span>
                            </div>
                        </div>
                        <div className="mb-2">
                            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">{exercise.category}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{exercise.title}</h3>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{exercise.briefing.goal}</p>

                        <div className="flex gap-2">
                            {exercise.locked ? (
                                <button
                                    onClick={() => handleUnlock(exercise.id)}
                                    className="btn btn-primary flex-1 text-center text-sm py-2 flex items-center justify-center gap-2"
                                >
                                    <Unlock size={16} />
                                    Desbloquear {exercise.price > 0 ? `($${exercise.price})` : '(Gratis)'}
                                </button>
                            ) : (
                                <Link
                                    to={`/briefing/${exercise.id}`}
                                    className="btn btn-primary flex-1 text-center text-sm py-2"
                                >
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredExercises.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-slate-400 text-lg">No se encontraron ejercicios con los filtros seleccionados.</p>
                </div>
            )}
        </Layout>
    );
};

export default MarketplacePage;
