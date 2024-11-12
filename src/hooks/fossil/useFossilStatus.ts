import { useEffect, useCallback, useState } from "react";
import { createJobId } from "@/lib/utils";
import { OptionRoundStateType } from "@/lib/types";

// Poll a job's status using it's ID
const INTERVAL_MS = 3000;

interface StatusData {
  status?: string;
  error?: string;
}

interface FossilStatusParams {
  roundId: string | undefined;
  targetTimestamp: string | undefined;
  isInitialRequest: boolean;
}

//const useFossilStatus = (jobId: string | undefined) => {
//const useFossilStatus = ({ roundId, targetTimestamp }: FossilStatusParams) => {
const useFossilStatus = (
  targetTimestamp: string | undefined,
  roundId: string | undefined,
) => {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStatus = useCallback(async () => {
    if (!targetTimestamp || targetTimestamp === "0") return;
    if (!roundId || roundId === "0") return;
    setLoading(true);
    try {
      const jobId = createJobId(targetTimestamp);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FOSSIL_API_URL}/job_status/${jobId}`,
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setStatus(null);
      setError("Error fetching job status");
    } finally {
      setLoading(false);
    }
  }, [targetTimestamp]);

  useEffect(() => {
    if (
      !targetTimestamp ||
      targetTimestamp === "0" ||
      !roundId ||
      roundId === "0" ||
      status?.status === "Completed" ||
      status?.status === "Failed"
    )
      return;

    const intervalId = setInterval(fetchStatus, INTERVAL_MS);
    fetchStatus();

    return () => {
      clearInterval(intervalId);
    };
  }, [targetTimestamp, fetchStatus]);

  return { status, error, loading };
};

export default useFossilStatus;
