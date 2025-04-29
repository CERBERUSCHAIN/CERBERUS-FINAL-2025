import React from 'react';

interface TokenPriceCardProps {
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: number;
  volume: number;
  iconLetter: string;
}

export const TokenPriceCard: React.FC<TokenPriceCardProps> = ({
  name,
  symbol,
  price,
  change,
  marketCap,
  volume,
  iconLetter
}) => {
  const isPositive = change > 0;
  
  return (
    <div className="bg-zinc-950 rounded-lg border border-purple-900/30 p-4">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-3">
          <span className="text-white font-semibold">{iconLetter}</span>
        </div>
        <div>
          <div className="text-lg font-semibold text-white">{name}</div>
          <div className="text-sm text-zinc-400">{symbol}</div>
        </div>
        <div className="ml-auto">
          <div className="text-lg font-semibold text-white">${price.toFixed(2)}</div>
          <div className={`text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? "+" : ""}{change.toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-zinc-400">Market Cap</div>
          <div className="text-white font-medium">${marketCap.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-zinc-400">24h Volume</div>
          <div className="text-white font-medium">${volume.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

// Make sure we're exporting correctly - we need a default export as well
export default TokenPriceCard;