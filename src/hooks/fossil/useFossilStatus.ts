import { useEffect, useCallback, useState } from "react";

// Poll a job's status using it's ID
const INTERVAL_MS = 3000;

interface StatusData {
  status?: string;
  error?: string;
}

const useFossilStatus = (jobId: string | undefined) => {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStatus = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
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
  }, [jobId]);

  useEffect(() => {
    if (!jobId || status?.status === "Completed" || status?.status === "Failed")
      return;

    const intervalId = setInterval(fetchStatus, INTERVAL_MS);
    fetchStatus();

    return () => {
      clearInterval(intervalId);
    };
  }, [jobId, fetchStatus]);

  return { status, error, loading };
};

export default useFossilStatus;
