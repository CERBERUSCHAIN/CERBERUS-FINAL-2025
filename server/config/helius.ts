import dotenv from "dotenv";

dotenv.config();

/**
 * Helius API configuration
 */
export const heliusConfig = {
  apiKey: process.env.HELIUS_API_KEY || "",
  baseUrl: "https://api.helius.xyz/v0",
  network: process.env.SOLANA_NETWORK || "devnet"
};

export default heliusConfig;
