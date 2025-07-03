import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const TrendChart = ({ title, data, color = 'primary' }) => {
  const getColorClasses = () => {
    const colors = {
      primary: 'from-primary to-secondary',
      accent: 'from-accent to-emerald-600',
      warning: 'from-warning to-orange-600'
    }
    return colors[color] || colors.primary
  }

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-bold text-gray-900">{title}</h3>
        <ApperIcon name="TrendingUp" size={20} className="text-accent" />
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <motion.div
            key={item.date}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600 font-medium w-12">
                {item.date}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((item.value - minValue) / (maxValue - minValue)) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                  className={`h-full bg-gradient-to-r ${getColorClasses()} rounded-full`}
                />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900 w-12 text-right">
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

export default TrendChart