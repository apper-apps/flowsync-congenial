import mockGoalData from '@/services/mockData/goalData.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const goalService = {
  async getAll() {
    await delay(300)
    return [...mockGoalData]
  },

  async getById(id) {
    await delay(200)
    return mockGoalData.find(item => item.Id === parseInt(id))
  },

  async create(data) {
    await delay(400)
    const newId = Math.max(...mockGoalData.map(item => item.Id), 0) + 1
    const newItem = { ...data, Id: newId }
    mockGoalData.push(newItem)
    return newItem
  },

  async update(id, data) {
    await delay(350)
    const index = mockGoalData.findIndex(item => item.Id === parseInt(id))
    if (index !== -1) {
      mockGoalData[index] = { ...mockGoalData[index], ...data }
      return mockGoalData[index]
    }
    throw new Error('Goal not found')
  },

  async delete(id) {
    await delay(300)
    const index = mockGoalData.findIndex(item => item.Id === parseInt(id))
    if (index !== -1) {
      const deleted = mockGoalData.splice(index, 1)[0]
      return deleted
    }
    throw new Error('Goal not found')
},

  async applyMoodGuidedAdjustments(goalId, adjustments) {
    await delay(300)
    const goal = mockGoalData.find(item => item.Id === parseInt(goalId))
    if (!goal) throw new Error('Goal not found')
    
    let updatedGoal = { ...goal }
    
    adjustments.forEach(adjustment => {
      switch (adjustment.action) {
        case 'reduce-tasks':
          const activeTasks = updatedGoal.tasks.filter(task => !task.completed)
          const tasksToSimplify = Math.ceil(activeTasks.length * (adjustment.severity === 3 ? 0.5 : 0.25))
          
          updatedGoal.tasks = updatedGoal.tasks.map(task => {
            if (!task.completed && tasksToSimplify > 0) {
              const simplifiedTitle = task.title.includes('(simplified)') 
                ? task.title 
                : `${task.title} (simplified)`
              return { ...task, title: simplifiedTitle, simplified: true }
            }
            return task
          })
          break
          
        case 'extend-deadline':
          if (updatedGoal.targetDate) {
            const currentDate = new Date(updatedGoal.targetDate)
            currentDate.setDate(currentDate.getDate() + adjustment.days)
            updatedGoal.targetDate = currentDate.toISOString().split('T')[0]
            updatedGoal.deadlineExtended = true
          }
          break
      }
    })
    
    // Update the goal
    const index = mockGoalData.findIndex(item => item.Id === parseInt(goalId))
    if (index !== -1) {
      mockGoalData[index] = updatedGoal
    }
    
    return updatedGoal
  },

  async getMoodAwareTaskSuggestions(goalId) {
    await delay(200)
    const goal = mockGoalData.find(item => item.Id === parseInt(goalId))
    if (!goal) return []
    
    // Import moodService to get burnout analysis
    const { moodService } = await import('./moodService.js')
    const burnoutAnalysis = await moodService.analyzeBurnoutRisk()
    
    const incompleteTasks = goal.tasks.filter(task => !task.completed)
    
    if (burnoutAnalysis.level >= 2) {
      // Suggest easier alternatives for high stress
      return incompleteTasks.map(task => ({
        original: task.title,
        suggestion: `Light version: ${task.title.toLowerCase()}`,
        reason: 'Adjusted for your current energy level'
      }))
    } else if (burnoutAnalysis.level === 1) {
      return [{
        original: 'Current tasks',
        suggestion: 'Take breaks between tasks',
        reason: 'Gentle pacing recommended'
      }]
    }
    
    return []
  }
}