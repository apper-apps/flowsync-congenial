import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { moodService } from '@/services/api/moodService'

const Journal = () => {
  const [moodEntries, setMoodEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEntry, setSelectedEntry] = useState(null)

  useEffect(() => {
    loadMoodEntries()
  }, [])

  const loadMoodEntries = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await moodService.getAll()
      setMoodEntries(data)
    } catch (err) {
      setError('Failed to load mood entries')
      console.error('Journal error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      great: '😊',
      good: '🙂',
      okay: '😐',
      low: '😔',
      poor: '😞'
    }
    return moodEmojis[mood] || '😐'
  }

  const getMoodColor = (mood) => {
    const moodColors = {
      great: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      okay: 'bg-yellow-100 text-yellow-800',
      low: 'bg-orange-100 text-orange-800',
      poor: 'bg-red-100 text-red-800'
    }
    return moodColors[mood] || 'bg-gray-100 text-gray-800'
  }

  const getEntryForDate = (date) => {
    return moodEntries.find(entry => 
      isSameDay(new Date(entry.timestamp), date)
    )
  }

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDayClick = (date) => {
    const entry = getEntryForDate(date)
    if (entry) {
      setSelectedEntry(entry)
    }
  }

  if (loading) {
    return <Loading type="list" />
  }

  if (error) {
    return (
      <Error
        title="Journal Error"
        message={error}
        onRetry={loadMoodEntries}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Mood Journal
        </h1>
        <p className="text-lg text-gray-600">
          Track your daily mood patterns and discover insights
        </p>
      </div>

      {/* Journal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-display font-bold text-gray-900">
                {moodEntries.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="BookOpen" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-display font-bold text-gray-900">
                {moodEntries.filter(entry => 
                  new Date(entry.timestamp).getMonth() === currentDate.getMonth()
                ).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="Calendar" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Mood</p>
              <p className="text-2xl font-display font-bold text-gray-900">
                {moodEntries.length > 0 
                  ? (moodEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / moodEntries.length).toFixed(1)
                  : '0'
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-accent to-emerald-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Heart" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Streak</p>
              <p className="text-2xl font-display font-bold text-gray-900">
                7 days
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-warning to-orange-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Flame" size={24} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="small"
              onClick={handlePreviousMonth}
            >
              <ApperIcon name="ChevronLeft" size={18} />
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={handleNextMonth}
            >
              <ApperIcon name="ChevronRight" size={18} />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center p-2 text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {monthDays.map((date, index) => {
            const entry = getEntryForDate(date)
            const isCurrentDay = isToday(date)
            
            return (
              <motion.button
                key={date.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                onClick={() => handleDayClick(date)}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  isCurrentDay 
                    ? 'border-primary bg-primary/10 text-primary font-bold' 
                    : entry
                    ? 'border-gray-200 hover:border-gray-300 cursor-pointer'
                    : 'border-transparent text-gray-400'
                }`}
              >
                <div className="text-sm font-medium">{format(date, 'd')}</div>
                {entry && (
                  <div className="text-xl mt-1">
                    {getMoodEmoji(entry.mood.toLowerCase())}
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </Card>

      {/* Recent Entries */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-gray-900">
            Recent Entries
          </h2>
          <a
            href="/"
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Log New Entry
          </a>
        </div>

        {moodEntries.length > 0 ? (
          <div className="space-y-4">
            {moodEntries.slice(0, 5).map((entry, index) => (
              <motion.div
                key={entry.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl">
                  {getMoodEmoji(entry.mood.toLowerCase())}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood.toLowerCase())}`}>
                      {entry.mood}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(entry.timestamp), 'PPp')}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-sm text-gray-700">{entry.note}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <Empty 
            type="journal"
            onAction={() => window.location.href = '/'}
          />
        )}
      </Card>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-gray-900">
                Journal Entry
              </h3>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {getMoodEmoji(selectedEntry.mood.toLowerCase())}
              </div>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getMoodColor(selectedEntry.mood.toLowerCase())}`}>
                {selectedEntry.mood}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                <p className="text-gray-900">
                  {format(new Date(selectedEntry.timestamp), 'PPpp')}
                </p>
              </div>

              {selectedEntry.note && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Note</p>
                  <p className="text-gray-900">{selectedEntry.note}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 mb-1">Mood Score</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{ width: `${(selectedEntry.moodScore / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedEntry.moodScore}/5
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() => setSelectedEntry(null)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Journal