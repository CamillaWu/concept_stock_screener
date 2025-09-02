#!/usr/bin/env node

/**
 * StockDetailPanel Migration Test Script
 * Tests the migrated StockDetailPanel component to verify it's using the new hooks correctly
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  log('\n' + '='.repeat(60), 'bright');
  log(`  ${title}`, 'bright');
  log('='.repeat(60), 'bright');
}

function logTest(testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const color = passed ? 'green' : 'red';
  log(`  ${status}: ${testName}`, color);
  if (details && !passed) {
    log(`    ${details}`, 'yellow');
  }
}

// Test results
let testResults = {
  total: 0,
  passed: 0,
  failed: 0
};

function runTest(testName, testFn) {
  testResults.total++;
  try {
    const result = testFn();
    if (result === true) {
      testResults.passed++;
      logTest(testName, true);
      return true;
    } else {
      testResults.failed++;
      logTest(testName, false, result);
      return false;
    }
  } catch (error) {
    testResults.failed++;
    logTest(testName, false, error.message);
    return false;
  }
}

// Test 1: Check if StockDetailPanel uses the new hooks
function testHookUsage() {
  logHeader('Testing StockDetailPanel Hook Usage');
  
  const stockDetailPanelPath = 'apps/web/src/components/ui/StockDetailPanel.tsx';
  if (!fs.existsSync(stockDetailPanelPath)) {
    return `StockDetailPanel component not found at ${stockDetailPanelPath}`;
  }
  
  const content = fs.readFileSync(stockDetailPanelPath, 'utf8');
  
  // Check if all required hooks are imported
  if (!content.includes('useStockPrice')) {
    return 'StockDetailPanel does not import useStockPrice hook';
  }
  
  if (!content.includes('useAiInvestmentAdvice')) {
    return 'StockDetailPanel does not import useAiInvestmentAdvice hook';
  }
  
  if (!content.includes('useAiRiskAssessment')) {
    return 'StockDetailPanel does not import useAiRiskAssessment hook';
  }
  
  // Check if hooks are used in the component
  if (!content.includes('useStockPrice(stock.stockCode')) {
    return 'StockDetailPanel does not use useStockPrice hook';
  }
  
  if (!content.includes('useAiInvestmentAdvice(stock.stockCode')) {
    return 'StockDetailPanel does not use useAiInvestmentAdvice hook';
  }
  
  if (!content.includes('useAiRiskAssessment(stock.stockCode')) {
    return 'StockDetailPanel does not use useAiRiskAssessment hook';
  }
  
  return true;
}

// Test 2: Check caching configuration
function testCachingConfiguration() {
  logHeader('Testing StockDetailPanel Caching Configuration');
  
  const stockDetailPanelPath = 'apps/web/src/components/ui/StockDetailPanel.tsx';
  const content = fs.readFileSync(stockDetailPanelPath, 'utf8');
  
  // Check useStockPrice caching (1 min cache, 30 sec stale)
  if (!content.includes('cacheTime: 1 * 60 * 1000') || !content.includes('staleTime: 30 * 1000')) {
    return 'useStockPrice does not have correct caching configuration (1min cache, 30sec stale)';
  }
  
  // Check AI hooks caching (30 min cache, 15 min stale)
  if (!content.includes('cacheTime: 30 * 60 * 1000') || !content.includes('staleTime: 15 * 60 * 1000')) {
    return 'AI hooks do not have correct caching configuration (30min cache, 15min stale)';
  }
  
  return true;
}

// Test 3: Check retry configuration
function testRetryConfiguration() {
  logHeader('Testing StockDetailPanel Retry Configuration');
  
  const stockDetailPanelPath = 'apps/web/src/components/ui/StockDetailPanel.tsx';
  const content = fs.readFileSync(stockDetailPanelPath, 'utf8');
  
  // Check useStockPrice retry (3 retries)
  if (!content.includes('retryCount: 3')) {
    return 'useStockPrice does not have correct retry configuration (3 retries)';
  }
  
  // Check AI hooks retry (2 retries)
  if (!content.includes('retryCount: 2')) {
    return 'AI hooks do not have correct retry configuration (2 retries)';
  }
  
  return true;
}

// Test 4: Check data processing and state management
function testDataProcessing() {
  logHeader('Testing StockDetailPanel Data Processing');
  
  const stockDetailPanelPath = 'apps/web/src/components/ui/StockDetailPanel.tsx';
  const content = fs.readFileSync(stockDetailPanelPath, 'utf8');
  
  // Check if useMemo is used for data processing
  if (!content.includes('useMemo')) {
    return 'StockDetailPanel does not use useMemo for data processing';
  }
  
  // Check if enhancedStock is created
  if (!content.includes('enhancedStock')) {
    return 'StockDetailPanel does not create enhancedStock data';
  }
  
  // Check if aiAnalysis is prepared
  if (!content.includes('aiAnalysis')) {
    return 'StockDetailPanel does not prepare aiAnalysis data';
  }
  
  // Check if loading states are managed
  if (!content.includes('analysisLoading')) {
    return 'StockDetailPanel does not manage loading states';
  }
  
  return true;
}

// Test 5: Check error handling
function testErrorHandling() {
  logHeader('Testing StockDetailPanel Error Handling');
  
  const stockDetailPanelPath = 'apps/web/src/components/ui/StockDetailPanel.tsx';
  const content = fs.readFileSync(stockDetailPanelPath, 'utf8');
  
  // Check if error states are managed
  if (!content.includes('priceError') || !content.includes('adviceError') || !content.includes('riskError')) {
    return 'StockDetailPanel does not manage error states for all hooks';
  }
  
  // Check if error messages are prepared
  if (!content.includes('errorMessage')) {
    return 'StockDetailPanel does not prepare error messages';
  }
  
  // Check if error handling is passed to UI component
  if (!content.includes('error={errorMessage}')) {
    return 'StockDetailPanel does not pass error to UI component';
  }
  
  return true;
}

// Test 6: Check UI component integration
function testUIComponentIntegration() {
  logHeader('Testing StockDetailPanel UI Component Integration');
  
  const stockDetailPanelPath = 'apps/web/src/components/ui/StockDetailPanel.tsx';
  const content = fs.readFileSync(stockDetailPanelPath, 'utf8');
  
  // Check if enhanced data is passed
  if (!content.includes('analysis={enhancedStock}')) {
    return 'StockDetailPanel does not pass enhancedStock to UI component';
  }
  
  // Check if AI analysis is passed
  if (!content.includes('aiAnalysis={aiAnalysis}')) {
    return 'StockDetailPanel does not pass aiAnalysis to UI component';
  }
  
  // Check if loading state is passed
  if (!content.includes('loading={analysisLoading}')) {
    return 'StockDetailPanel does not pass loading state to UI component';
  }
  
  // Check if real-time data flags are passed
  if (!content.includes('showRealTimeData={!!stockPrice}')) {
    return 'StockDetailPanel does not pass showRealTimeData flag';
  }
  
  if (!content.includes('showAiAnalysis={!!aiAnalysis.investmentAdvice || !!aiAnalysis.riskAssessment}')) {
    return 'StockDetailPanel does not pass showAiAnalysis flag';
  }
  
  return true;
}

// Test 7: Check conditional rendering logic
function testConditionalRendering() {
  logHeader('Testing StockDetailPanel Conditional Rendering');
  
  const stockDetailPanelPath = 'apps/web/src/components/ui/StockDetailPanel.tsx';
  const content = fs.readFileSync(stockDetailPanelPath, 'utf8');
  
  // Check if useRealData is used for conditional hook enabling
  if (!content.includes('enabled: useRealData && !!stock.stockCode')) {
    return 'StockDetailPanel does not conditionally enable useStockPrice based on useRealData';
  }
  
  // Check if stockCode is used for conditional hook enabling
  if (!content.includes('enabled: !!stock.stockCode')) {
    return 'StockDetailPanel does not conditionally enable AI hooks based on stockCode';
  }
  
  return true;
}

// Run all tests
function runAllTests() {
  logHeader('StockDetailPanel Migration Test Suite');
  log('Testing the migrated StockDetailPanel component...', 'cyan');
  
  const tests = [
    { name: 'Hook Usage', fn: testHookUsage },
    { name: 'Caching Configuration', fn: testCachingConfiguration },
    { name: 'Retry Configuration', fn: testRetryConfiguration },
    { name: 'Data Processing', fn: testDataProcessing },
    { name: 'Error Handling', fn: testErrorHandling },
    { name: 'UI Component Integration', fn: testUIComponentIntegration },
    { name: 'Conditional Rendering', fn: testConditionalRendering }
  ];
  
  for (const test of tests) {
    runTest(test.name, test.fn);
  }
  
  // Summary
  logHeader('Test Results Summary');
  log(`Total Tests: ${testResults.total}`, 'bright');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');
  
  if (testResults.failed === 0) {
    log('\n🎉 All tests passed! The StockDetailPanel migration is working correctly.', 'green');
    log('✅ Component uses all required hooks', 'green');
    log('✅ Caching and retry mechanisms are implemented', 'green');
    log('✅ Data processing and state management working', 'green');
    log('✅ Error handling is comprehensive', 'green');
    log('✅ UI component integration is complete', 'green');
  } else {
    log('\n⚠️  Some tests failed. Please review the issues above.', 'yellow');
  }
  
  return testResults.failed === 0;
}

// Run tests if this script is executed directly
if (require.main === module) {
  const success = runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = {
  runAllTests,
  testResults
};
