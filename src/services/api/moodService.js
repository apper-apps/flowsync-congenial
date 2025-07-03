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