import { motion } from 'framer-motion';

const CharacterCounter = ({ current, max }) => {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = percentage > 100;

  return (
    <div className="relative mt-2 h-6">
      <div className="absolute right-0 text-sm font-medium text-gray-600 dark:text-gray-400">
        {current}/{max} characters
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          className={`h-full rounded-full ${
            isOverLimit
              ? 'bg-red-500 dark:bg-red-600'
              : isNearLimit
                ? 'bg-yellow-500 dark:bg-yellow-600'
                : 'bg-green-500 dark:bg-green-600'
          }`}
        />
      </div>
    </div>
  );
};

export default CharacterCounter; 