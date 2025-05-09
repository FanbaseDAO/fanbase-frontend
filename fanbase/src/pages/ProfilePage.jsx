// src/pages/ProfilePage.jsx
import React from 'react';
import { Clock } from 'lucide-react';

const ProfileStats = ({ label, value }) => {
  return (
    <div className="mr-10">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
};

const ProfilePage = () => {
  // This would typically come from Firebase or context
  const profile = {
    name: 'Retro',
    address: '0x5cc...7ae3',
    joinDate: 'May 2023',
    stats: {
      posts: 1,
      followers: 0,
      collected: 0,
      artistsBacked: 0
    }
  };

  return (
    <>
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-purple-900 to-gray-900"></div>
      
      {/* Profile Info */}
      <div className="px-8 pb-6">
        <div className="flex justify-between items-start mt-4">
          <div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-gray-400 mt-1">{profile.address}</p>
          </div>
          <button className="bg-transparent border border-gray-600 text-white px-4 py-1 rounded-md text-sm">
            Edit Profile
          </button>
        </div>
        
        <div className="flex items-center mt-4 text-gray-400 text-sm">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>Since {profile.joinDate}</span>
          </div>
          <span className="mx-2">•</span>
          <span>About</span>
        </div>
        
        {/* Stats */}
        <div className="flex mt-6">
          <ProfileStats label="Posts" value={profile.stats.posts} />
          <ProfileStats label="Followers" value={profile.stats.followers} />
          <ProfileStats label="Collected" value={profile.stats.collected} />
          <ProfileStats label="Artists Backed" value={profile.stats.artistsBacked} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;