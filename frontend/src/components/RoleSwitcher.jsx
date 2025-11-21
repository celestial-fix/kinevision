import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { User } from 'lucide-react';

const RoleSwitcher = () => {
    const user = JSON.parse(localStorage.getItem('kinevision_user') || '{}');
    const userRoles = Array.isArray(user.roles) ? user.roles : (user.role ? [user.role] : []);

    if (userRoles.length <= 1) {
        // Don't show switcher if user only has one role
        return null;
    }

    const roleLabels = {
        patient: 'Paciente',
        professional: 'Profesional',
        trainer: 'Entrenador',
        admin: 'Admin'
    };

    const rolePaths = {
        patient: '/patient',
        professional: '/professional',
        trainer: '/trainer',
        admin: '/admin'
    };

    return (
        <div className="relative group">
            <button className="p-2 rounded-full transition-colors flex items-center gap-2 text-sm" style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: `var(--border-width) solid var(--border-color)`
            }}>
                <User size={16} />
                <span className="hidden md:inline">Cambiar Rol</span>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50" style={{
                backgroundColor: 'var(--bg-secondary)',
                border: `var(--border-width) solid var(--border-color)`
            }}>
                <div className="p-2 space-y-1">
                    {userRoles.map(role => (
                        <a
                            key={role}
                            href={rolePaths[role]}
                            className="block px-4 py-2 rounded-md transition-colors text-sm"
                            style={{
                                color: 'var(--text-primary)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'var(--primary)';
                                e.target.style.opacity = '0.1';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.opacity = '1';
                            }}
                        >
                            {roleLabels[role] || role}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoleSwitcher;
