import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const EnergyStatusCard = ({ energyData, recommendation, energyBreakdown }) => {
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

  const getFactorIcon = (factor) => {
    switch (factor) {
      case 'sleep':
        return 'Moon'
      case 'hrv':
        return 'Heart'
      case 'mood':
        return 'Smile'
      default:
        return 'Activity'
    }
  }

  const getFactorColor = (impact) => {
    if (impact > 5) return 'from-accent to-emerald-600'
    if (impact > 0) return 'from-primary to-blue-600'
    if (impact > -5) return 'from-warning to-orange-600'
    return 'from-error to-red-600'
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

      {/* Energy Factor Breakdown */}
      {energyBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">
            Contributing Factors
          </h4>
          
          <div className="space-y-3">
            {/* Sleep Quality Factor */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${getFactorColor(energyBreakdown.sleep.impact)} rounded-full flex items-center justify-center`}>
                  <ApperIcon name={getFactorIcon('sleep')} size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Sleep Quality</div>
                  <div className="text-xs text-gray-600">{energyBreakdown.sleep.score}/100</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{energyBreakdown.sleep.contribution}%</div>
                <div className="text-xs text-gray-600">
                  {energyBreakdown.sleep.impact > 0 ? '+' : ''}{energyBreakdown.sleep.impact}
                </div>
              </div>
            </div>

            {/* HRV Factor */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${getFactorColor(energyBreakdown.hrv.impact)} rounded-full flex items-center justify-center`}>
                  <ApperIcon name={getFactorIcon('hrv')} size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Heart Rate Variability</div>
                  <div className="text-xs text-gray-600">{energyBreakdown.hrv.score}ms</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{energyBreakdown.hrv.contribution}%</div>
                <div className="text-xs text-gray-600">
                  {energyBreakdown.hrv.impact > 0 ? '+' : ''}{energyBreakdown.hrv.impact}
                </div>
              </div>
            </div>

            {/* Recent Mood Factor */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${getFactorColor(energyBreakdown.mood.impact)} rounded-full flex items-center justify-center`}>
                  <ApperIcon name={getFactorIcon('mood')} size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Recent Mood</div>
                  <div className="text-xs text-gray-600">{energyBreakdown.mood.score}/5 avg</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{energyBreakdown.mood.contribution}%</div>
                <div className="text-xs text-gray-600">
                  {energyBreakdown.mood.impact > 0 ? '+' : ''}{energyBreakdown.mood.impact}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="text-xs text-gray-500">
              Based on recent patterns and correlations
            </div>
          </div>
        </motion.div>
      )}
    </Card>
}

export default EnergyStatusCard