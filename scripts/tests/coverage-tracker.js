/**
 * 測試覆蓋率追蹤腳本
 * 用於監控和報告測試覆蓋率趨勢
 */

const fs = require('fs');
const path = require('path');

class CoverageTracker {
  constructor() {
    this.coverageDir = path.join(__dirname, 'coverage');
    this.reportsDir = path.join(__dirname, 'reports');
    this.historyFile = path.join(this.reportsDir, 'coverage-history.json');
    this.targets = {
      unit: 80,
      integration: 70,
      e2e: 60,
      performance: 100,
      overall: 75
    };
  }

  // 讀取覆蓋率數據
  readCoverageData() {
    try {
      const lcovFile = path.join(this.coverageDir, 'lcov.info');
      if (!fs.existsSync(lcovFile)) {
        console.log('覆蓋率文件不存在，請先運行測試');
        return null;
      }

      const lcovContent = fs.readFileSync(lcovFile, 'utf8');
      return this.parseLcovData(lcovContent);
    } catch (error) {
      console.error('讀取覆蓋率數據時發生錯誤:', error.message);
      return null;
    }
  }

  // 解析 LCOV 數據
  parseLcovData(lcovContent) {
    const lines = lcovContent.split('\n');
    let currentFile = null;
    const files = {};
    let totalLines = 0;
    let coveredLines = 0;

    for (const line of lines) {
      if (line.startsWith('SF:')) {
        currentFile = line.substring(3);
        files[currentFile] = { lines: 0, covered: 0 };
      } else if (line.startsWith('LF:')) {
        const lineCount = parseInt(line.substring(3));
        if (currentFile && files[currentFile]) {
          files[currentFile].lines = lineCount;
          totalLines += lineCount;
        }
      } else if (line.startsWith('LH:')) {
        const coveredCount = parseInt(line.substring(3));
        if (currentFile && files[currentFile]) {
          files[currentFile].covered = coveredCount;
          coveredLines += coveredCount;
        }
      }
    }

    return {
      files,
      totalLines,
      coveredLines,
      coverage: totalLines > 0 ? (coveredLines / totalLines) * 100 : 0
    };
  }

  // 分析覆蓋率趨勢
  analyzeCoverageTrend() {
    try {
      if (!fs.existsSync(this.historyFile)) {
        console.log('覆蓋率歷史文件不存在，創建新的歷史記錄');
        return this.createInitialHistory();
      }

      const history = JSON.parse(fs.readFileSync(this.historyFile, 'utf8'));
      const currentData = this.readCoverageData();
      
      if (!currentData) {
        return null;
      }

      const currentRecord = {
        timestamp: new Date().toISOString(),
        overall: currentData.coverage,
        details: currentData
      };

      history.push(currentRecord);

      // 保持最近 30 條記錄
      if (history.length > 30) {
        history.shift();
      }

      // 保存更新後的歷史
      fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));

      return this.generateTrendReport(history);
    } catch (error) {
      console.error('分析覆蓋率趨勢時發生錯誤:', error.message);
      return null;
    }
  }

  // 創建初始歷史記錄
  createInitialHistory() {
    const initialHistory = [];
    const currentData = this.readCoverageData();
    
    if (currentData) {
      initialHistory.push({
        timestamp: new Date().toISOString(),
        overall: currentData.coverage,
        details: currentData
      });
    }

    // 確保目錄存在
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }

    fs.writeFileSync(this.historyFile, JSON.stringify(initialHistory, null, 2));
    return this.generateTrendReport(initialHistory);
  }

  // 生成趨勢報告
  generateTrendReport(history) {
    if (history.length < 2) {
      return {
        message: '需要更多數據來生成趨勢報告',
        currentCoverage: history[0]?.overall || 0,
        trend: 'stable'
      };
    }

    const recent = history.slice(-5);
    const older = history.slice(-10, -5);

    const recentAvg = recent.reduce((sum, record) => sum + record.overall, 0) / recent.length;
    const olderAvg = older.reduce((sum, record) => sum + record.overall, 0) / older.length;

    let trend = 'stable';
    if (recentAvg > olderAvg + 1) {
      trend = 'improving';
    } else if (recentAvg < olderAvg - 1) {
      trend = 'declining';
    }

    const currentCoverage = history[history.length - 1].overall;
    const targetGap = this.targets.overall - currentCoverage;

    return {
      currentCoverage: Math.round(currentCoverage * 100) / 100,
      targetCoverage: this.targets.overall,
      targetGap: Math.round(targetGap * 100) / 100,
      trend,
      recentAverage: Math.round(recentAvg * 100) / 100,
      olderAverage: Math.round(olderAvg * 100) / 100,
      change: Math.round((recentAvg - olderAvg) * 100) / 100,
      historyLength: history.length,
      lastUpdated: history[history.length - 1].timestamp
    };
  }

  // 生成覆蓋率摘要
  generateCoverageSummary() {
    const currentData = this.readCoverageData();
    if (!currentData) {
      return null;
    }

    const summary = {
      timestamp: new Date().toISOString(),
      overall: {
        coverage: Math.round(currentData.coverage * 100) / 100,
        target: this.targets.overall,
        status: currentData.coverage >= this.targets.overall ? 'pass' : 'fail'
      },
      files: {
        total: Object.keys(currentData.files).length,
        covered: Object.values(currentData.files).filter(f => f.covered > 0).length
      },
      lines: {
        total: currentData.totalLines,
        covered: currentData.coveredLines,
        uncovered: currentData.totalLines - currentData.coveredLines
      },
      recommendations: this.generateRecommendations(currentData)
    };

    return summary;
  }

  // 生成改進建議
  generateRecommendations(coverageData) {
    const recommendations = [];
    const currentCoverage = coverageData.coverage;

    if (currentCoverage < this.targets.overall) {
      recommendations.push(`整體覆蓋率 ${currentCoverage.toFixed(1)}% 低於目標 ${this.targets.overall}%`);
    }

    // 分析未覆蓋的文件
    const uncoveredFiles = Object.entries(coverageData.files)
      .filter(([file, data]) => data.covered === 0)
      .slice(0, 5); // 只顯示前 5 個

    if (uncoveredFiles.length > 0) {
      recommendations.push(`發現 ${uncoveredFiles.length} 個完全未覆蓋的文件，建議優先添加測試`);
      uncoveredFiles.forEach(([file, data]) => {
        recommendations.push(`  - ${path.basename(file)} (${data.lines} 行)`);
      });
    }

    // 分析覆蓋率低的文件
    const lowCoverageFiles = Object.entries(coverageData.files)
      .filter(([file, data]) => {
        const fileCoverage = data.lines > 0 ? (data.covered / data.lines) * 100 : 0;
        return fileCoverage > 0 && fileCoverage < 50;
      })
      .slice(0, 3);

    if (lowCoverageFiles.length > 0) {
      recommendations.push(`發現 ${lowCoverageFiles.length} 個覆蓋率低於 50% 的文件`);
      lowCoverageFiles.forEach(([file, data]) => {
        const fileCoverage = (data.covered / data.lines) * 100;
        recommendations.push(`  - ${path.basename(file)}: ${fileCoverage.toFixed(1)}%`);
      });
    }

    if (recommendations.length === 0) {
      recommendations.push('覆蓋率良好，建議保持現有測試品質');
    }

    return recommendations;
  }

  // 生成詳細報告
  generateDetailedReport() {
    const summary = this.generateCoverageSummary();
    const trend = this.analyzeCoverageTrend();

    if (!summary || !trend) {
      return null;
    }

    const report = {
      summary,
      trend,
      targets: this.targets,
      generatedAt: new Date().toISOString()
    };

    // 保存詳細報告
    const reportFile = path.join(this.reportsDir, 'coverage-detailed-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    return report;
  }

  // 顯示覆蓋率報告
  displayReport() {
    const report = this.generateDetailedReport();
    if (!report) {
      console.log('無法生成覆蓋率報告');
      return;
    }

    console.log('\n' + '='.repeat(60));
    console.log('          測試覆蓋率報告');
    console.log('='.repeat(60));
    
    console.log(`\n📊 整體覆蓋率: ${report.summary.overall.coverage}%`);
    console.log(`🎯 目標覆蓋率: ${report.summary.overall.target}%`);
    console.log(`📈 覆蓋率狀態: ${report.summary.overall.status === 'pass' ? '✅ 達標' : '❌ 未達標'}`);
    
    console.log(`\n📁 文件統計:`);
    console.log(`   - 總文件數: ${report.summary.files.total}`);
    console.log(`   - 已覆蓋文件: ${report.summary.files.covered}`);
    console.log(`   - 未覆蓋文件: ${report.summary.files.total - report.summary.files.covered}`);
    
    console.log(`\n📝 程式碼行數:`);
    console.log(`   - 總行數: ${report.summary.lines.total}`);
    console.log(`   - 已覆蓋: ${report.summary.lines.covered}`);
    console.log(`   - 未覆蓋: ${report.summary.lines.uncovered}`);
    
    console.log(`\n📈 趨勢分析:`);
    console.log(`   - 當前趨勢: ${this.getTrendEmoji(report.trend.trend)} ${report.trend.trend}`);
    console.log(`   - 最近平均: ${report.trend.recentAverage}%`);
    console.log(`   - 變化幅度: ${report.trend.change > 0 ? '+' : ''}${report.trend.change}%`);
    
    console.log(`\n💡 改進建議:`);
    report.summary.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
    
    console.log(`\n📅 報告生成時間: ${new Date(report.generatedAt).toLocaleString()}`);
    console.log('='.repeat(60));
  }

  // 獲取趨勢表情符號
  getTrendEmoji(trend) {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  }
}

// 主函數
function main() {
  const tracker = new CoverageTracker();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'report';
  
  switch (command) {
    case 'analyze':
      tracker.analyzeCoverageTrend();
      break;
      
    case 'summary':
      const summary = tracker.generateCoverageSummary();
      console.log(JSON.stringify(summary, null, 2));
      break;
      
    case 'trend':
      const trend = tracker.analyzeCoverageTrend();
      console.log(JSON.stringify(trend, null, 2));
      break;
      
    case 'detailed':
      const detailed = tracker.generateDetailedReport();
      console.log(JSON.stringify(detailed, null, 2));
      break;
      
    case 'report':
    default:
      tracker.displayReport();
      break;
  }
}

// 如果直接運行此腳本
if (require.main === module) {
  main();
}

module.exports = CoverageTracker;
