// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { 
  signInWithEmailLink, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);
  
  // Check if MetaMask is available
  const isMetaMaskAvailable = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Connect to MetaMask
  const connectWithMetaMask = async () => {
    try {
      if (!isMetaMaskAvailable()) {
        throw new Error('MetaMask is not installed');
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setWalletAddress(address);
      
      // Check if user exists in Firestore, if not create a new profile
      const userRef = doc(db, 'users', address);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          address,
          createdAt: new Date(),
          displayName: `User_${address.substring(0, 6)}`,
          stats: {
            posts: 0,
            followers: 0,
            collected: 0,
            artistsBacked: 0
          }
        });
      }
      
      return address;
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      throw error;
    }
  };

  // Coinbase Wallet integration
  const connectWithCoinbaseWallet = async () => {
    try {
      // This is a simplified version - in a real app, you'd use the Coinbase Wallet SDK
      // For now, we'll simulate wallet connection
      alert("Coinbase Wallet integration would go here. Currently simulated.");
      const simulatedAddress = `0x${Math.random().toString(16).slice(2, 12)}`;
      setWalletAddress(simulatedAddress);
      
      // Similar user creation logic as above would be needed
      
      return simulatedAddress;
    } catch (error) {
      console.error("Error connecting to Coinbase Wallet:", error);
      throw error;
    }
  };

  // Email auth - send link
  const sendEmailLink = async (email) => {
    try {
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true
      };
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email);
      return true;
    } catch (error) {
      console.error("Error sending email link:", error);
      throw error;
    }
  };

  // Email auth - confirm sign in
  const confirmEmailSignIn = async () => {
    try {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = localStorage.getItem('emailForSignIn');
        
        if (!email) {
          // If email not in storage, prompt user
          email = window.prompt('Please provide your email for confirmation');
        }
        
        const result = await signInWithEmailLink(auth, email, window.location.href);
        localStorage.removeItem('emailForSignIn');
        
        // Create user profile if new user
        if (result.additionalUserInfo?.isNewUser) {
          const userRef = doc(db, 'users', result.user.uid);
          await setDoc(userRef, {
            email: result.user.email,
            createdAt: new Date(),
            displayName: result.user.email.split('@')[0],
            stats: {
              posts: 0,
              followers: 0,
              collected: 0,
              artistsBacked: 0
            }
          });
        }
        
        return result.user;
      }
    } catch (error) {
      console.error("Error confirming sign in:", error);
      throw error;
    }
    return null;
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setWalletAddress(null);
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Set up auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser({
              ...user,
              ...userDoc.data()
            });
          } else {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Check for email sign-in completion
    if (isSignInWithEmailLink(auth, window.location.href)) {
      confirmEmailSignIn().catch(console.error);
    }

    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    walletAddress,
    loading,
    connectWithMetaMask,
    connectWithCoinbaseWallet,
    sendEmailLink,
    confirmEmailSignIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};