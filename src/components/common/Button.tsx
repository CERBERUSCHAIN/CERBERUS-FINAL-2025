import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  isLoading = false,
  className = "",
  disabled,
  ...rest
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "secondary":
        return "btn-secondary";
      case "outline":
        return "btn-outline";
      case "danger":
        return "btn-danger";
      default:
        return "btn-primary";
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "btn-sm";
      case "large":
        return "btn-lg";
      default:
        return "";
    }
  };

  return (
    <button
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="loading-indicator">
          <span className="spinner"></span>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
