export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
};

export const formatCompactNumber = (value: number): string => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(value);
};

export const truncateAddress = (address: string, length = 4): string => {
  if (!address) return "";
  return `${address.substring(0, length)}...${address.substring(address.length - length)}`;
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};

export default {
  formatCurrency,
  formatCompactNumber,
  truncateAddress,
  formatPercentage
};
