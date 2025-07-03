import { biometricService } from '@/services/api/biometricService'
import { goalService } from '@/services/api/goalService'
import { moodService } from '@/services/api/moodService'
import { startOfWeek, endOfWeek, format, subDays, getDay } from 'date-fns'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// AI-Powered Pattern Analysis Engine
const PatternAnalyzer = {
  // Analyze productivity patterns by day of week
  analyzeProductivityPatterns(weeklyData, moodData) {
    const dayPatterns = {}
    
    weeklyData.forEach(day => {
      const dayOfWeek = getDay(new Date(day.date))
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dayName = dayNames[dayOfWeek]
      
      if (!dayPatterns[dayName]) {
        dayPatterns[dayName] = {
          energyScores: [],
          sleepHours: [],
          moodScores: []
        }
      }
      
      dayPatterns[dayName].energyScores.push(day.energyScore)
      dayPatterns[dayName].sleepHours.push(day.sleepHours)
      
      // Find mood data for this day
      const dayMood = moodData.find(m => 
        format(new Date(m.date), 'yyyy-MM-dd') === format(new Date(day.date), 'yyyy-MM-dd')
      )
      if (dayMood) {
        dayPatterns[dayName].moodScores.push(dayMood.value)
      }
    })
    
    // Find best performing day
    let bestDay = null
    let bestScore = 0
    
    Object.entries(dayPatterns).forEach(([day, data]) => {
      if (data.energyScores.length > 0) {
        const avgEnergy = data.energyScores.reduce((a, b) => a + b, 0) / data.energyScores.length
        const avgSleep = data.sleepHours.reduce((a, b) => a + b, 0) / data.sleepHours.length
        const compositeScore = avgEnergy + (avgSleep * 10) // Weight sleep hours
        
        if (compositeScore > bestScore) {
          bestScore = compositeScore
          bestDay = {
            day,
            avgEnergy: Math.round(avgEnergy),
            avgSleep: Math.round(avgSleep * 10) / 10,
            compositeScore: Math.round(compositeScore)
          }
        }
      }
    })
    
    return bestDay
  },

  // Analyze sleep-productivity correlation
  analyzeSleepProductivityCorrelation(weeklyData) {
    const sleepProductivity = weeklyData.map(day => ({
      sleep: day.sleepHours,
      productivity: day.energyScore
    }))
    
    // Find optimal sleep threshold
    const highProductivityDays = sleepProductivity.filter(d => d.productivity > 80)
    const lowProductivityDays = sleepProductivity.filter(d => d.productivity < 60)
    
    if (highProductivityDays.length > 0 && lowProductivityDays.length > 0) {
      const avgHighSleep = highProductivityDays.reduce((a, b) => a + b.sleep, 0) / highProductivityDays.length
      const avgLowSleep = lowProductivityDays.reduce((a, b) => a + b.sleep, 0) / lowProductivityDays.length
      
      return {
        optimalSleep: Math.round(avgHighSleep * 10) / 10,
        lowSleep: Math.round(avgLowSleep * 10) / 10,
        difference: Math.round((avgHighSleep - avgLowSleep) * 10) / 10
      }
    }
    
    return null
  },

  // Analyze mood dips and task correlation
  analyzeMoodTaskCorrelation(moodData, weeklyData) {
    const correlations = []
    
    moodData.forEach(mood => {
      const sameDay = weeklyData.find(day => 
        format(new Date(day.date), 'yyyy-MM-dd') === format(new Date(mood.date), 'yyyy-MM-dd')
      )
      
      if (sameDay && mood.value < 3) { // Mood dip
        correlations.push({
          date: mood.date,
          mood: mood.value,
          energy: sameDay.energyScore,
          sleep: sameDay.sleepHours,
          context: mood.context || 'No context'
        })
      }
    })
    
    // Find common patterns in mood dips
    const heavyTaskDays = correlations.filter(c => 
      c.context.toLowerCase().includes('task') || 
      c.context.toLowerCase().includes('work') ||
      c.context.toLowerCase().includes('busy')
    )
    
    return {
      totalMoodDips: correlations.length,
      taskRelatedDips: heavyTaskDays.length,
      avgEnergyOnMoodDips: correlations.length > 0 ? 
        Math.round(correlations.reduce((a, b) => a + b.energy, 0) / correlations.length) : 0
    }
  },

  // Analyze heart rate patterns with activities
  analyzeHeartRatePatterns(weeklyData, moodData) {
    const patterns = []
    
    weeklyData.forEach(day => {
      const dayMood = moodData.find(m => 
        format(new Date(m.date), 'yyyy-MM-dd') === format(new Date(day.date), 'yyyy-MM-dd')
      )
      
      if (dayMood && dayMood.context) {
        const context = dayMood.context.toLowerCase()
        
        if (context.includes('journal') || context.includes('meditat') || context.includes('relax')) {
          patterns.push({
            activity: 'mindfulness',
            hrv: day.hrv,
            restingHR: day.restingHR,
            mood: dayMood.value
          })
        }
        
        if (context.includes('exercise') || context.includes('workout') || context.includes('run')) {
          patterns.push({
            activity: 'exercise',
            hrv: day.hrv,
            restingHR: day.restingHR,
            mood: dayMood.value
          })
        }
      }
    })
    
    // Analyze mindfulness impact on HRV
    const mindfulnessDays = patterns.filter(p => p.activity === 'mindfulness')
    const avgMindfulnessHRV = mindfulnessDays.length > 0 ? 
      Math.round(mindfulnessDays.reduce((a, b) => a + b.hrv, 0) / mindfulnessDays.length) : 0
    
    return {
      mindfulnessImpact: avgMindfulnessHRV,
      totalMindfulnessDays: mindfulnessDays.length,
      avgMoodAfterMindfulness: mindfulnessDays.length > 0 ?
        Math.round(mindfulnessDays.reduce((a, b) => a + b.mood, 0) / mindfulnessDays.length * 10) / 10 : 0
    }
  }
}

export const insightService = {
  async getWeeklyInsights() {
    await delay(400)
    
    // Get comprehensive data for AI analysis
    const [biometricInsights, goals, moodData] = await Promise.all([
      biometricService.getWeeklyInsights(),
      goalService.getAll(),
      moodService.getRecentTrends()
    ])
    
    const { weeklyData, averages, trends } = biometricInsights
    
    // Generate AI-powered insights with pattern analysis
    const insights = await this.generateAIInsights(weeklyData, averages, trends, goals, moodData)
    
    return insights
  },

  async generateAIInsights(weeklyData, averages, trends, goals, moodData) {
    const insights = []
    const weekStart = startOfWeek(new Date())
    const weekEnd = endOfWeek(new Date())
    const period = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`
    
    // AI-Powered Productivity Pattern Analysis
    const productivityPattern = PatternAnalyzer.analyzeProductivityPatterns(weeklyData, moodData)
    if (productivityPattern) {
      insights.push({
        Id: 101,
        title: 'Productivity Pattern Discovered',
        pattern: 'productivity_pattern',
        period,
        score: productivityPattern.compositeScore,
        averages,
        trends,
        summary: `You're more productive on ${productivityPattern.day}s! Average energy: ${productivityPattern.avgEnergy}, typically after ${productivityPattern.avgSleep} hours of sleep.`,
        recommendations: [
          `Schedule important tasks on ${productivityPattern.day}s when possible`,
          `Maintain ${productivityPattern.avgSleep}+ hours of sleep before key days`,
          `Use ${productivityPattern.day}s for your most challenging work`
        ],
        goalCorrelation: this.getGoalCorrelation(goals, 'productivity')
      })
    }
    
    // Sleep-Productivity Correlation Analysis
    const sleepCorrelation = PatternAnalyzer.analyzeSleepProductivityCorrelation(weeklyData)
    if (sleepCorrelation && sleepCorrelation.difference > 0.5) {
      insights.push({
        Id: 102,
        title: 'Sleep-Productivity Connection',
        pattern: 'sleep_productivity',
        period,
        score: Math.round(sleepCorrelation.optimalSleep * 10),
        averages,
        trends,
        summary: `Your productivity peaks after ${sleepCorrelation.optimalSleep}+ hours of sleep. You're ${sleepCorrelation.difference} hours more rested on high-energy days.`,
        recommendations: [
          `Target ${sleepCorrelation.optimalSleep}+ hours of sleep for optimal performance`,
          'Track your bedtime to ensure consistent sleep duration',
          'Consider adjusting evening routine to improve sleep quality'
        ],
        goalCorrelation: this.getGoalCorrelation(goals, 'sleep')
      })
    }
    
    // Mood-Task Correlation Analysis
    const moodTaskCorrelation = PatternAnalyzer.analyzeMoodTaskCorrelation(moodData, weeklyData)
    if (moodTaskCorrelation.totalMoodDips > 0) {
      insights.push({
        Id: 103,
        title: 'Mood Dips on Task-Heavy Days',
        pattern: 'mood_task_correlation',
        period,
        score: 100 - moodTaskCorrelation.avgEnergyOnMoodDips,
        averages,
        trends,
        summary: `Mood dipped on ${moodTaskCorrelation.taskRelatedDips} out of ${moodTaskCorrelation.totalMoodDips} low-mood days, often during task-heavy periods without breaks.`,
        recommendations: [
          'Schedule regular breaks during intensive work sessions',
          'Use the Pomodoro technique for better task management',
          'Consider brief mindfulness exercises between tasks'
        ],
        goalCorrelation: this.getGoalCorrelation(goals, 'mood')
      })
    }
    
    // Heart Rate-Activity Pattern Analysis
    const hrPatterns = PatternAnalyzer.analyzeHeartRatePatterns(weeklyData, moodData)
    if (hrPatterns.mindfulnessImpact > 0) {
      insights.push({
        Id: 104,
        title: 'Heart Rate Calms After Mindfulness',
        pattern: 'hrv_mindfulness',
        period,
        score: hrPatterns.mindfulnessImpact,
        averages,
        trends,
        summary: `Your heart rate variability improves to ${hrPatterns.mindfulnessImpact}ms after journaling and mindfulness activities. Mood improved to ${hrPatterns.avgMoodAfterMindfulness}/5 on these days.`,
        recommendations: [
          'Continue daily journaling for cardiovascular benefits',
          'Add 5-10 minutes of meditation to your routine',
          'Track HRV improvements with consistent mindfulness practice'
        ],
        goalCorrelation: this.getGoalCorrelation(goals, 'mindfulness')
      })
    }
    
    // Generate traditional insights as fallback
    const traditionalInsights = this.generateInsights(weeklyData, averages, trends, goals)
    
    // Combine AI insights with traditional ones, prioritizing AI insights
    const allInsights = [...insights, ...traditionalInsights]
    
    // Return top insights based on relevance and score
    return allInsights.sort((a, b) => b.score - a.score).slice(0, 8)
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
    const productivityGoals = goals.filter(goal => goal.category === 'productivity')
    const personalGoals = goals.filter(goal => goal.category === 'personal')
    
    if (goals.length === 0) return null
    
    const correlations = {
      sleep: `Your sleep improvements are supporting your health goals. ${healthGoals.length} health goal(s) may benefit from continued sleep optimization.`,
      energy: `Higher energy levels will help you achieve your active goals. Consider focusing on your health-related objectives.`,
      consistency: `Your consistent performance creates a strong foundation for goal achievement. Keep up the momentum!`,
      optimal: `With optimal performance, you're well-positioned to make significant progress on all your goals.`,
      productivity: `Your productivity patterns can help optimize your ${productivityGoals.length} productivity goal(s). Schedule important tasks during peak performance times.`,
      sleep_productivity: `Understanding your sleep-productivity connection can boost achievement of your ${goals.length} active goal(s).`,
      mood: `Managing mood fluctuations will support progress on your ${personalGoals.length} personal development goal(s).`,
      mindfulness: `Your mindfulness practice is enhancing both physical and mental well-being, supporting ${healthGoals.length} health goal(s).`
    }
    
    return correlations[pattern] || `This pattern may impact your ${goals.length} active goal(s).`
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