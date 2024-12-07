"use server";
import { VaultStateType, OptionRoundStateType } from "@/lib/types";
import { createJobRequest } from "@/lib/utils";

export const makeFossilCall = async (
  vaultState: VaultStateType | undefined,
  selectedRoundState: OptionRoundStateType | undefined,
) => {
  // Get request without API key
  let request = createJobRequest(
    vaultState,
    selectedRoundState?.optionSettleDate.toString(),
  );
  // Set API key
  request.headers["x-api-key"] = process.env.FOSSIL_API_KEY;

  // Send Fossil request
  let resp;
  try {
    resp = await fetch(
      `${process.env.NEXT_PUBLIC_FOSSIL_API_URL}/pricing_data`,
      request,
    );
  } catch (error) {
    console.log("Error sending Fossil request:", error);
  }
  resp;
};

export const makeFossilCallR1 = async (
  vaultState: VaultStateType | undefined,
) => {
  // Get request without API key
  let request = createJobRequest(
    vaultState,
    vaultState?.deploymentDate.toString(),
  );
  // Set API key
  request.headers["x-api-key"] = process.env.FOSSIL_API_KEY;

  // Send Fossil request
  let resp;
  try {
    resp = await fetch(
      `${process.env.NEXT_PUBLIC_FOSSIL_API_URL}/pricing_data`,
      request,
    );
  } catch (error) {
    console.log("Error sending Fossil request:", error);
  }

  return resp;
};
