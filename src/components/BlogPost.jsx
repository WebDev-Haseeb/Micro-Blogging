// eslint-disable-next-line
import { motion } from 'framer-motion';
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
  const { showError } = useAlert();
  
  // Update post if the props change
  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);
  
  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  // Custom time formatter
  const formatTime = (timestamp) => {
    if (!timestamp) return 'just now';
    
    const formatted = formatDistanceToNow(new Date(timestamp.toDate()), { addSuffix: true });
    
    // Replace "in less than a minute" with "less than a minute ago" if needed
    if (formatted === "in less than a minute") {
      return "less than a minute ago";
    }
    
    return formatted;
  };

  // Format the timestamp
  const formattedTime = post.createdAt ? formatTime(post.createdAt) : 'just now';

  // Check if the current user has liked or disliked this blog
  const userLiked = post.likedBy?.includes(currentUser?.uid);
  const userDisliked = post.dislikedBy?.includes(currentUser?.uid);

  const handleReaction = async (reactionType) => {
    if (!currentUser) {
      showError(`Please sign in to ${reactionType} blogs`, 3000);
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
      console.error(`Error ${reactionType}ing blog:`, error);
      
      // Revert to original state on error
      setPost(initialPost);
      
      // Notify parent component of error
      if (onReactionChange) {
        onReactionChange(initialPost);
      }
      
      showError(`Failed to ${reactionType} blog. Please try again.`, 3000);
    } finally {
      setIsReacting(false);
    }
  };

  const handleLike = () => handleReaction('like');
  const handleDislike = () => handleReaction('dislike');

  return (
    <motion.div 
      className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:border-gray-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* User avatar with subtle gradient border */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-70 blur-[1px]"></div>
            <img 
              src={post.photoURL} 
              alt={post.displayName} 
              className="relative h-12 w-12 rounded-full border-2 border-white object-cover dark:border-gray-800"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* User info and timestamp */}
            <div className="flex flex-wrap items-center justify-between gap-y-2">
              <div className="flex items-center gap-2 mr-4">
                <h3 className="font-bold text-gray-900 dark:text-white">{post.displayName}</h3>
                <div className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-1 h-3 w-3">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                  </svg>
                  {formattedTime}
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-2.5 py-1 text-xs font-medium text-blue-700 dark:from-blue-900/20 dark:to-purple-900/20 dark:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                </svg>
                {post.characterCount} characters
              </div>
            </div>
            
            {/* Blog content with elegant typography */}
            <div className={`mt-4 ${!expanded && post.content.length > 150 ? 'relative' : ''}`}>
              <p className={`whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed ${!expanded && post.content.length > 150 ? 'line-clamp-3' : ''}`}>
                {post.content}
              </p>
              
              {/* Gradient fade for truncated content */}
              {!expanded && post.content.length > 150 && (
                <div className="absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-white dark:from-gray-900"></div>
              )}
            </div>
            
            {/* Enhanced expand/collapse button */}
            {post.content.length > 150 && (
              <button 
                onClick={toggleExpand}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                {expanded ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    </svg>
                    Show less
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                    Read more
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Blog reactions with improved styling */}
        <div className="mt-5 flex items-center gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
          {/* Like button */}
          <button 
            onClick={handleLike}
            disabled={isReacting}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              userLiked 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
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
            <span className={`${userLiked ? 'font-semibold' : ''}`}>{post.likes || 0}</span>
          </button>
          
          {/* Dislike button */}
          <button 
            onClick={handleDislike}
            disabled={isReacting}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              userDisliked 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
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
            <span className={`${userDisliked ? 'font-semibold' : ''}`}>{post.dislikes || 0}</span>
          </button>
          
          {/* Added timestamp in text form for context */}
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            {/* Display absolute date if more than 7 days ago */}
            {post.createdAt ? (
              new Date(post.createdAt.toDate()) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
                ? new Date(post.createdAt.toDate()).toLocaleDateString()
                : formattedTime
            ) : 'just now'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPost;