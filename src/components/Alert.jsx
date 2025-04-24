import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

const Alert = ({ show, message, type = ALERT_TYPES.INFO, duration = 5000, onClose }) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);
  
  // Background and text colors based on alert type
  const getStyles = () => {
    switch (type) {
      case ALERT_TYPES.SUCCESS:
        return {
          background: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-800 dark:text-green-300',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        };
      case ALERT_TYPES.ERROR:
        return {
          background: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-800 dark:text-red-300',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      case ALERT_TYPES.WARNING:
        return {
          background: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-800 dark:text-yellow-300',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      case ALERT_TYPES.INFO:
      default:
        return {
          background: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-800 dark:text-blue-300',
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
        <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
          <motion.div
            className={`flex items-center rounded-lg p-4 shadow-lg ${styles.background} ${styles.text}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 30 
            }}
          >
            <div className="mr-3 flex-shrink-0">
              {styles.icon}
            </div>
            <div className="flex-1 text-sm font-medium">{message}</div>
            <button
              onClick={onClose}
              className="ml-4 inline-flex flex-shrink-0 items-center justify-center rounded-lg p-1.5 text-current hover:bg-opacity-20 hover:bg-white focus:outline-none"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Alert; 