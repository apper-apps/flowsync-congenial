import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const BiometricCard = ({ title, value, unit, icon, trend, color = 'primary' }) => {
  const getTrendIcon = () => {
    if (trend > 0) return 'TrendingUp'
    if (trend < 0) return 'TrendingDown'
    return 'Minus'
  }

  const getTrendColor = () => {
    if (trend > 0) return 'text-accent'
    if (trend < 0) return 'text-error'
    return 'text-gray-400'
  }

  const getColorClasses = () => {
    const colors = {
      primary: 'from-primary to-secondary',
      accent: 'from-accent to-emerald-600',
      warning: 'from-warning to-orange-600',
      purple: 'from-purple-500 to-pink-600'
    }
    return colors[color] || colors.primary
  }

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`w-8 h-8 bg-gradient-to-r ${getColorClasses()} rounded-lg flex items-center justify-center`}
        >
          <ApperIcon name={icon} size={16} className="text-white" />
        </motion.div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-display font-bold text-gray-900 mb-1"
          >
            {value}
            <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
          </motion.div>
          
          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}
            >
              <ApperIcon name={getTrendIcon()} size={12} />
              <span className="font-medium">
                {Math.abs(trend)}% vs yesterday
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Decorative gradient */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getColorClasses()} rounded-full opacity-10 transform translate-x-8 -translate-y-8`} />
    </Card>
  )
}

export default BiometricCard