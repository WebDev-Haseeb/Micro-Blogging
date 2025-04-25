import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogPost from '../components/BlogPost';
import Loading from '../components/Loading';
import { getPaginatedPosts } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { currentUser } = useAuth();
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const result = await getPaginatedPosts(null, postsPerPage);
        setPosts(result.posts);
        setLastDoc(result.lastDoc);
        setHasMore(result.posts.length === postsPerPage);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchPosts();
  }, []);

  const loadMorePosts = async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const result = await getPaginatedPosts(lastDoc, postsPerPage);
      
      if (result.posts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...result.posts]);
        setLastDoc(result.lastDoc);
      }
      
      setHasMore(result.posts.length === postsPerPage);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <motion.h1 
        className="mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="gradient-text">Latest</span> Posts
      </motion.h1>

      {initialLoad && loading ? (
        <Loading />
      ) : posts.length > 0 ? (
        <>
          <div className="space-y-4">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <BlogPost post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Load more posts button */}
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={loadMorePosts}
                disabled={loadingMore}
                className="btn-secondary px-6 py-2"
              >
                {loadingMore ? (
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </div>
                ) : "Load more posts"}
              </button>
            </div>
          )}
        </>
      ) : (
        <motion.div 
          className="flex h-[40vh] flex-col items-center justify-center rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-800/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>

          <h2 className="mb-2 text-xl font-bold text-gray-700 dark:text-gray-300">No posts yet</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentUser
              ? "Be the first to share your thoughts!"
              : "Sign in to start sharing your thoughts!"}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Home;