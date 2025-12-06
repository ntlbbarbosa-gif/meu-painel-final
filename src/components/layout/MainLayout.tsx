import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col pl-[70px] lg:pl-[260px] transition-all duration-300">
          <Topbar />
          <main className="flex-1 p-6 scrollbar-thin overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
