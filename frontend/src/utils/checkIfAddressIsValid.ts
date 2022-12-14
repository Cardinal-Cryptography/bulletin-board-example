const checkIfAddressIsValid = (walletAddress?: string): boolean => {
  if (!walletAddress || walletAddress.length !== 48) return false;
  return true;
};

export default checkIfAddressIsValid;
