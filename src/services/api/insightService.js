import { biometricService } from '@/services/api/biometricService'
import { goalService } from '@/services/api/goalService'
import { startOfWeek, endOfWeek, format } from 'date-fns'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const insightService = {
  async getWeeklyInsights() {
    await delay(400)
    
    // Get weekly biometric data and goal progress
    const [biometricInsights, goals] = await Promise.all([
      biometricService.getWeeklyInsights(),
      goalService.getAll()
    ])
    
    const { weeklyData, averages, trends } = biometricInsights
    
    // Generate insights based on patterns
    const insights = this.generateInsights(weeklyData, averages, trends, goals)
    
    return insights
  },

  generateInsights(weeklyData, averages, trends, goals) {
    const insights = []
    const weekStart = startOfWeek(new Date())
    const weekEnd = endOfWeek(new Date())
    const period = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`
    
    // Sleep Pattern Analysis
    if (trends.sleep > 5) {
      insights.push({
        Id: 1,
        title: 'Sleep Quality Improving',
        pattern: 'sleep_improvement',
        period,
        score: averages.sleepScore,
        averages,
        trends,
        summary: `Your sleep quality improved by ${Math.round(trends.sleep)} points this week. You're averaging ${averages.sleepHours} hours of sleep with a quality score of ${averages.sleepScore}.`,
        recommendations: [
          'Maintain your current bedtime routine',
          'Consider adding meditation before sleep',
          'Track what factors contribute to your best sleep nights'
        ],
        goalCorrelation: this.getGoalCorrelation(goals, 'sleep')
      })
    } else if (trends.sleep < -5) {
      insights.push({
        Id: 2,
        title: 'Sleep Recovery Needed',
        pattern: 'recovery_needed',
        period,
        score: averages.sleepScore,
        averages,
        trends,
        summary: `Sleep quality declined by ${Math.round(Math.abs(trends.sleep))} points this week. Focus on recovery to improve your ${averages.sleepScore} average score.`,
        recommendations: [
          'Establish a consistent bedtime routine',
          'Limit screen time before bed',
          'Consider earlier bedtime to increase sleep duration'
        ],
        goalCorrelation: this.getGoalCorrelation(goals, 'sleep')
      })
    }

    // Energy Pattern Analysis
    if (trends.energy > 5) {
      insights.push({
        Id: 3,
        title: 'Energy Levels Rising',
        pattern: 'energy_boost',
        period,
        score: averages.energyScore,
        averages,
        trends,
        summary: `Your energy levels increased by ${Math.round(trends.energy)} points this week. You're maintaining strong performance with an average score of ${averages.energyScore}.`,
        recommendations: [
          'Capitalize on high energy with challenging tasks',
          'Consider increasing workout intensity',
          'Use this momentum to tackle important goals'
        ],
        goalCorrelation: this.getGoalCorrelation(goals, 'energy')
      })
    } else if (trends.energy < -5) {
      insights.push({
        Id: 4,
        title: 'Energy Dip Detected',
        pattern: 'recovery_needed',
        period,
        score: averages.energyScore,
        averages,
        trends,
        summary: `Energy levels dropped by ${Math.round(Math.abs(trends.energy))} points this week. Your current average is ${averages.energyScore} - time to focus on recovery.`,
        recommendations: [
          'Prioritize rest and recovery activities',
          'Reduce high-intensity workouts temporarily',
          'Focus on stress management and relaxation'
        ],
        goalCorrelation: this.getGoalCorrelation(goals, 'energy')
      })
    }

    // Consistency Analysis
    const consistency = this.calculateConsistency(weeklyData)
    if (consistency > 0.8) {
      insights.push({
        Id: 5,
        title: 'Consistent Performance',
        pattern: 'consistent_performance',
        period,
        score: averages.energyScore,
        averages,
        trends,
        summary: `Excellent consistency this week! Your metrics show stable patterns with minimal day-to-day variation. Average energy score: ${averages.energyScore}.`,
        recommendations: [
          'Continue your current routine - it\'s working well',
          'Consider gradually increasing goals or challenges',
          'Document what\'s working to replicate success'
        ],
        goalCorrelation: this.getGoalCorrelation(goals, 'consistency')
      })
    }

    // Optimal Balance Analysis
    if (averages.sleepScore > 80 && averages.energyScore > 80 && averages.hrv > 45) {
      insights.push({
        Id: 6,
        title: 'Optimal Balance Achieved',
        pattern: 'optimal_balance',
        period,
        score: Math.round((averages.sleepScore + averages.energyScore) / 2),
        averages,
        trends,
        summary: `Outstanding week! You've achieved optimal balance with high sleep quality (${averages.sleepScore}), energy (${averages.energyScore}), and HRV (${averages.hrv}ms).`,
        recommendations: [
          'This is your peak performance zone - maintain these habits',
          'Perfect time to tackle your most challenging goals',
          'Consider sharing your routine with others'
        ],
        goalCorrelation: this.getGoalCorrelation(goals, 'optimal')
      })
    }

    // Return top insights based on priority
    return insights.sort((a, b) => b.score - a.score)
  },

  calculateConsistency(weeklyData) {
    if (weeklyData.length < 2) return 0
    
    const energyScores = weeklyData.map(d => d.energyScore)
    const mean = energyScores.reduce((sum, score) => sum + score, 0) / energyScores.length
    const variance = energyScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / energyScores.length
    const standardDeviation = Math.sqrt(variance)
    
    // Return consistency score (lower standard deviation = higher consistency)
    return Math.max(0, 1 - (standardDeviation / mean))
  },

  getGoalCorrelation(goals, pattern) {
    const healthGoals = goals.filter(goal => goal.category === 'health')
    
    if (healthGoals.length === 0) return null
    
    const correlations = {
      sleep: `Your sleep improvements are supporting your health goals. ${healthGoals.length} health goal(s) may benefit from continued sleep optimization.`,
      energy: `Higher energy levels will help you achieve your active goals. Consider focusing on your health-related objectives.`,
      consistency: `Your consistent performance creates a strong foundation for goal achievement. Keep up the momentum!`,
      optimal: `With optimal performance, you're well-positioned to make significant progress on all your goals.`
    }
    
    return correlations[pattern] || `This pattern may impact your ${healthGoals.length} health-related goal(s).`
  },

  async getAll() {
    await delay(300)
    return this.getWeeklyInsights()
  },

  async getById(id) {
    await delay(200)
    const insights = await this.getWeeklyInsights()
    return insights.find(insight => insight.Id === parseInt(id))
  },

  async create(data) {
    await delay(350)
    // Insights are generated, not created manually
    throw new Error('Insights cannot be created manually')
  },

  async update(id, data) {
    await delay(300)
    // Insights are generated, not updated manually
    throw new Error('Insights cannot be updated manually')
  },

  async delete(id) {
    await delay(250)
    // Insights are generated, not deleted manually
    throw new Error('Insights cannot be deleted manually')
  }
}