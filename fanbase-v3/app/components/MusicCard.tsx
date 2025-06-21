// components/MusicCard.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { MusicCardProps } from '@/types';
import LoadingSpinner from './ui/LoadingSpinner';

const MusicCard: React.FC<MusicCardProps> = ({
  music,
  onMint,
  isLoading,
  isSuccess,
  error
}) => {
  const handleMint = () => {
    if (!isLoading && !isSuccess) {
      onMint(music.id);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg hover:bg-gray-750">
      <div className="relative mb-4">
        <Image
          src={music.coverUrl}
          alt={music.name}
          width={300}
          height={300}
          className="rounded-md w-full h-auto object-cover"
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        {music.artist && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {music.artist}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white mb-2 truncate" title={music.name}>
          {music.name}
        </h2>
        {music.description && (
          <p className="text-gray-400 text-sm line-clamp-2">
            {music.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={handleMint}
          disabled={isLoading || isSuccess}
          className={`w-full py-2 px-4 rounded font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSuccess
              ? "bg-green-600 text-white cursor-default"
              : isLoading
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700 text-white transform hover:scale-105"
          }`}
          aria-label={`Mint ${music.name} NFT`}
        >
          <div className="flex items-center justify-center space-x-2">
            {isLoading && <LoadingSpinner size="sm" />}
            {isSuccess && <CheckCircle className="h-4 w-4" />}
            {error && <AlertCircle className="h-4 w-4" />}
            <span>
              {isLoading
                ? "Minting..."
                : isSuccess
                ? "Minted Successfully!"
                : "Mint NFT"}
            </span>
          </div>
        </button>

        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/20 rounded p-2">
            {error}
          </div>
        )}

        {isSuccess && (
          <div className="text-green-400 text-sm bg-green-900/20 border border-green-500/20 rounded p-2">
            NFT minted! Check your wallet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicCard;

