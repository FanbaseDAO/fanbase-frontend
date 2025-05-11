import { AlchemyAccountsUIConfig, createConfig } from "@account-kit/react";
import { sepolia, alchemy, baseSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [[{"type":"email"}],[{"type":"passkey"},{"type":"social","authProviderId":"google","mode":"popup"},{"type":"social","authProviderId":"facebook","mode":"popup"},{"type":"social","authProviderId":"twitch","mode":"popup"},{"type":"social","authProviderId":"auth0","mode":"popup","auth0Connection":"discord","displayName":"Discord","logoUrl":"/images/discord.svg","scope":"openid profile"},{"type":"social","authProviderId":"auth0","mode":"popup","auth0Connection":"twitter","displayName":"Twitter","logoUrl":"/images/twitter.svg","logoUrlDark":"/images/twitter-dark.svg","scope":"openid profile"}],[{"type":"external_wallets","walletConnect":{"projectId":"dvs0wrtim0q6kwx8"}}]],
    addPasskeyOnSignup: false,
  },
};

export const config = createConfig({
  // if you don't want to leak api keys, you can proxy to a backend and set the rpcUrl instead here
  // get this from the app config you create at https://dashboard.alchemy.com/accounts?utm_source=demo_alchemy_com&utm_medium=referral&utm_campaign=demo_to_dashboard
  transport: alchemy({ apiKey: "pzmKDSbZrFosY_CdEMGkSYqJ6WSwgmra" }),
  chain: baseSepolia,
  ssr: true, // set to false if you're not using server-side rendering
enablePopupOauth: true,
}, uiConfig);

export const queryClient = new QueryClient();