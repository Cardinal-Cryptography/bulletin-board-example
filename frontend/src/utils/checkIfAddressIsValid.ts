const checkIfAddressIsValid = (walletAddress?: string): boolean =>
  !(!walletAddress || walletAddress.length !== 48);

export default checkIfAddressIsValid;
