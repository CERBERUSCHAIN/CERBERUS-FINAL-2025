import React from "react";
import { Info, Check, AlertTriangle, Clock } from "lucide-react";
import { ActivityLogItemProps } from "./types";
import { X } from "./CustomIcons";

const ActivityLogItem: React.FC<ActivityLogItemProps> = ({ time, message, type }) => {
  let bgColor, textColor, iconColor, icon;
  
  switch (type) {
    case "info":
      bgColor = "bg-blue-900/20";
      textColor = "text-blue-300";
      iconColor = "text-blue-400";
      icon = <Info size={14} />;
      break;
    case "success":
      bgColor = "bg-green-900/20";
      textColor = "text-green-300";
      iconColor = "text-green-400";
      icon = <Check size={14} />;
      break;
    case "warning":
      bgColor = "bg-yellow-900/20";
      textColor = "text-yellow-300";
      iconColor = "text-yellow-400";
      icon = <AlertTriangle size={14} />;
      break;
    case "error":
      bgColor = "bg-red-900/20";
      textColor = "text-red-300";
      iconColor = "text-red-400";
      icon = <X size={14} className={iconColor} />;
      break;
    case "normal":
    default:
      bgColor = "bg-zinc-900";
      textColor = "text-zinc-300";
      iconColor = "text-zinc-400";
      icon = <Clock size={14} />;
  }

  return (
    <div className={`flex items-start rounded p-2 ${bgColor}`}>
      <div className={`mr-3 mt-0.5 ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className={`text-xs ${textColor}`}>{message}</div>
        <div className="text-xs text-zinc-500 mt-0.5">{time}</div>
      </div>
    </div>
  );
};

export default ActivityLogItem;
