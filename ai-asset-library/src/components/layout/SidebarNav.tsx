import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import wizardIcon from '../../assets/icons/wizard.svg';
import libraryIcon from '../../assets/icons/library.svg';
import savedIcon from '../../assets/icons/saved.svg';
import helpIcon from '../../assets/icons/help.svg';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Wizard', path: '/', icon: wizardIcon },
  { label: 'Library', path: '/search', icon: libraryIcon },
  { label: 'Saved', path: '/saved', icon: savedIcon },
  { label: 'Help & Support', path: '/help', icon: helpIcon },
];

export const SidebarNav: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-DEFAULT flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-DEFAULT">
        <h1 className="text-xl font-bold text-primary">
          AIS Knowledge
        </h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1.5">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-full transition-all"
                  style={{
                    textDecoration: 'none',
                    background: isActive ? 'linear-gradient(to right, #6A4AD8, #7A4AB8)' : 'transparent'
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    style={{
                      width: '24px',
                      height: '24px',
                      filter: isActive ? 'brightness(0) invert(1)' : 'none'
                    }}
                  />
                  <span className="font-medium text-sm" style={{ color: isActive ? 'white' : '#1F1F1F' }}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-DEFAULT text-xs text-text-secondary">
        <p>© 2026 Bain & Company</p>
        <p className="mt-1">Technical Assets v1.0</p>
      </div>
    </aside>
  );
};
