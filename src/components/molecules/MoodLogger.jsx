import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'

const MoodLogger = ({ onMoodLogged }) => {
  const [selectedMood, setSelectedMood] = useState('')
  const [note, setNote] = useState('')
  const [isLogging, setIsLogging] = useState(false)

  const moods = [
    { emoji: '😊', label: 'Great', value: 'great', score: 5 },
    { emoji: '🙂', label: 'Good', value: 'good', score: 4 },
    { emoji: '😐', label: 'Okay', value: 'okay', score: 3 },
    { emoji: '😔', label: 'Low', value: 'low', score: 2 },
    { emoji: '😞', label: 'Poor', value: 'poor', score: 1 }
  ]

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedMood) {
      toast.error('Please select a mood')
      return
    }

    setIsLogging(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
      
      const moodData = {
        mood: selectedMood.label,
        moodScore: selectedMood.score,
        note: note.trim(),
        timestamp: new Date().toISOString()
      }
      
      onMoodLogged(moodData)
      setSelectedMood('')
      setNote('')
      toast.success('Mood logged successfully!')
    } catch (error) {
      toast.error('Failed to log mood')
    } finally {
      setIsLogging(false)
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-bold text-gray-900">Quick Mood Log</h3>
        <ApperIcon name="Heart" size={20} className="text-error" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How are you feeling right now?
          </label>
          <div className="flex items-center justify-between space-x-2">
            {moods.map((mood, index) => (
              <motion.button
                key={mood.value}
                type="button"
                onClick={() => handleMoodSelect(mood)}
                className={`flex-1 p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedMood?.value === mood.value
                    ? 'border-primary bg-primary/10 shadow-medium'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs font-medium text-gray-600">{mood.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Optional Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={50}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder:text-gray-400 resize-none"
            rows={2}
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {note.length}/50
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={!selectedMood || isLogging}
          className="w-full"
        >
          {isLogging ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="mr-2"
              >
                <ApperIcon name="Loader" size={18} />
              </motion.div>
              Logging...
            </>
          ) : (
            <>
              <ApperIcon name="Plus" size={18} className="mr-2" />
              Log Mood
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}

export default MoodLogger