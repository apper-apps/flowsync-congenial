import mockBiometricData from '@/services/mockData/biometricData.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const biometricService = {
  async getTodayData() {
    await delay(300)
    const today = new Date().toISOString().split('T')[0]
    
    // Return today's data or generate mock data
    return mockBiometricData.find(entry => entry.date === today) || {
      date: today,
      sleepScore: 78,
      sleepHours: 7.5,
      hrv: 42,
      restingHR: 65,
      energyLevel: 'medium',
      energyScore: 72
    }
  },

  async getWeeklyData() {
    await delay(250)
    return mockBiometricData.slice(-7)
  },

  async getById(id) {
    await delay(200)
    return mockBiometricData.find(item => item.Id === parseInt(id))
  },

  async create(data) {
    await delay(300)
    const newId = Math.max(...mockBiometricData.map(item => item.Id), 0) + 1
    const newItem = { ...data, Id: newId }
    mockBiometricData.push(newItem)
    return newItem
  },

  async update(id, data) {
    await delay(300)
    const index = mockBiometricData.findIndex(item => item.Id === parseInt(id))
    if (index !== -1) {
      mockBiometricData[index] = { ...mockBiometricData[index], ...data }
      return mockBiometricData[index]
    }
    throw new Error('Item not found')
  },

  async delete(id) {
    await delay(250)
    const index = mockBiometricData.findIndex(item => item.Id === parseInt(id))
    if (index !== -1) {
      const deleted = mockBiometricData.splice(index, 1)[0]
return deleted
    }
    throw new Error('Item not found')
  },

  async get30DayData() {
    await delay(300)
    // Generate 30 days of mock data for comprehensive analytics
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))
    
    const data = []
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + (i * 24 * 60 * 60 * 1000))
      const dateStr = date.toISOString().split('T')[0]
      
      // Use existing data if available, otherwise generate realistic patterns
      const existingData = mockBiometricData.find(entry => entry.date === dateStr)
      if (existingData) {
        data.push(existingData)
      } else {
        // Generate realistic patterns with some correlation
        const sleepScore = Math.floor(Math.random() * 30) + 65 // 65-95
        const sleepHours = Math.round((Math.random() * 2 + 6.5) * 10) / 10 // 6.5-8.5
        const hrv = Math.floor(Math.random() * 25) + 35 // 35-60
        const restingHR = Math.floor(Math.random() * 15) + 60 // 60-75
        const energyScore = Math.floor(sleepScore * 0.9 + Math.random() * 20) // Correlated with sleep
        
        let energyLevel = 'medium'
        if (energyScore > 80) energyLevel = 'high'
        else if (energyScore < 65) energyLevel = 'low'
        
        data.push({
          Id: 1000 + i,
          date: dateStr,
          sleepScore,
          sleepHours,
          hrv,
          restingHR,
          energyLevel,
          energyScore
        })
      }
    }
    
return data
  },

  async getWeeklyInsights() {
    await delay(350)
    const weeklyData = await this.getWeeklyData()
    
    // Calculate weekly averages and trends
    const avgSleepScore = Math.round(weeklyData.reduce((sum, d) => sum + d.sleepScore, 0) / weeklyData.length)
    const avgEnergyScore = Math.round(weeklyData.reduce((sum, d) => sum + d.energyScore, 0) / weeklyData.length)
    const avgHRV = Math.round(weeklyData.reduce((sum, d) => sum + d.hrv, 0) / weeklyData.length)
    const avgSleepHours = Math.round((weeklyData.reduce((sum, d) => sum + d.sleepHours, 0) / weeklyData.length) * 10) / 10
    
    // Calculate trends (compare first half vs second half of week)
    const firstHalf = weeklyData.slice(0, Math.floor(weeklyData.length / 2))
    const secondHalf = weeklyData.slice(Math.floor(weeklyData.length / 2))
    
    const sleepTrend = (secondHalf.reduce((sum, d) => sum + d.sleepScore, 0) / secondHalf.length) - 
                      (firstHalf.reduce((sum, d) => sum + d.sleepScore, 0) / firstHalf.length)
    const energyTrend = (secondHalf.reduce((sum, d) => sum + d.energyScore, 0) / secondHalf.length) - 
                       (firstHalf.reduce((sum, d) => sum + d.energyScore, 0) / firstHalf.length)
    
    return {
      weeklyData,
      averages: {
        sleepScore: avgSleepScore,
        energyScore: avgEnergyScore,
        hrv: avgHRV,
        sleepHours: avgSleepHours
      },
      trends: {
        sleep: sleepTrend,
        energy: energyTrend
}
    }
  },

  async getEnergyBreakdown() {
    await delay(350)
    
    try {
      // Get today's biometric data
      const todayData = await this.getTodayData()
      
      // Import and get recent mood data for correlation
      const { moodService } = await import('./moodService.js')
      const recentMoodData = await moodService.getRecentTrends()
      
      // Calculate individual factor contributions
      const sleepContribution = Math.round((todayData.sleepScore / 100) * 40) // Sleep accounts for 40% max
      const hrvContribution = Math.round(((todayData.hrv - 30) / 30) * 30) // HRV accounts for 30% max (30-60ms range)
      const moodContribution = Math.round((recentMoodData.averageScore / 5) * 30) // Recent mood accounts for 30% max
      
      // Calculate impact scores (how much each factor helps/hurts energy)
      const sleepImpact = Math.round((todayData.sleepScore - 75) / 3) // Impact relative to good sleep (75)
      const hrvImpact = Math.round((todayData.hrv - 42) / 2) // Impact relative to average HRV (42)
      const moodImpact = Math.round((recentMoodData.averageScore - 3.5) * 6) // Impact relative to neutral mood (3.5)
      
      return {
        sleep: {
          score: todayData.sleepScore,
          contribution: Math.max(0, sleepContribution),
          impact: sleepImpact
        },
        hrv: {
          score: todayData.hrv,
          contribution: Math.max(0, hrvContribution),
          impact: hrvImpact
        },
        mood: {
          score: Math.round(recentMoodData.averageScore * 10) / 10,
          contribution: Math.max(0, moodContribution),
          impact: moodImpact
        },
        totalFactors: 3,
        correlationStrength: 0.85 // How well factors predict energy
      }
    } catch (error) {
      console.error('Error calculating energy breakdown:', error)
      
      // Return fallback breakdown based on today's data only
      const todayData = await this.getTodayData()
      return {
        sleep: {
          score: todayData.sleepScore,
          contribution: Math.round((todayData.sleepScore / 100) * 40),
          impact: Math.round((todayData.sleepScore - 75) / 3)
        },
        hrv: {
          score: todayData.hrv,
          contribution: Math.round(((todayData.hrv - 30) / 30) * 30),
          impact: Math.round((todayData.hrv - 42) / 2)
        },
        mood: {
          score: 3.5,
          contribution: 21,
          impact: 0
        },
        totalFactors: 3,
        correlationStrength: 0.70
      }
    }
  }
}