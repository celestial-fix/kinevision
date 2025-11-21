import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Contrast } from 'lucide-react';

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useTheme();

    const themes = [
        { id: 'dark', icon: Moon, label: 'Dark' },
        { id: 'light', icon: Sun, label: 'Light' },
        { id: 'high-contrast', icon: Contrast, label: 'High Contrast' }
    ];

    return (
        <div className="flex items-center gap-2 p-2 rounded-lg" style={{
            backgroundColor: 'var(--bg-secondary)',
            border: `var(--border-width) solid var(--border-color)`
        }}>
            {themes.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    onClick={() => toggleTheme(id)}
                    aria-label={`Switch to ${label} theme`}
                    aria-pressed={theme === id}
                    className="p-2 rounded transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                        backgroundColor: theme === id ? 'var(--primary)' : 'transparent',
                        color: theme === id ? '#000' : 'var(--text-primary)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                    }}
                    title={label}
                >
                    <Icon size={20} />
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
