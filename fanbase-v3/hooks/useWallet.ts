// hooks/useWallet.ts
"use client";
import { useState, useEffect, useCallback } from 'react';
import { useUser, useAuthModal } from '@account-kit/react';
import { ethers } from 'ethers';
import { WalletState } from '@/types';

interface UseWalletReturn {
  state: WalletState;
  connect: () => void;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

export const useWallet = (): UseWalletReturn => {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: '0',
    network: null,
    isLoading: false,
    error: null,
  });

  // Update wallet state when user changes
  useEffect(() => {
    const updateWalletState = async () => {
      if (!user) {
        setState({
          isConnected: false,
          address: null,
          balance: '0',
          network: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const address = user.address;
        let balance = '0';
        let network = null;

        if (address && typeof window !== 'undefined' && window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          // Get balance
          const balanceWei = await provider.getBalance(address);
          balance = ethers.formatEther(balanceWei);
          
          // Get network
          const networkInfo = await provider.getNetwork();
          network = networkInfo.name;
        }

        setState({
          isConnected: true,
          address: address || null,
          balance,
          network,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error updating wallet state:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to fetch wallet information',
        }));
      }
    };

    updateWalletState();
  }, [user]);

  const connect = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      openAuthModal();
    } catch (error) {
      console.error('Error opening auth modal:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to open wallet connection',
      }));
    }
  }, [openAuthModal]);

  const disconnect = useCallback(() => {
    // Note: Account Kit handles logout internally
    // This is handled by the useLogout hook from Account Kit
    setState({
      isConnected: false,
      address: null,
      balance: '0',
      network: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!user?.address || !window.ethereum) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(user.address);
      const balance = ethers.formatEther(balanceWei);
      
      setState(prev => ({
        ...prev,
        balance,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error refreshing balance:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to refresh balance',
      }));
    }
  }, [user?.address]);

  return {
    state,
    connect,
    disconnect,
    refreshBalance,
  };
};

