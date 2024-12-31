"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

export const CreatePost = () => {
  const [content, setContent] = useState("");
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { data: socialMediaContract } = useDeployedContractInfo("SocialMedia");

  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    if (!socialMediaContract || !content || !walletClient || !address) {
      console.log("Missing requirements:", {
        hasContract: !!socialMediaContract,
        hasContent: !!content,
        hasWalletClient: !!walletClient,
        hasAddress: !!address
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Starting post creation...");
      
      console.log("Contract:", {
        address: socialMediaContract.address,
        abi: socialMediaContract.abi,
      });

      const { request } = await publicClient.simulateContract({
        address: socialMediaContract.address,
        abi: socialMediaContract.abi,
        functionName: 'createPost',
        args: [content],
        account: address,
      });

      console.log("Simulation successful, sending transaction...");

      const hash = await walletClient.writeContract(request);
      console.log("Transaction sent:", hash);

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Transaction confirmed:", receipt);
      
      setContent("");
      console.log("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      // Add more detailed error logging
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add debug output
  console.log("Render state:", {
    hasContract: !!socialMediaContract,
    contractAddress: socialMediaContract?.address,
    hasWalletClient: !!walletClient,
    address,
    isLoading,
  });

  return (
    <div className="bg-base-100 rounded-xl shadow-md p-4 mb-8">
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="What's on your mind?"
        value={content}
        onChange={e => setContent(e.target.value)}
        maxLength={1000}
      />
      <div className="flex justify-end mt-2">
        <button
          className="btn btn-primary"
          onClick={handlePost}
          disabled={!address || !content || isLoading}
        >
          {isLoading ? <span className="loading loading-spinner"></span> : "Post"}
        </button>
      </div>
    </div>
  );
}; 