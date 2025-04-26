/* eslint-disable */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
/* eslint-enable */

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  
  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate('/');
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 dark:from-gray-900 dark:to-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10"></div>
        <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10"></div>
      </div>

      {/* 404 Display */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mb-6 -mt-8"
      >
        <div className="relative">
          {/* First 4 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative inline-block"
          >
            <div className="relative z-10 text-[5rem] font-extrabold leading-none tracking-tighter text-blue-600 drop-shadow-lg sm:text-[8rem] md:text-[10rem]">
              4
            </div>
            <div className="absolute left-1 top-1 -z-10 text-[5rem] font-extrabold leading-none tracking-tighter text-blue-300 blur-sm dark:text-blue-900 sm:text-[8rem] md:text-[10rem]">
              4
            </div>
          </motion.div>

          {/* Zero with spinning face */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative mx-1 inline-block sm:mx-2 md:mx-4"
          >
            <div className="relative z-10 text-[5rem] font-extrabold leading-none tracking-tighter text-purple-600 drop-shadow-lg sm:text-[8rem] md:text-[10rem]">
              0
            </div>
            <div className="absolute left-1 top-1 -z-10 text-[5rem] font-extrabold leading-none tracking-tighter text-purple-300 blur-sm dark:text-purple-900 sm:text-[8rem] md:text-[10rem]">
              0
            </div>
            
            <motion.div 
              className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-[2.5rem] sm:text-[4rem] md:text-[5rem]"
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              😵
            </motion.div>
          </motion.div>

          {/* Second 4 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative inline-block"
          >
            <div className="relative z-10 text-[5rem] font-extrabold leading-none tracking-tighter text-blue-600 drop-shadow-lg sm:text-[8rem] md:text-[10rem]">
              4
            </div>
            <div className="absolute left-1 top-1 -z-10 text-[5rem] font-extrabold leading-none tracking-tighter text-blue-300 blur-sm dark:text-blue-900 sm:text-[8rem] md:text-[10rem]">
              4
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center"
      >
        <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
          Oops! Page not found
        </h1>
        <p className="mb-6 text-base text-gray-600 dark:text-gray-300 md:text-lg">
          We couldn't find the page you're looking for.
        </p>
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          Redirecting to home in <span className="inline-block min-w-[2rem] rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">{countdown}</span> seconds
        </p>

        {/* Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25 dark:shadow-lg dark:hover:shadow-purple-500/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="mr-2 h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound; 