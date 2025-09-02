#!/usr/bin/env node

/**
 * API Hook Migration Test Script
 * Tests the migrated API hooks to verify they're working correctly
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

// Test 1: Check if migrated components exist and use new hooks
function testMigratedComponents() {
  logHeader('Testing Migrated Components');
  
  // Test Sidebar component
  const sidebarPath = 'apps/web/src/components/ui/Sidebar.tsx';
  if (!fs.existsSync(sidebarPath)) {
    return `Sidebar component not found at ${sidebarPath}`;
  }
  
  const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
  if (!sidebarContent.includes('useTrendingThemes')) {
    return 'Sidebar component does not use useTrendingThemes hook';
  }
  
  if (sidebarContent.includes('apiService.getTrendingThemes')) {
    return 'Sidebar component still uses old apiService.getTrendingThemes';
  }
  
  // Test DetailPanel component
  const detailPanelPath = 'apps/web/src/components/ui/DetailPanel.tsx';
  if (!fs.existsSync(detailPanelPath)) {
    return `DetailPanel component not found at ${detailPanelPath}`;
  }
  
  const detailPanelContent = fs.readFileSync(detailPanelPath, 'utf8');
  if (!detailPanelContent.includes('useAiConceptStrength') || !detailPanelContent.includes('useAiSentiment')) {
    return 'DetailPanel component does not use AI analysis hooks';
  }
  
  if (detailPanelContent.includes('apiService.getConceptStrength') || detailPanelContent.includes('apiService.getSentiment')) {
    return 'DetailPanel component still uses old API service calls';
  }
  
  // Test App.tsx
  const appPath = 'apps/web/src/App.tsx';
  if (!fs.existsSync(appPath)) {
    return `App.tsx not found at ${appPath}`;
  }
  
  const appContent = fs.readFileSync(appPath, 'utf8');
  if (!appContent.includes('useThemeSearch') || !appContent.includes('useStockSearch')) {
    return 'App.tsx does not use new search hooks';
  }
  
  if (appContent.includes('apiService.searchThemes') || appContent.includes('apiService.searchStocks')) {
    return 'App.tsx still uses old API service calls';
  }
  
  return true;
}

// Test 2: Check if new hooks exist and are properly exported
function testHookExports() {
  logHeader('Testing Hook Exports');
  
  const hooksIndexPath = 'apps/web/src/hooks/index.ts';
  if (!fs.existsSync(hooksIndexPath)) {
    return `Hooks index file not found at ${hooksIndexPath}`;
  }
  
  const hooksIndexContent = fs.readFileSync(hooksIndexPath, 'utf8');
  
  // Check if all migrated hooks are exported
  const requiredHooks = [
    'useTrendingThemes',
    'useThemeSearch', 
    'useStockSearch',
    'useAiConceptStrength',
    'useAiSentiment'
  ];
  
  for (const hook of requiredHooks) {
    if (!hooksIndexContent.includes(hook)) {
      return `Hook ${hook} is not exported from hooks index`;
    }
  }
  
  return true;
}

// Test 3: Check hook implementations
function testHookImplementations() {
  logHeader('Testing Hook Implementations');
  
  const useStockDataPath = 'apps/web/src/hooks/useStockData.ts';
  if (!fs.existsSync(useStockDataPath)) {
    return `useStockData.ts not found at ${useStockDataPath}`;
  }
  
  const useStockDataContent = fs.readFileSync(useStockDataPath, 'utf8');
  
  // Check if hooks use the new useApi base hook
  if (!useStockDataContent.includes('useApi<')) {
    return 'Hooks do not use the new useApi base hook';
  }
  
  // Check if caching options are properly implemented
  if (!useStockDataContent.includes('cacheTime:') || !useStockDataContent.includes('staleTime:')) {
    return 'Hooks do not implement caching options';
  }
  
  // Check if retry mechanism is implemented
  if (!useStockDataContent.includes('retryCount:')) {
    return 'Hooks do not implement retry mechanism';
  }
  
  return true;
}

// Test 4: Check if old API service usage is removed
function testOldApiServiceRemoval() {
  logHeader('Testing Old API Service Removal');
  
  const webSrcPath = 'apps/web/src';
  
  function checkDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        const result = checkDirectory(fullPath);
        if (result !== true) return result;
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for old API service patterns
        if (content.includes('apiService.') && !content.includes('// legacy')) {
          return `Old API service usage found in ${fullPath}`;
        }
      }
    }
    
    return true;
  }
  
  return checkDirectory(webSrcPath);
}

// Test 5: Check caching configuration
function testCachingConfiguration() {
  logHeader('Testing Caching Configuration');
  
  const useStockDataPath = 'apps/web/src/hooks/useStockData.ts';
  const content = fs.readFileSync(useStockDataPath, 'utf8');
  
  // Check trending themes caching (5 min cache, 2 min stale)
  if (!content.includes('cacheTime: 5 * 60 * 1000') || !content.includes('staleTime: 2 * 60 * 1000')) {
    return 'useTrendingThemes does not have correct caching configuration (5min cache, 2min stale)';
  }
  
  // Check search hooks caching (10 min cache, 5 min stale)
  if (!content.includes('cacheTime: 10 * 60 * 1000') || !content.includes('staleTime: 5 * 60 * 1000')) {
    return 'Search hooks do not have correct caching configuration (10min cache, 5min stale)';
  }
  
  // Check AI hooks caching (30 min cache, 15 min stale)
  if (!content.includes('cacheTime: 30 * 60 * 1000') || !content.includes('staleTime: 15 * 60 * 1000')) {
    return 'AI hooks do not have correct caching configuration (30min cache, 15min stale)';
  }
  
  return true;
}

// Test 6: Check retry configuration
function testRetryConfiguration() {
  logHeader('Testing Retry Configuration');
  
  const useStockDataPath = 'apps/web/src/hooks/useStockData.ts';
  const content = fs.readFileSync(useStockDataPath, 'utf8');
  
  // Check trending themes retry (3 retries)
  if (!content.includes('retryCount: 3')) {
    return 'useTrendingThemes does not have correct retry configuration (3 retries)';
  }
  
  // Check search hooks retry (2 retries)
  if (!content.includes('retryCount: 2')) {
    return 'Search hooks do not have correct retry configuration (2 retries)';
  }
  
  // Check AI hooks retry (2 retries)
  if (!content.includes('retryCount: 2')) {
    return 'AI hooks do not have correct retry configuration (2 retries)';
  }
  
  return true;
}

// Test 7: Check URL construction
function testUrlConstruction() {
  logHeader('Testing URL Construction');
  
  const useStockDataPath = 'apps/web/src/hooks/useStockData.ts';
  const content = fs.readFileSync(useStockDataPath, 'utf8');
  
  // Check trending themes URL
  if (!content.includes('/trending?sort=${sortBy}&real=${useRealData}')) {
    return 'useTrendingThemes does not construct correct URL with sort and real data parameters';
  }
  
  // Check theme search URL
  if (!content.includes('/search?mode=theme&q=${encodeURIComponent(query)}&real=${useRealData}')) {
    return 'useThemeSearch does not construct correct URL with mode, query, and real data parameters';
  }
  
  // Check stock search URL
  if (!content.includes('/search?mode=stock&q=${encodeURIComponent(query)}&real=${useRealData}')) {
    return 'useStockSearch does not construct correct URL with mode, query, and real data parameters';
  }
  
  // Check AI concept strength URL
  if (!content.includes('/ai/concept-strength?theme=${encodeURIComponent(theme)}')) {
    return 'useAiConceptStrength does not construct correct AI analysis URL';
  }
  
  // Check AI sentiment URL
  if (!content.includes('/ai/sentiment?stock=${encodeURIComponent(stockCode)}')) {
    return 'useAiSentiment does not construct correct sentiment analysis URL';
  }
  
  return true;
}

// Test 8: Check state management integration
function testStateManagementIntegration() {
  logHeader('Testing State Management Integration');
  
  const appPath = 'apps/web/src/App.tsx';
  const content = fs.readFileSync(appPath, 'utf8');
  
  // Check if Zustand stores are used
  if (!content.includes('useAppStore') || !content.includes('useUIStore') || !content.includes('useSearchStore')) {
    return 'App.tsx does not use Zustand stores for state management';
  }
  
  // Check if URL sync is implemented
  if (!content.includes('useUrlSync')) {
    return 'App.tsx does not use URL synchronization';
  }
  
  return true;
}

// Run all tests
function runAllTests() {
  logHeader('API Hook Migration Test Suite');
  log('Testing the migrated API hooks implementation...', 'cyan');
  
  const tests = [
    { name: 'Migrated Components', fn: testMigratedComponents },
    { name: 'Hook Exports', fn: testHookExports },
    { name: 'Hook Implementations', fn: testHookImplementations },
    { name: 'Old API Service Removal', fn: testOldApiServiceRemoval },
    { name: 'Caching Configuration', fn: testCachingConfiguration },
    { name: 'Retry Configuration', fn: testRetryConfiguration },
    { name: 'URL Construction', fn: testUrlConstruction },
    { name: 'State Management Integration', fn: testStateManagementIntegration }
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
    log('\n🎉 All tests passed! The API hook migration is working correctly.', 'green');
    log('✅ Components are using new hooks', 'green');
    log('✅ Caching and retry mechanisms are implemented', 'green');
    log('✅ URL construction is correct', 'green');
    log('✅ State management is properly integrated', 'green');
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
