import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = "No data available", 
  message = "Get started by adding your first item.", 
  icon = "Inbox",
  actionLabel = "Get Started",
  onAction,
  type = "general"
}) => {
  const getEmptyState = () => {
    switch (type) {
      case 'goals':
        return {
          icon: 'Target',
          title: 'No goals set yet',
          message: 'Create your first goal to start tracking your progress and building better habits.',
          actionLabel: 'Add Your First Goal',
          gradient: 'from-blue-500 to-purple-600'
        }
      case 'journal':
        return {
          icon: 'BookOpen',
          title: 'No journal entries',
          message: 'Start tracking your mood and energy levels to unlock personalized insights.',
          actionLabel: 'Log Your First Entry',
          gradient: 'from-green-500 to-teal-600'
        }
      case 'insights':
        return {
          icon: 'BarChart3',
          title: 'Not enough data for insights',
          message: 'Keep logging your mood and completing goals to see your progress patterns.',
          actionLabel: 'View Dashboard',
          gradient: 'from-purple-500 to-pink-600'
        }
      case 'search':
        return {
          icon: 'Search',
          title: 'No results found',
          message: 'Try adjusting your search terms or filters to find what you\'re looking for.',
          actionLabel: 'Clear Search',
          gradient: 'from-gray-500 to-gray-600'
        }
      default:
        return {
          icon,
          title,
          message,
          actionLabel,
          gradient: 'from-indigo-500 to-purple-600'
        }
    }
  }

  const emptyState = getEmptyState()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className={`w-20 h-20 bg-gradient-to-br ${emptyState.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-medium`}
      >
        <ApperIcon name={emptyState.icon} size={32} className="text-white" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-display font-bold text-gray-900 mb-3"
      >
        {emptyState.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-8 max-w-md leading-relaxed"
      >
        {emptyState.message}
      </motion.p>

      {onAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onAction}
            variant="primary"
            className="px-8 py-3"
          >
            <ApperIcon name="Plus" size={18} className="mr-2" />
            {emptyState.actionLabel}
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center space-x-8 text-sm text-gray-500"
      >
        <div className="flex items-center space-x-2">
          <ApperIcon name="Zap" size={16} className="text-primary" />
          <span>Smart recommendations</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="TrendingUp" size={16} className="text-accent" />
          <span>Progress tracking</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Heart" size={16} className="text-secondary" />
          <span>Wellness insights</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Empty