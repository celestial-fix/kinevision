import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');
            const email = searchParams.get('email');

            if (!token || !email) {
                setError("Enlace inválido.");
                return;
            }

            try {
                // Simulate API verification
                // In real app: const res = await fetch('/api/auth/magic-link/verify', ...)

                // Mock successful login
                const mockUser = {
                    email: email,
                    role: email.includes('trainer') ? 'trainer' : email.includes('pro') ? 'professional' : 'patient',
                    name: email.split('@')[0]
                };

                localStorage.setItem('kinevision_user', JSON.stringify(mockUser));

                // Redirect based on role
                if (mockUser.role === 'trainer') navigate('/trainer');
                else if (mockUser.role === 'professional') navigate('/professional');
                else navigate('/patient');

            } catch (err) {
                console.error(err);
                setError("Error al verificar el enlace.");
            }
        };

        verifyToken();
    }, [searchParams, navigate]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Error de Autenticación</h1>
                    <p className="text-slate-400">{error}</p>
                    <button onClick={() => navigate('/')} className="mt-4 btn btn-secondary">Volver al Inicio</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
            <div className="text-center">
                <Loader2 className="animate-spin mx-auto mb-4 text-sky-500" size={48} />
                <h1 className="text-2xl font-bold mb-2">Verificando...</h1>
                <p className="text-slate-400">Te estamos redirigiendo a tu panel.</p>
            </div>
        </div>
    );
};

export default AuthCallback;
