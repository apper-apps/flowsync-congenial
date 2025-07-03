import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const InsightCard = ({ insight }) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) return { icon: 'TrendingUp', color: 'text-green-500' }
    if (trend < 0) return { icon: 'TrendingDown', color: 'text-red-500' }
    return { icon: 'Minus', color: 'text-gray-500' }
  }

  const getPatternIcon = (pattern) => {
    const iconMap = {
      'sleep_improvement': 'Moon',
      'energy_boost': 'Zap',
      'consistent_performance': 'Target',
      'recovery_needed': 'Shield',
      'optimal_balance': 'Balance'
    }
    return iconMap[pattern] || 'BarChart3'
  }

  const getPatternColor = (pattern) => {
    const colorMap = {
      'sleep_improvement': 'from-purple-500 to-purple-600',
      'energy_boost': 'from-yellow-500 to-orange-500',
      'consistent_performance': 'from-green-500 to-emerald-500',
      'recovery_needed': 'from-red-500 to-pink-500',
      'optimal_balance': 'from-blue-500 to-indigo-500'
    }
    return colorMap[pattern] || 'from-gray-500 to-gray-600'
  }

  const sleepTrend = getTrendIcon(insight.trends.sleep)
  const energyTrend = getTrendIcon(insight.trends.energy)

  return (
    <Card className="h-full" hover gradient>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPatternColor(insight.pattern)} flex items-center justify-center`}>
              <ApperIcon name={getPatternIcon(insight.pattern)} size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-lg">
                {insight.title}
              </h3>
              <p className="text-sm text-gray-500">
                {insight.period}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {insight.score}
              </div>
              <div className="text-xs text-gray-500">
                Weekly Score
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Moon" size={16} className="text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Sleep</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold text-gray-900">
                  {insight.averages.sleepScore}
                </span>
                <ApperIcon name={sleepTrend.icon} size={14} className={sleepTrend.color} />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Zap" size={16} className="text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Energy</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold text-gray-900">
                  {insight.averages.energyScore}
                </span>
                <ApperIcon name={energyTrend.icon} size={14} className={energyTrend.color} />
              </div>
            </div>
          </div>
        </div>

        {/* Insight Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {insight.summary}
          </p>
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <ApperIcon name="Lightbulb" size={16} className="text-amber-500" />
            <span className="text-sm font-medium text-gray-700">Recommendations</span>
          </div>
          <div className="space-y-1">
            {insight.recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Goal Correlation */}
        {insight.goalCorrelation && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Target" size={16} className="text-green-500" />
              <span className="text-sm font-medium text-gray-700">Goal Impact</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {insight.goalCorrelation}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default InsightCard