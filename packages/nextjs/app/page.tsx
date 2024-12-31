"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isLocalNetwork, setIsLocalNetwork] = useState(false);

  useEffect(() => {
    // Check if we're on a local network
    if (window.ethereum) {
      window.ethereum.request({ method: 'net_version' })
        .then((networkId: string) => {
          setIsLocalNetwork(networkId === '1337' || networkId === '31337');
        })
        .catch(console.error);
    }
  }, []);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-lg">
              Get started by editing{" "}
              <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
                packages/nextjs/app/page.tsx
              </code>
            </p>
            <p className="text-center text-lg">
              Edit your smart contract{" "}
              <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
                YourContract.sol
              </code>{" "}
              in{" "}
              <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
                packages/hardhat/contracts
              </code>
            </p>
          </div>
          <div className="flex justify-center mt-8 gap-4">
            {isLocalNetwork && (
              <div className="bg-base-300 rounded-lg p-4 text-center">
                <span className="block text-lg mb-2">Local Network</span>
                <span className="block text-sm">Test ETH available via faucet</span>
              </div>
            )}
            {connectedAddress && (
              <Link
                href="/social"
                className="btn btn-primary"
              >
                Go to Social Feed →
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
