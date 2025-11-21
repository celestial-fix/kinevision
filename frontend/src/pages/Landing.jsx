import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, User, Stethoscope, BrainCircuit, Check, ArrowRight, Mail, Loader2 } from 'lucide-react';
import ThemeSwitcher from '../components/ThemeSwitcher';

const Landing = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        // API call to backend
        try {
            const response = await fetch('http://localhost:8000/api/auth/magic-link/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setSent(true);
                // For demo purposes, we'll simulate the user clicking the link after 3 seconds
                // In reality, they would go to email -> click link -> /auth/verify page
                setTimeout(async () => {
                    // Auto-login simulation for demo flow
                    // Fetch user role to redirect correctly
                    // This part is a bit hacky for the demo, normally the link handles this
                    if (email.includes('trainer')) navigate('/trainer');
                    else if (email.includes('pro')) navigate('/professional');
                    else navigate('/patient');
                }, 3000);
            } else {
                const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
                console.error("Login failed:", response.status, errorData);
                alert(`Error: ${errorData.detail || 'Failed to send magic link'}`);
            }
        } catch (error) {
            console.error("Login failed", error);
            alert('Network error: Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans bg-[var(--bg-primary)] text-[var(--text-primary)]">
            {/* Navbar */}
            <nav className="fixed w-full z-50 backdrop-blur-md bg-[var(--bg-primary)]/95 border-b border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity style={{ color: 'var(--primary)' }} size={28} />
                        <span className="text-xl font-bold text-gradient">
                            KineVision
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
                        <a href="#features" className="transition-colors hover:text-[var(--text-primary)]">Características</a>
                        <a href="#pricing" className="transition-colors hover:text-[var(--text-primary)]">Planes</a>
                        <a href="#trainers" className="transition-colors hover:text-[var(--text-primary)]">Entrenadores IA</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeSwitcher />
                        <button
                            onClick={() => document.getElementById('login-section').scrollIntoView({ behavior: 'smooth' })}
                            className="btn btn-primary text-sm px-6"
                        >
                            Ingresar
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full blur-[120px] -z-10" style={{ backgroundColor: 'var(--primary)', opacity: 0.2 }} />

                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--success)' }} />
                        <span className="text-sm text-[var(--text-secondary)]">IA de Nueva Generación Activa</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-[var(--text-primary)]">
                        Recupera tu movilidad con <br />
                        <span className="text-gradient">
                            Inteligencia Artificial
                        </span>
                    </h1>

                    <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-[var(--text-secondary)]">
                        KineVision utiliza visión por computadora avanzada para guiar tus ejercicios en tiempo real,
                        asegurando una recuperación segura y efectiva desde casa.
                    </p>

                    {/* Login / CTA Box */}
                    <div id="login-section" className="max-w-md mx-auto backdrop-blur-xl rounded-2xl p-8 shadow-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        {!sent ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="text-left mb-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Comienza ahora</label>
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} size={20} />
                                    <input
                                        type="email"
                                        placeholder="tu@email.com"
                                        className="w-full rounded-xl py-3 pl-10 pr-4 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            backgroundColor: 'var(--bg-primary)',
                                            border: `var(--border-width) solid var(--border-color)`,
                                            color: 'var(--text-primary)'
                                        }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading || sent}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || sent}
                                    className="w-full btn btn-primary py-3 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <>Continuar con Magic Link <ArrowRight size={18} /></>}
                                </button>
                                <p className="text-xs mt-4" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                                    Te enviaremos un enlace seguro para ingresar sin contraseña.
                                </p>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--success)', opacity: 0.1 }}>
                                    <Mail style={{ color: 'var(--success)' }} size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">¡Enlace enviado!</h3>
                                <p className="text-[var(--text-secondary)] text-sm">
                                    Revisa tu correo ({email}) y haz clic en el enlace para ingresar.
                                </p>
                                <p className="text-xs mt-4 animate-pulse" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                                    (Simulando redirección en 3s...)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Tecnología que te cuida</h2>
                        <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>Nuestra IA analiza 33 puntos clave de tu cuerpo en tiempo real para prevenir lesiones y maximizar resultados.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Activity />}
                            title="Análisis en Tiempo Real"
                            description="Feedback instantáneo sobre tu postura y ejecución. Como tener un kinesiólogo a tu lado 24/7."
                        />
                        <FeatureCard
                            icon={<Stethoscope />}
                            title="Supervisión Profesional"
                            description="Tu kinesiólogo puede ver tu progreso, ajustar rutinas y enviarte mensajes directamente."
                        />
                        <FeatureCard
                            icon={<BrainCircuit />}
                            title="Gamificación Inteligente"
                            description="Mantén la motivación con rachas, niveles y recompensas adaptadas a tu progreso."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing / Plans */}
            <section id="pricing" className="py-24" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: 'var(--text-primary)' }}>Planes Flexibles</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Patient Plan */}
                        <PricingCard
                            title="Pacientes"
                            price="Gratis"
                            period="Plan Básico"
                            features={[
                                "Acceso a ejercicios básicos",
                                "Feedback de IA en tiempo real",
                                "Seguimiento de progreso simple",
                                "Conexión con 1 profesional"
                            ]}
                            cta="Comenzar Gratis"
                            highlight={false}
                        />

                        {/* Professional Plan */}
                        <PricingCard
                            title="Profesionales"
                            price="$29"
                            period="/mes"
                            features={[
                                "Pacientes ilimitados",
                                "Panel de control avanzado",
                                "Creación de rutinas personalizadas",
                                "Análisis de video detallado",
                                "Soporte prioritario"
                            ]}
                            cta="Prueba Profesional"
                            highlight={true}
                        />
                    </div>
                </div>
            </section>

            {/* AI Trainers Section */}
            <section id="trainers" className="py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(to bottom, rgba(147, 51, 234, 0.1), var(--bg-secondary))' }} />
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                            <BrainCircuit size={14} className="text-purple-400" />
                            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Programa AI Trainer</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ayuda a entrenar el futuro de la rehabilitación</h2>
                        <p className="text-slate-400 mb-8 text-lg">
                            Únete a nuestra comunidad de expertos y entusiastas. Sube videos de ejercicios, clasifica movimientos y gana recompensas mientras mejoras la precisión de nuestra IA.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center"><Check size={14} className="text-purple-400" /></div>
                                Gana dinero por videos aprobados (Profesionales)
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center"><Check size={14} className="text-purple-400" /></div>
                                Sube de rango y desbloquea insignias exclusivas
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center"><Check size={14} className="text-purple-400" /></div>
                                Acceso anticipado a nuevas funciones
                            </li>
                        </ul>
                        <button className="btn bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all">
                            Unirse como Trainer
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        {/* Abstract visual for AI Training */}
                        <div className="relative z-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold">P</div>
                                    <div>
                                        <p className="font-bold">Pablo</p>
                                        <p className="text-xs text-slate-400">Expert Trainer</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-purple-400 font-bold">12,500 pts</p>
                                    <p className="text-xs text-slate-500">Top 1%</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-indigo-500" />
                                </div>
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Contribución Semanal</span>
                                    <span>75%</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-10 -right-10 w-full h-full bg-purple-500/10 rounded-2xl -z-10 blur-xl" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
                <p>&copy; 2024 KineVision AI. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-6 rounded-2xl border hover:border-sky-500/30 transition-colors group" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)' }}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </div>
);

const PricingCard = ({ title, price, period, features, cta, highlight }) => (
    <div className="p-8 rounded-3xl border flex flex-col" style={{
        backgroundColor: highlight ? 'var(--bg-card)' : 'var(--bg-secondary)',
        borderColor: highlight ? 'var(--primary)' : 'var(--border-color)',
        boxShadow: highlight ? '0 0 40px -10px rgba(14, 165, 233, 0.15)' : 'none'
    }}>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{price}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{period}</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Check size={16} style={{ color: highlight ? 'var(--primary)' : 'var(--text-secondary)' }} />
                    {feature}
                </li>
            ))}
        </ul>
        <button className={`w-full py-3 rounded-xl font-semibold transition-all ${highlight ? 'btn-primary' : ''}`} style={!highlight ? { backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' } : {}}>
            {cta}
        </button>
    </div>
);

export default Landing;
