import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

export const useNativeCurrencyPrice = () => {
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // For local development, return a mock price
        const chainId = await publicClient.getChainId();
        if (chainId === 1337 || chainId === 31337) {
          setPrice(1800); // Mock ETH price for local development
          setIsLoading(false);
          return;
        }

        // For production, you could fetch from an API
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        setPrice(data.ethereum.usd);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
        setPrice(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
    // Refresh price every 5 minutes
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [publicClient]);

  return { price, isLoading };
}; 