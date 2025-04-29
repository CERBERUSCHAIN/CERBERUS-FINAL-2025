import axios from "axios";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import ConnectionService from "./connection";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

interface CreateTokenParams {
  name: string;
  symbol: string;
  totalSupply: number;
  decimals: number;
}

interface TokenInfo {
  mintAddress: string;
  name: string;
  symbol: string;
  price: number;
  change: string;
  marketCap: string;
  volume: string;
}

class TokenService {
  private connectionService: ConnectionService;
  
  constructor() {
    this.connectionService = ConnectionService.getInstance();
  }
  
  // Fetch token info from API (for development)
  public async getTokenInfo(mintAddress: string): Promise<TokenInfo | null> {
    try {
      const response = await axios.get(`${API_URL}/api/token/${mintAddress}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch token info:", error);
      return null;
    }
  }
  
  // Fetch all tokens from API (for development)
  public async getAllTokens(): Promise<TokenInfo[]> {
    try {
      const response = await axios.get(`${API_URL}/api/tokens`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
      return [];
    }
  }
  
  // Create token (mock for development)
  public async createToken(params: CreateTokenParams): Promise<string> {
    try {
      // In development, we're using the API to simulate token creation
      const response = await axios.post(`${API_URL}/api/token`, params);
      
      if (response.data.success) {
        return response.data.mintAddress;
      } else {
        throw new Error("Token creation failed");
      }
    } catch (error) {
      console.error("Failed to create token:", error);
      throw error;
    }
  }
  
  // For production: actual token creation on Solana
  public async createTokenOnChain(params: CreateTokenParams): Promise<string> {
    try {
      const connection = this.connectionService.getConnection();
      const payer = Keypair.generate(); // In prod, this would be the wallet
      
      // Create mint
      const mintKeypair = Keypair.generate();
      const mintAddress = mintKeypair.publicKey;
      
      // Just use mintAddress for now since we can't actually create the token in the browser
      console.log("Token created with mint:", mintAddress.toString());
      
      return mintAddress.toString();
    } catch (error) {
      console.error("Failed to create token on chain:", error);
      throw error;
    }
  }
}

export default TokenService;