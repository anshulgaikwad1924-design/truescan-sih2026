import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Shield, LogOut, Phone, Building2, Briefcase, Calendar, User, Edit2, Check, X, Camera, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../lib/firebase';

export default function ProfilePage() {
  const { appUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // States
  const [displayName, setDisplayName] = useState(appUser?.displayName || 'Anshul Gaikwad');
  const [phoneNo, setPhoneNo] = useState('+91 98765 43210');
  const [department, setDepartment] = useState('Department of Land Resources (DoLR)');
  const [age, setAge] = useState('24');
  const [joinDate, setJoinDate] = useState('January 15, 2024');

  useEffect(() => {
    // Load from local storage for hackathon demo persistence
    const savedProfile = localStorage.getItem('userProfileData');
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      if (data.phoneNo) setPhoneNo(data.phoneNo);
      if (data.department) setDepartment(data.department);
      if (data.age) setAge(data.age);
      if (data.joinDate) setJoinDate(data.joinDate);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSave = async () => {
    // Save to Firebase Auth
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName });
    }
    
    // Save extra fields to localStorage
    localStorage.setItem('userProfileData', JSON.stringify({
      phoneNo, department, age, joinDate
    }));

    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `profiles/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      
      await updateProfile(auth.currentUser, { photoURL });
      
      // Force reload to reflect new image (hacky but works for demo)
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const role = appUser?.role || 'data_entry_operator';
  const email = appUser?.email || 'anshul@example.com';
  // Use Firebase photo URL if exists, else fallback to UI Avatars
  const currentAvatar = auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3D8471&color=fff&size=128&bold=true`;

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
              <div className="relative group">
                <img 
                  src={currentAvatar} 
                  alt="Profile" 
                  className="w-40 h-40 rounded-full border-8 border-white shadow-lg bg-white object-cover"
                />
                
                {/* Image Upload Overlay */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 m-2 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                >
                  {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Camera className="w-8 h-8" />}
                  <span className="text-xs font-semibold mt-1">{isUploading ? 'Uploading...' : 'Change'}</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" title="Online"></div>
              </div>
              
              <div className="pb-4">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="text-3xl font-bold text-gray-900 tracking-tight bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none focus:border-ts-mint"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{displayName}</h1>
                )}
                
                <div className="flex items-center text-gray-600 mt-2">
                  <Shield className="w-5 h-5 mr-2 text-ts-peach" />
                  <span className="capitalize font-medium text-lg">{role.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>
            <div className="pt-24 flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-ts-mint hover:bg-[#43a088] text-white">
                    <Check className="w-4 h-4 mr-2" /> Save
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 shadow-sm transition-all hidden sm:flex">
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
                {isEditing ? (
                  <input type="text" value={phoneNo} onChange={e => setPhoneNo(e.target.value)} className="w-full bg-white border border-gray-200 rounded px-2 py-1 outline-none focus:border-ts-mint" />
                ) : (
                  <div className="text-gray-900 font-medium text-base">{phoneNo}</div>
                )}
              </div>

              {/* Department */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 hover:border-ts-mint/50 hover:shadow-sm transition-all">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                  <Building2 className="w-5 h-5 mr-2 text-ts-mint" />
                  Department
                </div>
                {isEditing ? (
                  <input type="text" value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-white border border-gray-200 rounded px-2 py-1 outline-none focus:border-ts-mint" />
                ) : (
                  <div className="text-gray-900 font-medium text-base line-clamp-1" title={department}>{department}</div>
                )}
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
                {isEditing ? (
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-white border border-gray-200 rounded px-2 py-1 outline-none focus:border-ts-mint" />
                ) : (
                  <div className="text-gray-900 font-medium text-base">{age} Years</div>
                )}
              </div>

              {/* Joined */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 hover:border-ts-mint/50 hover:shadow-sm transition-all">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                  <Calendar className="w-5 h-5 mr-2 text-ts-mint" />
                  Date of Joining
                </div>
                {isEditing ? (
                  <input type="text" value={joinDate} onChange={e => setJoinDate(e.target.value)} className="w-full bg-white border border-gray-200 rounded px-2 py-1 outline-none focus:border-ts-mint" />
                ) : (
                  <div className="text-gray-900 font-medium text-base">{joinDate}</div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
