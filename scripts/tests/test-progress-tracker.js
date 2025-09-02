/**
 * 測試進度追蹤腳本
 * 用於追蹤測試覆蓋率的進度和目標達成情況
 */

const fs = require('fs');
const path = require('path');

class TestProgressTracker {
  constructor() {
    this.progressFile = path.join(__dirname, 'test-progress.json');
    this.targets = {
      unit: { current: 0, target: 80, weight: 0.4 },
      integration: { current: 0, target: 70, weight: 0.3 },
      e2e: { current: 0, target: 60, weight: 0.2 },
      performance: { current: 0, target: 100, weight: 0.1 }
    };
    this.milestones = [
      { name: '基礎測試架構', target: 20, achieved: false },
      { name: '核心功能測試', target: 40, achieved: false },
      { name: '完整測試套件', target: 60, achieved: false },
      { name: '高品質測試', target: 80, achieved: false },
      { name: '測試驅動開發', target: 95, achieved: false }
    ];
  }

  // 載入進度數據
  loadProgress() {
    try {
      if (fs.existsSync(this.progressFile)) {
        const data = JSON.parse(fs.readFileSync(this.progressFile, 'utf8'));
        this.targets = { ...this.targets, ...data.targets };
        this.milestones = data.milestones || this.milestones;
        return true;
      }
    } catch (error) {
      console.error('載入進度數據時發生錯誤:', error.message);
    }
    return false;
  }

  // 保存進度數據
  saveProgress() {
    try {
      const data = {
        targets: this.targets,
        milestones: this.milestones,
        lastUpdated: new Date().toISOString(),
        overallProgress: this.calculateOverallProgress()
      };
      fs.writeFileSync(this.progressFile, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('保存進度數據時發生錯誤:', error.message);
      return false;
    }
  }

  // 更新測試覆蓋率
  updateCoverage(type, coverage) {
    if (this.targets[type]) {
      this.targets[type].current = Math.min(100, Math.max(0, coverage));
      this.updateMilestones();
      this.saveProgress();
      return true;
    }
    return false;
  }

  // 更新里程碑狀態
  updateMilestones() {
    const overallProgress = this.calculateOverallProgress();
    
    this.milestones.forEach(milestone => {
      if (!milestone.achieved && overallProgress >= milestone.target) {
        milestone.achieved = true;
        milestone.achievedAt = new Date().toISOString();
      }
    });
  }

  // 計算整體進度
  calculateOverallProgress() {
    let weightedSum = 0;
    let totalWeight = 0;
    
    Object.values(this.targets).forEach(target => {
      weightedSum += (target.current / 100) * target.weight;
      totalWeight += target.weight;
    });
    
    return totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
  }

  // 計算各類型進度
  calculateTypeProgress() {
    const progress = {};
    
    Object.entries(this.targets).forEach(([type, target]) => {
      progress[type] = {
        current: target.current,
        target: target.target,
        percentage: (target.current / target.target) * 100,
        status: target.current >= target.target ? 'achieved' : 'in-progress',
        remaining: Math.max(0, target.target - target.current)
      };
    });
    
    return progress;
  }

  // 生成進度報告
  generateProgressReport() {
    const overallProgress = this.calculateOverallProgress();
    const typeProgress = this.calculateTypeProgress();
    const nextMilestone = this.getNextMilestone(overallProgress);
    
    return {
      timestamp: new Date().toISOString(),
      overall: {
        progress: Math.round(overallProgress * 100) / 100,
        status: this.getOverallStatus(overallProgress),
        nextMilestone: nextMilestone
      },
      types: typeProgress,
      milestones: this.milestones,
      recommendations: this.generateRecommendations(typeProgress, overallProgress)
    };
  }

  // 獲取下一個里程碑
  getNextMilestone(currentProgress) {
    const unachieved = this.milestones.filter(m => !m.achieved);
    if (unachieved.length === 0) return null;
    
    return unachieved.reduce((next, milestone) => {
      if (milestone.target > currentProgress && 
          (!next || milestone.target < next.target)) {
        return milestone;
      }
      return next;
    }, null);
  }

  // 獲取整體狀態
  getOverallStatus(progress) {
    if (progress >= 95) return 'excellent';
    if (progress >= 80) return 'good';
    if (progress >= 60) return 'fair';
    if (progress >= 40) return 'poor';
    return 'critical';
  }

  // 生成改進建議
  generateRecommendations(typeProgress, overallProgress) {
    const recommendations = [];
    
    // 分析各類型進度
    Object.entries(typeProgress).forEach(([type, progress]) => {
      if (progress.percentage < 50) {
        recommendations.push({
          priority: 'high',
          type: type,
          message: `${type} 測試覆蓋率較低 (${progress.current}%)，建議優先改進`,
          action: `增加 ${type} 測試用例，目標達到 ${progress.target}%`
        });
      } else if (progress.percentage < 80) {
        recommendations.push({
          priority: 'medium',
          type: type,
          message: `${type} 測試覆蓋率中等 (${progress.current}%)，有改進空間`,
          action: `補充 ${type} 測試，爭取達到 ${progress.target}%`
        });
      }
    });
    
    // 整體進度建議
    if (overallProgress < 40) {
      recommendations.unshift({
        priority: 'critical',
        type: 'overall',
        message: '整體測試覆蓋率嚴重不足，需要立即行動',
        action: '制定測試計劃，優先實現基礎測試架構'
      });
    } else if (overallProgress < 60) {
      recommendations.unshift({
        priority: 'high',
        type: 'overall',
        message: '整體測試覆蓋率偏低，需要系統性改進',
        action: '平衡各類型測試，重點提升薄弱環節'
      });
    }
    
    // 里程碑建議
    const nextMilestone = this.getNextMilestone(overallProgress);
    if (nextMilestone) {
      const gap = nextMilestone.target - overallProgress;
      if (gap <= 10) {
        recommendations.push({
          priority: 'medium',
          type: 'milestone',
          message: `即將達成里程碑: ${nextMilestone.name}`,
          action: `再努力 ${gap.toFixed(1)}% 即可達成 ${nextMilestone.name} 里程碑`
        });
      }
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  // 顯示進度報告
  displayProgressReport() {
    const report = this.generateProgressReport();
    
    console.log('\n' + '='.repeat(70));
    console.log('                   測試進度追蹤報告');
    console.log('='.repeat(70));
    
    // 整體進度
    console.log(`\n📊 整體進度: ${report.overall.progress}%`);
    console.log(`📈 當前狀態: ${this.getStatusEmoji(report.overall.status)} ${report.overall.status}`);
    
    if (report.overall.nextMilestone) {
      console.log(`🎯 下個里程碑: ${report.overall.nextMilestone.name} (${report.overall.nextMilestone.target}%)`);
    }
    
    // 各類型進度
    console.log(`\n📋 各類型測試進度:`);
    Object.entries(report.types).forEach(([type, progress]) => {
      const status = progress.status === 'achieved' ? '✅' : '🔄';
      const percentage = progress.percentage.toFixed(1);
      console.log(`   ${status} ${type.toUpperCase()}: ${progress.current}% / ${progress.target}% (${percentage}%)`);
    });
    
    // 里程碑狀態
    console.log(`\n🏆 里程碑狀態:`);
    report.milestones.forEach((milestone, index) => {
      const status = milestone.achieved ? '✅' : '⏳';
      const achievedInfo = milestone.achieved ? ` (${new Date(milestone.achievedAt).toLocaleDateString()})` : '';
      console.log(`   ${index + 1}. ${status} ${milestone.name}: ${milestone.target}%${achievedInfo}`);
    });
    
    // 改進建議
    console.log(`\n💡 改進建議:`);
    report.recommendations.forEach((rec, index) => {
      const priority = this.getPriorityEmoji(rec.priority);
      console.log(`   ${index + 1}. ${priority} [${rec.priority.toUpperCase()}] ${rec.message}`);
      console.log(`      → ${rec.action}`);
    });
    
    console.log(`\n📅 報告生成時間: ${new Date(report.timestamp).toLocaleString()}`);
    console.log('='.repeat(70));
  }

  // 獲取狀態表情符號
  getStatusEmoji(status) {
    const emojis = {
      excellent: '🌟',
      good: '👍',
      fair: '😐',
      poor: '😟',
      critical: '🚨'
    };
    return emojis[status] || '❓';
  }

  // 獲取優先級表情符號
  getPriorityEmoji(priority) {
    const emojis = {
      critical: '🚨',
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
    return emojis[priority] || '❓';
  }

  // 重置進度
  resetProgress() {
    Object.values(this.targets).forEach(target => {
      target.current = 0;
    });
    
    this.milestones.forEach(milestone => {
      milestone.achieved = false;
      delete milestone.achievedAt;
    });
    
    this.saveProgress();
    console.log('進度已重置');
  }

  // 設置目標
  setTarget(type, target) {
    if (this.targets[type]) {
      this.targets[type].target = Math.max(0, Math.min(100, target));
      this.saveProgress();
      console.log(`${type} 測試目標已設置為 ${target}%`);
      return true;
    }
    return false;
  }
}

// 主函數
function main() {
  const tracker = new TestProgressTracker();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'report';
  
  switch (command) {
    case 'update':
      const type = args[1];
      const coverage = parseFloat(args[2]);
      if (type && !isNaN(coverage)) {
        if (tracker.updateCoverage(type, coverage)) {
          console.log(`${type} 測試覆蓋率已更新為 ${coverage}%`);
        } else {
          console.error(`無效的測試類型: ${type}`);
        }
      } else {
        console.error('用法: node test-progress-tracker.js update <type> <coverage>');
      }
      break;
      
    case 'reset':
      tracker.resetProgress();
      break;
      
    case 'set-target':
      const targetType = args[1];
      const targetValue = parseFloat(args[2]);
      if (targetType && !isNaN(targetValue)) {
        tracker.setTarget(targetType, targetValue);
      } else {
        console.error('用法: node test-progress-tracker.js set-target <type> <target>');
      }
      break;
      
    case 'report':
    default:
      tracker.displayProgressReport();
      break;
  }
}

// 如果直接運行此腳本
if (require.main === module) {
  main();
}

module.exports = TestProgressTracker;
