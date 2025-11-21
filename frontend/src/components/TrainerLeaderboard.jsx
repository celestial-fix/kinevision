import React from 'react';
import { Trophy, Medal, Star, User } from 'lucide-react';

const TrainerLeaderboard = ({ trainers, currentUser }) => {
    // Sort trainers by points
    const sortedTrainers = [...trainers].sort((a, b) => b.points - a.points);

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Trophy className="text-yellow-500" size={24} />;
            case 1: return <Medal className="text-slate-300" size={24} />;
            case 2: return <Medal className="text-amber-700" size={24} />;
            default: return <span className="text-slate-500 font-bold w-6 text-center">{index + 1}</span>;
        }
    };

    return (
        <div className="card bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Trophy className="text-yellow-500" /> Tabla de Clasificación
                </h3>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-700 text-xs text-slate-300">Semanal</span>
                    <span className="px-3 py-1 rounded-full bg-sky-600 text-xs text-white">Histórico</span>
                </div>
            </div>

            <div className="space-y-4">
                {sortedTrainers.map((trainer, index) => (
                    <div
                        key={trainer.id}
                        className={`flex items-center justify-between p-3 rounded-xl transition-colors ${currentUser && currentUser.id === trainer.id
                                ? 'bg-sky-500/10 border border-sky-500/50'
                                : 'bg-slate-700/30 hover:bg-slate-700/50'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 flex justify-center">
                                {getRankIcon(index)}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {trainer.name.charAt(0)}
                                </div>
                                <div>
                                    <p className={`font-semibold ${currentUser && currentUser.id === trainer.id ? 'text-sky-400' : 'text-white'}`}>
                                        {trainer.name}
                                        {currentUser && currentUser.id === trainer.id && " (Tú)"}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span className="capitalize">{trainer.type}</span>
                                        <span>•</span>
                                        <span className="text-yellow-500 flex items-center gap-1">
                                            <Star size={10} fill="currentColor" /> {trainer.rank}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-white font-bold text-lg">{trainer.points.toLocaleString()}</p>
                            <p className="text-xs text-slate-500">pts</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainerLeaderboard;
