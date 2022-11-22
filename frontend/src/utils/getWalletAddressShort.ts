const getWalletAddressShort = (walletAddress: string, visibleDigitsEachSide = 4): string => {
  if (2 * visibleDigitsEachSide >= walletAddress.length) {
    return walletAddress;
  }
  return `${walletAddress.substring(0, visibleDigitsEachSide)}...${walletAddress.slice(
    -visibleDigitsEachSide
  )}`;
};

export default getWalletAddressShort;
