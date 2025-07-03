import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { insightService } from "@/services/api/insightService";
import InsightCard from "@/components/molecules/InsightCard";
import BiometricCard from "@/components/molecules/BiometricCard";
import GoalCard from "@/components/molecules/GoalCard";
import MoodLogger from "@/components/molecules/MoodLogger";
import TrendChart from "@/components/molecules/TrendChart";
import EnergyStatusCard from "@/components/molecules/EnergyStatusCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Goals from "@/components/pages/Goals";
import Insights from "@/components/pages/Insights";
import { moodService } from "@/services/api/moodService";
import { biometricService } from "@/services/api/biometricService";
import { goalService } from "@/services/api/goalService";
import { recommendationService } from "@/services/api/recommendationService";
const Dashboard = () => {
  const [biometricData, setBiometricData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [moodTrends, setMoodTrends] = useState([]);
const [recommendation, setRecommendation] = useState(null);
  const [energyBreakdown, setEnergyBreakdown] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadDashboardData();
  }, []);

const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

const [biometrics, goalsData, moodData, recommendationData, insightsData, breakdownData] = await Promise.all([
        biometricService.getTodayData(),
        goalService.getAll(),
        moodService.getRecentTrends(),
        recommendationService.getTodayRecommendation(),
        insightService.getWeeklyInsights(),
        biometricService.getEnergyBreakdown()
      ]);
      
setBiometricData(biometrics);
      setGoals(goalsData.slice(0, 3)); // Show top 3 goals
      setMoodTrends(moodData);
      setRecommendation(recommendationData);
      setEnergyBreakdown(breakdownData);
      setInsights(insightsData.slice(0, 2)); // Show top 2 insights
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

const handleMoodLogged = async (moodData) => {
    try {
      await moodService.create(moodData);
      // Refresh mood trends
      const updatedTrends = await moodService.getRecentTrends();
      setMoodTrends(updatedTrends);
    } catch (err) {
      console.error('Failed to save mood:', err);
    }
  };

const handleTaskComplete = async (taskId) => {
    try {
      // Find the goal containing this task
      const goalWithTask = goals.find(goal => 
        goal.tasks?.some(task => task.id === taskId)
      );
      
      if (goalWithTask) {
        // Update task completion status
        const updatedTasks = goalWithTask.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
);
        
        // Calculate new progress
        const completedTasks = updatedTasks.filter(task => task.completed).length;
        const newProgress = Math.round((completedTasks / updatedTasks.length) * 100);
        
        const updatedGoal = {
          ...goalWithTask,
          tasks: updatedTasks,
          progress: newProgress
        };
await goalService.update(goalWithTask.Id, updatedGoal);
        
        // Update local state
        setGoals(goals.map(goal => 
          goal.Id === goalWithTask.Id ? updatedGoal : goal
        ));
        
        toast.success('Task updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update task');
      console.error('Task update error:', err);
    }
  };

const handleGoalEdit = (goal) => {
    // Navigate to goals page or open modal
    toast.info('Goal editing coming soon!');
  };

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return (
      <Error
        title="Dashboard Error"
        message={error}
        onRetry={loadDashboardData}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          Welcome to FlowSync
        </h1>
        <p className="text-lg text-gray-600">
          Your personalized wellness dashboard adapts to your energy levels
        </p>
      </motion.div>

      {/* Energy Status - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-md mx-auto"
      >
{biometricData && (
          <EnergyStatusCard 
            energyData={biometricData} 
            recommendation={recommendation}
            energyBreakdown={energyBreakdown}
          />
        )}
      </motion.div>

      {/* Biometric Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
          Today's Biometrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {biometricData && (
            <>
              <BiometricCard
                title="Sleep Quality"
                value={biometricData.sleepScore}
                unit="/100"
                icon="Moon"
                trend={5}
                color="purple"
              />
              <BiometricCard
                title="Sleep Duration"
                value={biometricData.sleepHours}
                unit="hrs"
                icon="Clock"
                trend={-2}
                color="primary"
              />
              <BiometricCard
                title="Heart Rate Variability"
                value={biometricData.hrv}
                unit="ms"
                icon="Heart"
                trend={8}
                color="accent"
              />
              <BiometricCard
                title="Resting Heart Rate"
                value={biometricData.restingHR}
                unit="bpm"
                icon="Activity"
                trend={0}
                color="warning"
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Mood Logger & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MoodLogger onMoodLogged={handleMoodLogged} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {moodTrends.length > 0 ? (
            <TrendChart 
              title="7-Day Mood Trends"
              data={moodTrends}
              color="accent"
            />
          ) : (
            <Empty 
              type="insights"
              title="No mood data yet"
              message="Start logging your mood to see trends and patterns."
            />
)}
        </motion.div>
      </div>

      {/* Weekly Insights */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-gray-900">
              Weekly Insights
            </h2>
            <a
              href="/insights"
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View All Insights
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <InsightCard insight={insight} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Active Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-gray-900">
            Active Goals
          </h2>
          <a
            href="/goals"
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            View All Goals
          </a>
        </div>
        
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <GoalCard
                  goal={goal}
                  onComplete={handleTaskComplete}
                  onEdit={handleGoalEdit}
                />
              </motion.div>
            ))}
          </div>
) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Empty 
              type="goals"
              title="No active goals"
              message="Create your first goal to start tracking your progress."
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;