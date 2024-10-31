import { useEffect, useState } from "react";
import { ProviderInterface } from "starknet";

const useLatestTimestamp = (
  provider: ProviderInterface | undefined,
  interval: number = 5000,
) => {
  const [timestamp, setTimestamp] = useState<number>(0);

  useEffect(() => {
    if (!provider) return;

    const fetchTimestamp = async () => {
      try {
        const block = await provider.getBlock("latest");
        setTimestamp(block.timestamp);
      } catch (err) {
        console.log(err);
      }
    };

    // Fetch the timestamp immediately and then set up the interval
    fetchTimestamp();
    const intervalId = setInterval(fetchTimestamp, interval);

    // Cleanup interval on unmount or if provider changes
    return () => clearInterval(intervalId);
  }, [provider, interval]); // Add dependencies to re-run if provider or interval changes

  return { timestamp };
};

export default useLatestTimestamp;
