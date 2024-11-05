import { poseidonHashMany, poseidonHashSingle } from "@scure/starknet";
import { bytesToNumberBE, numberToBytesBE } from "@noble/curves/abstract/utils";
import { VaultStateType, OptionRoundStateType } from "@/lib/types";
import { num } from "starknet";

export const createJobRequestParams = (targetTimestamp: string) => {
  return {
    twap: [Number(targetTimestamp) - 720, Number(targetTimestamp)],
    volatility: [Number(targetTimestamp) - 2160, Number(targetTimestamp)],
    reserve_price: [Number(targetTimestamp) - 2160, Number(targetTimestamp)],
  };
};

export const createJobRequest = (
  vaultState: VaultStateType | undefined,
  targetTimestamp: string,
): any => {
  if (!vaultState) return;

  const apiKey = process.env.NEXT_PUBLIC_FOSSIL_API_KEY;
  const identifiers = ["PITCH_LAKE_V1"];
  const params = createJobRequestParams(targetTimestamp);
  const clientInfo = {
    client_address: vaultState.fossilClientAddress,
    vault_address: vaultState.address,
    timestamp: Number(targetTimestamp),
  };

  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      identifiers,
      params,
      client_info: clientInfo,
    }),
  };
};

export const createJobId = (
  roundState: OptionRoundStateType | undefined,
): string => {
  if (!roundState?.optionSettleDate) return "";

  const identifiers = ["PITCH_LAKE_V1"];
  const params = createJobRequestParams(roundState.optionSettleDate.toString());

  const input = [
    ...identifiers,
    params.twap[0],
    params.twap[1],
    params.volatility[0],
    params.volatility[1],
    params.reserve_price[0],
    params.reserve_price[1],
  ].join("");

  const bytes: Buffer = Buffer.from(input, "utf-8");
  const asNum = bytesToNumberBE(bytes);

  const hashResult = poseidonHashSingle(asNum);

  return hashResult.toString();
};

export const shortenString = (str: string) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

export const copyToClipboard = (text: string) =>
  navigator.clipboard.writeText(text);

export const stringToHex = (decimalString?: string) => {
  if (!decimalString) return undefined;
  decimalString = String(decimalString);

  const num = BigInt(decimalString);

  return `0x${num.toString(16)}`;
};

// Utility function to format the number
export const formatNumberText = (number: number) => {
  if (number < 100_000) {
    return number.toLocaleString(); // Return raw number with commas
  } else if (number >= 100_000 && number < 1_000_000) {
    return `${(number / 1_000).toFixed(1)}k`; // Format as '123.45k'
  } else if (number >= 1_000_000 && number < 1_000_000_000) {
    return `${(number / 1_000_000).toFixed(1)}m`; // Format as '123.45m'
  } else {
    return `${(number / 1_000_000_000).toFixed(1)}b`; // Optional for larger numbers like '123.45b'
  }
};

export const timeFromNow = (timestamp: string) => {
  const now = new Date().getTime() / 1000;
  return timeUntilTarget(now.toString(), timestamp);
};

export const timeUntilTarget = (timestamp: string, target: string) => {
  const timestampDate = new Date(Number(timestamp) * 1000);
  const targetDate = new Date(Number(target) * 1000);

  // Calculate the difference in milliseconds
  const diffInMs = targetDate.getTime() - timestampDate.getTime();
  const sign = diffInMs < 0 ? "-" : "";
  const diffInMsAbs = Math.abs(diffInMs);

  // Convert milliseconds to meaningful units
  const msInDay = 24 * 60 * 60 * 1000;
  const msInHour = 60 * 60 * 1000;
  const msInMinute = 60 * 1000;
  const msInSecond = 1000;

  const days = Math.floor(diffInMsAbs / msInDay);
  const hours = Math.floor((diffInMsAbs % msInDay) / msInHour);
  const minutes = Math.floor((diffInMsAbs % msInHour) / msInMinute);
  const seconds = Math.floor((diffInMsAbs % msInMinute) / msInSecond);

  let str = `${sign}`;
  str += days > 0 ? `${days}d ` : "";
  str += hours > 0 ? `${hours}h ` : "";
  str += minutes > 0 ? `${minutes}m ` : "";
  if ((days === 0 && sign === "") || (sign === "-" && days === 0 && hours <= 2))
    str += `${seconds}s `;

  return str;
};

export const timeUntilTargetFormal = (timestamp: string, target: string) => {
  const timestampDate = new Date(Number(timestamp) * 1000);
  const targetDate = new Date(Number(target) * 1000);

  // Calculate the difference in milliseconds
  const diffInMs = targetDate.getTime() - timestampDate.getTime();
  const sign = diffInMs < 0 ? "-" : "";
  const diffInMsAbs = Math.abs(diffInMs);

  // Convert milliseconds to meaningful units
  const msInDay = 24 * 60 * 60 * 1000;
  const msInHour = 60 * 60 * 1000;
  const msInMinute = 60 * 1000;
  const msInSecond = 1000;

  const days = Math.floor(diffInMsAbs / msInDay);
  const hours = Math.floor((diffInMsAbs % msInDay) / msInHour);
  const minutes = Math.floor((diffInMsAbs % msInHour) / msInMinute);
  const seconds = Math.floor((diffInMsAbs % msInMinute) / msInSecond);

  let str = `${sign}`;
  str += days > 0 ? `${days} ${days === 1 ? "Day" : "Days"} ` : "";
  str += hours > 0 ? `${hours} ${hours === 1 ? "Hour" : "Hours"} ` : "";
  str +=
    minutes > 0 ? `${minutes} ${minutes === 1 ? "Minute" : "Minutes"} ` : "";

  if (
    (days === 0 && sign === "" && seconds > 0) ||
    (sign === "-" && days === 0 && hours <= 2)
  )
    str += `${seconds} ${seconds === 1 ? "Second" : "Seconds"}`;

  return str;
};
