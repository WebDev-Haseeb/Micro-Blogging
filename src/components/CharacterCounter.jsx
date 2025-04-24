import { motion } from 'framer-motion';

const CharacterCounter = ({ current, max }) => {
  const percentage = (current / max) * 100;
  const isNearLimit = current > 250 && current <= 280; 
  const isCloseToLimit = current > 280 && current <= max;
  const isOverLimit = current > max;

  // Color based on character count
  const getBarColor = () => {
    if (isOverLimit) return 'bg-red-500 dark:bg-red-600';
    if (isCloseToLimit) return 'bg-red-500 dark:bg-red-600';
    if (isNearLimit) return 'bg-yellow-500 dark:bg-yellow-600';
    return 'bg-blue-500 dark:bg-blue-600';
  };

  // Text color based on character count
  const getTextColor = () => {
    if (isOverLimit) return 'text-red-600 dark:text-red-400';
    if (isCloseToLimit) return 'text-red-600 dark:text-red-400';
    if (isNearLimit) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between px-1">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 pl-1">
          {isOverLimit ? 'Character limit exceeded' : 'Character count'}
        </div>
        <div className={`text-sm font-medium ${getTextColor()} pr-1`}>
          {current}/{max}
        </div>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          className={`h-full rounded-full ${getBarColor()}`}
        />
      </div>
    </div>
  );
};

export default CharacterCounter; 