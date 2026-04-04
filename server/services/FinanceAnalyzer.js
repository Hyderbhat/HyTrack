/**
 * FinanceAnalyzer Service
 * Core business logic for spending analysis, alert generation
 * and personality calculation.
 */

const { PERSONALITIES, CATEGORIES } = require('../../shared/constants.js');

class FinanceAnalyzer {
  /**
   * Analyze spending by category and week-over-week change.
   * @param {Array} transactions
   */
  static analyzeSpending(transactions) {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const income   = transactions.filter((t) => t.type === 'income');

    const totalExpense = expenses.reduce((s, t) => s + Number(t.amount), 0);
    const totalIncome  = income.reduce((s, t) => s + Number(t.amount), 0);

    // Category breakdown
    const byCategory = {};
    expenses.forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + Number(t.amount);
    });

    const categoryBreakdown = Object.entries(byCategory)
      .map(([id, total]) => {
        const cat = CATEGORIES.find((c) => c.id === id);
        return {
          id,
          label: cat?.label || id,
          icon:  cat?.icon  || '📦',
          total,
          percentage: totalExpense > 0 ? (total / totalExpense) * 100 : 0,
        };
      })
      .sort((a, b) => b.total - a.total);

    // Week-over-week
    const now         = new Date();
    const oneWeekAgo  = new Date(now); oneWeekAgo.setDate(now.getDate() - 7);
    const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(now.getDate() - 14);

    const thisWeek = expenses
      .filter((t) => new Date(t.date) >= oneWeekAgo)
      .reduce((s, t) => s + Number(t.amount), 0);

    const lastWeek = expenses
      .filter((t) => new Date(t.date) >= twoWeeksAgo && new Date(t.date) < oneWeekAgo)
      .reduce((s, t) => s + Number(t.amount), 0);

    const weeklyChangePct = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;

    return {
      totalIncome,
      totalExpense,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
      categoryBreakdown,
      weeklyChange: { thisWeek, lastWeek, pct: weeklyChangePct },
    };
  }

  /**
   * Generate smart alerts based on spending patterns.
   * @param {Array} transactions
   * @param {number} budget Monthly budget
   */
  static generateAlerts(transactions, budget = 50000) {
    const alerts = [];
    const analysis = this.analyzeSpending(transactions);

    // Budget exceeded
    if (analysis.totalExpense > budget) {
      alerts.push({
        type: 'danger',
        icon: '🔴',
        title: 'Budget Exceeded',
        desc: `You've spent ${((analysis.totalExpense / budget) * 100).toFixed(0)}% of your monthly budget.`,
      });
    } else if (analysis.totalExpense > budget * 0.8) {
      alerts.push({
        type: 'warning',
        icon: '🟡',
        title: 'Approaching Budget Limit',
        desc: `You've used ${((analysis.totalExpense / budget) * 100).toFixed(0)}% of your budget.`,
      });
    }

    // High single-day spend
    const today = new Date().toISOString().split('T')[0];
    const todaySpend = transactions
      .filter((t) => t.type === 'expense' && t.date === today)
      .reduce((s, t) => s + Number(t.amount), 0);

    const avgDaily = analysis.totalExpense / 30;
    if (todaySpend > avgDaily * 2.5) {
      alerts.push({
        type: 'warning',
        icon: '🟡',
        title: 'High Spend Today',
        desc: `You spent ₹${todaySpend.toLocaleString('en-IN')} today — ${(todaySpend / avgDaily).toFixed(1)}× your daily average.`,
      });
    }

    // Weekly spike
    if (analysis.weeklyChange.pct > 30) {
      alerts.push({
        type: 'info',
        icon: '🔵',
        title: 'Spending Spike',
        desc: `Your spending rose by ${analysis.weeklyChange.pct.toFixed(0)}% vs last week.`,
      });
    }

    return alerts;
  }

  /**
   * Calculate the user's spending personality.
   * @param {Array} transactions
   */
  static calculatePersonality(transactions) {
    const { savingsRate, weeklyChange } = this.analyzeSpending(transactions);
    const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

    let type;
    if (savingsRate >= 30)   type = 'saver';
    else if (savingsRate >= 10) type = 'balanced';
    else if (expense > income)  type = 'overspender';
    else                        type = 'risky';

    return { type, ...PERSONALITIES[type], savingsRate };
  }

  /**
   * Generate dynamic AI insight messages.
   * @param {Array} transactions
   */
  static generateInsights(transactions) {
    const analysis = this.analyzeSpending(transactions);
    const insights = [];

    if (analysis.weeklyChange.pct !== 0) {
      const dir = analysis.weeklyChange.pct > 0 ? 'more' : 'less';
      insights.push({
        icon: '📊',
        tag:  'Spending Trend',
        message: `You spent ${Math.abs(analysis.weeklyChange.pct).toFixed(0)}% ${dir} this week compared to last week.`,
      });
    }

    if (analysis.categoryBreakdown.length > 0) {
      const top = analysis.categoryBreakdown[0];
      insights.push({
        icon: top.icon,
        tag:  'Top Category',
        message: `${top.label} is your highest expense at ${top.percentage.toFixed(0)}% of total spending.`,
      });
    }

    insights.push({
      icon: '💡',
      tag:  'Savings',
      message: `Your savings rate is ${analysis.savingsRate.toFixed(0)}%. ${
        analysis.savingsRate >= 20 ? 'Great job keeping expenses in check!' : 'Try to save at least 20% of your income.'
      }`,
    });

    return insights;
  }
}

module.exports = FinanceAnalyzer;
