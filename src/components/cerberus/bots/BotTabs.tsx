import React from 'react';

interface BotTabsProps {
  activeBot: string; 
  setActiveBot: React.Dispatch<React.SetStateAction<string>>;
}

export const BotTabs: React.FC<BotTabsProps> = ({ activeBot, setActiveBot }) => {
  return (
    <div className="flex border-b border-zinc-800" role="tablist" aria-label="Bot configurations">
      {/* Only removing aria-controls="volume-panel" from line 13 that was causing the error */}
      {activeBot === "volume" ? (
        <div 
          className="px-4 py-2 cursor-pointer text-sm border-b-2 border-purple-500 text-purple-400"
          onClick={() => setActiveBot("volume")}
          role="tab"
          aria-selected="true"
          tabIndex={0}
          id="volume-tab"
        >
          Volume Analysis
        </div>
      ) : (
        <div 
          className="px-4 py-2 cursor-pointer text-sm border-b-2 border-transparent text-zinc-400 hover:text-zinc-300"
          onClick={() => setActiveBot("volume")}
          role="tab"
          aria-selected="false"
          tabIndex={0}
          id="volume-tab"
        >
          Volume Analysis
        </div>
      )}
      
      {/* Removed aria-controls from bundle tab */}
      {activeBot === "bundle" ? (
        <div 
          className="px-4 py-2 cursor-pointer text-sm border-b-2 border-purple-500 text-purple-400"
          onClick={() => setActiveBot("bundle")}
          role="tab"
          aria-selected="true"
          tabIndex={0}
          id="bundle-tab"
        >
          Bundle Bot
        </div>
      ) : (
        <div 
          className="px-4 py-2 cursor-pointer text-sm border-b-2 border-transparent text-zinc-400 hover:text-zinc-300"
          onClick={() => setActiveBot("bundle")}
          role="tab"
          aria-selected="false"
          tabIndex={0}
          id="bundle-tab"
        >
          Bundle Bot
        </div>
      )}
      
      {/* Removed aria-controls from sniper tab */}
      {activeBot === "sniper" ? (
        <div 
          className="px-4 py-2 cursor-pointer text-sm border-b-2 border-purple-500 text-purple-400"
          onClick={() => setActiveBot("sniper")}
          role="tab"
          aria-selected="true"
          tabIndex={0}
          id="sniper-tab"
        >
          Sniper Bot
        </div>
      ) : (
        <div 
          className="px-4 py-2 cursor-pointer text-sm border-b-2 border-transparent text-zinc-400 hover:text-zinc-300"
          onClick={() => setActiveBot("sniper")}
          role="tab"
          aria-selected="false"
          tabIndex={0}
          id="sniper-tab"
        >
          Sniper Bot
        </div>
      )}
      
      {/* Removed aria-controls from bump tab */}
      {activeBot === "bump" ? (
        <div 
          className="px-4 py-2 cursor-pointer text-sm border-b-2 border-purple-500 text-purple-400"
          onClick={() => setActiveBot("bump")}
          role="tab"
          aria-selected="true"
          tabIndex={0}
          id="bump-tab"
        >
          Bump Bot
        </div>
      ) : (
        <div 
          className="px-4 py-2 cursor-pointer text-sm border-b-2 border-transparent text-zinc-400 hover:text-zinc-300"
          onClick={() => setActiveBot("bump")}
          role="tab"
          aria-selected="false"
          tabIndex={0}
          id="bump-tab"
        >
          Bump Bot
        </div>
      )}
    </div>
  );
};