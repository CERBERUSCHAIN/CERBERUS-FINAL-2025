export const isValidSolanaAddress = (address: string): boolean => {
  // Simple validation - Solana addresses are 44 characters and base58 encoded
  return /^[1-9A-HJ-NP-Za-km-z]{43,44}$/.test(address);
};

export const isValidTokenSymbol = (symbol: string): boolean => {
  // Token symbols should be 2-10 characters and alphanumeric
  return /^[A-Za-z0-9]{2,10}$/.test(symbol);
};

export const isValidTokenName = (name: string): boolean => {
  // Token names should be 1-50 characters
  return name.length >= 1 && name.length <= 50;
};

export const isValidAmount = (amount: string): boolean => {
  // Amount should be a positive number
  return /^[0-9]+(\.[0-9]+)?$/.test(amount) && parseFloat(amount) > 0;
};

export default {
  isValidSolanaAddress,
  isValidTokenSymbol,
  isValidTokenName,
  isValidAmount
};
