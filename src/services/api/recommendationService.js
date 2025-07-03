import mockRecommendationData from '@/services/mockData/recommendationData.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const recommendationService = {
  async getTodayRecommendation() {
    await delay(250)
    const today = new Date().toISOString().split('T')[0]
    
    // Return today's recommendation or generate one
    return mockRecommendationData.find(rec => rec.date === today) || {
      date: today,
      priority: 'focus',
      reasoning: 'Your sleep quality was good and HRV is stable. Perfect time for focused work.',
      suggestedTasks: ['Complete important project', 'Review quarterly goals', 'Plan next week'],
      energyScore: 75
    }
  },

  async getAll() {
    await delay(300)
    return [...mockRecommendationData]
  },

  async getById(id) {
    await delay(200)
    return mockRecommendationData.find(item => item.Id === parseInt(id))
  },

  async create(data) {
    await delay(350)
    const newId = Math.max(...mockRecommendationData.map(item => item.Id), 0) + 1
    const newItem = { ...data, Id: newId }
    mockRecommendationData.push(newItem)
    return newItem
  },

  async update(id, data) {
    await delay(300)
    const index = mockRecommendationData.findIndex(item => item.Id === parseInt(id))
    if (index !== -1) {
      mockRecommendationData[index] = { ...mockRecommendationData[index], ...data }
      return mockRecommendationData[index]
    }
    throw new Error('Recommendation not found')
  },

  async delete(id) {
    await delay(250)
    const index = mockRecommendationData.findIndex(item => item.Id === parseInt(id))
    if (index !== -1) {
      const deleted = mockRecommendationData.splice(index, 1)[0]
      return deleted
    }
    throw new Error('Recommendation not found')
  }
}