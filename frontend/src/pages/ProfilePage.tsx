import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function ProfilePage() {
  const { appUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm border border-ts-border overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-ts-mint/30"></div>
        
        {/* Profile Info */}
        <div className="relative px-8 pb-8">
          <div className="absolute -top-12 w-24 h-24 rounded-full bg-ts-peach flex items-center justify-center border-4 border-white shadow-md">
            <User className="w-10 h-10 text-white" />
          </div>
          
          <div className="mt-16 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{appUser?.displayName || 'User Profile'}</h1>
              <div className="flex items-center text-gray-500 mt-1">
                <Shield className="w-4 h-4 mr-1.5" />
                <span className="capitalize">{appUser?.role || 'Guest'}</span>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
          
          <div className="mt-8 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </div>
                <div className="text-gray-900">{appUser?.email}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                  <Shield className="w-4 h-4 mr-2" />
                  Account Role
                </div>
                <div className="text-gray-900 capitalize">{appUser?.role} Level Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
