"use client";

import { useAccount, useReadContract, useSimulateContract, useWriteContract } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface PostCardProps {
  post: {
    id: number;
    creator: string;
    content: string;
    timestamp: number;
    likeCount: number;
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const { address } = useAccount();
  const { data: socialMediaContract } = useDeployedContractInfo("SocialMedia");
  const { writeContract, isPending } = useWriteContract();

  // Read like status
  const { data: hasLiked } = useReadContract({
    address: socialMediaContract?.address,
    abi: socialMediaContract?.abi,
    functionName: 'hasLiked',
    args: [BigInt(post.id), address],
    watch: true,
    enabled: Boolean(socialMediaContract && address),
  });

  // Simulate contract write
  const { data: simulateData } = useSimulateContract({
    address: socialMediaContract?.address,
    abi: socialMediaContract?.abi,
    functionName: 'toggleLike',
    args: [BigInt(post.id)],
    account: address,
    enabled: Boolean(socialMediaContract && address),
  });

  const handleToggleLike = async () => {
    if (!simulateData?.request) return;

    try {
      await writeContract(simulateData.request);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="bg-base-100 rounded-xl shadow-md p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Address address={post.creator} />
        <span className="text-sm opacity-50">
          {new Date(Number(post.timestamp) * 1000).toLocaleString()}
        </span>
      </div>
      <p className="mb-4">{post.content}</p>
      <div className="flex items-center gap-2">
        <button
          className={`btn btn-sm ${hasLiked ? "btn-primary" : "btn-outline"}`}
          onClick={handleToggleLike}
          disabled={!address || isPending || !simulateData?.request}
        >
          {isPending ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <>
              <span>❤️</span>
              <span>{post.likeCount}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}; 