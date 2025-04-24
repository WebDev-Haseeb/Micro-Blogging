import { motion } from 'framer-motion';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const BlogPost = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  // Format the timestamp (handling cases where timestamp might not be available yet)
  const formattedTime = post.createdAt 
    ? formatDistanceToNow(new Date(post.createdAt.toDate()), { addSuffix: true })
    : 'just now';

  return (
    <motion.div 
      className="card mb-4 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4 p-4">
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
          <p className="mt-2 whitespace-pre-wrap text-gray-700 dark:text-gray-300">{post.content}</p>
          
          {/* Expand/collapse button */}
          {post.content.length > 150 && (
            <button 
              onClick={toggleExpand}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPost; 