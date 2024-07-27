

export const shortenString = (str: string) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

export const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);