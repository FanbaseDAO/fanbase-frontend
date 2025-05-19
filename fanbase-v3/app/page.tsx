"use client";

import { useUser } from "@account-kit/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import { contractAddress, contractABI } from "@/config";
import { getMusicList } from "@/lib/userService";
import { EthereumProvider } from "@walletconnect/ethereum-provider";

interface Music {
  name: string;
  coverUrl: string;
  id: string; // Firestore unique ID
}

export default function Home() {
  const user = useUser();
  const address = user?.address;
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [minting, setMinting] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintSuccess, setMintSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const musicData = await getMusicList();
        setMusicList(musicData);
      } catch (error: any) {
        console.error("Error fetching music:", error);
      }
    };

    fetchMusic();
  }, []);

  const isMobileDevice = (): boolean => {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const getProvider = async (): Promise<ethers.BrowserProvider> => {
    if (!isMobileDevice() && typeof window.ethereum !== "undefined") {
      // Desktop with injected provider (e.g., MetaMask)
      return new ethers.BrowserProvider(window.ethereum);
    } else {
      // Mobile or no injected provider; use WalletConnect
      const walletConnectProvider = await EthereumProvider.init({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
        metadata: {
          name: "Fanbase",
          description: "Fanbase",
          url: "http://ssrfanbasedao-67xy3muyqq-uc.a.run.app/", // Ensure this matches your domain
          icons: ["/fanbase_logo.png"],
        },
        showQrModal: true,
        optionalChains: [1, 11155111, 8453, 84532],
      });

      await walletConnectProvider.connect();
      return new ethers.BrowserProvider(walletConnectProvider);
    }
  };

  const handleMint = async (musicId: string) => {
    if (!address) {
      alert("Please connect your wallet to mint.");
      return;
    }

    setMinting(musicId);
    setMintError(null);
    setMintSuccess(null);

    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.mint(address, { gasLimit: 500000 });
      console.log("Minting transaction sent:", tx);

      const receipt = await tx.wait();
      console.log("Minting confirmed!", receipt);

      // Optional: Search for TokenMinted event in logs
      const tokenMintedEvent = receipt.logs.find(
        (log: ethers.Log) => log.address.toLowerCase() === contractAddress.toLowerCase()
      );

      // Whether or not we find the event, assume success if confirmed
      if (tokenMintedEvent) {
        console.log("TokenMinted event found:", tokenMintedEvent);
      }

      setMintSuccess(musicId);
    } catch (error: any) {
      console.error("Error minting:", error);
      setMintError(error.message || "An error occurred while minting.");
      alert(`Minting failed: ${error.message || "Unknown error"}`);
    } finally {
      setMinting(null);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Discover Music NFTs</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {musicList.map((music) => (
            <div key={music.id} className="bg-gray-800 rounded-lg shadow-md p-4">
              <img
                src={music.coverUrl}
                alt={music.name}
                className="rounded-md w-full h-auto mb-2"
              />
              <h2 className="text-xl font-semibold text-white mb-2">{music.name}</h2>
              <button
                onClick={() => handleMint(music.id)}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  minting === music.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={minting === music.id}
              >
                {minting === music.id
                  ? "Minting..."
                  : mintSuccess === music.id
                  ? "Successfully minted!"
                  : "Mint"}
              </button>
              {mintError && minting === music.id && (
                <p className="text-red-500 mt-2">{mintError}</p>
              )}
              {mintSuccess === music.id && (
                <p className="text-green-500 mt-2">Check your wallet for the NFT.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
