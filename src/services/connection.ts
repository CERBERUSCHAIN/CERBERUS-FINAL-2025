import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Connection, PublicKey } from "@solana/web3.js";

// Mock wallet adapter for development (replace with actual adapter in production)
class MockWalletAdapter {
  publicKey: PublicKey;
  connecting: boolean = false;
  connected: boolean = true;

  constructor() {
    this.publicKey = new PublicKey("CerbeR1234567890123456789012345678901234");
  }

  async connect(): Promise<void> {
    this.connected = true;
    console.log("Mock wallet connected");
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log("Mock wallet disconnected");
  }

  async signTransaction(transaction: any): Promise<any> {
    console.log("Mock wallet signing transaction");
    return transaction;
  }

  async signAllTransactions(transactions: any[]): Promise<any[]> {
    console.log("Mock wallet signing all transactions");
    return transactions;
  }
}

class ConnectionService {
  private static instance: ConnectionService;
  private connection: Connection;
  private network: WalletAdapterNetwork;
  private walletAdapter: MockWalletAdapter;

  private constructor() {
    // Use Helius endpoint with API key when available
    const HELIUS_API_KEY = process.env.REACT_APP_HELIUS_API_KEY || "YOUR_HELIUS_API_KEY";
    const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
    
    this.network = WalletAdapterNetwork.Mainnet;
    this.connection = new Connection(HELIUS_RPC, "confirmed");
    this.walletAdapter = new MockWalletAdapter();
  }

  public static getInstance(): ConnectionService {
    if (!ConnectionService.instance) {
      ConnectionService.instance = new ConnectionService();
    }
    return ConnectionService.instance;
  }

  public getConnection(): Connection {
    return this.connection;
  }

  public getNetwork(): WalletAdapterNetwork {
    return this.network;
  }

  public getWalletAdapter(): MockWalletAdapter {
    return this.walletAdapter;
  }

  public getWalletPublicKey(): PublicKey | null {
    return this.walletAdapter.publicKey;
  }
  
  public async getBalance(): Promise<number> {
    try {
      if (this.walletAdapter.publicKey) {
        const balance = await this.connection.getBalance(this.walletAdapter.publicKey);
        return balance / 1_000_000_000; // Convert lamports to SOL
      }
      return 0;
    } catch (error) {
      console.error("Failed to get balance:", error);
      return 0;
    }
  }
}

export default ConnectionService;