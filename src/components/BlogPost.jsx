import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { likePost, dislikePost, addComment } from '../firebase';
import { useAlert } from '../contexts/AlertContext';

const BlogPost = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useAlert();
  
  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  const toggleComments = () => {
    setShowComments(prev => !prev);
  };

  // Format the timestamp (handling cases where timestamp might not be available yet)
  const formattedTime = post.createdAt 
    ? formatDistanceToNow(new Date(post.createdAt.toDate()), { addSuffix: true })
    : 'just now';

  // Check if the current user has liked or disliked this post
  const userLiked = post.likedBy?.includes(currentUser?.uid);
  const userDisliked = post.dislikedBy?.includes(currentUser?.uid);

  const handleLike = async () => {
    if (!currentUser) {
      showError('Please sign in to like posts', 3000);
      return;
    }

    try {
      await likePost(post.id, currentUser.uid);
    } catch (error) {
      showError('Failed to like post', 3000);
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async () => {
    if (!currentUser) {
      showError('Please sign in to dislike posts', 3000);
      return;
    }

    try {
      await dislikePost(post.id, currentUser.uid);
    } catch (error) {
      showError('Failed to dislike post', 3000);
      console.error('Error disliking post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      showError('Please sign in to comment', 3000);
      return;
    }

    if (!comment.trim()) {
      showError('Comment cannot be empty', 3000);
      return;
    }

    try {
      setIsSubmittingComment(true);
      await addComment(post.id, currentUser, comment);
      setComment('');
      showSuccess('Comment added successfully', 3000);
    } catch (error) {
      showError('Failed to add comment', 3000);
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

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
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
                userLiked 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
              }`}
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
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
                userDisliked 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
              }`}
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
            
            {/* Comment button */}
            <button 
              onClick={toggleComments}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
              </svg>
              <span>{(post.comments?.length) || 0}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
          >
            <div className="p-4">
              <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {post.comments?.length 
                  ? `Comments (${post.comments.length})` 
                  : 'No comments yet'
                }
              </h4>
              
              {/* Comment form */}
              {currentUser && (
                <form onSubmit={handleCommentSubmit} className="mb-4">
                  <div className="flex gap-3">
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName} 
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/50"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={isSubmittingComment}
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmittingComment || !comment.trim()}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-500/50"
                        >
                          {isSubmittingComment ? 'Posting...' : 'Post'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
              
              {/* Comment list */}
              <div className="space-y-4">
                {post.comments?.length > 0 && post.comments.map((comment, index) => (
                  <div key={index} className="flex gap-3">
                    <img 
                      src={comment.photoURL} 
                      alt={comment.displayName} 
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                            {comment.displayName}
                          </h5>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {comment.createdAt 
                              ? formatDistanceToNow(new Date(comment.createdAt.toDate()), { addSuffix: true }) 
                              : 'just now'
                            }
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BlogPost;