import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const GoalCard = ({ goal, onComplete, onEdit, moodSuggestions }) => {
  const handleApplyAdjustment = (adjustment) => {
    // Apply mood-based adjustment logic
    console.log('Applying adjustment:', adjustment);
    // This would typically call a parent function or dispatch an action
    // For now, we'll just log the adjustment
  };

  const getCategoryColor = (category) => {
    const colors = {
      health: 'from-accent to-emerald-600',
      work: 'from-primary to-secondary',
      personal: 'from-purple-500 to-pink-600'
    }
    return colors[category] || colors.personal
  }

  const getCategoryIcon = (category) => {
    const icons = {
      health: 'Heart',
      work: 'Briefcase',
      personal: 'User'
    }
    return icons[category] || 'Target'
  }

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-r ${getCategoryColor(goal.category)} rounded-xl flex items-center justify-center`}>
            <ApperIcon name={getCategoryIcon(goal.category)} size={18} className="text-white" />
          </div>
          <div>
            <h4 className="font-display font-bold text-gray-900">{goal.title}</h4>
            <p className="text-sm text-gray-600 capitalize">{goal.category}</p>
          </div>
        </div>
        
        <button
          onClick={() => onEdit(goal)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name="MoreVertical" size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goal.progress}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`h-2 bg-gradient-to-r ${getCategoryColor(goal.category)} rounded-full`}
          />
        </div>
      </div>

      {/* Today's Tasks */}
      {goal.tasks && goal.tasks.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">Today's Tasks</h5>
          {goal.tasks.slice(0, 3).map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                task.completed 
                  ? 'bg-accent/10 border-accent/20 text-accent' 
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <button
                onClick={() => onComplete(task.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  task.completed 
                    ? 'bg-accent border-accent' 
                    : 'border-gray-300 hover:border-accent'
                }`}
              >
                {task.completed && (
                  <ApperIcon name="Check" size={12} className="text-white" />
                )}
              </button>
              <span className={`flex-1 text-sm ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </span>
            </motion.div>
          ))}
</div>
      )}

      {/* Mood-Guided Suggestions */}
      {moodSuggestions?.adjustments?.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h6 className="text-xs font-medium text-gray-600">Suggested Adjustments</h6>
            <ApperIcon name="Brain" size={14} className="text-blue-500" />
          </div>
          
          {moodSuggestions.message && (
            <p className="text-xs text-gray-600 mb-2 italic">
              {moodSuggestions.message}
            </p>
          )}
          
          {moodSuggestions.adjustments.slice(0, 2).map((adjustment, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleApplyAdjustment(adjustment)}
              className="w-full text-left p-2 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={
                    adjustment.type === 'mindfulness' ? 'Heart' :
                    adjustment.type === 'task-reduction' ? 'Minus' :
                    adjustment.type === 'timeline' ? 'Calendar' : 'Settings'
                  } 
                  size={12} 
                  className="text-blue-600" 
                />
                <span className="text-xs text-blue-800">{adjustment.description}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </Card>
  )
}

export default GoalCard