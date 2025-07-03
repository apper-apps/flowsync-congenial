import mockTemplateData from '@/services/mockData/goalTemplateData.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const goalTemplateService = {
  async getAll() {
    await delay(300)
    return [...mockTemplateData]
  },

  async getById(id) {
    await delay(200)
    return mockTemplateData.find(item => item.Id === parseInt(id))
  },

  async create(data) {
    await delay(400)
    const newId = Math.max(...mockTemplateData.map(item => item.Id), 0) + 1
    const newItem = { ...data, Id: newId }
    mockTemplateData.push(newItem)
    return newItem
  }
}