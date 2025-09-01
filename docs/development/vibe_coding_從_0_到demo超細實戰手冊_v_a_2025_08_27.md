# 從 0 到 Demo：Vibe Coding 超細實戰手冊（對齊 Freeze vA-2025-08-27）

> 目標：不改 PRD／規格流程書，直接依 Freeze 內容從空資料夾 → 可 Demo 的前後端。含：安裝、資料夾、Mock Data、API、元件、部署、檢查清單、Cursor 讀檔、One-Feature-One-Prompt、AI 亮點實作。

---

## 0. 先決條件（10 分鐘）

- OS：macOS / Windows / Linux 皆可。
- Node.js：v20 LTS（建議 `20.16+`）。
- 套件管理：`pnpm`（亦可 `npm`）。
- IDE：Cursor（含 Copilot / Claude / GPT 皆可用）。
- 帳號：Vercel（前端）、Cloudflare（Workers / KV）。
- Repo：GitHub（monorepo 或雙 repo 皆可）。

**安裝指令**
```bash
# Node 版本確認
node -v
# 安裝 pnpm
npm i -g pnpm
# 可選：安裝 wrangler（Cloudflare CLI）
pnpm i -g wrangler
```

---

## 1. 專案結構（照 Freeze，前端以 Vite React + Tailwind）

```
/concepts-radar
  /apps
    /web               # 前端（Vite + React + Tailwind）
    /api               # 後端（Cloudflare Workers + Hono）
  /packages
    /ui                # 共用 UI（可選）
    /types             # 共用型別（StockConcept, StockAnalysisResult）
  /docs                # PRD / 規格 / README（供 Cursor 吸收）
  /mock                # 假資料（trending.json 等）
  .editorconfig
  .gitignore
  README.md
```

> 若你偏好單 repo：`/web` + `/api` 即可。

---

## 2. 建專案與前端初始化（15–20 分鐘）

```bash
mkdir concepts-radar && cd $_
mkdir apps packages docs mock
cd apps && pnpm create vite web --template react-ts && cd web
pnpm i
pnpm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Tailwind 設定**
```ts
// web/tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**全域樣式**
```css
/* web/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**環境變數**（可選）
```bash
# web/.env.local
VITE_API_BASE=http://127.0.0.1:8787
VITE_CACHE_TTL=60
```

---

## 3. 共享型別（`/packages/types`）

```ts
// packages/types/src/index.ts
export type Stock = { ticker: string; name: string; reason?: string; };
export type Theme = { name: string; description?: string };

export type StockConcept = {
  theme: Theme;
  heatScore: number; // 0–100
  stocks: Stock[];   // length <= 10
};

export type StockAnalysisResult = {
  stock: Stock;
  themes: Array<{ theme: Theme; heatScore: number; reason?: string; sources?: string[] }>; // length >= 5
};

export type ApiError = { code: "invalid_mode"|"no_results"|"rate_limited"|"internal_error"; message: string; trace_id?: string };
```

**封裝發佈（可選）**
```bash
cd ../../packages && mkdir types && cd types
pnpm init -y && mkdir src && code .
```

---

## 4. Mock Data（`/mock`）

**必備檔案**
- `trending.json`：長度 15 的 `StockConcept[]`；每筆含 `theme`, `heatScore`, `stocks (<=10)`
- `search_theme_AI伺服器.json`：單一 `StockConcept`（AI 伺服器）
- `search_stock_2330.json`：`StockAnalysisResult`（themes >= 5）

```json
// mock/trending.json（節錄 2 筆；實際放 15 筆）
[
  {
    "theme": { "name": "AI 伺服器", "description": "AI 訓練/推論伺服器供應鏈" },
    "heatScore": 87,
    "stocks": [
      { "ticker": "2330", "name": "台積電", "reason": "CoWoS 產能與 AI 伺服器需求相關" },
      { "ticker": "2377", "name": "微星" }
    ]
  },
  {
    "theme": { "name": "光通訊", "description": "高速傳輸與資料中心光模組" },
    "heatScore": 81,
    "stocks": [
      { "ticker": "4977", "name": "眾達" },
      { "ticker": "4979", "name": "華星光" }
    ]
  }
]
```

```json
// mock/search_theme_AI伺服器.json
{
  "theme": { "name": "AI 伺服器", "description": "AI 伺服器供應鏈" },
  "heatScore": 87,
  "stocks": [
    { "ticker": "2330", "name": "台積電", "reason": "CoWoS 關聯" },
    { "ticker": "2382", "name": "廣達" }
  ]
}
```

```json
// mock/search_stock_2330.json
{
  "stock": { "ticker": "2330", "name": "台積電" },
  "themes": [
    { "theme": { "name": "AI 伺服器" }, "heatScore": 90, "reason": "先進製程與封裝" },
    { "theme": { "name": "先進封裝" }, "heatScore": 88 },
    { "theme": { "name": "高速運算" }, "heatScore": 84 },
    { "theme": { "name": "汽車電子" }, "heatScore": 72 },
    { "theme": { "name": "物聯網" }, "heatScore": 60 }
  ]
}
```

---

## 5. API 後端（Cloudflare Workers + Hono，30 分鐘）

**初始化**
```bash
cd ../../apps && mkdir api && cd api
pnpm init -y
pnpm i hono
pnpm i -D wrangler typescript @cloudflare/workers-types
```

**tsconfig**
```json
// apps/api/tsconfig.json
{ "compilerOptions": { "target": "ES2022", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "types": ["@cloudflare/workers-types"] } }
```

**Worker 程式**
```ts
// apps/api/src/index.ts
import { Hono } from 'hono'

const app = new Hono()
const wait = (ms:number)=>new Promise(r=>setTimeout(r,ms))

// 讀取 mock
async function load(name:string) {
  const url = new URL(`../../mock/${name}`, import.meta.url)
  const res = await fetch(url)
  return res.json()
}

// /trending：固定回 15 筆
app.get('/trending', async c => {
  try {
    const data = await load('trending.json')
    return c.json(data)
  } catch (e) {
    return c.json({ code: 'internal_error', message: 'mock not found' }, 500)
  }
})

// /search：mode=theme|stock, q=...
app.get('/search', async c => {
  const mode = c.req.query('mode')
  const q = c.req.query('q')?.trim()
  if (!['theme','stock'].includes(mode||'')) {
    return c.json({ code:'invalid_mode', message:'mode must be theme or stock' },400)
  }
  if (!q) return c.json({ code:'no_results', message:'q required' },404)

  // 模擬逾時/重試用
  if (q === 'simulate500') return c.json({ code:'internal_error', message:'boom' },500)

  const file = mode==='theme' ? 'search_theme_AI伺服器.json' : 'search_stock_2330.json'
  const data = await load(file)
  // 簡單關鍵字比對
  const ok = mode==='theme' ? q.includes('AI') : q.includes('2330')
  if (!ok) return c.json({ code:'no_results', message:'No data found' },404)
  await wait(200) // 模擬延遲
  return c.json(data)
})

export default app
```

**wrangler 設定與本地啟動**
```toml
# apps/api/wrangler.toml
name = "concepts-api"
main = "src/index.ts"
compatibility_date = "2024-12-01"
```

```bash
pnpm wrangler dev --port 8787
```

> 進階：接雲端資料改讀 KV / D1；錯誤碼維持一致；RAG 與排程留到 AI 亮點段落。

---

## 6. 前端功能（/apps/web）

### 6.1 資料夾與檔案

```
/src
  /components
    TrendingList.tsx
    HeatBar.tsx
    SearchBar.tsx
    DetailPanel.tsx
    StockDetailPanel.tsx
    Toast.tsx
    Skeleton.tsx
  /hooks
    useQuery.ts
  /services
    api.ts
  /store
    favorites.ts
  /utils
    urlState.ts
  App.tsx
  main.tsx
```

### 6.2 服務層 `api.ts`

```ts
// web/src/services/api.ts
const BASE = import.meta.env.VITE_API_BASE || ''

async function http<T>(path:string, opts?:RequestInit): Promise<T> {
  const ctl = new AbortController()
  const t = setTimeout(()=>ctl.abort(), 3000)
  try {
    const res = await fetch(BASE + path, { ...opts, signal: ctl.signal })
    if (!res.ok) throw await res.json()
    return await res.json()
  } finally { clearTimeout(t) }
}

export const Api = {
  trending: ()=>http('/trending'),
  searchTheme:(q:string)=>http(`/search?mode=theme&q=${encodeURIComponent(q)}`),
  searchStock:(q:string)=>http(`/search?mode=stock&q=${encodeURIComponent(q)}`)
}
```

### 6.3 快取 / 退避 `useQuery.ts`

```ts
// web/src/hooks/useQuery.ts
import { useEffect, useRef, useState } from 'react'

export function useQuery<T>(key:string, fn:()=>Promise<T>, ttl=60_000) {
  const [data,setData] = useState<T|undefined>()
  const [err,setErr] = useState<any>()
  const [loading,setLoading] = useState(true)
  const cache = (window as any).__CACHE ||= new Map<string,{t:number,v:any}>()
  const timer = useRef<number>()

  useEffect(()=>{
    const now = Date.now()
    const hit = cache.get(key)
    if (hit && now-hit.t < ttl) { setData(hit.v); setLoading(false); return }

    let aborted=false
    const run = async(retry=false)=>{
      try{
        setLoading(true)
        const v = await fn()
        cache.set(key,{t:Date.now(),v})
        setData(v); setErr(undefined)
      }catch(e:any){
        if (!retry) {
          await new Promise(r=>setTimeout(r,800))
          return run(true)
        }
        setErr(e)
      }finally{ setLoading(false) }
    }
    // debounce 300ms
    timer.current = window.setTimeout(()=>run(false),300)
    return ()=>{ window.clearTimeout(timer.current) ; aborted = true }
  },[key])

  return { data, err, loading }
}
```

### 6.4 收藏 `favorites.ts`

```ts
// web/src/store/favorites.ts
const KEY = 'favStocks:v1'
export function getFav(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]') as string[] }catch{ return [] } }
export function toggleFav(ticker:string){
  const cur = new Set(getFav())
  cur.has(ticker) ? cur.delete(ticker) : cur.add(ticker)
  localStorage.setItem(KEY, JSON.stringify([...cur]))
  return [...cur]
}
```

### 6.5 URL 狀態同步 `urlState.ts`

```ts
export function readUrl(){
  const u = new URL(location.href)
  const mode = (u.searchParams.get('mode')||'theme') as 'theme'|'stock'
  const q = u.searchParams.get('q')||''
  return { mode, q }
}
export function writeUrl(mode:'theme'|'stock', q:string){
  const u = new URL(location.href)
  u.searchParams.set('mode',mode)
  u.searchParams.set('q',q)
  history.pushState({},'',u)
}
```

### 6.6 元件骨架（重點節錄）

```tsx
// web/src/components/HeatBar.tsx
export default function HeatBar({ score }:{ score:number }){
  return (
    <div className="w-full bg-gray-200 h-2 rounded">
      <div className="h-2 rounded transition-all" style={{ width: `${Math.min(100,Math.max(0,score))}%` }} />
    </div>
  )
}
```

```tsx
// web/src/components/TrendingList.tsx
import HeatBar from './HeatBar'
export default function TrendingList({ items, onPick }:{ items:any[], onPick:(t:any)=>void }){
  return (
    <div className="space-y-2">
      {items.map((it,i)=> (
        <button key={i} onClick={()=>onPick(it)} className="w-full text-left p-3 rounded hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="font-medium">{it.theme.name}</div>
            <div className="w-32"><HeatBar score={it.heatScore}/></div>
          </div>
        </button>
      ))}
    </div>
  )
}
```

（`SearchBar.tsx`, `DetailPanel.tsx`, `StockDetailPanel.tsx`, `Toast.tsx`, `Skeleton.tsx` 依此模式擴充即可）

### 6.7 App 佈局（三欄 + 還原）

```tsx
// web/src/App.tsx
import { useEffect, useState } from 'react'
import { Api } from './services/api'
import { useQuery } from './hooks/useQuery'
import TrendingList from './components/TrendingList'
import HeatBar from './components/HeatBar'
import { readUrl, writeUrl } from './utils/urlState'

export default function App(){
  const [mode,setMode] = useState<'theme'|'stock'>(readUrl().mode)
  const [q,setQ] = useState(readUrl().q)
  useEffect(()=>{ writeUrl(mode,q) },[mode,q])

  const { data:trending } = useQuery('trending', ()=>Api.trending(), 60_000)
  const key = `${mode}:${q}`
  const search = useQuery(key, ()=> mode==='theme' ? Api.searchTheme(q) : Api.searchStock(q), 60_000)

  return (
    <div className="grid grid-cols-12 h-screen gap-4 p-4">
      <aside className="col-span-3 overflow-auto">
        <h2 className="mb-2 font-semibold">Trending Top 15</h2>
        {trending && <TrendingList items={trending} onPick={(it)=>{ setMode('theme'); setQ(it.theme.name) }}/>}    
      </aside>
      <main className="col-span-5 overflow-auto">
        <div className="mb-3 flex gap-2">
          <select value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="theme">theme</option>
            <option value="stock">stock</option>
          </select>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder={mode==='theme'? '輸入主題':'輸入代號'} className="border px-2 py-1 rounded w-full"/>
        </div>
        {/* 中欄詳情：theme or stock 概覽 */}
        {search.data && mode==='theme' && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{search.data.theme.name}</h3>
            <HeatBar score={search.data.heatScore}/>
            <ul className="list-disc ml-5">
              {search.data.stocks.map((s:any)=> <li key={s.ticker}>{s.ticker} {s.name} {s.reason?`— ${s.reason}`:''}</li>)}
            </ul>
          </div>
        )}
        {search.data && mode==='stock' && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{search.data.stock.ticker} {search.data.stock.name}</h3>
            <ul className="list-disc ml-5">
              {search.data.themes.map((t:any)=> <li key={t.theme.name}>{t.theme.name}（{t.heatScore}）</li>)}
            </ul>
          </div>
        )}
      </main>
      <section className="col-span-4 overflow-auto">
        {/* 右欄個股詳情 + 歸因（可後補） */}
      </section>
    </div>
  )
}
```

---

## 7. 本地串接與 Demo 流程

1. 先啟動 API（8787）：`pnpm wrangler dev`
2. 另啟動前端：
   ```bash
   cd apps/web && pnpm dev
   ```
3. 開啟 `http://localhost:5173`：
   - 左欄應出現 Trending 15（Skeleton → 實資料）
   - 搜「AI 伺服器」→ 中欄 1.5s 內出現 HeatBar 與清單
   - 切 `mode=stock`、輸入 `2330` → 右側可擴充個股詳情（≥5 主題）
   - 於網址列手動改 `?mode=theme&q=AI伺服器` → 完整還原

> 模擬錯誤：於搜尋輸入 `simulate500` → Toast + Retry。

---

## 8. 保底機制（雙連錯 → 切 Mock；恢復雲端即切回）

- 攝入於 `useQuery.ts`：已實作自動重試 1 次（800ms）
- 你可在 `api.ts` 捕捉 `AbortError` 或 500 次數，觸發：
  - 顯示 toast：「目前使用快取資料（60 秒內），系統將稍後自動重試。」
  - 將 BASE 替換為 `''`（同源 Worker）或直接改讀 `/mock/*.json`（開發環境）。

---

## 9. 部署（前端 Vercel、後端 Cloudflare Workers）

**後端**
```bash
cd apps/api
pnpm wrangler deploy
```

**前端**
1. 推到 GitHub → Import 至 Vercel。
2. `VITE_API_BASE=https://concepts-api.your.workers.dev`。
3. 部署完成後用自訂網域。

---

## 10. 檢查清單（QA 可直接跑）

- [ ] 左欄 Trending：恆為 15 筆，按 `heatScore` 排序
- [ ] 搜 `AI 伺服器`：中欄 HeatBar + stocks <= 10
- [ ] 點任一個股：右欄顯示所屬主題（>= 5）
- [ ] URL 直開 `?mode=theme&q=AI伺服器`：完整還原
- [ ] Timeout=3000ms；Retry=自動 1 次（800ms）；有 Toast
- [ ] 500 / 429 → Retry；400 / 404 → Empty
- [ ] 收藏：`favStocks:v1` 寫入、重整保留
- [ ] 返回上一頁：左/中欄捲動位置保留

---

## 11. 讓 Cursor 讀 PRD / 規格（最佳做法）

1. 把三份文件（MRD / PRD / 規格流程）丟進 `/docs`。
2. 在 Cursor 對話視窗點 **@ Files** → 勾選 `/docs` 夾。
3. 新增 **工作規則**：於 `.cursor/rules.md` 放入：
   - 凍結要點（Top 10 事實）
   - 錯誤碼對應表
   - 端點定義（/trending, /search）
4. 指令：
   - 「**以文件 `/docs/規格流程.md` 的 2.4 端點定義為準，生成 `apps/api` 的 Hono route**」
   - 「**以 `/docs/PRD.md` 的三欄式說明為準，生成 `TrendingList.tsx`**」

> 小撇步：每段對話都 **Attach** 關鍵檔案，讓 Cursor 自動引用上下文。

---

## 12. One-Feature-One-Prompt（可直接貼到 Cursor）

**A. TrendingList**
```
你是 TS + React + Tailwind 的前端。請依《規格流程 3.2 三欄式》與《市場熱度指標 3.1.4》，實作 `TrendingList.tsx`：
- 輸入：`items: StockConcept[]`（length 恆為 15）
- 右側以 HeatBar 呈現 0–100；條狀動畫、滑鼠 hover 顯示 tooltip（來源說明留佔位）
- 點擊項目觸發 `onPick(item)`
- A11y：list + button、focus 樣式
- 單檔輸出（含 minimal 測試）
```

**B. useQuery（快取 / 退避 / 超時）**
```
請寫 `useQuery.ts`：
- debounce=300ms、timeout=3000ms、retry=1（間隔 800ms）
- 同 key 在 60s 內命中快取
- 提供 { data, err, loading }
- 失敗時不要 throw；交給 Toast 處理
```

**C. /search 行為映射**
```
請寫 `services/api.ts`：
- /trending, /search（mode=theme|stock）
- HTTP 非 2xx 時將錯誤 JSON 直接回拋（{code,message}）
- 可選：若連續兩次 500/超時→改讀 /mock
```

**D. URL 還原與滾動保留**
```
請在 App.tsx 完成：
- readUrl()/writeUrl() 同步 mode|q
- 返回上一頁後，保留左右兩欄的滾動位置（用 sessionStorage 保存 scrollTop）
```

**E. StockDetailPanel + Attribution 佔位**
```
請建立 `StockDetailPanel.tsx` 與 `StockAttribution.tsx`：
- 標題：{ticker} {name}
- 區塊：Related Themes(>=5)、Attribution(來源清單)
- Attribution 資料先以 props 模擬；之後再接 /attribution API
```

---

## 13. AI 亮點實作（MVP 友善版）

> 先以「可 Demo」為優先，採 **最小 AI**：客製字典 + 提示工程 + 輕量 RAG。後續再上模型 API。

### 13.1 Query Rewrite（前端）
- 使用小字典與規則將使用者輸入改寫：
  - 例：`"tsmc" → "2330"`、`"ai server" → "AI 伺服器"`
- 可在 `utils/queryRewrite.ts` 加入映射表，並逐步從後端生成。

### 13.2 Attribution（後端佔位）
- 建立 `/attribution?stock=2330` 假資料：
  - 欄位：`{ theme, reason, sources: [url] }[]`
- 前端 `StockAttribution.tsx` 先渲染列表（來源可點）。

### 13.3 熱度來源說明（Tooltip）
- 在 HeatBar hover 顯示：
  - 範例：「由近 7 日新聞 / 社群分佈 + 搜尋熱度估算（0–100）」
- 之後可真的接 RAG 結果：GitHub Actions 每日生成，寫入 KV。

### 13.4 RAG Pipeline（延伸）
- GitHub Actions 觸發 Python：抓新聞／社群 → 規則過濾 → 向量化 → 以提示生成 `heatScore` 與 `reasons`，寫入 KV。
- Worker 讀 KV 回傳，前端不變。

---

## 14. 常見卡點 & 快速排解

- CORS：Worker 加 `cors()` 中介軟體或前端 devServer proxy。
- 逾時：確認 `AbortController` 有啟用；API 端回覆錯誤 JSON。
- Cursor 不讀檔：重新 Attach `/docs` ；把關鍵規格複製到 `.cursor/rules.md`。
- Vercel 404：檢查 `VITE_API_BASE`；前端路徑用相對 `/`。

---

## 15. README 片段（可貼）

```md
# 概念股自動化篩選系統 – Demo Freeze 2025-08-27
- 端點：GET /trending；GET /search?mode=theme|stock&q=...
- 規則：Trending 15；theme→stocks<=10；stock→themes>=5；heatScore 0–100
- 逾時：3000ms；自動重試 1 次（800ms）；429/500→Retry；400/404→Empty
- Favorites：localStorage `favStocks:v1`
- URL 還原：?mode|q；返回/重整保留滾動
```

---

## 16. 下一步（可選）

- 加入 E2E（Playwright）：覆寫 Demo 腳本 8 步驟。
- 以 D1/KV 儲存熱度與字典。
- 以 Edge Functions 加快 /trending /search。

---

> 完成以上步驟，你即可於 30–60 分鐘內從 0 到 Demo。任何畫面 / 錯誤訊息，直接貼上來我一起 debug。

