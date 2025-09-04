// 路由器類型定義
// 解決 itty-router 與 Cloudflare Workers 的類型兼容性問題

// 定義 Cloudflare Workers 兼容的 Request 類型
export interface CloudflareRequest extends Request {
  // 添加 Cloudflare 特有的屬性
  cf?: {
    country?: string;
    city?: string;
    continent?: string;
    timezone?: string;
    ip?: string;
    [key: string]: unknown;
  };
}

// 定義 Cloudflare Workers 兼容的 Context 類型
export interface CloudflareContext {
  waitUntil: (promise: Promise<unknown>) => void;
  env: Record<string, unknown>;
}

// 定義兼容的 RouteHandler 類型
export type CompatibleRouteHandler = (
  request: CloudflareRequest,
  env?: Record<string, unknown>,
  ctx?: CloudflareContext
) => Response | Promise<Response>;

// 類型轉換函數
export function toCompatibleHandler(
  handler: (request: Request) => Response | Promise<Response>
): CompatibleRouteHandler {
  return (
    _request: CloudflareRequest,
    _env?: Record<string, unknown>,
    _ctx?: CloudflareContext
  ) => {
    return handler(_request);
  };
}

// 類型轉換函數（無參數版本）
export function toCompatibleHandlerNoParams(
  handler: () => Response | Promise<Response>
): CompatibleRouteHandler {
  return (
    _request: CloudflareRequest,
    _env?: Record<string, unknown>,
    _ctx?: CloudflareContext
  ) => {
    return handler();
  };
}
