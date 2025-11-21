import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children, allowedRoles = [] }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // In a real app, we'd check for a token in localStorage/cookie and validate it with the backend
        // For this demo, we'll simulate a check based on a "mock_session" in localStorage
        const checkAuth = async () => {
            const storedUser = localStorage.getItem('kinevision_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;
    }

    if (!user) {
        // Redirect to landing page (login) but save the location they were trying to go to
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // User is logged in but doesn't have permission
        // Redirect to their appropriate dashboard
        if (user.role === 'patient') return <Navigate to="/patient" replace />;
        if (user.role === 'professional') return <Navigate to="/professional" replace />;
        if (user.role === 'trainer') return <Navigate to="/trainer" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RequireAuth;
