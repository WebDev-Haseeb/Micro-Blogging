import { createContext, useContext, useState, useEffect } from 'react';
import Alert, { ALERT_TYPES } from '../components/Alert';
import { motion, AnimatePresence } from 'framer-motion';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [position, setPosition] = useState({
    vertical: 'top', // 'top' or 'bottom'
    horizontal: 'right' // 'left', 'center', or 'right'
  });

  const addAlert = (message, type = ALERT_TYPES.INFO, duration = 5000) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setAlerts(prev => [...prev, { id, message, type, duration, createdAt: Date.now() }]);
    return id;
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  // Convenience methods for different alert types
  const showSuccess = (message, duration = 5000) => addAlert(message, ALERT_TYPES.SUCCESS, duration);
  const showError = (message, duration = 7000) => addAlert(message, ALERT_TYPES.ERROR, duration);
  const showInfo = (message, duration = 5000) => addAlert(message, ALERT_TYPES.INFO, duration);
  const showWarning = (message, duration = 6000) => addAlert(message, ALERT_TYPES.WARNING, duration);

  // Change alert position programmatically
  const setAlertPosition = (vertical, horizontal) => {
    setPosition({ vertical, horizontal });
  };

  // Get position classes based on current position settings
  const getPositionClasses = () => {
    let classes = 'fixed z-50 p-4 pointer-events-none';
    
    // Vertical positioning
    if (position.vertical === 'top') {
      classes += ' top-0 mt-16';
    } else {
      classes += ' bottom-0';
    }
    
    // Horizontal positioning
    if (position.horizontal === 'left') {
      classes += ' left-0';
    } else if (position.horizontal === 'center') {
      classes += ' left-1/2 transform -translate-x-1/2';
    } else {
      classes += ' right-0';
    }
    
    return classes;
  };

  // Sort alerts so newest are on top if at bottom position, oldest on top if at top position
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (position.vertical === 'bottom') {
      return b.createdAt - a.createdAt; // Newest on top for bottom position
    }
    return a.createdAt - b.createdAt; // Oldest on top for top position
  });

  return (
    <AlertContext.Provider 
      value={{ 
        addAlert, 
        removeAlert,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        setAlertPosition
      }}
    >
      {children}
      
      {/* Container for all alerts */}
      <div className={getPositionClasses()}>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <AnimatePresence>
            {sortedAlerts.map((alert, index) => (
              <motion.div 
                key={alert.id}
                layout
                className="pointer-events-auto"
                initial={{ opacity: 0, y: position.vertical === 'top' ? -20 : 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 400, 
                  damping: 30,
                  delay: index * 0.05 // Stagger entrances
                }}
              >
                <Alert
                  id={alert.id}
                  show={true}
                  message={alert.message}
                  type={alert.type}
                  duration={alert.duration}
                  onClose={() => removeAlert(alert.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </AlertContext.Provider>
  );
};

export default AlertProvider; 