import React, { type ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      <SidebarNav />
      <main className="flex-1 ml-64 relative">
        <div className="absolute inset-0 bg-gradient-wash pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};
