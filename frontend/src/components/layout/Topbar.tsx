import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const { appUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-ts-ivory border-b border-ts-border flex items-center justify-between px-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex-shrink-0">
      <div>
        {/* Breadcrumbs could go here in a later stage */}
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full text-ts-text-muted hover:bg-ts-sage hover:text-ts-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ts-mint relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ts-peach rounded-full border border-ts-ivory"></span>
        </button>
        <div className="h-8 w-px bg-ts-border"></div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 hover:bg-ts-sage/30 p-1 pr-2 rounded-full transition-colors focus:outline-none"
            title="View Profile"
          >
            <div className="w-8 h-8 rounded-full bg-ts-mint flex items-center justify-center border border-ts-border text-ts-text-primary">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-ts-text-primary hidden sm:block">
              {appUser?.displayName || 'Loading...'}
            </span>
          </button>
          <button 
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-full text-ts-text-muted hover:bg-ts-peach/20 hover:text-ts-peach transition-colors focus:outline-none"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
