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
  }
}