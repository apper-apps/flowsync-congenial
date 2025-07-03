import { endOfWeek, format, getDay, startOfWeek, subDays } from "date-fns";
import { moodService } from "@/services/api/moodService";
import { biometricService } from "@/services/api/biometricService";
import { goalService } from "@/services/api/goalService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class InsightAnalyzer {
  generateSleepRecommendations(avgHours, avgScore) {
    const recommendations = [];
    
    if (avgHours < 7) {
      recommendations.push('Aim for 7-9 hours of sleep per night');
    }
    if (avgScore < 0.7) {
      recommendations.push('Consider improving sleep quality through better sleep hygiene');
    }
    if (avgHours > 9) {
      recommendations.push('You might be getting too much sleep - consider consistency');
    }
    
    return recommendations;
  }
  
  calculateConfidence(dataPoints) {
    if (dataPoints < 3) return 0.3;
    if (dataPoints < 7) return 0.6;
    if (dataPoints < 14) return 0.8;
    return 0.95;
  }
  
  analyzeSleepPattern(sleepData) {
    if (!sleepData || sleepData.length === 0) {
      return {
        pattern: 'insufficient_data',
        insights: ['Not enough sleep data to analyze patterns'],
        recommendations: ['Start tracking your sleep consistently'],
        confidence: 0.1
      };
    }
    
    const recentSleep = sleepData.slice(-14);
    const avgSleepHours = recentSleep.reduce((sum, entry) => sum + (entry.hours || 0), 0) / recentSleep.length;
    const avgSleepScore = recentSleep.reduce((sum, entry) => sum + (entry.score || 0), 0) / recentSleep.length;
    
    const sleepTrend = this.calculateTrend(recentSleep.map(entry => entry.hours || 0));
    
    return {
      pattern: avgSleepHours >= 7 && avgSleepHours <= 9 ? 'healthy' : 'needs_improvement',
      insights: [
        `Average sleep: ${avgSleepHours.toFixed(1)} hours`,
        `Sleep quality score: ${avgSleepScore.toFixed(0)}%`,
        `Sleep trend: ${sleepTrend > 0 ? 'Improving' : sleepTrend < 0 ? 'Declining' : 'Stable'}`
      ],
      recommendations: this.generateSleepRecommendations(avgSleepHours, avgSleepScore / 100),
      confidence: this.calculateConfidence(recentSleep.length)
    };
  }
  
  calculateTrend(values) {
    if (values.length < 2) return 0;
    
    const first = values.slice(0, Math.floor(values.length / 2));
    const second = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = first.reduce((sum, val) => sum + val, 0) / first.length;
    const secondAvg = second.reduce((sum, val) => sum + val, 0) / second.length;
    
    return secondAvg - firstAvg;
  }
}

const analyzer = new InsightAnalyzer();

export const insightService = {
  generateAdvancedRecommendations(patterns) {
    return [
      'Schedule your most challenging tasks during identified optimal windows',
      'Use predictive mood patterns to plan important meetings and decisions',
      'Implement stress recovery techniques during identified high-stress periods'
    ];
  },

  getGoalCorrelation(goals, pattern) {
    const healthGoals = goals.filter(goal => goal.category === 'health');
    const productivityGoals = goals.filter(goal => goal.category === 'productivity');
    const personalGoals = goals.filter(goal => goal.category === 'personal');
    
    if (goals.length === 0) return null;
    
    const correlations = {
      health: healthGoals.length > 0 ? 0.8 : 0.2,
      productivity: productivityGoals.length > 0 ? 0.7 : 0.3,
      personal: personalGoals.length > 0 ? 0.6 : 0.4
    };
    
    return correlations;
  },

  async getWeeklyInsights() {
    try {
      await delay(500);
      
      const endDate = new Date();
      const startDate = startOfWeek(endDate);
      
      const [moodData, biometricData, goals] = await Promise.all([
        moodService.getAll(),
        biometricService.getAll(),
        goalService.getAll()
      ]);
      
      const weeklyMood = moodData.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      });
      
      const weeklyBiometrics = biometricData.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      });
      
      const sleepPattern = analyzer.analyzeSleepPattern(weeklyBiometrics);
      
      const insights = [
        {
          Id: 1,
          title: 'Sleep Pattern Analysis',
          type: 'sleep',
          description: 'Your sleep patterns this week',
          data: sleepPattern,
          confidence: sleepPattern.confidence,
          createdAt: new Date().toISOString()
        }
      ];
      
      return insights.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    } catch (error) {
      console.error('Error generating weekly insights:', error);
      return [];
    }
  },

  async getById(id) {
    await delay(200);
    const insights = await this.getWeeklyInsights();
    return insights.find(insight => insight.Id === parseInt(id));
  },

  async create(data) {
    await delay(350);
    // Insights are generated, not created manually
    throw new Error('Insights cannot be created manually');
  },

  async update(id, data) {
    await delay(300);
    // Insights are generated, not updated manually
    throw new Error('Insights cannot be updated manually');
  },

  async delete(id) {
    await delay(250);
    // Insights are generated, not deleted manually
    throw new Error('Insights cannot be deleted manually');
  }
};