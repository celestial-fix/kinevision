import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const AssessmentLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500/30">
            {/* Simple Header */}
            <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">KineVision</span>
                    </Link>
                    <div className="text-sm text-slate-400">
                        Free Mobility Assessment
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-12">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="border-t border-white/10 py-8 mt-auto">
                <div className="max-w-5xl mx-auto px-6 text-center text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} KineVision. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default AssessmentLayout;
