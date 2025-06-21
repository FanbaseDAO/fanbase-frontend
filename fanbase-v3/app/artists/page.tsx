"use client";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Image from "next/image";
import { Search, Star, Music } from "lucide-react";
import { Artist } from "@/types";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import ErrorBoundary from "../components/ErrorBoundary";

// Enhanced artist data with more realistic diversity
const featuredArtists: Artist[] = [
  { 
    id: "1", 
    name: "Burna Boy", 
    stageName: "African Giant",
    image: "/artist_cards/burnaboy.jpg",
    bio: "Grammy-winning Nigerian artist bringing Afrofusion to the world.",
    verified: true,
    followerCount: 2400000,
    musicCount: 156
  },
  { 
    id: "2", 
    name: "Wizkid", 
    stageName: "Big Wiz",
    image: "/artist_cards/burnaboy.jpg", // Using same image as placeholder
    bio: "International Afrobeats superstar with global collaborations.",
    verified: true,
    followerCount: 3100000,
    musicCount: 203
  },
  { 
    id: "3", 
    name: "Tems", 
    stageName: "Rebel",
    image: "/artist_cards/burnaboy.jpg",
    bio: "Rising R&B and Afrobeats sensation with a unique sound.",
    verified: true,
    followerCount: 890000,
    musicCount: 67
  },
  { 
    id: "4", 
    name: "Davido", 
    stageName: "OBO",
    image: "/artist_cards/burnaboy.jpg",
    bio: "Afrobeats pioneer with infectious energy and global appeal.",
    verified: true,
    followerCount: 2800000,
    musicCount: 189
  },
  { 
    id: "5", 
    name: "Ayra Starr", 
    image: "/artist_cards/burnaboy.jpg",
    bio: "Young Afropop sensation taking the world by storm.",
    verified: false,
    followerCount: 450000,
    musicCount: 34
  },
  { 
    id: "6", 
    name: "Fireboy DML", 
    image: "/artist_cards/burnaboy.jpg",
    bio: "Melodic Afrobeats artist with a smooth, romantic style.",
    verified: true,
    followerCount: 720000,
    musicCount: 98
  },
];

function ArtistCard({ artist, onClick }: { 
  artist: Artist; 
  onClick?: (artistId: string) => void;
}) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
      onClick={() => onClick?.(artist.id)}
    >
      <div className="relative h-48 w-full">
        <Image
          src={artist.image}
          alt={artist.name}
          fill
          className="object-cover group-hover:brightness-110 transition-all duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {artist.verified && (
          <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
            <Star className="h-3 w-3 text-white fill-current" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-lg text-white mb-1">{artist.name}</h3>
          {artist.stageName && (
            <p className="text-gray-300 text-sm">aka {artist.stageName}</p>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {artist.bio && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {artist.bio}
          </p>
        )}
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {artist.followerCount && (
              <span>{formatNumber(artist.followerCount)} followers</span>
            )}
            {artist.musicCount && (
              <div className="flex items-center space-x-1">
                <Music className="h-3 w-3" />
                <span>{artist.musicCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>(featuredArtists);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>(featuredArtists);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter artists based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArtists(artists);
      return;
    }

    const filtered = artists.filter(artist => 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.stageName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredArtists(filtered);
  }, [searchQuery, artists]);

  const handleArtistClick = (artistId: string) => {
    // TODO: Navigate to artist detail page
    console.log(`Clicked artist: ${artistId}`);
    // router.push(`/artists/${artistId}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const retryLoad = () => {
    setError(null);
    setIsLoading(true);
    // Simulate retry logic
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-400">Loading artists...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <ErrorBoundary>
      <Layout>
        <div className="p-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Discover Artists</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore talented musicians and creators building the future of music NFTs
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search artists by name, stage name, or genre..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>

          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={retryLoad}
              className="mb-6 max-w-md mx-auto"
            />
          )}

          {/* Results Info */}
          {searchQuery && (
            <div className="mb-6 text-center">
              <p className="text-gray-400">
                {filteredArtists.length === 0 
                  ? "No artists found" 
                  : `Found ${filteredArtists.length} artist${filteredArtists.length === 1 ? '' : 's'}`
                } for &quot;{searchQuery}&quot;
              </p>
            </div>
          )}

          {/* Artist Grid */}
          {filteredArtists.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">
                {searchQuery ? "No artists found matching your search" : "No artists available"}
              </div>
              {searchQuery && (
                <p className="text-gray-500 text-sm">
                  Try adjusting your search terms or browse all artists
                </p>
              )}
            </div>
          ) : (
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredArtists.map((artist) => (
                  <ArtistCard 
                    key={artist.id} 
                    artist={artist} 
                    onClick={handleArtistClick}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </Layout>
    </ErrorBoundary>
  );
}
