import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import { format, subDays, parseISO } from 'date-fns'
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
        biometricService.get30DayData()
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

// Prepare 30-day data for analysis
  const thirtyDaysAgo = subDays(new Date(), 30)
  const last30DaysMoods = moodData.filter(entry => 
    parseISO(entry.timestamp) >= thirtyDaysAgo
  ).sort((a, b) => parseISO(a.timestamp) - parseISO(b.timestamp))

  // Pattern Detection Algorithms
  const detectPatterns = () => {
    const patterns = {
      moodSleepCorrelation: 0,
      energyTrend: 'stable',
      bestPerformanceDays: [],
      lowEnergyDays: [],
      recommendations: []
    }

    // Calculate mood-sleep correlation
    const moodSleepPairs = last30DaysMoods.map(mood => {
      const moodDate = format(parseISO(mood.timestamp), 'yyyy-MM-dd')
      const biometric = biometricData.find(b => b.date === moodDate)
      return biometric ? { mood: mood.moodScore, sleep: biometric.sleepScore } : null
    }).filter(Boolean)

    if (moodSleepPairs.length > 5) {
      const correlation = calculateCorrelation(
        moodSleepPairs.map(p => p.mood),
        moodSleepPairs.map(p => p.sleep)
      )
      patterns.moodSleepCorrelation = correlation
    }

    // Identify best performance days (high mood + high energy)
    patterns.bestPerformanceDays = biometricData
      .filter(day => day.energyScore > 80 && day.sleepScore > 80)
      .map(day => format(parseISO(day.date), 'MMM dd'))
      .slice(0, 3)

    // Identify low energy patterns
    patterns.lowEnergyDays = biometricData
      .filter(day => day.energyScore < 60)
      .map(day => ({ date: day.date, factors: [] }))

    // Generate recommendations based on patterns
    if (patterns.moodSleepCorrelation > 0.6) {
      patterns.recommendations.push("Strong correlation detected between sleep quality and mood. Prioritize consistent sleep schedule.")
    }
    if (patterns.bestPerformanceDays.length > 0) {
      patterns.recommendations.push(`Your best performance days were ${patterns.bestPerformanceDays.join(', ')}. Analyze what made these days special.`)
    }
    if (patterns.lowEnergyDays.length > 7) {
      patterns.recommendations.push("Consider reviewing your sleep hygiene and stress management strategies.")
    }

    return patterns
  }

  const calculateCorrelation = (x, y) => {
    const n = x.length
    const sum1 = x.reduce((a, b) => a + b, 0)
    const sum2 = y.reduce((a, b) => a + b, 0)
    const sum1Sq = x.reduce((a, b) => a + b * b, 0)
    const sum2Sq = y.reduce((a, b) => a + b * b, 0)
    const pSum = x.map((x, i) => x * y[i]).reduce((a, b) => a + b, 0)
    const num = pSum - (sum1 * sum2 / n)
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n))
    return den === 0 ? 0 : num / den
  }

  const patterns = detectPatterns()

  // 30-Day Mood Trend Chart Configuration
  const moodChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: true }
    },
    colors: ['#4F46E5'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: last30DaysMoods.map(entry => 
        format(parseISO(entry.timestamp), 'MMM dd')
      ),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '11px'
        },
        rotate: -45
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
    markers: {
      size: 4,
      colors: ['#4F46E5'],
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    annotations: {
      yaxis: [
        {
          y: 4,
          borderColor: '#10B981',
          label: {
            text: 'Good Mood Threshold',
            style: {
              color: '#10B981',
              fontSize: '12px'
            }
          }
        }
      ]
    }
  }

  const moodChartSeries = [
    {
      name: 'Mood Score',
      data: last30DaysMoods.map(entry => entry.moodScore)
    }
  ]

  // 30-Day Sleep & Energy Correlation Chart
  const sleepEnergyChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#10B981', '#F59E0B', '#EF4444'],
    stroke: {
      curve: 'smooth',
      width: [3, 3, 2]
    },
    xaxis: {
      categories: biometricData.map(entry => 
        format(parseISO(entry.date), 'MMM dd')
      ),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '11px'
        },
        rotate: -45
      }
    },
    yaxis: [
      {
        title: { text: 'Sleep Score' },
        min: 0,
        max: 100,
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '12px'
          }
        }
      },
      {
        opposite: true,
        title: { text: 'Energy Level' },
        min: 0,
        max: 100,
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '12px'
          }
        }
      }
    ],
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

  const sleepEnergyChartSeries = [
    {
      name: 'Sleep Score',
      data: biometricData.map(entry => entry.sleepScore)
    },
    {
      name: 'Energy Score',
      data: biometricData.map(entry => entry.energyScore)
    },
    {
      name: 'HRV',
      data: biometricData.map(entry => entry.hrv)
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

// Calculate comprehensive insights
  const averageMood = last30DaysMoods.length > 0 
    ? (last30DaysMoods.reduce((sum, entry) => sum + entry.moodScore, 0) / last30DaysMoods.length).toFixed(1)
    : 0

  const averageSleep = biometricData.length > 0 
    ? (biometricData.reduce((sum, entry) => sum + entry.sleepScore, 0) / biometricData.length).toFixed(1)
    : 0

  const averageEnergy = biometricData.length > 0 
    ? (biometricData.reduce((sum, entry) => sum + entry.energyScore, 0) / biometricData.length).toFixed(1)
    : 0

  const totalGoals = goalData.length
  const completedGoals = goalData.filter(g => g.progress === 100).length
  const averageProgress = totalGoals > 0 
    ? Math.round(goalData.reduce((sum, g) => sum + g.progress, 0) / totalGoals)
    : 0

  const bestMoodDay = last30DaysMoods.length > 0 
    ? last30DaysMoods.reduce((best, current) => 
        current.moodScore > best.moodScore ? current : best
      ).mood
    : 'Great'

  const moodTrend = last30DaysMoods.length > 7 
    ? (last30DaysMoods.slice(-7).reduce((sum, entry) => sum + entry.moodScore, 0) / 7) >
      (last30DaysMoods.slice(0, 7).reduce((sum, entry) => sum + entry.moodScore, 0) / 7)
      ? 'improving' : 'declining'
    : 'stable'

  const sleepConsistency = biometricData.length > 0 
    ? biometricData.filter(day => day.sleepScore > 75).length
    : 0
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
          30-Day Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Comprehensive trends and correlations in your mood, sleep, and energy levels
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
              <p className="text-xs text-gray-500 capitalize">
                Trend: {moodTrend}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Heart" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Sleep</p>
              <p className="text-2xl font-display font-bold text-gray-900">
                {averageSleep}/100
              </p>
              <p className="text-xs text-gray-500">
                {sleepConsistency} good nights
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Moon" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Energy</p>
              <p className="text-2xl font-display font-bold text-gray-900">
                {averageEnergy}/100
              </p>
              <p className="text-xs text-gray-500">
                {patterns.bestPerformanceDays.length} peak days
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-accent to-emerald-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Correlation</p>
              <p className="text-2xl font-display font-bold text-gray-900">
                {Math.round(patterns.moodSleepCorrelation * 100)}%
              </p>
              <p className="text-xs text-gray-500">Mood-Sleep link</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-warning to-orange-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

{/* Main Analytics Charts */}
      <div className="space-y-8">
        {/* 30-Day Mood Trends */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-bold text-gray-900">
              30-Day Mood Trends & Patterns
            </h3>
            <ApperIcon name="TrendingUp" size={20} className="text-accent" />
          </div>
          {last30DaysMoods.length > 0 ? (
            <Chart
              options={moodChartOptions}
              series={moodChartSeries}
              type="line"
              height={350}
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

        {/* Sleep & Energy Correlation */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-bold text-gray-900">
              Sleep & Energy Correlation Analysis
            </h3>
            <ApperIcon name="Activity" size={20} className="text-secondary" />
          </div>
          {biometricData.length > 0 ? (
            <Chart
              options={sleepEnergyChartOptions}
              series={sleepEnergyChartSeries}
              type="line"
              height={350}
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

{/* Pattern Insights & Personalized Recommendations */}
      <div className="space-y-6">
        <h2 className="text-xl font-display font-bold text-gray-900">
          Personalized Insights & Recommendations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Brain" size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-display font-bold text-gray-900">
                Pattern Analysis
              </h3>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                <strong>Mood-Sleep Correlation:</strong> {Math.round(patterns.moodSleepCorrelation * 100)}% correlation detected.
              </p>
              {patterns.bestPerformanceDays.length > 0 && (
                <p className="text-gray-700 leading-relaxed">
                  <strong>Peak Performance Days:</strong> {patterns.bestPerformanceDays.join(', ')}
                </p>
              )}
              <p className="text-gray-700 leading-relaxed">
                <strong>Trend:</strong> Your mood is currently {moodTrend} over the past 30 days.
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-emerald-600/10 border border-accent/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-emerald-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Lightbulb" size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-display font-bold text-gray-900">
                AI Recommendations
              </h3>
            </div>
            <div className="space-y-3">
              {patterns.recommendations.length > 0 ? (
                patterns.recommendations.map((rec, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    • {rec}
                  </p>
                ))
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  Keep logging your daily metrics to generate personalized recommendations based on your patterns.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Key Correlations Summary */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="BarChart3" size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-display font-bold text-gray-900">
              Key Findings
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-blue-600">
                {Math.round(patterns.moodSleepCorrelation * 100)}%
              </p>
              <p className="text-sm text-gray-600">Sleep-Mood Link</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-green-600">
                {sleepConsistency}
              </p>
              <p className="text-sm text-gray-600">Quality Sleep Days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-purple-600 capitalize">
                {moodTrend}
              </p>
              <p className="text-sm text-gray-600">Overall Trend</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Insights