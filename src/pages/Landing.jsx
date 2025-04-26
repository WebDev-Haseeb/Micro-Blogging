import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Landing = () => {
  const { currentUser, login, loading } = useAuth();

  // If user is logged in, redirect to the homepage
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  // If auth is still loading, show a loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-blue-600"
        />
      </div>
    );
  }

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-30 dark:from-blue-900/20 dark:to-purple-900/20" />
      
      {/* Content container */}
      <div className="relative container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          
          {/* Text content */}
          <div className="max-w-lg sm:mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                Welcome to <span className="gradient-text">Smart</span> MicroBlog
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300">
                Share your thoughts in 300 characters or less. Get instant AI-powered insights on your writing, and connect with others.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                  onClick={handleLogin}
                >
                  Sign in with Google
                </motion.button>
              </div>
              
              <div className="mt-12 space-y-6 text-base text-gray-600 dark:text-gray-400">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3">Quick thoughts in 300 characters or less</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3">AI-powered analysis of your writing</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3">Rewrite your posts in different tones</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Illustration / Demo */}
          <motion.div
            className="relative hidden sm:block lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-900/10 dark:bg-gray-800 dark:ring-gray-700">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4 dark:border-gray-700">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">John Doe</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">less than a minute ago</div>
                </div>
              </div>
              <div className="mt-4 text-gray-700 dark:text-gray-300">
                Just got my new Smart laptop and I'm loving it! The keyboard feels amazing and the performance is stellar. Can't wait to use it for my next project. #NewTech #Productivity
              </div>
              <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>191 characters</span>
                </div>
              </div>
            </div>
            
            <div className="absolute -right-6 -top-6 z-10 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-900/10 dark:bg-gray-800 dark:ring-gray-700">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="font-semibold text-blue-600 dark:text-blue-400">AI Analysis:</div>
                <div className="mt-2 space-y-1">
                  <p><span className="font-medium">Tone:</span> Excited, enthusiastic</p>
                  <p><span className="font-medium">Clarity:</span> Very clear message</p>
                  <p><span className="font-medium">Sentiment:</span> Positive</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 