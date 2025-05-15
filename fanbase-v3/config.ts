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

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""; // Your contract address
export const contractABI = ABI; // Your contract's ABI

export const config = createConfig({
  // if you don't want to leak api keys, you can proxy to a backend and set the rpcUrl instead here
  // get this from the app config you create at https://dashboard.alchemy.com/accounts?utm_source=demo_alchemy_com&utm_medium=referral&utm_campaign=demo_to_dashboard
  transport: alchemy({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "" }),
  chain: baseSepolia, // You can keep this as baseSepolia for now, as it mainly affects the Account Kit's network context. For local testing with ethers, the provider will be different.
  ssr: true, // set to false if you're not using server-side rendering
enablePopupOauth: true,
}, uiConfig);

export const queryClient = new QueryClient();