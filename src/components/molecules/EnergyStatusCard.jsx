import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const EnergyStatusCard = ({ energyData, recommendation }) => {
  const { energyLevel, energyScore } = energyData
  
  const getEnergyColor = (level) => {
    switch (level) {
      case 'high':
        return 'from-accent to-emerald-600'
      case 'medium':
        return 'from-warning to-orange-600'
      case 'low':
        return 'from-error to-red-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getEnergyIcon = (level) => {
    switch (level) {
      case 'high':
        return 'Zap'
      case 'medium':
        return 'Battery'
      case 'low':
        return 'BatteryLow'
      default:
        return 'Battery'
    }
  }

  const getRecommendationIcon = (priority) => {
    switch (priority) {
      case 'focus':
        return 'Brain'
      case 'workout':
        return 'Dumbbell'
      case 'rest':
        return 'Moon'
      default:
        return 'Sparkles'
    }
  }

  return (
    <Card className="text-center bg-gradient-to-br from-white to-gray-50 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-bold text-gray-900">Energy Status</h3>
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
        >
          <ApperIcon name="Activity" size={20} className="text-white" />
        </motion.div>
      </div>

      {/* Energy Ring */}
      <div className="relative mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto relative"
        >
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#energyGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - energyScore / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - energyScore / 100) }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <defs>
              <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="text-primary" stopColor="currentColor" />
                <stop offset="100%" className="text-accent" stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Energy icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-8 h-8 bg-gradient-to-br ${getEnergyColor(energyLevel)} rounded-full flex items-center justify-center`}>
              <ApperIcon name={getEnergyIcon(energyLevel)} size={16} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Energy Score */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1"
        >
          {energyScore}%
        </motion.div>
        <div className="text-sm text-gray-600 capitalize font-medium">
          {energyLevel} Energy Level
        </div>
      </div>

      {/* Today's Recommendation */}
      {recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <ApperIcon name={getRecommendationIcon(recommendation.priority)} size={18} className="text-primary" />
            <span className="text-sm font-medium text-primary capitalize">
              Today's Priority: {recommendation.priority}
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {recommendation.reasoning}
          </p>
        </motion.div>
      )}
    </Card>
  )
}

export default EnergyStatusCard