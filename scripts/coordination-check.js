#!/usr/bin/env node

/**
 * 協調檢查腳本 - 簡化版
 * 用於在修改前後進行基本的質量檢查
 */

const { spawn } = require('child_process');

async function runCommand(command, args = []) {
  return new Promise(resolve => {
    const child = spawn(command, args, { stdio: 'pipe', shell: true });
    let output = '';

    child.stdout.on('data', data => {
      output += data.toString();
    });

    child.stderr.on('data', data => {
      output += data.toString();
    });

    child.on('close', code => {
      resolve({ success: code === 0, output });
    });
  });
}

async function checkESLint() {
  console.log('🔍 檢查 ESLint 狀態...');
  const result = await runCommand('pnpm', ['lint:check']);

  if (result.success) {
    console.log('✅ ESLint 檢查通過');
    return true;
  } else {
    console.log('❌ ESLint 檢查失敗');
    return false;
  }
}

async function checkTypeScript() {
  console.log('🔍 檢查 TypeScript 類型...');
  const result = await runCommand('pnpm', ['type-check']);

  if (result.success) {
    console.log('✅ TypeScript 類型檢查通過');
    return true;
  } else {
    console.log('❌ TypeScript 類型檢查失敗');
    return false;
  }
}

async function main() {
  console.log('🚀 開始協調檢查...\n');

  const checks = [
    { name: 'ESLint', method: checkESLint },
    { name: 'TypeScript', method: checkTypeScript },
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      const result = await check.method();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
      console.log(`❌ ${check.name} 檢查執行失敗:`, error.message);
    }
    console.log('');
  }

  console.log('📊 檢查結果摘要');
  console.log('================');
  console.log(`通過: ${passed} ✅`);
  console.log(`失敗: ${failed} ❌`);

  if (failed === 0) {
    console.log('\n🎉 所有檢查通過！項目狀態良好。');
  } else {
    console.log('\n⚠️ 發現問題！建議先解決這些問題。');
  }
}

if (require.main === module) {
  main().catch(console.error);
}
