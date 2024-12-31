"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { CreatePost } from "~~/components/social/CreatePost";
import { PostCard } from "~~/components/social/PostCard";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface Post {
  id: number;
  creator: string;
  content: string;
  timestamp: number;
  likeCount: number;
}

const SocialFeed = () => {
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();
  const [posts, setPosts] = useState<Post[]>([]);
  const publicClient = usePublicClient();
  const { data: socialMediaContract } = useDeployedContractInfo("SocialMedia");

  const fetchPosts = async () => {
    if (!socialMediaContract) {
      setLoading(false);
      return;
    }

    try {
      // Get total posts count
      const totalPosts = await publicClient.readContract({
        address: socialMediaContract.address,
        abi: socialMediaContract.abi,
        functionName: 'getTotalPosts',
      });

      console.log("Total posts:", totalPosts);

      // Fetch all posts
      const fetchedPosts = [];
      for (let i = Number(totalPosts); i > 0; i--) {
        const post = await publicClient.readContract({
          address: socialMediaContract.address,
          abi: socialMediaContract.abi,
          functionName: 'getPost',
          args: [BigInt(i)],
        });

        if (post) {
          fetchedPosts.push({
            id: Number(post.id),
            creator: post.creator,
            content: post.content,
            timestamp: Number(post.timestamp),
            likeCount: Number(post.likeCount),
          });
        }
      }

      console.log("Fetched posts:", fetchedPosts);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [socialMediaContract]);

  // Listen for new posts
  useEffect(() => {
    if (!socialMediaContract) return;

    const filter = {
      address: socialMediaContract.address,
      events: socialMediaContract.abi.filter(x => x.type === 'event' && x.name === 'PostCreated'),
    };

    const unwatch = publicClient.watchContractEvent({
      ...filter,
      onLogs: () => {
        // Refetch posts when new post is created
        fetchPosts();
      },
    });

    return () => unwatch();
  }, [socialMediaContract, publicClient]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Social Feed</h1>
      
      {address ? (
        <CreatePost />
      ) : (
        <div className="bg-base-200 rounded-xl p-4 mb-8 text-center">
          Please connect your wallet to create posts
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-base-content/70">
          No posts yet. Be the first to post!
        </div>
      )}
    </div>
  );
};

export default SocialFeed; 