import { useAuth } from '../context/AuthContext';
import { Mail, Shield, LogOut, Phone, Building2, Briefcase, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function ProfilePage() {
  const { appUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = appUser?.displayName || 'Anshul Gaikwad';
  const role = appUser?.role || 'data_entry_operator';
  const email = appUser?.email || 'anshul@example.com';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3D8471&color=fff&size=128&bold=true`;
  
  // Placeholder data for the hackathon presentation
  const phoneNo = '+91 98765 43210';
  const department = 'Department of Land Resources (DoLR)';
  const age = '24';
  const joinDate = 'January 15, 2024';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-ts-border overflow-hidden">
        {/* Header Cover */}
        <div className="h-48 bg-gradient-to-r from-ts-mint via-ts-sage to-ts-mint/80 relative">
          <div className="absolute inset-0 bg-white/10 pattern-dots"></div>
        </div>
        
        {/* Profile Info */}
        <div className="px-8 pb-10">
          <div className="relative flex justify-between items-start -mt-20">
            <div className="flex items-end space-x-6">
              <div className="relative">
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-40 h-40 rounded-full border-8 border-white shadow-lg bg-white object-cover"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" title="Online"></div>
              </div>
              <div className="pb-4">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{displayName}</h1>
                <div className="flex items-center text-gray-600 mt-2">
                  <Shield className="w-5 h-5 mr-2 text-ts-peach" />
                  <span className="capitalize font-medium text-lg">{role.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>
            <div className="pt-24">
              <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 shadow-sm transition-all">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-100 pt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
              <User className="w-6 h-6 mr-2 text-ts-peach" />
              Personal & Employment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Email */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 hover:border-ts-mint/50 hover:shadow-sm transition-all">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                  <Mail className="w-5 h-5 mr-2 text-ts-mint" />
                  Email Address
                </div>
                <div className="text-gray-900 font-medium text-base truncate" title={email}>{email}</div>
              </div>

              {/* Phone */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 hover:border-ts-mint/50 hover:shadow-sm transition-all">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                  <Phone className="w-5 h-5 mr-2 text-ts-mint" />
                  Phone Number
                </div>
                <div className="text-gray-900 font-medium text-base">{phoneNo}</div>
              </div>

              {/* Department */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 hover:border-ts-mint/50 hover:shadow-sm transition-all">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                  <Building2 className="w-5 h-5 mr-2 text-ts-mint" />
                  Department
                </div>
                <div className="text-gray-900 font-medium text-base line-clamp-1" title={department}>{department}</div>
              </div>

              {/* Designation */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 hover:border-ts-mint/50 hover:shadow-sm transition-all">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                  <Briefcase className="w-5 h-5 mr-2 text-ts-mint" />
                  Designation / Post
                </div>
                <div className="text-gray-900 font-medium text-base capitalize">{role.replace(/_/g, ' ')}</div>
              </div>

              {/* Age */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 hover:border-ts-mint/50 hover:shadow-sm transition-all">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                  <User className="w-5 h-5 mr-2 text-ts-mint" />
                  Age
                </div>
                <div className="text-gray-900 font-medium text-base">{age} Years</div>
              </div>

              {/* Joined */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 hover:border-ts-mint/50 hover:shadow-sm transition-all">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                  <Calendar className="w-5 h-5 mr-2 text-ts-mint" />
                  Date of Joining
                </div>
                <div className="text-gray-900 font-medium text-base">{joinDate}</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
