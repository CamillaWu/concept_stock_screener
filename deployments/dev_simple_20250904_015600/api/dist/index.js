var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../node_modules/.pnpm/itty-router@3.0.12/node_modules/itty-router/dist/itty-router.mjs
var e = /* @__PURE__ */ __name(({ base: e2 = "", routes: r = [] } = {}) => ({ __proto__: new Proxy({}, { get: /* @__PURE__ */ __name((a, o, t) => (a2, ...p) => r.push([o.toUpperCase(), RegExp(`^${(e2 + a2).replace(/(\/?)\*/g, "($1.*)?").replace(/(\/$)|((?<=\/)\/)/, "").replace(/(:(\w+)\+)/, "(?<$2>.*)").replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3").replace(/\.(?=[\w(])/, "\\.").replace(/\)\.\?\(([^\[]+)\[\^/g, "?)\\.?($1(?<=\\.)[^\\.")}/*$`), p]) && t, "get") }), routes: r, async handle(e3, ...a) {
  let o, t, p = new URL(e3.url), l = e3.query = {};
  for (let [e4, r2] of p.searchParams) l[e4] = void 0 === l[e4] ? r2 : [l[e4], r2].flat();
  for (let [l2, s, c] of r) if ((l2 === e3.method || "ALL" === l2) && (t = p.pathname.match(s))) {
    e3.params = t.groups || {};
    for (let r2 of c) if (void 0 !== (o = await r2(e3.proxy || e3, ...a))) return o;
  }
} }), "e");

// src/handlers/concept.ts
var mockConcepts = [
  {
    id: "ai-chips",
    name: "AI \u6676\u7247\u6982\u5FF5",
    description: "\u4EBA\u5DE5\u667A\u6167\u6676\u7247\u76F8\u95DC\u7684\u80A1\u7968\uFF0C\u5305\u62EC\u8A2D\u8A08\u3001\u88FD\u9020\u3001\u5C01\u88DD\u7B49\u7522\u696D\u93C8",
    stocks: [
      {
        symbol: "2330",
        name: "\u53F0\u7A4D\u96FB",
        price: 580,
        change: 15,
        changePercent: 0.026,
        volume: 5e7,
        marketCap: 15e12,
        sector: "\u534A\u5C0E\u9AD4",
        industry: "\u6676\u5713\u4EE3\u5DE5"
      },
      {
        symbol: "2454",
        name: "\u806F\u767C\u79D1",
        price: 850,
        change: 25,
        changePercent: 0.03,
        volume: 3e7,
        marketCap: 135e10,
        sector: "\u534A\u5C0E\u9AD4",
        industry: "IC \u8A2D\u8A08"
      }
    ],
    keywords: ["AI", "\u6676\u7247", "\u4EBA\u5DE5\u667A\u6167", "\u534A\u5C0E\u9AD4"],
    category: "\u79D1\u6280"
  },
  {
    id: "electric-vehicle",
    name: "\u96FB\u52D5\u8ECA\u6982\u5FF5",
    description: "\u96FB\u52D5\u8ECA\u7522\u696D\u76F8\u95DC\u80A1\u7968\uFF0C\u5305\u62EC\u96FB\u6C60\u3001\u99AC\u9054\u3001\u5145\u96FB\u6A01\u7B49",
    stocks: [
      {
        symbol: "2317",
        name: "\u9D3B\u6D77",
        price: 105,
        change: -2,
        changePercent: -0.019,
        volume: 8e7,
        marketCap: 145e10,
        sector: "\u96FB\u5B50\u96F6\u7D44\u4EF6",
        industry: "\u96FB\u5B50\u88FD\u9020\u670D\u52D9"
      }
    ],
    keywords: ["\u96FB\u52D5\u8ECA", "\u96FB\u6C60", "\u5145\u96FB", "\u65B0\u80FD\u6E90"],
    category: "\u6C7D\u8ECA"
  }
];
var conceptHandler = {
  // 獲取所有概念股
  async getConcepts() {
    try {
      const response = {
        success: true,
        data: mockConcepts,
        message: "\u6210\u529F\u7372\u53D6\u6982\u5FF5\u80A1\u5217\u8868"
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      const errorResponse = {
        success: false,
        error: "\u7372\u53D6\u6982\u5FF5\u80A1\u5217\u8868\u5931\u6557"
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  },
  // 獲取單一概念股
  async getConcept(request) {
    try {
      const url = new URL(request.url);
      const conceptId = url.searchParams.get("id");
      if (!conceptId) {
        const errorResponse = {
          success: false,
          error: "\u6982\u5FF5\u80A1 ID \u4E0D\u80FD\u70BA\u7A7A"
        };
        return new Response(JSON.stringify(errorResponse), {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
      const concept = mockConcepts.find((c) => c.id === conceptId);
      if (!concept) {
        const errorResponse = {
          success: false,
          error: "\u627E\u4E0D\u5230\u8A72\u6982\u5FF5\u80A1"
        };
        return new Response(JSON.stringify(errorResponse), {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
      const response = {
        success: true,
        data: concept,
        message: "\u6210\u529F\u7372\u53D6\u6982\u5FF5\u80A1\u8CC7\u8A0A"
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      const errorResponse = {
        success: false,
        error: "\u7372\u53D6\u6982\u5FF5\u80A1\u8CC7\u8A0A\u5931\u6557"
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  }
};

// src/handlers/search.ts
var mockSearchResults = {
  stocks: [
    {
      symbol: "2330",
      name: "\u53F0\u7A4D\u96FB",
      price: 580,
      change: 15,
      changePercent: 0.026,
      volume: 5e7,
      marketCap: 15e12,
      sector: "\u534A\u5C0E\u9AD4",
      industry: "\u6676\u5713\u4EE3\u5DE5"
    },
    {
      symbol: "2454",
      name: "\u806F\u767C\u79D1",
      price: 850,
      change: 25,
      changePercent: 0.03,
      volume: 3e7,
      marketCap: 135e10,
      sector: "\u534A\u5C0E\u9AD4",
      industry: "IC \u8A2D\u8A08"
    }
  ],
  concepts: [
    {
      id: "ai-chips",
      name: "AI \u6676\u7247\u6982\u5FF5",
      description: "\u4EBA\u5DE5\u667A\u6167\u6676\u7247\u76F8\u95DC\u7684\u80A1\u7968",
      stocks: [],
      keywords: ["AI", "\u6676\u7247", "\u4EBA\u5DE5\u667A\u6167"],
      category: "\u79D1\u6280"
    }
  ],
  total: 3,
  suggestions: ["AI", "\u6676\u7247", "\u534A\u5C0E\u9AD4", "\u53F0\u7A4D\u96FB", "\u806F\u767C\u79D1"]
};
var searchHandler = {
  // 搜尋功能
  async search(request) {
    try {
      const url = new URL(request.url);
      const query = url.searchParams.get("q") || "";
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "10");
      if (!query.trim()) {
        const errorResponse = {
          success: false,
          error: "\u641C\u5C0B\u95DC\u9375\u5B57\u4E0D\u80FD\u70BA\u7A7A"
        };
        return new Response(JSON.stringify(errorResponse), {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
      const filteredStocks = mockSearchResults.stocks.filter(
        (stock) => stock.name.toLowerCase().includes(query.toLowerCase()) || stock.symbol.includes(query) || stock.sector.toLowerCase().includes(query.toLowerCase())
      );
      const filteredConcepts = mockSearchResults.concepts.filter(
        (concept) => concept.name.toLowerCase().includes(query.toLowerCase()) || concept.keywords.some(
          (keyword) => keyword.toLowerCase().includes(query.toLowerCase())
        )
      );
      const total = filteredStocks.length + filteredConcepts.length;
      const startIndex = (page - 1) * limit;
      const paginatedStocks = filteredStocks.slice(
        startIndex,
        startIndex + limit
      );
      const paginatedConcepts = filteredConcepts.slice(
        startIndex,
        startIndex + limit
      );
      const response = {
        success: true,
        data: {
          stocks: paginatedStocks,
          concepts: paginatedConcepts,
          total,
          suggestions: mockSearchResults.suggestions.filter(
            (suggestion) => suggestion.toLowerCase().includes(query.toLowerCase())
          )
        },
        message: `\u627E\u5230 ${total} \u500B\u76F8\u95DC\u7D50\u679C`
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      const errorResponse = {
        success: false,
        error: "\u641C\u5C0B\u5931\u6557"
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  }
};

// src/handlers/stock.ts
var mockStocks = [
  {
    symbol: "2330",
    name: "\u53F0\u7A4D\u96FB",
    price: 580,
    change: 15,
    changePercent: 0.026,
    volume: 5e7,
    marketCap: 15e12,
    sector: "\u534A\u5C0E\u9AD4",
    industry: "\u6676\u5713\u4EE3\u5DE5"
  },
  {
    symbol: "2317",
    name: "\u9D3B\u6D77",
    price: 105,
    change: -2,
    changePercent: -0.019,
    volume: 8e7,
    marketCap: 145e10,
    sector: "\u96FB\u5B50\u96F6\u7D44\u4EF6",
    industry: "\u96FB\u5B50\u88FD\u9020\u670D\u52D9"
  }
];
var stockHandler = {
  // 獲取所有股票
  async getStocks() {
    try {
      const response = {
        success: true,
        data: mockStocks,
        message: "\u6210\u529F\u7372\u53D6\u80A1\u7968\u5217\u8868"
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      const errorResponse = {
        success: false,
        error: "\u7372\u53D6\u80A1\u7968\u5217\u8868\u5931\u6557"
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  },
  // 獲取單一股票
  async getStock(request) {
    try {
      const url = new URL(request.url);
      const symbol = url.searchParams.get("symbol");
      if (!symbol) {
        const errorResponse = {
          success: false,
          error: "\u80A1\u7968\u4EE3\u78BC\u4E0D\u80FD\u70BA\u7A7A"
        };
        return new Response(JSON.stringify(errorResponse), {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
      const stock = mockStocks.find((s) => s.symbol === symbol);
      if (!stock) {
        const errorResponse = {
          success: false,
          error: "\u627E\u4E0D\u5230\u8A72\u80A1\u7968"
        };
        return new Response(JSON.stringify(errorResponse), {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
      const response = {
        success: true,
        data: stock,
        message: "\u6210\u529F\u7372\u53D6\u80A1\u7968\u8CC7\u8A0A"
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      const errorResponse = {
        success: false,
        error: "\u7372\u53D6\u80A1\u7968\u8CC7\u8A0A\u5931\u6557"
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  }
};

// src/middleware/cors.ts
var corsMiddleware = /* @__PURE__ */ __name((request) => {
  const response = new Response();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: response.headers });
  }
  return response;
}, "corsMiddleware");

// src/index.ts
var router = e();
router.all("*", corsMiddleware);
router.get("/api/health", () => new Response("OK", { status: 200 }));
router.get("/api/stocks", stockHandler.getStocks);
router.get("/api/stocks/:symbol", stockHandler.getStock);
router.get("/api/concepts", conceptHandler.getConcepts);
router.get("/api/concepts/:id", conceptHandler.getConcept);
router.get("/api/search", searchHandler.search);
router.all("*", () => new Response("Not Found", { status: 404 }));
var index_default = {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx);
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
