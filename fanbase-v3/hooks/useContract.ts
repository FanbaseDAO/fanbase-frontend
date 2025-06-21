// hooks/useContract.ts
"use client";
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useUser } from '@account-kit/react';
import { contractAddress, contractABI, appConfig } from '@/config';
import { ContractInteractionState, TransactionResult, MintParams } from '@/types';
import { validateMintParams } from '@/lib/validation';

interface UseContractReturn {
  contract: ethers.Contract | null;
  provider: ethers.BrowserProvider | null;
  mintNFT: (params: MintParams) => Promise<TransactionResult>;
  state: ContractInteractionState;
  resetState: () => void;
}

export const useContract = (): UseContractReturn => {
  const user = useUser();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [state, setState] = useState<ContractInteractionState>({
    isLoading: false,
    error: null,
    success: null,
  });

  // Initialize provider and contract
  useEffect(() => {
    const initializeContract = async () => {
      if (!contractAddress || !contractABI) {
        setState(prev => ({ 
          ...prev, 
          error: 'Contract configuration missing' 
        }));
        return;
      }

      try {
        let web3Provider: ethers.BrowserProvider;

        if (typeof window !== 'undefined' && window.ethereum) {
          // Use injected provider (MetaMask, etc.)
          web3Provider = new ethers.BrowserProvider(window.ethereum);
        } else {
          setState(prev => ({ 
            ...prev, 
            error: 'No wallet provider found. Please install MetaMask or connect a wallet.' 
          }));
          return;
        }

        const contractInstance = new ethers.Contract(
          contractAddress, 
          contractABI, 
          web3Provider
        );

        setProvider(web3Provider);
        setContract(contractInstance);
      } catch (error) {
        console.error('Error initializing contract:', error);
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to initialize contract connection' 
        }));
      }
    };

    initializeContract();
  }, []);

  const estimateGas = useCallback(async (
    contract: any,
    method: string,
    params: any[]
  ): Promise<bigint> => {
    try {
      return await contract[method].estimateGas(...params);
    } catch (error) {
      console.warn('Gas estimation failed, using default:', error);
      // Return a reasonable default gas limit
      return BigInt(500000);
    }
  }, []);

  const mintNFT = useCallback(async (params: MintParams): Promise<TransactionResult> => {
    // Validate inputs
    const validation = validateMintParams(params);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    if (!contract || !provider || !user?.address) {
      throw new Error('Contract not initialized or user not connected');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, success: null }));

    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      // Estimate gas
      const estimatedGas = params.gasLimit || 
        await estimateGas(contractWithSigner, 'mint', [params.to]);

      // Add configured buffer to gas estimate
      const gasLimit = BigInt(Math.floor(Number(estimatedGas) * appConfig.gasLimitBuffer));

      // Execute transaction
      const tx = await (contractWithSigner as any).mint(params.to, { gasLimit });
      
      setState(prev => ({ 
        ...prev, 
        success: 'Transaction submitted! Waiting for confirmation...',
        txHash: tx.hash 
      }));

      // Wait for confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          success: 'NFT minted successfully!' 
        }));
      } else {
        throw new Error('Transaction failed');
      }

      return {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed?.toString(),
        status: receipt.status || 0
      };
    } catch (error: any) {
      console.error('Minting error:', error);
      
      let errorMessage = 'Minting failed. Please try again.';
      
      if (error.code === 'USER_REJECTED') {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for transaction.';
      } else if (error.message?.includes('gas')) {
        errorMessage = 'Transaction failed due to gas issues. Please try again.';
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      throw error;
    }
  }, [contract, provider, user?.address, estimateGas]);

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      success: null,
    });
  }, []);

  return {
    contract,
    provider,
    mintNFT,
    state,
    resetState
  };
};

