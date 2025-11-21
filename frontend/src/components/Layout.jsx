import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LogOut, User, Settings, Menu, X } from 'lucide-react';

const Layout = ({ children, role, title, sidebarItems }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('kinevision_user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-20 flex items-center px-6 border-b border-slate-800">
                        <Activity className="text-sky-500 mr-3" size={28} />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">
                            KineVision
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                        {sidebarItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                                <User size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white capitalize">{role}</p>
                                <p className="text-xs text-slate-500">Online</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="text-sm font-medium">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-20 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-slate-400 hover:text-white"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-white">{title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Header Actions (Notifications, etc.) could go here */}
                        <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="w-full animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
