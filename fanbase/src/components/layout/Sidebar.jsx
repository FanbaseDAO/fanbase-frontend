// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Bell, User, Plus } from 'lucide-react';
import fanbaseLogo from '../../assets/fanbase_logo.png';


const NavItem = ({ icon, label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center px-6 py-3 text-lg hover:bg-gray-800 ${isActive ? 'text-white font-medium' : 'text-gray-400'}`}
    >
      <span className="mr-4">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <div className="w-64 border-r border-gray-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <Link to="/">
          <img 
            src={fanbaseLogo} 
            alt="Fanbase Logo" 
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1">
        <NavItem icon={<Home size={20} />} label="Home" to="/" />
        <NavItem icon={<Compass size={20} />} label="Explore" to="/explore" />
        <NavItem icon={<Bell size={20} />} label="Notifications" to="/notifications" />
        <NavItem icon={<User size={20} />} label="Profile" to="/profile" />
      </nav>
      
      {/* Create Button */}
      <div className="p-4 mb-6">
        <Link to="/create">
          <button className="w-full bg-white text-black rounded-full py-2 px-4 font-medium flex items-center justify-center">
            <Plus size={20} className="mr-2" /> Create
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;