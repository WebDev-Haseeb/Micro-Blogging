import { createContext, useContext, useState } from 'react';
import Alert, { ALERT_TYPES } from '../components/Alert';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (message, type = ALERT_TYPES.INFO, duration = 5000) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  // Convenience methods for different alert types
  const showSuccess = (message, duration) => addAlert(message, ALERT_TYPES.SUCCESS, duration);
  const showError = (message, duration) => addAlert(message, ALERT_TYPES.ERROR, duration);
  const showInfo = (message, duration) => addAlert(message, ALERT_TYPES.INFO, duration);
  const showWarning = (message, duration) => addAlert(message, ALERT_TYPES.WARNING, duration);

  return (
    <AlertContext.Provider 
      value={{ 
        addAlert, 
        removeAlert,
        showSuccess,
        showError,
        showInfo,
        showWarning
      }}
    >
      {children}
      
      {/* Render all active alerts */}
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          show={true}
          message={alert.message}
          type={alert.type}
          duration={alert.duration}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </AlertContext.Provider>
  );
};

export default AlertProvider; 