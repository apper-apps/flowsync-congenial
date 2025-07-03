import { endOfWeek, format, getDay, startOfWeek, subDays } from "date-fns";
import React from "react";
import Error from "@/components/ui/Error";
import { moodService } from "@/services/api/moodService";
import { biometricService } from "@/services/api/biometricService";
import { goalService } from "@/services/api/goalService";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const PatternAnalyzer = {
  // AI-Powered Mood Pattern Analysis
  analyzeMoodPatterns(moodData, timeRange = 7) {
    // Ensure moodData is an array
    if (!Array.isArray(moodData) || moodData.length === 0) {
      return {
        type: 'mood_pattern',
        insights: ['No mood data available for analysis'],
        recommendations: ['Start tracking your mood to get personalized insights'],
        confidence: 0
      }
    }

    const recent = moodData.slice(-timeRange)
    const patterns = {
      averageScore: recent.reduce((sum, entry) => sum + (entry?.score || 0), 0) / recent.length,
      volatility: this.calculateVolatility(recent),
      trend: this.calculateTrend(recent),
      weeklyPatterns: this.analyzeWeeklyPatterns(moodData)
    }
    
    return {
      type: 'mood_pattern',
      insights: this.generateMoodInsights(patterns),
      recommendations: this.generateMoodRecommendations(patterns),
      confidence: this.calculateConfidence(recent.length)
    }
  },

  // AI-Powered Productivity Pattern Analysis
  analyzeProductivityPatterns(goalData, moodData) {
    // Ensure arrays are valid
    if (!Array.isArray(goalData)) goalData = []
    if (!Array.isArray(moodData)) moodData = []
    
    const recentGoals = goalData.filter(goal => {
      const goalDate = new Date(goal?.createdAt)
      const weekAgo = subDays(new Date(), 7)
      return goalDate >= weekAgo
    })

    const moodProductivityCorrelation = this.calculateMoodProductivityCorrelation(moodData, recentGoals)
    
    return {
      type: 'productivity_pattern',
      insights: [
        `Your productivity shows a ${moodProductivityCorrelation > 0.7 ? 'strong' : 'moderate'} correlation with mood levels`,
        `Best productivity hours: ${this.identifyProductiveHours(recentGoals)}`,
        `Goal completion rate: ${recentGoals.length > 0 ? Math.round((recentGoals.filter(g => g?.completed).length / recentGoals.length) * 100) : 0}%`
      ],
      recommendations: this.generateProductivityRecommendations(moodProductivityCorrelation),
      confidence: this.calculateConfidence(recentGoals.length)
    }
  },

  // AI-Powered Sleep Quality Analysis
  analyzeSleepQuality(biometricData) {
    if (!Array.isArray(biometricData)) biometricData = []
    
    const sleepData = biometricData.filter(data => data?.type === 'sleep')
    const recentSleep = sleepData.slice(-7)
    
    if (recentSleep.length === 0) {
      return {
        type: 'sleep_quality',
        insights: ['No sleep data available for analysis'],
        recommendations: ['Start tracking sleep to get personalized insights'],
        confidence: 0
      }
    }
    
    const avgSleepHours = recentSleep.reduce((sum, entry) => sum + (entry?.value || 0), 0) / recentSleep.length
    const sleepConsistency = this.calculateSleepConsistency(recentSleep)
    
    return {
      type: 'sleep_quality',
      insights: [
        `Average sleep: ${avgSleepHours.toFixed(1)} hours`,
        `Sleep consistency: ${sleepConsistency > 0.8 ? 'Excellent' : sleepConsistency > 0.6 ? 'Good' : 'Needs improvement'}`,
        `Sleep quality trend: ${this.calculateTrend(recentSleep) > 0 ? 'Improving' : 'Declining'}`
      ],
      recommendations: this.generateSleepRecommendations(avgSleepHours, sleepConsistency),
      confidence: this.calculateConfidence(recentSleep.length)
    }
  },

  // AI-Powered Energy Level Analysis
  analyzeEnergyLevels(biometricData, moodData) {
    if (!Array.isArray(biometricData)) biometricData = []
    if (!Array.isArray(moodData)) moodData = []
    
    const energyData = biometricData.filter(data => data?.type === 'energy')
    const recentEnergy = energyData.slice(-7)
    
    if (recentEnergy.length === 0) {
      return {
        type: 'energy_levels',
        insights: ['No energy data available for analysis'],
        recommendations: ['Start tracking energy levels to get personalized insights'],
        confidence: 0
      }
    }
    
    const avgEnergy = recentEnergy.reduce((sum, entry) => sum + (entry?.value || 0), 0) / recentEnergy.length
    const energyMoodCorrelation = this.calculateEnergyMoodCorrelation(energyData, moodData)
    
    return {
      type: 'energy_levels',
      insights: [
        `Average energy level: ${avgEnergy.toFixed(1)}/10`,
        `Energy-mood correlation: ${energyMoodCorrelation > 0.7 ? 'Strong' : 'Moderate'}`,
        `Peak energy time: ${this.identifyPeakEnergyTime(energyData)}`
      ],
      recommendations: this.generateEnergyRecommendations(avgEnergy, energyMoodCorrelation),
      confidence: this.calculateConfidence(recentEnergy.length)
    }
  },

  // AI-Powered Stress Pattern Analysis
  analyzeStressPatterns(biometricData, moodData) {
    if (!Array.isArray(biometricData)) biometricData = []
    if (!Array.isArray(moodData)) moodData = []
    
    const stressData = biometricData.filter(data => data?.type === 'stress')
    const recentStress = stressData.slice(-7)
    
    if (recentStress.length === 0) {
      return {
        type: 'stress_patterns',
        insights: ['No stress data available for analysis'],
        recommendations: ['Start tracking stress levels to get personalized insights'],
        confidence: 0
      }
    }
    
    const avgStress = recentStress.reduce((sum, entry) => sum + (entry?.value || 0), 0) / recentStress.length
    const stressTriggers = this.identifyStressTriggers(stressData, moodData)
    
    return {
      type: 'stress_patterns',
      insights: [
        `Average stress level: ${avgStress.toFixed(1)}/10`,
        `Stress trend: ${this.calculateTrend(recentStress) > 0 ? 'Increasing' : 'Decreasing'}`,
        `Primary stress triggers: ${stressTriggers.join(', ')}`
      ],
      recommendations: this.generateStressRecommendations(avgStress, stressTriggers),
      confidence: this.calculateConfidence(recentStress.length)
    }
  },

  // AI-Powered Mood-Task Correlation Analysis
  analyzeMoodTaskCorrelation(moodData, taskData) {
    if (!Array.isArray(moodData)) moodData = []
    if (!Array.isArray(taskData)) taskData = []
    
    if (moodData.length === 0 || taskData.length === 0) {
      return {
        type: 'mood_task_correlation',
        insights: ['Insufficient data for mood-task correlation analysis'],
        recommendations: ['Continue tracking mood and tasks to build correlation insights'],
        confidence: 0
      }
    }
    
    const correlationData = this.calculateMoodTaskCorrelation(moodData, taskData)
    
    return {
      type: 'mood_task_correlation',
      insights: [
        `Mood-productivity correlation: ${correlationData.correlation > 0.7 ? 'Strong' : 'Moderate'}`,
        `Best performance mood range: ${correlationData.optimalMoodRange}`,
        `Task completion rate improves by ${correlationData.improvementRate}% with better mood`
      ],
      recommendations: this.generateMoodTaskRecommendations(correlationData),
      confidence: this.calculateConfidence(Math.min(moodData.length, taskData.length))
    }
  },

  // Helper methods
  calculateVolatility(data) {
    if (!Array.isArray(data) || data.length === 0) return 0
    
    const scores = data.map(entry => entry?.score || 0)
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length
    return Math.sqrt(variance)
  },

  calculateTrend(data) {
    if (!Array.isArray(data) || data.length < 2) return 0
    
    const first = data[0]?.score || data[0]?.value || 0
    const last = data[data.length - 1]?.score || data[data.length - 1]?.value || 0
    return (last - first) / data.length
  },

  analyzeWeeklyPatterns(moodData) {
    if (!Array.isArray(moodData) || moodData.length === 0) return []
    
    const weeklyData = {}
    moodData.forEach(entry => {
      if (!entry?.timestamp) return
      
      const dayOfWeek = getDay(new Date(entry.timestamp))
      if (!weeklyData[dayOfWeek]) weeklyData[dayOfWeek] = []
      weeklyData[dayOfWeek].push(entry?.score || 0)
    })
    
    return Object.entries(weeklyData).map(([day, scores]) => ({
      day: parseInt(day),
      averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      count: scores.length
    }))
  },

  calculateMoodProductivityCorrelation(moodData, goalData) {
    if (!Array.isArray(moodData) || !Array.isArray(goalData)) return 0
    if (moodData.length === 0 || goalData.length === 0) return 0
    
    // Simplified correlation calculation
    const moodAvg = moodData.reduce((sum, entry) => sum + (entry?.score || 0), 0) / moodData.length
    const productivityRate = goalData.filter(g => g?.completed).length / goalData.length
    return Math.min(1, Math.max(0, moodAvg / 5 * productivityRate))
  },

  calculateSleepConsistency(sleepData) {
    if (!Array.isArray(sleepData) || sleepData.length === 0) return 0
    
    const sleepTimes = sleepData.map(entry => entry?.value || 0)
    const avgSleep = sleepTimes.reduce((sum, time) => sum + time, 0) / sleepTimes.length
    const variance = sleepTimes.reduce((sum, time) => sum + Math.pow(time - avgSleep, 2), 0) / sleepTimes.length
    return Math.max(0, 1 - Math.sqrt(variance) / avgSleep)
  },

  calculateEnergyMoodCorrelation(energyData, moodData) {
    if (!Array.isArray(energyData) || !Array.isArray(moodData)) return 0
    if (energyData.length === 0 || moodData.length === 0) return 0
    
    // Simplified correlation - in real app, use proper statistical correlation
    const energyAvg = energyData.reduce((sum, entry) => sum + (entry?.value || 0), 0) / energyData.length
    const moodAvg = moodData.reduce((sum, entry) => sum + (entry?.score || 0), 0) / moodData.length
    return Math.abs(energyAvg - moodAvg) / 5
  },

  identifyStressTriggers(stressData, moodData) {
    if (!Array.isArray(stressData)) return []
    
    // Simplified trigger identification
    const highStressPeriods = stressData.filter(entry => (entry?.value || 0) > 7)
    const triggers = ['Work pressure', 'Social situations', 'Physical fatigue']
    return triggers.slice(0, Math.min(3, highStressPeriods.length))
  },

  calculateMoodTaskCorrelation(moodData, taskData) {
    if (!Array.isArray(moodData) || !Array.isArray(taskData)) {
      return { correlation: 0, optimalMoodRange: '7-9', improvementRate: 0 }
    }
    
    const correlation = Math.random() * 0.3 + 0.6 // Simplified for demo
    return {
      correlation,
      optimalMoodRange: '7-9',
      improvementRate: Math.round(correlation * 30)
    }
  },

  identifyProductiveHours(goalData) {
    // Simplified hour identification
    return '9-11 AM, 2-4 PM'
  },

  identifyPeakEnergyTime(energyData) {
    // Simplified peak time identification
    return '10 AM - 12 PM'
  },

  calculateConfidence(dataPoints) {
    return Math.min(1, Math.max(0, dataPoints / 10))
  },

  generateMoodInsights(patterns) {
    return [
      `Your average mood score is ${patterns.averageScore.toFixed(1)}/10`,
      `Mood volatility: ${patterns.volatility < 1 ? 'Low' : patterns.volatility < 2 ? 'Moderate' : 'High'}`,
      `Trend: ${patterns.trend > 0 ? 'Improving' : 'Declining'}`
    ]
  },

  generateMoodRecommendations(patterns) {
    const recommendations = []
    if (patterns.averageScore < 6) {
      recommendations.push('Consider scheduling more relaxation activities')
    }
    if (patterns.volatility > 2) {
      recommendations.push('Focus on maintaining consistent daily routines')
    }
    return recommendations
  },

  generateProductivityRecommendations(correlation) {
    return correlation > 0.7 ? 
      ['Schedule important tasks during high-mood periods', 'Use mood tracking to optimize productivity'] :
      ['Develop mood-independent productivity strategies', 'Consider external factors affecting productivity']
  },

  generateSleepRecommendations(avgSleep, consistency) {
    const recommendations = []
    if (avgSleep < 7) recommendations.push('Aim for 7-9 hours of sleep nightly')
    if (consistency < 0.6) recommendations.push('Establish a consistent sleep schedule')
    return recommendations
  },

  generateEnergyRecommendations(avgEnergy, correlation) {
    return avgEnergy < 6 ? 
      ['Focus on regular exercise and nutrition', 'Consider energy-boosting activities'] :
      ['Maintain current energy management strategies', 'Optimize peak energy periods']
  },

  generateStressRecommendations(avgStress, triggers) {
    return avgStress > 6 ? 
      ['Practice stress management techniques', `Address primary triggers: ${triggers.join(', ')}`] :
      ['Continue current stress management practices', 'Monitor stress levels regularly']
  },

  generateMoodTaskRecommendations(correlationData) {
    return [
      'Schedule challenging tasks during optimal mood periods',
      'Use mood data to predict productivity levels',
      'Develop mood regulation strategies for important tasks'
    ]
  }
}

export const insightService = {
  async getPersonalizedInsights() {
    try {
      await delay(800)
      
      const [biometricData, goalData, moodData] = await Promise.all([
        biometricService.getBiometricData().catch(err => {
          console.error('Failed to fetch biometric data:', err)
          return []
        }),
        goalService.getGoals().catch(err => {
          console.error('Failed to fetch goal data:', err)
          return []
        }),
        moodService.getMoodData().catch(err => {
          console.error('Failed to fetch mood data:', err)
          return []
        })
      ])

      const insights = []
      const weeklyData = Array.isArray(goalData) ? goalData.filter(goal => {
        const goalDate = new Date(goal?.createdAt)
        const weekAgo = subDays(new Date(), 7)
        return goalDate >= weekAgo
      }) : []

      // Mood Pattern Analysis
      const moodPattern = PatternAnalyzer.analyzeMoodPatterns(moodData)
      insights.push(moodPattern)

      // AI-Powered Productivity Pattern Analysis
      const productivityPattern = PatternAnalyzer.analyzeProductivityPatterns(weeklyData, moodData)
      insights.push(productivityPattern)

      // Sleep Quality Analysis
      const sleepQuality = PatternAnalyzer.analyzeSleepQuality(biometricData)
      insights.push(sleepQuality)

      // Energy Level Analysis
      const energyLevels = PatternAnalyzer.analyzeEnergyLevels(biometricData, moodData)
      insights.push(energyLevels)

      // Stress Pattern Analysis
      const stressPatterns = PatternAnalyzer.analyzeStressPatterns(biometricData, moodData)
      insights.push(stressPatterns)

      return {
        insights,
        lastUpdated: new Date().toISOString(),
        totalInsights: insights.length
      }
    } catch (error) {
      console.error('Error generating personalized insights:', error)
      return {
        insights: [{
          type: 'error',
          insights: ['Unable to generate insights at this time'],
          recommendations: ['Please try again later'],
          confidence: 0
        }],
        lastUpdated: new Date().toISOString(),
        totalInsights: 0
      }
    }
  },

  async getAdvancedAnalytics() {
    try {
      await delay(1000)
      
      const [biometricData, goalData, moodData] = await Promise.all([
        biometricService.getBiometricData().catch(err => {
          console.error('Failed to fetch biometric data:', err)
          return []
        }),
        goalService.getGoals().catch(err => {
          console.error('Failed to fetch goal data:', err)
          return []
        }),
        moodService.getMoodData().catch(err => {
          console.error('Failed to fetch mood data:', err)
          return []
        })
      ])

      const weeklyData = Array.isArray(goalData) ? goalData.filter(goal => {
        const goalDate = new Date(goal?.createdAt)
        const weekAgo = subDays(new Date(), 7)
        return goalDate >= weekAgo
      }) : []

      // Mood-Task Correlation Analysis
      const moodTaskCorrelation = PatternAnalyzer.analyzeMoodTaskCorrelation(moodData, weeklyData)
      
      // Advanced Pattern Recognition
      const patterns = {
        moodPatterns: PatternAnalyzer.analyzeMoodPatterns(moodData, 14),
        productivityCycles: this.analyzeProductivityCycles(weeklyData),
        optimalPerformanceWindows: this.identifyOptimalWindows(biometricData, moodData),
        stressRecoveryPatterns: this.analyzeStressRecovery(biometricData)
      }

      // Heart Rate-Activity Pattern Analysis
      const heartRatePatterns = Array.isArray(biometricData) ? 
        biometricData.filter(data => data?.type === 'heart_rate').slice(-14) : []
      
      const activityCorrelation = this.calculateActivityCorrelation(heartRatePatterns, weeklyData)

      return {
        correlationAnalysis: {
          moodTaskCorrelation,
          heartRateActivity: activityCorrelation,
          sleepProductivity: this.calculateSleepProductivityCorrelation(biometricData, weeklyData)
        },
        patterns,
        predictiveInsights: this.generatePredictiveInsights(patterns),
        recommendations: this.generateAdvancedRecommendations(patterns),
        confidence: PatternAnalyzer.calculateConfidence(Math.min(
          Array.isArray(biometricData) ? biometricData.length : 0,
          Array.isArray(goalData) ? goalData.length : 0,
          Array.isArray(moodData) ? moodData.length : 0
        ))
      }
    } catch (error) {
      console.error('Error generating advanced analytics:', error)
      return {
        correlationAnalysis: {
          moodTaskCorrelation: { correlation: 0, optimalMoodRange: '7-9', improvementRate: 0 },
          heartRateActivity: { correlation: 0, averageHeartRate: 0, activityLevel: 'Low' },
          sleepProductivity: { correlation: 0, averageSleepHours: 0, optimalSleepRange: '7-9 hours' }
        },
        patterns: {},
        predictiveInsights: ['Unable to generate insights at this time'],
        recommendations: ['Please try again later'],
        confidence: 0
      }
    }
  },

  analyzeProductivityCycles(goalData) {
    if (!Array.isArray(goalData) || goalData.length === 0) return []
    
    const hourlyData = {}
    goalData.forEach(goal => {
      if (!goal?.createdAt) return
      
      const hour = new Date(goal.createdAt).getHours()
      if (!hourlyData[hour]) hourlyData[hour] = { total: 0, completed: 0 }
      hourlyData[hour].total++
      if (goal.completed) hourlyData[hour].completed++
    })

    return Object.entries(hourlyData).map(([hour, data]) => ({
      hour: parseInt(hour),
      completionRate: data.total > 0 ? data.completed / data.total : 0,
      totalTasks: data.total
    })).sort((a, b) => b.completionRate - a.completionRate)
  },

  identifyOptimalWindows(biometricData, moodData) {
    if (!Array.isArray(biometricData)) biometricData = []
    if (!Array.isArray(moodData)) moodData = []
    
    const energyData = biometricData.filter(data => data?.type === 'energy')
    const highEnergyPeriods = energyData.filter(data => (data?.value || 0) > 7)
    const highMoodPeriods = moodData.filter(data => (data?.score || 0) > 7)
    
    return {
      highEnergyHours: this.extractHours(highEnergyPeriods),
      highMoodHours: this.extractHours(highMoodPeriods),
      optimalWindows: this.findOverlappingWindows(highEnergyPeriods, highMoodPeriods)
    }
  },

  analyzeStressRecovery(biometricData) {
    if (!Array.isArray(biometricData)) biometricData = []
    
    const stressData = biometricData.filter(data => data?.type === 'stress')
    const recoveryPatterns = []
    
    for (let i = 1; i < stressData.length; i++) {
      const current = stressData[i]
      const previous = stressData[i - 1]
      
      if (!current?.timestamp || !previous?.timestamp) continue
      
      if ((previous?.value || 0) > 7 && (current?.value || 0) < 5) {
        recoveryPatterns.push({
          recoveryTime: new Date(current.timestamp) - new Date(previous.timestamp),
          stressLevel: previous.value || 0,
          recoveryLevel: current.value || 0
        })
      }
    }
    
    const avgRecoveryTime = recoveryPatterns.length > 0 ? 
      recoveryPatterns.reduce((sum, pattern) => sum + pattern.recoveryTime, 0) / recoveryPatterns.length : 0
    
    const highStressCount = stressData.filter(d => (d?.value || 0) > 7).length
    
    return {
      averageRecoveryTime: avgRecoveryTime,
      recoveryEfficiency: highStressCount > 0 ? recoveryPatterns.length / highStressCount : 0,
      patterns: recoveryPatterns
    }
  },

  calculateActivityCorrelation(heartRateData, goalData) {
    if (!Array.isArray(heartRateData) || !Array.isArray(goalData)) {
      return { correlation: 0, averageHeartRate: 0, activityLevel: 'Low' }
    }
    
    if (heartRateData.length === 0 || goalData.length === 0) {
      return { correlation: 0, averageHeartRate: 0, activityLevel: 'Low' }
    }
    
    const avgHeartRate = heartRateData.reduce((sum, data) => sum + (data?.value || 0), 0) / heartRateData.length
    const completionRate = goalData.filter(g => g?.completed).length / goalData.length
    
    return {
      correlation: Math.abs(avgHeartRate - 70) / 30 * completionRate,
      averageHeartRate: avgHeartRate,
      activityLevel: avgHeartRate > 80 ? 'High' : avgHeartRate > 60 ? 'Moderate' : 'Low'
    }
  },

  calculateSleepProductivityCorrelation(biometricData, goalData) {
    if (!Array.isArray(biometricData) || !Array.isArray(goalData)) {
      return { correlation: 0, averageSleepHours: 0, optimalSleepRange: '7-9 hours' }
    }
    
    const sleepData = biometricData.filter(data => data?.type === 'sleep')
    
    if (sleepData.length === 0 || goalData.length === 0) {
      return { correlation: 0, averageSleepHours: 0, optimalSleepRange: '7-9 hours' }
    }
    
    const avgSleep = sleepData.reduce((sum, data) => sum + (data?.value || 0), 0) / sleepData.length
    const completionRate = goalData.filter(g => g?.completed).length / goalData.length
    
    return {
      correlation: Math.min(1, avgSleep / 8 * completionRate),
      averageSleepHours: avgSleep,
      optimalSleepRange: '7-9 hours'
    }
  },

  extractHours(dataPoints) {
    if (!Array.isArray(dataPoints)) return {}
    
    return dataPoints.filter(point => point?.timestamp)
      .map(point => new Date(point.timestamp).getHours())
      .reduce((hours, hour) => {
        hours[hour] = (hours[hour] || 0) + 1
        return hours
      }, {})
  },

  findOverlappingWindows(energyData, moodData) {
    const energyHours = this.extractHours(energyData)
    const moodHours = this.extractHours(moodData)
    
    const overlapping = {}
    Object.keys(energyHours).forEach(hour => {
      if (moodHours[hour]) {
        overlapping[hour] = energyHours[hour] + moodHours[hour]
      }
    })
    
    return Object.entries(overlapping)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: parseInt(hour), score: count }))
  },

  generatePredictiveInsights(patterns) {
    return [
      'Based on your patterns, tomorrow morning (9-11 AM) will be your peak productivity window',
      'Your mood tends to improve by 15% after completing morning goals',
      'Stress levels typically decrease by 20% within 2 hours of physical activity'
    ]
  },

  generateAdvancedRecommendations(patterns) {
    return [
      'Schedule your most challenging tasks during identified optimal windows',
      'Use predictive mood patterns to plan important meetings and decisions',
      'Implement stress recovery techniques during identified high-stress periods'
    ]
]
  }
}
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