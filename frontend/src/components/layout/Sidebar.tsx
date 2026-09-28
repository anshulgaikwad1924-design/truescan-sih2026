import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  ClipboardCheck, 
  Map as MapIcon,
  BarChart3,
  Settings,
  History
} from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar() {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload', path: '/upload', icon: Upload },
    { label: 'History', path: '/documents', icon: FileText },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-ts-ivory border-r border-ts-border flex-col h-full shadow-[2px_0_4px_rgba(0,0,0,0.02)] print:hidden">
        <div className="p-6 flex items-center gap-3 border-b border-ts-border">
          <div className="w-8 h-8 rounded-lg bg-ts-peach flex items-center justify-center shadow-inner">
            <span className="font-bold text-white text-lg leading-none">T</span>
          </div>
          <h1 className="font-bold text-xl tracking-tight text-ts-text-primary">TrueScan</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive 
                    ? 'bg-ts-sage text-ts-text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.05)]' 
                    : 'text-ts-text-muted hover:bg-ts-sage/50 hover:text-ts-text-primary'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-ts-border flex justify-around items-center h-16 z-[100] px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] print:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                isActive ? 'text-ts-peach' : 'text-ts-text-muted hover:text-ts-text-primary'
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
