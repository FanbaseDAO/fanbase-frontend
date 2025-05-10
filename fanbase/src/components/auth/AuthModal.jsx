// src/components/auth/AuthModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState('main'); // main, email, emailSent
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { connectWithMetaMask, connectWithCoinbaseWallet, sendEmailLink } = useAuth();
  
  if (!isOpen) return null;
  
  const handleMetaMaskConnect = async () => {
    setLoading(true);
    setError('');
    try {
      await connectWithMetaMask();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCoinbaseConnect = async () => {
    setLoading(true);
    setError('');
    try {
      await connectWithCoinbaseWallet();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendEmailLink(email);
      setView('emailSent');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        {view === 'main' && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Connect to Fanbase</h2>
            
            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-200 p-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <button
                onClick={handleMetaMaskConnect}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
              >
                <img 
                  src="/api/placeholder/24/24" 
                  alt="MetaMask" 
                  className="mr-2" 
                />
                Connect with MetaMask
              </button>
              
              <button
                onClick={handleCoinbaseConnect}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center"
              >
                <img 
                  src="/api/placeholder/24/24" 
                  alt="Coinbase Wallet" 
                  className="mr-2" 
                />
                Connect with Coinbase Wallet
              </button>
              
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-700"></div>
                <div className="px-4 text-gray-400">or</div>
                <div className="flex-1 border-t border-gray-700"></div>
              </div>
              
              <button
                onClick={() => setView('email')}
                disabled={loading}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium"
              >
                Continue with Email
              </button>
            </div>
          </>
        )}
        
        {view === 'email' && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Sign in with Email</h2>
            
            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-200 p-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 rounded-lg font-medium mt-2"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
              
              <button
                type="button"
                onClick={() => setView('main')}
                className="w-full text-gray-300 py-2 mt-4"
              >
                Back
              </button>
            </form>
          </>
        )}
        
        {view === 'emailSent' && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Check Your Email</h2>
            
            <div className="text-center mb-6">
              <div className="bg-gray-800 mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              
              <p className="text-gray-300 mb-4">
                We've sent a sign-in link to:
              </p>
              <p className="font-medium text-lg mb-4">{email}</p>
              <p className="text-gray-400 text-sm">
                Click the link in the email to sign in to your account.
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;