#!/usr/bin/env node

const https = require("https");
const http = require("http");

const PRODUCTION_API_URL = "https://concept-stock-screener-api.sandy246836.workers.dev";
const PRODUCTION_WEB_URL = "https://concept-stock-screener.vercel.app";

console.log("Testing production API connections...");

function testEndpoint(url, description) {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    
    console.log(`Testing: ${description}`);
    console.log(`   URL: ${url}`);
    
    const req = client.get(url, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`   SUCCESS: ${description}\n`);
        resolve({ success: true, statusCode: res.statusCode });
      } else {
        console.log(`   FAILED: ${description}\n`);
        resolve({ success: false, statusCode: res.statusCode });
      }
    });
    
    req.on("error", (error) => {
      console.log(`   ERROR: ${description} - ${error.message}\n`);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`   TIMEOUT: ${description}\n`);
      resolve({ success: false, error: "Timeout" });
    });
  });
}

async function runTests() {
  const tests = [
    { url: `${PRODUCTION_API_URL}/`, description: "API Root Endpoint" },
    { url: `${PRODUCTION_API_URL}/trending`, description: "Trending API" },
    { url: `${PRODUCTION_API_URL}/rag/manifest.json`, description: "RAG Manifest API" },
    { url: `${PRODUCTION_API_URL}/rag/docs.jsonl`, description: "RAG Docs API" }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.url, test.description);
    results.push({ ...test, ...result });
  }
  
  console.log("Test Results Summary:");
  console.log("=====================");
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  results.forEach(result => {
    const status = result.success ? "PASS" : "FAIL";
    console.log(`${status} ${result.description}`);
  });
  
  console.log(`\nOverall: ${successCount}/${totalCount} tests passed`);
  
  if (successCount === totalCount) {
    console.log("All API connection tests passed!");
  } else {
    console.log("Some tests failed, please check the services.");
  }
}

runTests().catch(console.error);
