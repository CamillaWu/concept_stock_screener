from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

# 建立 FastAPI 應用
app = FastAPI(
    title="概念股篩選系統 - 數據管道",
    description="RAG 數據處理管道，提供概念股分析和篩選服務",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 添加 CORS 中間件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 數據模型
class StockConcept(BaseModel):
    id: str
    name: str
    description: str
    keywords: List[str]
    category: str
    heat_score: float
    stocks: List[str]

class ConceptAnalysis(BaseModel):
    concept_id: str
    analysis: str
    confidence: float
    recommendations: List[str]

# 模擬數據
mock_concepts = [
    {
        "id": "ai-chips",
        "name": "AI 晶片概念",
        "description": "人工智慧晶片相關的股票，包括設計、製造、封裝等產業鏈",
        "keywords": ["AI", "晶片", "人工智慧", "半導體", "機器學習"],
        "category": "科技",
        "heat_score": 0.95,
        "stocks": ["2330", "2454", "2379", "3034"]
    },
    {
        "id": "electric-vehicle",
        "name": "電動車概念",
        "description": "電動車產業相關股票，包括電池、馬達、充電樁等",
        "keywords": ["電動車", "電池", "充電", "新能源", "環保"],
        "category": "汽車",
        "heat_score": 0.88,
        "stocks": ["2317", "2354", "2308", "2327"]
    }
]

# API 端點
@app.get("/")
async def root():
    return {
        "message": "概念股篩選系統 - 數據管道",
        "version": "1.0.0",
        "status": "運行中"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "data-pipeline"}

@app.get("/concepts", response_model=List[StockConcept])
async def get_concepts():
    """獲取所有概念股列表"""
    return mock_concepts

@app.get("/concepts/{concept_id}", response_model=StockConcept)
async def get_concept(concept_id: str):
    """獲取特定概念股詳情"""
    concept = next((c for c in mock_concepts if c["id"] == concept_id), None)
    if not concept:
        raise HTTPException(status_code=404, detail="概念股不存在")
    return concept

@app.get("/concepts/search/{keyword}")
async def search_concepts(keyword: str):
    """搜尋概念股"""
    results = []
    for concept in mock_concepts:
        if (keyword.lower() in concept["name"].lower() or
            keyword.lower() in concept["description"].lower() or
            any(keyword.lower() in k.lower() for k in concept["keywords"])):
            results.append(concept)
    return {"results": results, "total": len(results)}

@app.post("/concepts/analyze", response_model=ConceptAnalysis)
async def analyze_concept(concept_id: str):
    """分析概念股（模擬 RAG 分析）"""
    concept = next((c for c in mock_concepts if c["id"] == concept_id), None)
    if not concept:
        raise HTTPException(status_code=404, detail="概念股不存在")

    # 模擬 AI 分析結果
    analysis = f"基於 {concept['name']} 的分析：該概念目前熱度評分為 {concept['heat_score']}，屬於 {concept['category']} 類別。"
    recommendations = [
        "關注相關產業政策變化",
        "監控龍頭企業財報表現",
        "留意技術創新和專利申請",
        "關注國際市場發展趨勢"
    ]

    return ConceptAnalysis(
        concept_id=concept_id,
        analysis=analysis,
        confidence=0.85,
        recommendations=recommendations
    )

# 啟動腳本
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")

    print(f"🚀 啟動概念股篩選系統數據管道...")
    print(f"📍 服務地址：http://{host}:{port}")
    print(f"📚 API 文檔：http://{host}:{port}/docs")

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
