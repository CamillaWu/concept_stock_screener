/**
 * 部署配置文件
 * 定義不同環境的部署設定
 */

module.exports = {
  // 開發環境
  development: {
    name: 'development',
    description: '本地開發環境',
    cloudflare: {
      workers: {
        name: 'concept-stock-screener-dev',
        script: 'dist/worker.js',
        env: 'development'
      },
      pages: {
        name: 'concept-stock-screener-dev',
        directory: 'dist',
        env: 'development'
      }
    },
    domains: {
      api: 'http://localhost:8787',
      web: 'http://localhost:3000'
    },
    features: {
      debug: true,
      logging: 'verbose',
      cache: false
    }
  },

  // 測試環境
  staging: {
    name: 'staging',
    description: '測試環境',
    cloudflare: {
      workers: {
        name: 'concept-stock-screener-staging',
        script: 'dist/worker.js',
        env: 'staging'
      },
      pages: {
        name: 'concept-stock-screener-staging',
        directory: 'dist',
        env: 'staging'
      }
    },
    domains: {
      api: 'https://staging-api.concept-stock-screener.workers.dev',
      web: 'https://staging.concept-stock-screener.pages.dev'
    },
    features: {
      debug: true,
      logging: 'info',
      cache: true
    },
    monitoring: {
      enabled: true,
      alerts: ['slack', 'email'],
      metrics: ['response-time', 'error-rate', 'throughput']
    }
  },

  // 生產環境
  production: {
    name: 'production',
    description: '生產環境',
    cloudflare: {
      workers: {
        name: 'concept-stock-screener',
        script: 'dist/worker.js',
        env: 'production'
      },
      pages: {
        name: 'concept-stock-screener',
        directory: 'dist',
        env: 'production'
      }
    },
    domains: {
      api: 'https://api.concept-stock-screener.workers.dev',
      web: 'https://concept-stock-screener.pages.dev'
    },
    features: {
      debug: false,
      logging: 'warn',
      cache: true
    },
    monitoring: {
      enabled: true,
      alerts: ['slack', 'email', 'pagerduty'],
      metrics: ['response-time', 'error-rate', 'throughput', 'availability']
    },
    security: {
      rateLimit: true,
      cors: {
        allowedOrigins: ['https://concept-stock-screener.pages.dev'],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
      }
    }
  },

  // 災難恢復環境
  disaster_recovery: {
    name: 'disaster_recovery',
    description: '災難恢復環境',
    cloudflare: {
      workers: {
        name: 'concept-stock-screener-dr',
        script: 'dist/worker.js',
        env: 'disaster_recovery'
      },
      pages: {
        name: 'concept-stock-screener-dr',
        directory: 'dist',
        env: 'disaster_recovery'
      }
    },
    domains: {
      api: 'https://dr-api.concept-stock-screener.workers.dev',
      web: 'https://dr.concept-stock-screener.pages.dev'
    },
    features: {
      debug: false,
      logging: 'error',
      cache: true
    },
    monitoring: {
      enabled: true,
      alerts: ['pagerduty'],
      metrics: ['availability', 'response-time']
    }
  },

  // 環境特定配置
  env_specific: {
    // 測試數據配置
    test_data: {
      enabled: true,
      sources: ['mock', 'fixtures'],
      cleanup: true
    },

    // 性能測試配置
    performance: {
      enabled: true,
      thresholds: {
        response_time: 1000, // ms
        throughput: 100,     // requests/second
        error_rate: 0.01     // 1%
      }
    },

    // 安全配置
    security: {
      api_keys: {
        required: true,
        validation: true
      },
      rate_limiting: {
        enabled: true,
        max_requests: 100,
        window_ms: 60000
      }
    }
  },

  // 部署策略
  deployment_strategy: {
    // 藍綠部署
    blue_green: {
      enabled: true,
      health_check: true,
      rollback_threshold: 0.05, // 5% 錯誤率
      switchover_time: 300000   // 5分鐘
    },

    // 金絲雀部署
    canary: {
      enabled: true,
      percentage: 0.1,          // 10% 流量
      duration: 3600000,        // 1小時
      metrics: ['error-rate', 'response-time']
    },

    // 滾動部署
    rolling: {
      enabled: true,
      batch_size: 1,
      batch_delay: 30000        // 30秒
    }
  },

  // 通知配置
  notifications: {
    slack: {
      enabled: true,
      channels: {
        ci_cd: '#ci-cd',
        alerts: '#alerts',
        deployments: '#deployments'
      }
    },
    email: {
      enabled: true,
      recipients: {
        developers: 'dev@concept-stock-screener.com',
        operations: 'ops@concept-stock-screener.com'
      }
    },
    webhook: {
      enabled: true,
      endpoints: [
        'https://api.concept-stock-screener.com/webhooks/deployment'
      ]
    }
  },

  // 回滾配置
  rollback: {
    enabled: true,
    triggers: [
      'high_error_rate',
      'performance_degradation',
      'manual_trigger'
    ],
    strategies: {
      immediate: {
        description: '立即回滾',
        delay: 0
      },
      gradual: {
        description: '漸進式回滾',
        delay: 300000, // 5分鐘
        percentage: 0.25 // 25% 流量
      }
    }
  }
};
