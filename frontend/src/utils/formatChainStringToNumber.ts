// expected input example: "12,345" (string) or 12,345 (string) -> expected output example: 12345 (number)
const formatChainStringToNumber = (str: string): number =>
  parseFloat(str.replace(/,/g, '').replace(/"/g, ''));

export default formatChainStringToNumber;
