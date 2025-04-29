import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenService from "../services/token";

const TokenCreation: React.FC = () => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(9);
  const [tokenSupply, setTokenSupply] = useState(1000000000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // In a real implementation, this would connect to a wallet and create a token
      const tokenService = new TokenService();
      const result = await tokenService.createToken({
        name: tokenName,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        totalSupply: tokenSupply
      });
      
      setMintAddress(result);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to create token");
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-zinc-950 rounded-lg border border-purple-900/30">
      <h1 className="text-2xl font-bold text-white mb-6">Create New Token</h1>
      
      {mintAddress ? (
        <div className="p-6 bg-zinc-900/50 rounded-lg border border-green-900/30">
          <h2 className="text-xl font-bold text-green-400 mb-4">Token Created Successfully!</h2>
          <div className="mb-4">
            <div className="text-zinc-400 mb-1">Token Mint Address:</div>
            <div className="p-2 bg-zinc-900 rounded border border-zinc-800 break-all font-mono text-white">
              {mintAddress}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-zinc-400 mb-1">Name:</div>
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800 text-white">
                {tokenName}
              </div>
            </div>
            <div>
              <div className="text-zinc-400 mb-1">Symbol:</div>
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800 text-white">
                {tokenSymbol}
              </div>
            </div>
            <div>
              <div className="text-zinc-400 mb-1">Decimals:</div>
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800 text-white">
                {tokenDecimals}
              </div>
            </div>
            <div>
              <div className="text-zinc-400 mb-1">Supply:</div>
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800 text-white">
                {tokenSupply.toLocaleString()}
              </div>
            </div>
          </div>
          <button
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded text-white font-medium"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-900/30 rounded mb-4 text-red-300">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-zinc-400 mb-2">Token Name</label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-white"
                placeholder="Cerberus Token"
                required
              />
            </div>
            
            <div>
              <label className="block text-zinc-400 mb-2">Token Symbol</label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-white"
                placeholder="CBRST"
                maxLength={10}
                required
              />
            </div>
            
            <div>
              <label className="block text-zinc-400 mb-2">Decimals</label>
              <input
                type="number"
                value={tokenDecimals}
                onChange={(e) => setTokenDecimals(parseInt(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-white"
                min={0}
                max={9}
                required
              />
            </div>
            
            <div>
              <label className="block text-zinc-400 mb-2">Total Supply</label>
              <input
                type="number"
                value={tokenSupply}
                onChange={(e) => setTokenSupply(parseInt(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-white"
                min={1}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className={`w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded text-white font-medium ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating Token..." : "Create Token"}
          </button>
        </form>
      )}
    </div>
  );
};

export default TokenCreation;