import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

const Alert = ({ show, message, type = ALERT_TYPES.INFO, duration = 5000, onClose, id }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    if (show && duration > 0 && !isPaused) {
      // Set up progress countdown
      const startTime = Date.now();
      const endTime = startTime + duration;
      
      const updateProgress = () => {
        const now = Date.now();
        const remaining = endTime - now;
        const calculatedProgress = (remaining / duration) * 100;
        
        if (calculatedProgress <= 0) {
          onClose && onClose();
        } else {
          setProgress(calculatedProgress);
          requestAnimationFrame(updateProgress);
        }
      };
      
      const animationFrame = requestAnimationFrame(updateProgress);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [show, duration, onClose, isPaused]);
  
  // Icon and styles based on alert type
  const getStyles = () => {
    switch (type) {
      case ALERT_TYPES.SUCCESS:
        return {
          background: 'bg-white dark:bg-gray-800',
          border: 'border-l-4 border-green-500',
          text: 'text-gray-800 dark:text-gray-100',
          iconBackground: 'bg-green-100 dark:bg-green-900/30 text-green-500',
          progressBar: 'bg-green-500',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        };
      case ALERT_TYPES.ERROR:
        return {
          background: 'bg-white dark:bg-gray-800',
          border: 'border-l-4 border-red-500',
          text: 'text-gray-800 dark:text-gray-100',
          iconBackground: 'bg-red-100 dark:bg-red-900/30 text-red-500',
          progressBar: 'bg-red-500',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      case ALERT_TYPES.WARNING:
        return {
          background: 'bg-white dark:bg-gray-800',
          border: 'border-l-4 border-yellow-500',
          text: 'text-gray-800 dark:text-gray-100',
          iconBackground: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500',
          progressBar: 'bg-yellow-500',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      case ALERT_TYPES.INFO:
      default:
        return {
          background: 'bg-white dark:bg-gray-800',
          border: 'border-l-4 border-blue-500',
          text: 'text-gray-800 dark:text-gray-100',
          iconBackground: 'bg-blue-100 dark:bg-blue-900/30 text-blue-500',
          progressBar: 'bg-blue-500',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )
        };
    }
  };
  
  const styles = getStyles();
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="alert-container relative"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          layout
          transition={{ 
            type: 'spring', 
            stiffness: 400, 
            damping: 30
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          data-alert-id={id}
        >
          <div className={`flex w-full overflow-hidden rounded-lg shadow-md ${styles.background} ${styles.border}`}>
            <div className={`flex items-center justify-center px-4 ${styles.iconBackground}`}>
              {styles.icon}
            </div>
            
            <div className="w-full p-3">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${styles.text}`}>
                  {message}
                </p>
                <button
                  onClick={onClose}
                  className="ml-2 inline-flex rounded-md bg-transparent p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 focus:outline-none dark:hover:bg-gray-700 dark:hover:text-white"
                  aria-label="Close"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 w-full bg-gray-200 dark:bg-gray-700">
                <motion.div 
                  className={`h-full ${styles.progressBar}`} 
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert; 