// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

/**
 * @title SocialMedia
 * @dev A decentralized social media contract for posting content and interactions
 */
contract SocialMedia {
    // Data Structures
    struct Post {
        uint256 id;
        address creator;
        string content;
        uint256 timestamp;
        uint256 likeCount;
    }

    // State Variables
    uint256 private _postCounter;
    mapping(uint256 => Post) public posts;
    mapping(address => uint256[]) public userPosts;
    mapping(uint256 => mapping(address => bool)) public postLikes;

    // Events
    event PostCreated(uint256 indexed postId, address indexed creator, string content);
    event PostLiked(uint256 indexed postId, address indexed liker);
    event PostUnliked(uint256 indexed postId, address indexed unliker);

    // Modifiers
    modifier validPostId(uint256 postId) {
        require(postId > 0 && postId <= _postCounter, "Invalid post ID");
        _;
    }

    modifier notPostCreator(uint256 postId) {
        require(posts[postId].creator != msg.sender, "Cannot like own post");
        _;
    }

    /**
     * @dev Create a new post
     * @param content The content of the post
     */
    function createPost(string memory content) external {
        require(bytes(content).length > 0, "Content cannot be empty");
        require(bytes(content).length <= 1000, "Content too long");

        _postCounter++;
        
        Post memory newPost = Post({
            id: _postCounter,
            creator: msg.sender,
            content: content,
            timestamp: block.timestamp,
            likeCount: 0
        });

        posts[_postCounter] = newPost;
        userPosts[msg.sender].push(_postCounter);

        emit PostCreated(_postCounter, msg.sender, content);
    }

    /**
     * @dev Like or unlike a post
     * @param postId The ID of the post
     */
    function toggleLike(uint256 postId) external validPostId(postId) notPostCreator(postId) {
        bool hasLiked = postLikes[postId][msg.sender];
        
        if (hasLiked) {
            postLikes[postId][msg.sender] = false;
            posts[postId].likeCount--;
            emit PostUnliked(postId, msg.sender);
        } else {
            postLikes[postId][msg.sender] = true;
            posts[postId].likeCount++;
            emit PostLiked(postId, msg.sender);
        }
    }

    /**
     * @dev Get post by ID
     * @param postId The ID of the post
     */
    function getPost(uint256 postId) external view validPostId(postId) returns (Post memory) {
        return posts[postId];
    }

    /**
     * @dev Get all posts by an address
     * @param user The address to get posts for
     */
    function getPostsByUser(address user) external view returns (Post[] memory) {
        uint256[] memory userPostIds = userPosts[user];
        Post[] memory userPostsArray = new Post[](userPostIds.length);
        
        for (uint256 i = 0; i < userPostIds.length; i++) {
            userPostsArray[i] = posts[userPostIds[i]];
        }
        
        return userPostsArray;
    }

    /**
     * @dev Get total number of posts
     */
    function getTotalPosts() external view returns (uint256) {
        return _postCounter;
    }

    /**
     * @dev Check if user has liked a post
     * @param postId The ID of the post
     * @param user The address to check
     */
    function hasLiked(uint256 postId, address user) external view validPostId(postId) returns (bool) {
        return postLikes[postId][user];
    }
} 