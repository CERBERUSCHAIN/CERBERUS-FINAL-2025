import React from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = "medium", 
  color = "var(--primary-color)" 
}) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return "24px";
      case "large":
        return "48px";
      default:
        return "36px";
    }
  };

  const loaderSize = getSize();

  return (
    <div 
      className="loader"
      style={{
        width: loaderSize,
        height: loaderSize,
        borderTop: `3px solid ${color}`,
        borderRight: "3px solid transparent",
        borderRadius: "50%",
        display: "inline-block",
        animation: "loader-spin 1s linear infinite",
        margin: "10px auto",
      }}
    />
  );
};

export default Loader;
