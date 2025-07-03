import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { moodService } from '@/services/api/moodService'
import { goalService } from '@/services/api/goalService'
import { biometricService } from '@/services/api/biometricService'

const Insights = () => {
  const [moodData, setMoodData] = useState([])
  const [goalData, setGoalData] = useState([])
  const [biometricData, setBiometricData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadInsightData()
  }, [])

  const loadInsightData = async () => {
    try {
      setLoading(true)
      setError('')

      const [moods, goals, biometrics] = await Promise.all([
        moodService.getAll(),
        goalService.getAll(),
        biometricService.getWeeklyData()
      ])

      setMoodData(moods)
      setGoalData(goals)
      setBiometricData(biometrics)
    } catch (err) {
      setError('Failed to load insight data')
      console.error('Insights error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Mood Trend Chart Configuration
  const moodChartOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#4F46E5', '#10B981'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: moodData.slice(-7).map(entry => 
        new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      min: 1,
      max: 5,
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontWeight: 500
    }
  }

  const moodChartSeries = [
    {
      name: 'Mood Score',
      data: moodData.slice(-7).map(entry => entry.moodScore)
    }
  ]

  // Goal Progress Chart Configuration
  const goalChartOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    colors: ['#4F46E5', '#7C3AED', '#10B981'],
    labels: ['Health', 'Work', 'Personal'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontWeight: 500
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  const goalChartSeries = [
    goalData.filter(g => g.category === 'health').reduce((sum, g) => sum + g.progress, 0) / Math.max(goalData.filter(g => g.category === 'health').length, 1),
    goalData.filter(g => g.category === 'work').reduce((sum, g) => sum + g.progress, 0) / Math.max(goalData.filter(g => g.category === 'work').length, 1),
    goalData.filter(g => g.category === 'personal').reduce((sum, g) => sum + g.progress, 0) / Math.max(goalData.filter(g => g.category === 'personal').length, 1)
  ]

  // Biometric Correlation Chart Configuration
  const biometricChartOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false }
    },
    colors: ['#EF4444', '#F59E0B', '#10B981'],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: biometricData.map(entry => 
        new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontWeight: 500
    }
  }

  const biometricChartSeries = [
    {
      name: 'Sleep Score',
      data: biometricData.map(entry => entry.sleepScore)
    },
    {
      name: 'HRV',
      data: biometricData.map(entry => entry.hrv)
    },
    {
      name: 'Energy Level',
      data: biometricData.map(entry => entry.energyLevel === 'high' ? 85 : entry.energyLevel === 'medium' ? 60 : 35)
    }
  ]

  // Calculate insights
  const averageMood = moodData.length > 0 
    ? (moodData.reduce((sum, entry) => sum + entry.moodScore, 0) / moodData.length).toFixed(1)
    : 0

  const totalGoals = goalData.length
  const completedGoals = goalData.filter(g => g.progress === 100).length
  const averageProgress = totalGoals > 0 
    ? Math.round(goalData.reduce((sum, g) => sum + g.progress, 0) / totalGoals)
    : 0

  const bestMoodDay = moodData.length > 0 
    ? moodData.reduce((best, current) => 
        current.moodScore > best.moodScore ? current : best
      ).mood
    : 'Great'

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return (
      <Error
        title="Insights Error"
        message={error}
        onRetry={loadInsightData}
      />
    )
  }

  if (moodData.length === 0 && goalData.length === 0) {
    return (
      <Empty 
        type="insights"
        onAction={() => window.location.href = '/'}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Insights & Analytics
        </h1>
        <p className="text-lg text-gray-600">
          Discover patterns in your mood, goals, and biometric data
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Mood</p>
              <p className="text-2xl font-display font-bold text-gray-900">
                {averageMood}/5
              </p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Heart" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Goal Progress</p>
              <p className="text-2xl font-display font-bold text-gray-900">
                {averageProgress}%
              </p>
              <p className="text-xs text-gray-500">{completedGoals}/{totalGoals} completed</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="Target" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Best Mood</p>
              <p className="text-2xl font-display font-bold text-gray-900 capitalize">
                {bestMoodDay}
              </p>
              <p className="text-xs text-gray-500">Most common</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-accent to-emerald-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
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
              <p className="text-xs text-gray-500">Logging consistency</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-warning to-orange-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Flame" size={24} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Trends */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-bold text-gray-900">
              7-Day Mood Trends
            </h3>
            <ApperIcon name="TrendingUp" size={20} className="text-accent" />
          </div>
          {moodData.length > 0 ? (
            <Chart
              options={moodChartOptions}
              series={moodChartSeries}
              type="line"
              height={300}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="BarChart3" size={48} className="mx-auto mb-2 text-gray-400" />
                <p>No mood data available</p>
              </div>
            </div>
          )}
        </Card>

        {/* Goal Progress by Category */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-bold text-gray-900">
              Goal Progress by Category
            </h3>
            <ApperIcon name="Target" size={20} className="text-primary" />
          </div>
          {goalData.length > 0 ? (
            <Chart
              options={goalChartOptions}
              series={goalChartSeries}
              type="donut"
              height={300}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="PieChart" size={48} className="mx-auto mb-2 text-gray-400" />
                <p>No goal data available</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Biometric Correlations */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-bold text-gray-900">
            Biometric Correlations
          </h3>
          <ApperIcon name="Activity" size={20} className="text-secondary" />
        </div>
        {biometricData.length > 0 ? (
          <Chart
            options={biometricChartOptions}
            series={biometricChartSeries}
            type="line"
            height={300}
          />
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <ApperIcon name="Activity" size={48} className="mx-auto mb-2 text-gray-400" />
              <p>No biometric data available</p>
            </div>
          </div>
        )}
      </Card>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="Brain" size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-display font-bold text-gray-900">
              AI Insights
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Your mood tends to be higher on days with better sleep quality. 
            Consider maintaining consistent sleep patterns to optimize your daily energy levels.
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-emerald-600/10 border border-accent/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-emerald-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Lightbulb" size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-display font-bold text-gray-900">
              Recommendations
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Your goal completion rate is highest on days when you log a positive mood first thing in the morning. 
            Try starting each day with a quick mood check-in.
          </p>
        </Card>
      </div>
    </div>
  )
}

export default Insights