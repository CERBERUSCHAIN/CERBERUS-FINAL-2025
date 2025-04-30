import React from "react";

const TokenPriceCard = ({
  name,
  symbol,
  price,
  change,
}: {
  name: string;
  symbol: string;
  price: number;
  change: number;
}) => (
  <div className="p-4 bg-zinc-900 rounded-lg">
    <div className="text-sm text-zinc-400">{name}</div>
    <div className="text-lg font-bold text-white">{symbol}</div>
    <div className={`text-sm ${change > 0 ? "text-green-400" : "text-red-400"}`}>
      {change > 0 ? "+" : ""}
      {change}%
    </div>
  </div>
);

export default TokenPriceCard;