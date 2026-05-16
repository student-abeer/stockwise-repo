import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Profile() {
  const { user, token, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    bio: '',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || '',
        companyName: user.companyName || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      updateUser(res.data);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/upload-avatar', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      updateUser(res.data);
      toast.success('Avatar updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload avatar');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-lg">
        <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Profile</h1>
        <p className="text-on-surface-variant">Manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Avatar Section */}
        <div className="md:col-span-1">
          <div className="bg-surface border border-surface-variant rounded-xl p-6 flex flex-col items-center text-center shadow-ambient">
            <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {user?.avatarUrl ? (
                <img src={`http://localhost:5000${user.avatarUrl}`} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-surface-variant group-hover:opacity-80 transition-opacity" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-4xl border-4 border-surface-variant group-hover:opacity-80 transition-opacity">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 p-2 rounded-full text-white">
                  <Camera size={24} />
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-lg text-on-surface">{user?.name || 'User'}</h3>
            <p className="text-sm text-on-surface-variant mb-4">{user?.email}</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-sm px-4 py-2 bg-surface-variant text-on-surface rounded-lg hover:bg-surface-variant/80 transition-colors font-medium w-full"
            >
              Change Photo
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2">
          <div className="bg-surface border border-surface-variant rounded-xl p-6 shadow-ambient">
            <h2 className="text-xl font-semibold mb-6 text-on-surface border-b border-surface-variant pb-4">Personal Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-variant border border-surface-variant rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Email Address (Read Only)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full bg-surface-variant/50 border border-surface-variant rounded-lg px-4 py-2 text-on-surface-variant cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full bg-surface-variant border border-surface-variant rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Company/Organization</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full bg-surface-variant border border-surface-variant rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                    placeholder="Acme Corp"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-surface-variant border border-surface-variant rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface resize-none"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
              <div className="flex justify-end pt-4 border-t border-surface-variant">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
