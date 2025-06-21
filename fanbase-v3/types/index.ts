// types/index.ts
// Import UserData interface
import type { UserData } from '@/lib/userService';

// Re-export UserData from userService
export type { UserData } from '@/lib/userService';

export interface MusicNFT {
  id: string;
  name: string;
  coverUrl: string;
  artist?: string;
  description?: string;
  price?: number;
  tokenId?: number;
  contractAddress?: string;
}

export interface Artist {
  id: string;
  name: string;
  stageName?: string;
  image: string;
  bio?: string;
  verified?: boolean;
  followerCount?: number;
  musicCount?: number;
}

export interface UserProfile extends UserData {
  displayName?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    spotify?: string;
  };
}

export interface ContractInteractionState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  txHash?: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
  network: string | null;
  isLoading: boolean;
  error: string | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component Props types
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export interface MusicCardProps {
  music: MusicNFT;
  onMint: (musicId: string) => void;
  isLoading: boolean;
  isSuccess: boolean;
  error?: string | null;
}

export interface ArtistCardProps {
  artist: Artist;
  onClick?: (artistId: string) => void;
}

// Smart Contract types
export interface MintParams {
  to: string;
  tokenURI?: string;
  gasLimit?: number;
}

export interface TransactionResult {
  hash: string;
  blockNumber?: number;
  gasUsed?: string;
  status?: number;
}

