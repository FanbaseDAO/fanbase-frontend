import { AlchemyAccountsUIConfig, createConfig } from "@account-kit/react";
import { sepolia, alchemy, baseSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
                [{"type":"email"}],
                [{"type":"passkey"},{"type":"social","authProviderId":"google","mode":"popup"}],
                [{"type":"external_wallets","walletConnect":{"projectId":"c992d67f9ef5238e5ff9d5ee5b310a20"}}]
              ],
    addPasskeyOnSignup: false,
  },
};

export const config = createConfig({
  // if you don't want to leak api keys, you can proxy to a backend and set the rpcUrl instead here
  // get this from the app config you create at https://dashboard.alchemy.com/accounts?utm_source=demo_alchemy_com&utm_medium=referral&utm_campaign=demo_to_dashboard
  transport: alchemy({ apiKey: "pzmKDSbZrFosY_CdEMGkSYqJ6WSwgmra" }),
  chain: baseSepolia,
  ssr: false, // set to false if you're not using server-side rendering
enablePopupOauth: true,
}, uiConfig);

export const queryClient = new QueryClient();