import { useEffect, useCallback, useState } from "react";
import {
  createJobId,
  getDurationForRound,
  getTargetTimestampForRound,
} from "@/lib/utils";
import { useProtocolContext } from "@/context/ProtocolProvider";

export interface StatusData {
  status?: string;
  error?: string;
}

const useFossilStatus = () => {
  const { selectedRoundState, conn } = useProtocolContext();
  const targetTimestamp = getTargetTimestampForRound(selectedRoundState);
  const roundDuration = getDurationForRound(selectedRoundState);
console.log("selectedRoundState",selectedRoundState)
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  console.log("statusData",statusData)
  const fetchStatus = useCallback(async () => {
    console.log("target",targetTimestamp)
    if (!selectedRoundState) return;
    console.log("ATLEAST target",targetTimestamp)
    if (targetTimestamp === 0) return;
    if (conn === "mock") {
      console.log("ATLEAST HERE", selectedRoundState)
      if (
        selectedRoundState.roundState === "FossilReady" ||
        selectedRoundState.roundState === "Running"
      ) {
        console.log("ALSO ATLEAST HERE")
        setStatusData({
          status: "Completed",
        } as StatusData);
      }
      return;
    }

    setLoading(true);
    try {

      const jobId = createJobId(targetTimestamp, roundDuration);
      const response = await fetch(
        `${process.env.NEXT_PUBsLIC_FOSSIL_API_URL}/job_status/${jobId}`
      );

      if (!response.ok) throw new Error("Network response was not ok");

      console.log("REACHING HERE ALSO THOUGH")
      const data = await response.json();
      setStatusData(data);
      setError(null);
    } catch (err) {
      setError("Error fetching job status");
    } finally {
      setLoading(false);
    }
  }, [targetTimestamp, conn]);

  useEffect(() => {
    if (
      selectedRoundState?.roundState === "Auctioning" ||
      selectedRoundState?.roundState === "Settled"
    )
      return;

    const intervalId = setInterval(() => {
      fetchStatus();

      // Stop polling if status is "Completed"
      if (statusData?.status === "Completed") {
        clearInterval(intervalId);
      }
    }, 9999);

    // Fetch immediately on mount
    fetchStatus();

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchStatus, targetTimestamp, selectedRoundState?.roundState]);

  return { status: statusData, error, loading, setStatusData };
};

export default useFossilStatus;
