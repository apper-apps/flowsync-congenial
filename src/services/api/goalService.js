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
  }
}