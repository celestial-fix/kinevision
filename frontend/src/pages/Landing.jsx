import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, User, Stethoscope, BrainCircuit, Check, ArrowRight, Mail, Loader2 } from 'lucide-react';

const Landing = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call to backend
        try {
            const response = await fetch('http://localhost:8000/api/auth/magic-link/request?email=' + email, {
                method: 'POST'
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
            }
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-sky-500/30">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="text-sky-500" size={28} />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">
                            KineVision
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Características</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Planes</a>
                        <a href="#trainers" className="hover:text-white transition-colors">Entrenadores IA</a>
                    </div>
                    <button
                        onClick={() => document.getElementById('login-section').scrollIntoView({ behavior: 'smooth' })}
                        className="btn btn-primary text-sm px-6"
                    >
                        Ingresar
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-sky-500/20 rounded-full blur-[120px] -z-10" />

                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 mb-8 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-slate-300">IA de Nueva Generación Activa</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                        Recupera tu movilidad con <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
                            Inteligencia Artificial
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        KineVision utiliza visión por computadora avanzada para guiar tus ejercicios en tiempo real,
                        asegurando una recuperación segura y efectiva desde casa.
                    </p>

                    {/* Login / CTA Box */}
                    <div id="login-section" className="max-w-md mx-auto bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        {!sent ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="text-left mb-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Comienza ahora</label>
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="email"
                                        placeholder="tu@email.com"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn btn-primary py-3 text-base flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <>Continuar con Magic Link <ArrowRight size={18} /></>}
                                </button>
                                <p className="text-xs text-slate-500 mt-4">
                                    Te enviaremos un enlace seguro para ingresar sin contraseña.
                                </p>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="text-green-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">¡Enlace enviado!</h3>
                                <p className="text-slate-400 text-sm">
                                    Revisa tu correo ({email}) y haz clic en el enlace para ingresar.
                                </p>
                                <p className="text-xs text-slate-600 mt-4 animate-pulse">
                                    (Simulando redirección en 3s...)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-slate-950 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Tecnología que te cuida</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Nuestra IA analiza 33 puntos clave de tu cuerpo en tiempo real para prevenir lesiones y maximizar resultados.</p>
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
            <section id="pricing" className="py-24 bg-slate-900/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Planes Flexibles</h2>

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
            <section id="trainers" className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-slate-950 -z-10" />
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
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-sky-500/30 transition-colors group">
        <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
);

const PricingCard = ({ title, price, period, features, cta, highlight }) => (
    <div className={`p-8 rounded-3xl border ${highlight ? 'bg-slate-900/80 border-sky-500/50 shadow-[0_0_40px_-10px_rgba(14,165,233,0.15)]' : 'bg-slate-950 border-slate-800'} flex flex-col`}>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold text-white">{price}</span>
            <span className="text-slate-500">{period}</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <Check size={16} className={highlight ? "text-sky-400" : "text-slate-500"} />
                    {feature}
                </li>
            ))}
        </ul>
        <button className={`w-full py-3 rounded-xl font-semibold transition-all ${highlight ? 'btn-primary' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
            {cta}
        </button>
    </div>
);

export default Landing;
