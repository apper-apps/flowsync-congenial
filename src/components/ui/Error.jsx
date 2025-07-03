import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading your data. Please try again.", 
  onRetry,
  type = "general"
}) => {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return 'WifiOff'
      case 'data':
        return 'AlertTriangle'
      case 'permission':
        return 'Shield'
      default:
        return 'AlertCircle'
    }
  }

  const getGradient = () => {
    switch (type) {
      case 'network':
        return 'from-blue-500 to-purple-600'
      case 'data':
        return 'from-orange-500 to-red-600'
      case 'permission':
        return 'from-purple-500 to-pink-600'
      default:
        return 'from-red-500 to-orange-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className={`w-16 h-16 bg-gradient-to-br ${getGradient()} rounded-full flex items-center justify-center mb-6 shadow-medium`}
      >
        <ApperIcon name={getIcon()} size={28} className="text-white" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-display font-bold text-gray-900 mb-3"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-8 max-w-md leading-relaxed"
      >
        {message}
      </motion.p>

      {onRetry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onRetry}
            variant="primary"
            className="px-6 py-3"
          >
            <ApperIcon name="RotateCcw" size={18} className="mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-xs text-gray-500"
      >
        If the problem persists, please check your connection and try again.
      </motion.div>
    </motion.div>
  )
}

export default Error