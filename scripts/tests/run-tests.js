#!/usr/bin/env node

/**
 * 測試運行腳本
 * 用於執行不同類型的測試並生成報告
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 顏色輸出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// 測試配置
const testConfig = {
  unit: {
    pattern: 'tests/unit',
    description: '單元測試',
    target: 80
  },
  integration: {
    pattern: 'tests/integration',
    description: '整合測試',
    target: 70
  },
  e2e: {
    pattern: 'tests/e2e',
    description: '端到端測試',
    target: 60
  },
  performance: {
    pattern: 'tests/performance',
    description: '效能測試',
    target: 100
  }
};

// 工具函數
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  log('\n' + '='.repeat(60), 'bright');
  log(`  ${title}`, 'bright');
  log('='.repeat(60), 'bright');
}

function logSection(title) {
  log(`\n${title}`, 'cyan');
  log('-'.repeat(title.length));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// 檢查依賴
function checkDependencies() {
  logSection('檢查依賴');
  
  try {
    // 檢查 Jest
    execSync('jest --version', { stdio: 'pipe' });
    logSuccess('Jest 已安裝');
  } catch (error) {
    logError('Jest 未安裝，請執行: npm install --save-dev jest');
    process.exit(1);
  }
  
  try {
    // 檢查必要的套件
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const devDependencies = packageJson.devDependencies || {};
    
    if (devDependencies['jest-junit']) {
      logSuccess('jest-junit 已安裝');
    } else {
      logWarning('jest-junit 未安裝，建議安裝以生成 JUnit 報告');
    }
    
    if (devDependencies['@types/jest']) {
      logSuccess('@types/jest 已安裝');
    } else {
      logWarning('@types/jest 未安裝，建議安裝以獲得更好的 TypeScript 支援');
    }
  } catch (error) {
    logWarning('無法讀取 package.json');
  }
}

// 運行單一測試類型
function runTestType(type) {
  const config = testConfig[type];
  if (!config) {
    logError(`未知的測試類型: ${type}`);
    return false;
  }
  
  logSection(`運行 ${config.description}`);
  
  try {
    const command = `jest ${config.pattern} --coverage --testTimeout=30000`;
    logInfo(`執行命令: ${command}`);
    
    const result = execSync(command, {
      cwd: __dirname,
      stdio: 'pipe',
      encoding: 'utf8'
    });
    
    logSuccess(`${config.description} 完成`);
    return true;
  } catch (error) {
    logError(`${config.description} 失敗`);
    if (error.stdout) {
      console.log(error.stdout);
    }
    if (error.stderr) {
      console.log(error.stderr);
    }
    return false;
  }
}

// 運行所有測試
function runAllTests() {
  logSection('運行所有測試');
  
  const results = {};
  let allPassed = true;
  
  for (const [type, config] of Object.entries(testConfig)) {
    logInfo(`開始 ${config.description}...`);
    results[type] = runTestType(type);
    if (!results[type]) {
      allPassed = false;
    }
  }
  
  // 生成總結報告
  logSection('測試結果總結');
  
  for (const [type, config] of Object.entries(testConfig)) {
    const status = results[type] ? '✅ 通過' : '❌ 失敗';
    log(`${config.description}: ${status}`);
  }
  
  if (allPassed) {
    logSuccess('所有測試都通過了！');
  } else {
    logError('部分測試失敗，請檢查錯誤訊息');
    process.exit(1);
  }
}

// 生成覆蓋率報告
function generateCoverageReport() {
  logSection('生成覆蓋率報告');
  
  try {
    // 檢查覆蓋率目錄
    const coverageDir = path.join(__dirname, 'coverage');
    if (fs.existsSync(coverageDir)) {
      logSuccess('覆蓋率報告已生成');
      logInfo(`報告位置: ${coverageDir}`);
      
      // 檢查 HTML 報告
      const htmlReport = path.join(coverageDir, 'index.html');
      if (fs.existsSync(htmlReport)) {
        logInfo(`HTML 報告: ${htmlReport}`);
      }
      
      // 檢查 LCOV 報告
      const lcovReport = path.join(coverageDir, 'lcov.info');
      if (fs.existsSync(lcovReport)) {
        logInfo(`LCOV 報告: ${lcovReport}`);
      }
    } else {
      logWarning('覆蓋率報告未生成');
    }
  } catch (error) {
    logError(`生成覆蓋率報告時發生錯誤: ${error.message}`);
  }
}

// 生成測試報告
function generateTestReport() {
  logSection('生成測試報告');
  
  try {
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    // 檢查 JUnit 報告
    const junitReport = path.join(reportsDir, 'junit.xml');
    if (fs.existsSync(junitReport)) {
      logSuccess('JUnit 報告已生成');
      logInfo(`報告位置: ${junitReport}`);
    } else {
      logWarning('JUnit 報告未生成');
    }
    
    // 生成簡單的測試摘要
    const summary = {
      timestamp: new Date().toISOString(),
      testTypes: Object.keys(testConfig),
      totalTests: 0,
      passedTests: 0,
      failedTests: 0
    };
    
    const summaryFile = path.join(reportsDir, 'test-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    logSuccess('測試摘要已生成');
    
  } catch (error) {
    logError(`生成測試報告時發生錯誤: ${error.message}`);
  }
}

// 清理測試文件
function cleanupTestFiles() {
  logSection('清理測試文件');
  
  try {
    const dirsToClean = ['coverage', 'reports'];
    
    for (const dir of dirsToClean) {
      const dirPath = path.join(__dirname, dir);
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        logSuccess(`已清理 ${dir} 目錄`);
      }
    }
  } catch (error) {
    logError(`清理測試文件時發生錯誤: ${error.message}`);
  }
}

// 主函數
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  logHeader('概念股篩選系統 - 測試運行器');
  
  // 檢查依賴
  checkDependencies();
  
  switch (command) {
    case 'unit':
      runTestType('unit');
      break;
      
    case 'integration':
      runTestType('integration');
      break;
      
    case 'e2e':
      runTestType('e2e');
      break;
      
    case 'performance':
      runTestType('performance');
      break;
      
    case 'coverage':
      generateCoverageReport();
      break;
      
    case 'report':
      generateTestReport();
      break;
      
    case 'clean':
      cleanupTestFiles();
      break;
      
    case 'all':
    default:
      runAllTests();
      generateCoverageReport();
      generateTestReport();
      break;
  }
  
  logHeader('測試完成');
}

// 錯誤處理
process.on('uncaughtException', (error) => {
  logError(`未捕獲的異常: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`未處理的 Promise 拒絕: ${reason}`);
  process.exit(1);
});

// 運行主函數
if (require.main === module) {
  main();
}

module.exports = {
  runTestType,
  runAllTests,
  generateCoverageReport,
  generateTestReport,
  cleanupTestFiles
};
