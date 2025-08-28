interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const kv = (globalThis as any).CONCEPTS_CACHE;
      if (!kv) {
        console.warn('KV 未設定，跳過快取');
        return null;
      }

      const cached = await kv.get(key);
      if (!cached) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();

      // 檢查是否過期
      if (now > entry.timestamp + entry.ttl * 1000) {
        // 過期了，刪除快取
        await kv.delete(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('快取讀取錯誤:', error);
      return null;
    }
  },

  async set<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
    try {
      const kv = (globalThis as any).CONCEPTS_CACHE;
      if (!kv) {
        console.warn('KV 未設定，跳過快取儲存');
        return;
      }

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttlSeconds
      };

      await kv.put(key, JSON.stringify(entry), {
        expirationTtl: ttlSeconds
      });
    } catch (error) {
      console.error('快取儲存錯誤:', error);
    }
  },

  async delete(key: string): Promise<void> {
    try {
      const kv = (globalThis as any).CONCEPTS_CACHE;
      if (!kv) {
        return;
      }

      await kv.delete(key);
    } catch (error) {
      console.error('快取刪除錯誤:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      const kv = (globalThis as any).CONCEPTS_CACHE;
      if (!kv) {
        return;
      }

      // 注意：Cloudflare KV 沒有批量刪除，這裡只是示例
      console.log('快取清除功能需要手動實作');
    } catch (error) {
      console.error('快取清除錯誤:', error);
    }
  }
};
