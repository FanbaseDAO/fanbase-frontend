// config.ts
import { AlchemyAccountsUIConfig, createConfig } from "@account-kit/react";
import { sepolia, alchemy, baseSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";
import ABI from "./ABI.json"; // Import your contract's ABI

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
                [{"type":"email"}],
                [{"type":"passkey"},{"type":"social","authProviderId":"google","mode":"popup"}],
                [{"type":"external_wallets","walletConnect":{"projectId":process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""}}]
              ],
    addPasskeyOnSignup: false,
  },
};

// Validate environment variables
const requiredEnvVars = {
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error('Missing required environment variables:', missingVars);
}

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
export const contractABI = ABI;

// Environment configuration
export const appConfig = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  apiUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532'),
  maxRetries: 3,
  retryDelay: 1000,
  gasLimitBuffer: 1.2, // 20% buffer for gas estimation
};

export const config = createConfig({
  // if you don't want to leak api keys, you can proxy to a backend and set the rpcUrl instead here
  // get this from the app config you create at https://dashboard.alchemy.com/accounts?utm_source=demo_alchemy_com&utm_medium=referral&utm_campaign=demo_to_dashboard
  transport: alchemy({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "" }),
  chain: baseSepolia, // You can keep this as baseSepolia for now, as it mainly affects the Account Kit's network context. For local testing with ethers, the provider will be different.
  ssr: true, // set to false if you're not using server-side rendering
enablePopupOauth: true,
}, uiConfig);

export const queryClient = new QueryClient();