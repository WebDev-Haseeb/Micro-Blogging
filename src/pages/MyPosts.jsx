import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getUserPosts } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import BlogPost from '../components/BlogPost';
import Loading from '../components/Loading';

const MyPosts = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userPosts = await getUserPosts(currentUser.uid);
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [currentUser]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <motion.h1 
        className="mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="gradient-text">Your</span> Posts
      </motion.h1>

      {loading ? (
        <Loading />
      ) : posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>
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
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>

          <h2 className="mb-2 text-xl font-bold text-gray-700 dark:text-gray-300">No posts yet</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You haven't created any posts yet.
          </p>
          <a
            href="/post"
            className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create Your First Post
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default MyPosts; 