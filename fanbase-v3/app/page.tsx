"use client";

import { useUser } from "@account-kit/react";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import { getMusicList } from "@/lib/userService";
import { MusicNFT } from "@/types";
import { useContract } from "@/hooks/useContract";
import { useWallet } from "@/hooks/useWallet";
import MusicCard from "./components/MusicCard";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ErrorMessage from "./components/ui/ErrorMessage";
import ErrorBoundary from "./components/ErrorBoundary";

export default function Home() {
  const user = useUser();
  const { mintNFT, state: contractState, resetState } = useContract();
  const { state: walletState, connect } = useWallet();
  
  const [musicList, setMusicList] = useState<MusicNFT[]>([]);
  const [isLoadingMusic, setIsLoadingMusic] = useState(true);
  const [musicError, setMusicError] = useState<string | null>(null);
  const [activeMintId, setActiveMintId] = useState<string | null>(null);
  const [successfulMints, setSuccessfulMints] = useState<Set<string>>(new Set());

  // Fetch music list on component mount
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        setIsLoadingMusic(true);
        setMusicError(null);
        const musicData = await getMusicList();
        setMusicList(musicData.map(item => ({
          ...item,
          artist: item.artist || "Unknown Artist"
        })));
      } catch (error: any) {
        console.error("Error fetching music:", error);
        setMusicError("Failed to load music. Please try again later.");
      } finally {
        setIsLoadingMusic(false);
      }
    };

    fetchMusic();
  }, []);

  // Handle mint success
  useEffect(() => {
    if (contractState.success && activeMintId) {
      setSuccessfulMints(prev => new Set(Array.from(prev).concat(activeMintId)));
      // Auto-reset after 5 seconds
      setTimeout(() => {
        resetState();
        setActiveMintId(null);
      }, 5000);
    }
  }, [contractState.success, activeMintId, resetState]);

  const handleMint = async (musicId: string) => {
    if (!user?.address) {
      connect();
      return;
    }

    try {
      setActiveMintId(musicId);
      resetState();
      
      await mintNFT({ to: user.address });
    } catch (error: any) {
      console.error("Minting error:", error);
      // Error is handled by the useContract hook
    }
  };

  const retryFetchMusic = () => {
    setMusicError(null);
    setIsLoadingMusic(true);
    
    const fetchMusic = async () => {
      try {
        const musicData = await getMusicList();
        setMusicList(musicData.map(item => ({
          ...item,
          artist: item.artist || "Unknown Artist"
        })));
      } catch (error: any) {
        console.error("Error fetching music:", error);
        setMusicError("Failed to load music. Please try again later.");
      } finally {
        setIsLoadingMusic(false);
      }
    };

    fetchMusic();
  };

  if (isLoadingMusic) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-400">Loading music collection...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (musicError) {
    return (
      <Layout>
        <div className="p-8">
          <ErrorMessage 
            message={musicError} 
            onRetry={retryFetchMusic}
            className="max-w-md mx-auto"
          />
        </div>
      </Layout>
    );
  }

  return (
    <ErrorBoundary>
      <Layout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Discover Music NFTs</h1>
            <p className="text-gray-400">
              Mint exclusive music NFTs from your favorite artists
            </p>
          </div>

          {!user && (
            <div className="mb-6 bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-400 text-center">
                Connect your wallet to start minting NFTs
              </p>
            </div>
          )}

          {walletState.error && (
            <ErrorMessage 
              message={walletState.error} 
              className="mb-6"
            />
          )}

          {contractState.error && (
            <ErrorMessage 
              message={contractState.error} 
              onRetry={resetState}
              className="mb-6"
            />
          )}

          {musicList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No music NFTs available at the moment.</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for new releases!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {musicList.map((music) => (
                <MusicCard
                  key={music.id}
                  music={music}
                  onMint={handleMint}
                  isLoading={contractState.isLoading && activeMintId === music.id}
                  isSuccess={successfulMints.has(music.id) || (contractState.success !== null && activeMintId === music.id)}
                  error={contractState.error && activeMintId === music.id ? contractState.error : null}
                />
              ))}
            </div>
          )}
        </div>
      </Layout>
    </ErrorBoundary>
  );
}
