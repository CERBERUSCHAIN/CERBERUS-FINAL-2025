import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color 
}) => {
  let gradient: string, textColor: string, borderColor: string;
  
  switch (color) {
    case "purple":
      gradient = "from-purple-500 to-fuchsia-500";
      textColor = "text-purple-300";
      borderColor = "border-purple-900/30";
      break;
    case "pink":
      gradient = "from-pink-500 to-rose-500";
      textColor = "text-pink-300";
      borderColor = "border-pink-900/30";
      break;
    case "blue":
      gradient = "from-blue-500 to-cyan-500";
      textColor = "text-blue-300";
      borderColor = "border-blue-900/30";
      break;
    case "cyan":
      gradient = "from-cyan-500 to-blue-500";
      textColor = "text-cyan-300";
      borderColor = "border-cyan-900/30";
      break;
    default:
      gradient = "from-purple-500 to-fuchsia-500";
      textColor = "text-purple-300";
      borderColor = "border-purple-900/30";
  }

  return (
    <div className={`bg-zinc-950 rounded-lg border ${borderColor} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`${textColor} text-sm`}>{title}</div>
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
      {trend && (
        <div className={`text-xs ${trend.startsWith("+") ? "text-green-400" : "text-red-400"} mt-1`}>
          {trend} {trend.includes("%") ? "" : "today"}
        </div>
      )}
    </div>
  );
};