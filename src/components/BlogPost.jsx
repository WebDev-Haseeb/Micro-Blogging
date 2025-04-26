import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { reactToPost } from '../firebase';
import { useAlert } from '../contexts/AlertContext';

const BlogPost = ({ post: initialPost, onReactionChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [post, setPost] = useState(initialPost);
  const [isReacting, setIsReacting] = useState(false);
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useAlert();
  
  // Update post if the props change
  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);
  
  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  // Format the timestamp (handling cases where timestamp might not be available yet)
  const formattedTime = post.createdAt 
    ? formatDistanceToNow(new Date(post.createdAt.toDate()), { addSuffix: true })
    : 'just now';

  // Check if the current user has liked or disliked this post
  const userLiked = post.likedBy?.includes(currentUser?.uid);
  const userDisliked = post.dislikedBy?.includes(currentUser?.uid);

  const handleReaction = async (reactionType) => {
    if (!currentUser) {
      showError(`Please sign in to ${reactionType} posts`, 3000);
      return;
    }

    // Prevent multiple rapid clicks
    if (isReacting) return;

    try {
      setIsReacting(true);
      
      // Create optimistic update for UI
      const newPost = { ...post };
      
      if (reactionType === 'like') {
        if (userLiked) {
          // Remove like
          newPost.likes = Math.max(0, (post.likes || 0) - 1);
          newPost.likedBy = post.likedBy.filter(id => id !== currentUser.uid);
        } else {
          // Add like
          newPost.likes = (post.likes || 0) + 1;
          newPost.likedBy = [...(post.likedBy || []), currentUser.uid];
          
          // Remove dislike if exists
          if (userDisliked) {
            newPost.dislikes = Math.max(0, (post.dislikes || 0) - 1);
            newPost.dislikedBy = post.dislikedBy.filter(id => id !== currentUser.uid);
          }
        }
      } else { // dislike
        if (userDisliked) {
          // Remove dislike
          newPost.dislikes = Math.max(0, (post.dislikes || 0) - 1);
          newPost.dislikedBy = post.dislikedBy.filter(id => id !== currentUser.uid);
        } else {
          // Add dislike
          newPost.dislikes = (post.dislikes || 0) + 1;
          newPost.dislikedBy = [...(post.dislikedBy || []), currentUser.uid];
          
          // Remove like if exists
          if (userLiked) {
            newPost.likes = Math.max(0, (post.likes || 0) - 1);
            newPost.likedBy = post.likedBy.filter(id => id !== currentUser.uid);
          }
        }
      }
      
      // Update local state immediately for responsive UI
      setPost(newPost);
      
      // Notify parent component
      if (onReactionChange) {
        onReactionChange(newPost);
      }
      
      // Send to the server and wait for confirmation
      await reactToPost(post.id, currentUser.uid, reactionType);
    } catch (error) {
      console.error(`Error ${reactionType}ing post:`, error);
      
      // Revert to original state on error
      setPost(initialPost);
      
      // Notify parent component of error
      if (onReactionChange) {
        onReactionChange(initialPost);
      }
      
      showError(`Failed to ${reactionType} post. Please try again.`, 3000);
    } finally {
      setIsReacting(false);
    }
  };

  const handleLike = () => handleReaction('like');
  const handleDislike = () => handleReaction('dislike');

  return (
    <motion.div 
      className="card mb-4 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* User avatar */}
          <img 
            src={post.photoURL} 
            alt={post.displayName} 
            className="h-10 w-10 rounded-full"
          />
          
          <div className="flex-1">
            {/* User info and timestamp */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{post.displayName}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formattedTime}</span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                  <path d="M3.196 12.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 12.87z" />
                  <path d="M3.196 8.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 8.87z" />
                  <path d="M10.38 1.103a.75.75 0 00-.76 0l-7.25 4.25a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.76 0l7.25-4.25a.75.75 0 000-1.294l-7.25-4.25z" />
                </svg>
                {post.characterCount} chars
              </div>
            </div>
            
            {/* Post content */}
            <p className={`mt-2 whitespace-pre-wrap text-gray-700 dark:text-gray-300 ${!expanded && post.content.length > 150 ? 'line-clamp-3' : ''}`}>
              {post.content}
            </p>
            
            {/* Expand/collapse button */}
            {post.content.length > 150 && (
              <button 
                onClick={toggleExpand}
                className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>
        
        {/* Post actions */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {/* Like button */}
            <button 
              onClick={handleLike}
              disabled={isReacting}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
                userLiked 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
              } ${isReacting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={userLiked ? "currentColor" : "none"}
                stroke={userLiked ? "none" : "currentColor"}
                className="h-5 w-5" 
                strokeWidth={1.5}
              >
                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
              </svg>
              <span>{post.likes || 0}</span>
            </button>
            
            {/* Dislike button */}
            <button 
              onClick={handleDislike}
              disabled={isReacting}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
                userDisliked 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
              } ${isReacting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={userDisliked ? "currentColor" : "none"}
                stroke={userDisliked ? "none" : "currentColor"}
                className="h-5 w-5 rotate-180" 
                strokeWidth={1.5}
              >
                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
              </svg>
              <span>{post.dislikes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPost;