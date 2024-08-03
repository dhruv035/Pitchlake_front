export const shortenString = (str: string) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

export const copyToClipboard = (text: string) =>
  navigator.clipboard.writeText(text);

export const stringToHex = (decimalString: string) => {
  decimalString = String(decimalString);

  const num = BigInt(decimalString);

  return `0x${num.toString(16)}`;
};

import { Connector } from "@starknet-react/core";
import { Account, ec, Provider } from "starknet";
