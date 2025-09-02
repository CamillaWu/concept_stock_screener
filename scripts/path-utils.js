#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const os = require('os');

class PathUtils {
  constructor() {
    this.platform = os.platform();
    this.isWindows = this.platform === 'win32';
    this.isMac = this.platform === 'darwin';
    this.isLinux = this.platform === 'linux';
    this.separator = path.sep;
    this.delimiter = path.delimiter;
  }

  // 標準化路徑
  normalizePath(inputPath) {
    if (Array.isArray(inputPath)) {
      return path.join(...inputPath);
    }
    return path.normalize(inputPath);
  }

  // 創建絕對路徑
  resolvePath(...paths) {
    return path.resolve(...paths);
  }

  // 獲取相對路徑
  relativePath(from, to) {
    return path.relative(from, to);
  }

  // 解析路徑組件
  parsePath(filePath) {
    return path.parse(filePath);
  }

  // 獲取目錄名
  getDirName(filePath) {
    return path.dirname(filePath);
  }

  // 獲取檔案名
  getBaseName(filePath, ext) {
    return path.basename(filePath, ext);
  }

  // 獲取副檔名
  getExtension(filePath) {
    return path.extname(filePath);
  }

  // 檢查路徑是否存在
  pathExists(filePath) {
    return fs.existsSync(filePath);
  }

  // 創建目錄（遞歸）
  createDirectory(dirPath) {
    const normalizedPath = this.normalizePath(dirPath);
    
    if (!this.pathExists(normalizedPath)) {
      try {
        fs.mkdirSync(normalizedPath, { recursive: true });
        console.log(`✅ 目錄創建成功: ${normalizedPath}`);
        return true;
      } catch (error) {
        console.log(`❌ 目錄創建失敗: ${normalizedPath}`, error.message);
        return false;
      }
    } else {
      console.log(`ℹ️  目錄已存在: ${normalizedPath}`);
      return true;
    }
  }

  // 獲取專案根目錄
  getProjectRoot() {
    return process.cwd();
  }

  // 獲取專案子目錄
  getProjectSubDir(subDir) {
    return this.resolvePath(this.getProjectRoot(), subDir);
  }

  // 獲建構輸出目錄
  getBuildOutputDir() {
    return this.getProjectSubDir('dist');
  }

  // 獲取測試輸出目錄
  getTestOutputDir() {
    return this.getProjectSubDir('coverage');
  }

  // 獲取日誌目錄
  getLogDir() {
    return this.getProjectSubDir('logs');
  }

  // 獲取臨時目錄
  getTempDir() {
    return this.getProjectSubDir('.temp');
  }

  // 獲取平台配置目錄
  getPlatformConfigDir() {
    return this.getProjectSubDir('.platform-config');
  }

  // 創建標準專案目錄結構
  createProjectStructure() {
    const directories = [
      'dist',
      'coverage',
      'logs',
      '.temp',
      '.platform-config',
      'build',
      'out'
    ];

    console.log('📁 創建專案目錄結構...');
    
    directories.forEach(dir => {
      this.createDirectory(this.getProjectSubDir(dir));
    });

    console.log('✅ 專案目錄結構創建完成');
  }

  // 清理臨時和構建文件
  cleanProjectFiles() {
    const dirsToClean = [
      'dist',
      'coverage',
      '.temp',
      'build',
      'out',
      '.next'
    ];

    console.log('🧹 清理專案文件...');
    
    dirsToClean.forEach(dir => {
      const dirPath = this.getProjectSubDir(dir);
      if (this.pathExists(dirPath)) {
        try {
          fs.rmSync(dirPath, { recursive: true, force: true });
          console.log(`✅ 已清理: ${dir}`);
        } catch (error) {
          console.log(`⚠️  清理失敗: ${dir}`, error.message);
        }
      }
    });

    console.log('✅ 專案文件清理完成');
  }

  // 獲取檔案大小
  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  // 獲取目錄大小
  getDirectorySize(dirPath) {
    let totalSize = 0;
    
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          totalSize += this.getDirectorySize(itemPath);
        } else {
          totalSize += stats.size;
        }
      });
    } catch (error) {
      console.log(`⚠️  無法讀取目錄: ${dirPath}`, error.message);
    }
    
    return totalSize;
  }

  // 格式化檔案大小
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 顯示路徑資訊
  showPathInfo() {
    console.log('🔍 路徑工具資訊:');
    console.log(`  平台: ${this.platform}`);
    console.log(`  路徑分隔符: ${this.separator}`);
    console.log(`  路徑分隔符 (環境變數): ${this.delimiter}`);
    console.log(`  專案根目錄: ${this.getProjectRoot()}`);
    console.log(`  建構輸出目錄: ${this.getBuildOutputDir()}`);
    console.log(`  測試輸出目錄: ${this.getTestOutputDir()}`);
    console.log(`  日誌目錄: ${this.getLogDir()}`);
    console.log(`  臨時目錄: ${this.getTempDir()}`);
  }

  // 顯示幫助
  showHelp() {
    console.log(`
🛤️  路徑工具

用法: node scripts/path-utils.js [命令]

命令:
  info      - 顯示路徑資訊
  create    - 創建專案目錄結構
  clean     - 清理專案文件
  help      - 顯示此幫助

範例:
  node scripts/path-utils.js info
  node scripts/path-utils.js create
  node scripts/path-utils.js clean
`);
  }
}

// 主執行邏輯
async function main() {
  const pathUtils = new PathUtils();
  const command = process.argv[2] || 'help';

  try {
    switch (command) {
      case 'info':
        pathUtils.showPathInfo();
        break;
      case 'create':
        pathUtils.createProjectStructure();
        break;
      case 'clean':
        pathUtils.cleanProjectFiles();
        break;
      case 'help':
      default:
        pathUtils.showHelp();
        break;
    }
  } catch (error) {
    console.error('❌ 執行失敗:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = PathUtils;
