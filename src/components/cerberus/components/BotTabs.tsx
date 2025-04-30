import React from "react";

const BotTabs = ({
  activeBot,
  setActiveBot,
}: {
  activeBot: string;
  setActiveBot: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <div className="flex border-b border-zinc-800" role="tablist">
    {["volume", "bundle", "sniper", "bump"].map((tab) => (
      <div
        key={tab}
        className={`px-4 py-2 cursor-pointer text-sm border-b-2 ${
          activeBot === tab ? "border-purple-500 text-purple-400" : "border-transparent text-zinc-400"
        }`}
        onClick={() => setActiveBot(tab)}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)} Bot
      </div>
    ))}
  </div>
);

export default BotTabs;