import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import GoalCard from "@/components/molecules/GoalCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { goalTemplateService } from "@/services/api/goalTemplateService";
import { goalService } from "@/services/api/goalService";

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
const [showAddModal, setShowAddModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templateFilter, setTemplateFilter] = useState('all')
  const [templates, setTemplates] = useState([])
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'personal',
    targetDate: '',
    tasks: []
  })

  const categories = [
    { value: 'health', label: 'Health & Fitness', icon: 'Heart', color: 'from-accent to-emerald-600' },
    { value: 'work', label: 'Work & Career', icon: 'Briefcase', color: 'from-primary to-secondary' },
    { value: 'personal', label: 'Personal Growth', icon: 'User', color: 'from-purple-500 to-pink-600' }
  ]

useEffect(() => {
    loadGoals()
    loadTemplates()
  }, [])

  const loadGoals = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await goalService.getAll()
      setGoals(data)
    } catch (err) {
      setError('Failed to load goals')
      console.error('Goals error:', err)
    } finally {
      setLoading(false)
    }
}

  const loadTemplates = async () => {
    try {
      setTemplatesLoading(true)
      const data = await goalTemplateService.getAll()
      setTemplates(data)
    } catch (err) {
      console.error('Templates error:', err)
    } finally {
      setTemplatesLoading(false)
    }
  }

  const handleUseTemplate = (template) => {
    setNewGoal({
      title: template.title,
      category: template.category,
      targetDate: '',
      tasks: template.tasks
    })
    setShowTemplateModal(false)
    setShowAddModal(true)
  }

  const filteredTemplates = templateFilter === 'all' 
    ? templates 
    : templates.filter(t => t.category === templateFilter)

  const handleAddGoal = async (e) => {
    e.preventDefault()
    if (!newGoal.title.trim()) {
      toast.error('Please enter a goal title')
      return
    }

    try {
      const goalData = {
        ...newGoal,
        progress: 0,
        tasks: [
          { id: 1, title: 'Get started', completed: false },
          { id: 2, title: 'Make progress', completed: false },
          { id: 3, title: 'Achieve milestone', completed: false }
        ]
      }

      await goalService.create(goalData)
      await loadGoals()
      setShowAddModal(false)
      setNewGoal({ title: '', category: 'personal', targetDate: '', tasks: [] })
      toast.success('Goal added successfully!')
    } catch (err) {
      toast.error('Failed to add goal')
      console.error('Add goal error:', err)
    }
  }

  const handleTaskComplete = async (goalId, taskId) => {
    try {
      const goal = goals.find(g => g.Id === goalId)
      if (!goal) return

      const updatedTasks = goal.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )

      const completedTasks = updatedTasks.filter(task => task.completed).length
      const newProgress = Math.round((completedTasks / updatedTasks.length) * 100)

      const updatedGoal = {
        ...goal,
        tasks: updatedTasks,
        progress: newProgress
      }

      await goalService.update(goalId, updatedGoal)
      setGoals(goals.map(g => g.Id === goalId ? updatedGoal : g))
      toast.success('Task updated successfully!')
    } catch (err) {
      toast.error('Failed to update task')
      console.error('Task update error:', err)
    }
  }

  const handleGoalEdit = (goal) => {
    toast.info('Goal editing coming soon!')
  }

  const handleDeleteGoal = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      await goalService.delete(goalId)
      setGoals(goals.filter(g => g.Id !== goalId))
      toast.success('Goal deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete goal')
      console.error('Delete goal error:', err)
    }
  }

  if (loading) {
    return <Loading type="list" />
  }

  if (error) {
    return (
      <Error
        title="Goals Error"
        message={error}
        onRetry={loadGoals}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Goals & Progress
          </h1>
          <p className="text-lg text-gray-600">
            Track your goals and adapt tasks to your energy levels
          </p>
</div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowTemplateModal(true)}
            variant="secondary"
            className="px-6 py-3"
          >
            <ApperIcon name="BookOpen" size={18} className="mr-2" />
            Browse Templates
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            variant="primary"
            className="px-6 py-3"
          >
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Add Goal
          </Button>
        </div>
      </div>

      {/* Goals Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Goals</p>
              <p className="text-2xl font-display font-bold text-gray-900">
                {goals.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="Target" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-display font-bold text-gray-900">
                {goals.filter(g => g.progress === 100).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-accent to-emerald-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Progress</p>
              <p className="text-2xl font-display font-bold text-gray-900">
                {goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Goals List */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
<GoalCard
                goal={goal}
                onComplete={(taskId) => handleTaskComplete(goal.Id, taskId)}
                onEdit={handleGoalEdit}
                onDelete={() => handleDeleteGoal(goal.Id)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <Empty 
          type="goals"
          onAction={() => setShowAddModal(true)}
        />
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-gray-900">
                Add New Goal
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <Input
                label="Goal Title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="Enter your goal..."
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.value}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        newGoal.category === category.value
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={newGoal.category === category.value}
                        onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                        <ApperIcon name={category.icon} size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Input
                label="Target Date"
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Add Goal
                </Button>
              </div>
            </form>
          </motion.div>
</div>
      )}

      {/* Template Gallery Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-display font-bold text-gray-900">
                Goal Templates
              </h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Template Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'health', 'work', 'personal'].map((filter) => (
                  <Button
                    key={filter}
                    onClick={() => setTemplateFilter(filter)}
                    variant={templateFilter === filter ? 'primary' : 'secondary'}
                    className="px-4 py-2 text-sm"
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
                {templatesLoading ? (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="text-gray-500">Loading templates...</div>
                  </div>
                ) : filteredTemplates.length === 0 ? (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="text-gray-500">No templates found</div>
                  </div>
                ) : (
                  filteredTemplates.map((template) => (
                    <motion.div
                      key={template.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${categories.find(c => c.value === template.category)?.color || 'from-gray-400 to-gray-600'} rounded-lg flex items-center justify-center`}>
                          <ApperIcon 
                            name={categories.find(c => c.value === template.category)?.icon || 'Target'} 
                            size={20} 
                            className="text-white" 
                          />
                        </div>
                        <Button
                          onClick={() => handleUseTemplate(template)}
                          variant="primary"
                          size="sm"
                          className="px-3 py-1 text-xs"
                        >
                          Use Template
                        </Button>
                      </div>
                      
                      <h4 className="font-display font-bold text-gray-900 mb-2">
                        {template.title}
                      </h4>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 mb-2">
                          {template.tasks.length} tasks included
                        </div>
                        {template.tasks.slice(0, 3).map((task, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-600">
                            <ApperIcon name="Check" size={12} className="mr-2 text-gray-400" />
                            {task.title}
                          </div>
                        ))}
                        {template.tasks.length > 3 && (
                          <div className="text-xs text-gray-500 mt-1">
                            +{template.tasks.length - 3} more tasks
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Goals