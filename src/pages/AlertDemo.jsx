import { useState } from 'react';
import { useAlert } from '../contexts/AlertContext';

const AlertDemo = () => {
  const { 
    showSuccess,
    showError,
    showInfo,
    showWarning,
    setAlertPosition
  } = useAlert();
  
  const [selectedPosition, setSelectedPosition] = useState({
    vertical: 'top',
    horizontal: 'right'
  });
  
  const handlePositionChange = (e) => {
    const [vertical, horizontal] = e.target.value.split('-');
    setSelectedPosition({ vertical, horizontal });
    setAlertPosition(vertical, horizontal);
  };
  
  const handleShowAlert = (type, message) => {
    switch (type) {
      case 'success':
        showSuccess(message || 'This is a success message!');
        break;
      case 'error':
        showError(message || 'This is an error message!');
        break;
      case 'info':
        showInfo(message || 'This is an informational message!');
        break;
      case 'warning':
        showWarning(message || 'This is a warning message!');
        break;
      default:
        showInfo(message || 'This is a default message!');
    }
  };
  
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        <span className="gradient-text">Alert</span> System Demo
      </h1>
      
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Alert Position</h2>
        
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center">
            <input
              type="radio"
              id="top-right"
              name="position"
              value="top-right"
              checked={selectedPosition.vertical === 'top' && selectedPosition.horizontal === 'right'}
              onChange={handlePositionChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="top-right" className="ml-2 text-gray-700 dark:text-gray-300">
              Top Right
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="top-center"
              name="position"
              value="top-center"
              checked={selectedPosition.vertical === 'top' && selectedPosition.horizontal === 'center'}
              onChange={handlePositionChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="top-center" className="ml-2 text-gray-700 dark:text-gray-300">
              Top Center
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="top-left"
              name="position"
              value="top-left"
              checked={selectedPosition.vertical === 'top' && selectedPosition.horizontal === 'left'}
              onChange={handlePositionChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="top-left" className="ml-2 text-gray-700 dark:text-gray-300">
              Top Left
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="bottom-right"
              name="position"
              value="bottom-right"
              checked={selectedPosition.vertical === 'bottom' && selectedPosition.horizontal === 'right'}
              onChange={handlePositionChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="bottom-right" className="ml-2 text-gray-700 dark:text-gray-300">
              Bottom Right
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="bottom-center"
              name="position"
              value="bottom-center"
              checked={selectedPosition.vertical === 'bottom' && selectedPosition.horizontal === 'center'}
              onChange={handlePositionChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="bottom-center" className="ml-2 text-gray-700 dark:text-gray-300">
              Bottom Center
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="bottom-left"
              name="position"
              value="bottom-left"
              checked={selectedPosition.vertical === 'bottom' && selectedPosition.horizontal === 'left'}
              onChange={handlePositionChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="bottom-left" className="ml-2 text-gray-700 dark:text-gray-300">
              Bottom Left
            </label>
          </div>
        </div>
      </div>
      
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Test Alerts</h2>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => handleShowAlert('success')}
            className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-green-700"
          >
            Show Success
          </button>
          
          <button
            onClick={() => handleShowAlert('error')}
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-red-700"
          >
            Show Error
          </button>
          
          <button
            onClick={() => handleShowAlert('info')}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Show Info
          </button>
          
          <button
            onClick={() => handleShowAlert('warning')}
            className="rounded-lg bg-yellow-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-yellow-700"
          >
            Show Warning
          </button>
          
          <button
            onClick={() => {
              // Show multiple alerts in sequence
              handleShowAlert('info', 'Multiple alerts will stack properly');
              setTimeout(() => handleShowAlert('success', 'This is the second alert'), 300);
              setTimeout(() => handleShowAlert('warning', 'And a third one for good measure'), 600);
            }}
            className="sm:col-span-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-purple-700"
          >
            Show Multiple Alerts
          </button>
        </div>
      </div>
      
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Usage Guide</h2>
        
        <div className="prose max-w-none dark:prose-invert">
          <p>
            The enhanced alert system provides a flexible way to display notifications to users.
            Alerts are now properly positioned, stackable, and include a progress bar for timing.
          </p>
          
          <h3>Features:</h3>
          <ul>
            <li>Multiple alert positioning options</li>
            <li>Auto-dismiss with visual progress indicator</li>
            <li>Pause timer on hover</li>
            <li>Proper stacking behavior</li>
            <li>Animations and transitions</li>
            <li>Accessibility support</li>
          </ul>
          
          <h3>Code Example:</h3>
          <pre><code>{`
// In your component:
import { useAlert } from '../contexts/AlertContext';

const YourComponent = () => {
  const { showSuccess, showError } = useAlert();
  
  // Show a success alert
  const handleSuccess = () => {
    showSuccess('Operation completed successfully!');
  };
  
  // Show an error alert with longer duration (7 seconds)
  const handleError = () => {
    showError('Something went wrong', 7000);
  };
  
  return (
    <button onClick={handleSuccess}>
      Click Me
    </button>
  );
};
          `}</code></pre>
        </div>
      </div>
    </div>
  );
};

export default AlertDemo; 