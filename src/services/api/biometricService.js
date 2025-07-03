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
  }
}