/**
 * 環境檢測服務
 * 負責檢測當前運行環境（Cloudflare Workers vs 本地開發）
 */
export class EnvironmentDetector {
  /**
   * 檢測是否在 Cloudflare Workers 環境中
   */
  static isCloudflareWorkers(): boolean {
    // 檢查是否在 Cloudflare Workers 環境中
    const hasCloudflare = typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;
    const hasProcess = typeof (globalThis as any).process !== 'undefined';
    const hasNodeModules = typeof (globalThis as any).require !== 'undefined';
    const isDev = (globalThis as any).__DEV__ === true;
    
    // 如果有 Cloudflare 對象，且沒有 Node.js 相關對象，則認為是 Cloudflare Workers
    const result = hasCloudflare && !hasProcess && !hasNodeModules && !isDev;
    console.log('Environment detection:', { hasCloudflare, hasProcess, hasNodeModules, isDev, result });
    return result;
  }

  /**
   * 檢測是否有 Cloudflare 環境標識
   */
  static hasCloudflareEnvironment(): boolean {
    return typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;
  }

  /**
   * 獲取環境資訊
   */
  static getEnvironmentInfo(): {
    isCloudflareWorkers: boolean;
    hasCloudflare: boolean;
    hasProcess: boolean;
    hasNodeModules: boolean;
    isDev: boolean;
  } {
    const hasCloudflare = typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;
    const hasProcess = typeof (globalThis as any).process !== 'undefined';
    const hasNodeModules = typeof (globalThis as any).require !== 'undefined';
    const isDev = (globalThis as any).__DEV__ === true;
    const isCloudflareWorkers = hasCloudflare && !hasProcess && !hasNodeModules && !isDev;

    return {
      isCloudflareWorkers,
      hasCloudflare,
      hasProcess,
      hasNodeModules,
      isDev
    };
  }
}
