import mockMoodData from '@/services/mockData/moodData.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const moodService = {
  async getAll() {
    await delay(250)
    return [...mockMoodData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

async getRecentTrends() {
    await delay(300)
    const recent = mockMoodData.slice(-7)
    const trendData = recent.map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: entry.moodScore
    }))
    
    // Calculate additional metrics for energy correlation
    const averageScore = recent.reduce((sum, entry) => sum + entry.moodScore, 0) / recent.length
    const trend = recent.length > 1 ? recent[recent.length - 1].moodScore - recent[0].moodScore : 0
    
    // Return enhanced data structure
    return {
      ...trendData,
      data: trendData,
      averageScore: Math.round(averageScore * 10) / 10,
      trend: Math.round(trend * 10) / 10,
      totalEntries: recent.length
    }
  },

  async analyzeBurnoutRisk() {
    await delay(250)
    const recent = mockMoodData.slice(-7)
    if (recent.length < 3) return { risk: 'insufficient-data', level: 0 }
    
    const averageScore = recent.reduce((sum, entry) => sum + entry.moodScore, 0) / recent.length
    const recentScore = recent.slice(-3).reduce((sum, entry) => sum + entry.moodScore, 0) / 3
    const decline = averageScore - recentScore
    
    let riskLevel = 0
    let riskCategory = 'low'
    let recommendations = []
    
    if (averageScore < 3 || decline > 1.5) {
      riskLevel = 3
      riskCategory = 'high'
      recommendations = [
        'Reduce daily task load by 50%',
        'Take mindfulness breaks every 2 hours',
        'Extend milestone dates by 1-2 weeks',
        'Focus on one priority goal only'
      ]
    } else if (averageScore < 4 || decline > 1) {
      riskLevel = 2
      riskCategory = 'moderate'
      recommendations = [
        'Reduce daily task load by 25%',
        'Add 15-minute mindfulness sessions',
        'Extend milestone dates by 3-5 days',
        'Simplify complex tasks'
      ]
    } else if (averageScore < 5 || decline > 0.5) {
      riskLevel = 1
      riskCategory = 'mild'
      recommendations = [
        'Take regular breaks between tasks',
        'Practice 5-minute breathing exercises',
        'Consider lighter alternatives for difficult tasks'
      ]
    }
    
    return {
      risk: riskCategory,
      level: riskLevel,
      averageScore: Math.round(averageScore * 10) / 10,
      recentScore: Math.round(recentScore * 10) / 10,
      decline: Math.round(decline * 10) / 10,
      recommendations
    }
  },

  async getGoalAdjustmentSuggestions(goalData) {
    await delay(200)
    const burnoutAnalysis = await this.analyzeBurnoutRisk()
    
    if (burnoutAnalysis.risk === 'insufficient-data') {
      return { adjustments: [], message: 'Keep tracking your mood for personalized suggestions!' }
    }
    
    const adjustments = []
    let message = ''
    
    if (burnoutAnalysis.level >= 2) {
      // High/Moderate burnout - significant adjustments
      adjustments.push({
        type: 'task-reduction',
        description: `Reduce today's tasks by ${burnoutAnalysis.level === 3 ? '50%' : '25%'}`,
        action: 'reduce-tasks',
        severity: burnoutAnalysis.level
      })
      
      adjustments.push({
        type: 'mindfulness',
        description: 'Take a mindfulness break',
        action: 'show-mindfulness',
        duration: burnoutAnalysis.level === 3 ? 10 : 5
      })
      
      if (goalData?.targetDate) {
        const extensionDays = burnoutAnalysis.level === 3 ? 10 : 5
        adjustments.push({
          type: 'timeline',
          description: `Extend deadline by ${extensionDays} days`,
          action: 'extend-deadline',
          days: extensionDays
        })
      }
      
      message = burnoutAnalysis.level === 3 
        ? "I notice you might be feeling overwhelmed. Let's slow down and be kind to yourself."
        : "Your energy seems low lately. Let's adjust your goals to match your current capacity."
        
    } else if (burnoutAnalysis.level === 1) {
      // Mild stress - gentle suggestions
      adjustments.push({
        type: 'mindfulness',
        description: 'Take a short breathing break',
        action: 'show-breathing',
        duration: 3
      })
      
      message = "You're doing great! Just a gentle reminder to take care of yourself."
    } else {
      // Good mood - encouragement
      message = "Your energy looks good! Keep up the momentum while staying balanced."
    }
    
    return { adjustments, message, burnoutRisk: burnoutAnalysis }
  },

  async getById(id) {
    await delay(200)
    return mockMoodData.find(item => item.Id === parseInt(id))
  },

  async create(data) {
    await delay(350)
    const newId = Math.max(...mockMoodData.map(item => item.Id), 0) + 1
    const newItem = { ...data, Id: newId }
    mockMoodData.push(newItem)
    return newItem
  },

  async update(id, data) {
    await delay(300)
    const index = mockMoodData.findIndex(item => item.Id === parseInt(id))
    if (index !== -1) {
      mockMoodData[index] = { ...mockMoodData[index], ...data }
      return mockMoodData[index]
    }
    throw new Error('Mood entry not found')
  },

  async delete(id) {
    await delay(250)
    const index = mockMoodData.findIndex(item => item.Id === parseInt(id))
    if (index !== -1) {
      const deleted = mockMoodData.splice(index, 1)[0]
      return deleted
    }
    throw new Error('Mood entry not found')
  }
}