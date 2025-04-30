// Configuration file for API keys, RPCs, and other constants.

export const API_KEY = "db301f63-f32f-4dc2-8145-854177455291";

export const RPC_URLS = {
  MAINNET: "https://mainnet.helius-rpc.com/?api-key=" + API_KEY,
  DEVNET: "https://staked.helius-rpc.com?api-key=" + API_KEY,
  WEBSOCKET: "wss://mainnet.helius-rpc.com/?api-key=" + API_KEY,
};

export const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1366201027745026048/WChs30CoYOXhtP17XvaxYXv0ZspW3P-4tdFAAUo4ON-Z64VPfOQEaKnRoF8LMrgxLhXb";

export const ENVIRONMENT = process.env.REACT_APP_ENV || "DEVNET";

export const CURRENT_RPC =
  ENVIRONMENT === "MAINNET" ? RPC_URLS.MAINNET : RPC_URLS.DEVNET;