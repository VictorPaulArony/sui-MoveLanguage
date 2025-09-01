export const FormatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const FormatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

export const CopyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};