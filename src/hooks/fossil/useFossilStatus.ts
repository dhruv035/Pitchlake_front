import { useEffect, useCallback, useState } from "react";

const useFossilStatus = (jobId: string | undefined) => {
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    if (!jobId) return;

    setStatus(null);
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/job_status/${jobId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError("Error fetching job status");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    const intervalId = setInterval(fetchStatus, 3000);
    fetchStatus();

    return () => clearInterval(intervalId);
  }, [fetchStatus]);

  useEffect(() => {
    setStatus(null);
    setError(null);
  }, [jobId]);

  return { status, error, loading };
};

export default useFossilStatus;
