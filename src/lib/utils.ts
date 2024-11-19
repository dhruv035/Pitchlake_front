import { poseidonHashSingle } from "@scure/starknet";
import { bytesToNumberBE } from "@noble/curves/abstract/utils";
import { OptionRoundStateType, FossilParams } from "@/lib/types";

export const createJobRequestParams = (
  targetTimestamp: number,
  roundDuration: number,
) => {
  return {
    // TWAP duration is 1 x round duration
    twap: [targetTimestamp - roundDuration, targetTimestamp],
    // Volatility duration is 3 x round duration
    volatility: [targetTimestamp - 3 * roundDuration, targetTimestamp],
    // Reserve price duration is 3 x round duration
    reserve_price: [targetTimestamp - 3 * roundDuration, targetTimestamp],
  };
};

export const createJobRequest = ({
  targetTimestamp,
  roundDuration,
  clientAddress,
  vaultAddress,
}: FossilParams): any => {
  if (!targetTimestamp || !roundDuration || !clientAddress || !vaultAddress)
    return;

  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "<REPLACE_ME>",
    },
    body: JSON.stringify({
      identifiers: ["PITCH_LAKE_V1"],
      params: createJobRequestParams(targetTimestamp, roundDuration),
      client_info: {
        client_address: clientAddress,
        vault_address: vaultAddress,
        timestamp: targetTimestamp,
      },
    }),
  };
};

export const createJobId = (
  targetTimestamp: number,
  roundDuration: number,
): string => {
  if (!targetTimestamp || !roundDuration) return "";

  const identifiers = ["PITCH_LAKE_V1"];
  const params = createJobRequestParams(targetTimestamp, roundDuration);

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

export const getTargetTimestampForRound = (
  roundState: OptionRoundStateType | undefined,
): number => {
  if (
    !roundState ||
    !roundState.roundId ||
    !roundState.roundState ||
    !roundState.deploymentDate ||
    !roundState.optionSettleDate
  )
    return 0;

  const state = roundState.roundState.toString();
  const roundId = roundState.roundId.toString();
  const targetTimestamp = Number(
    state === "Open" && roundId === "1"
      ? roundState.deploymentDate
      : roundState.optionSettleDate,
  );

  return Number(targetTimestamp);
};

export const getDurationForRound = (
  roundState: OptionRoundStateType | undefined,
): number => {
  if (!roundState || !roundState.auctionEndDate || !roundState.optionSettleDate)
    return 0;

  /// @NOTE Replace once sepolia instance duration >= 12 min
  //let high = Number(roundState.optionSettleDate);
  //let low = Number(roundState.auctionEndDate);
  //return Number(high - low);
  return 720;
  //return 60 * 60 * 24 * 30;
};

export const getLocalStorage = (key: string): string => {
  try {
    return localStorage.getItem(key) || "";
  } catch (error) {
    console.log("Error getting from localStorage", error);
    return "";
  }
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

function generateMockData(
  startDate: string,
  itemCount: number,
  stepInSeconds: number,
) {
  const data = [];
  const start = new Date(startDate);
  start.setSeconds(0, 0); // Ensure the date starts at the beginning of the minute

  let previousBaseFee: number | null = null;

  for (let i = 0; i < itemCount; i++) {
    const currentTime = new Date(start.getTime() + i * stepInSeconds * 1000); // Add stepInSeconds seconds

    // Get Unix timestamp in seconds
    const timestamp = Math.floor(currentTime.getTime() / 1000);

    // BASEFEE calculation
    let baseFee: number;
    if (previousBaseFee === null) {
      baseFee = 20; // Starting BASEFEE
    } else {
      const min = previousBaseFee * 0.875; // -12.5%
      const max = previousBaseFee * 1.125; // +12.5%
      baseFee = getRandomNumber(min, max);
    }
    baseFee = parseFloat(baseFee.toFixed(2));

    // TWAP calculation
    const TWAP = baseFee + getRandomNumber(-1, 1); // Slight variation
    const twapValue = parseFloat(TWAP.toFixed(2));

    // Add the data point
    data.push({
      timestamp,
      BASEFEE: baseFee,
      TWAP: twapValue,
    });

    // Update previousBaseFee for the next iteration
    previousBaseFee = baseFee;
  }

  return data;
}

function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

//const mockData = generateMockData("2024-11-18T18:00:00Z", 10000, 20); // 2 days (in minutes)
//console.log(JSON.stringify(mockData, null, 2));
