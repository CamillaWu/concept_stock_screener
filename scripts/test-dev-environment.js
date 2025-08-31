#!/usr/bin/env node

const http = require("http");

const LOCAL_API_URL = "http://localhost:8787";
const LOCAL_WEB_URL = "http://localhost:3002"; // 更新為正確的端口

console.log("Testing development environment...");

function testEndpoint(url, description) {
  return new Promise((resolve) => {
    console.log(`Testing: ${description}`);
    console.log(`   URL: ${url}`);
    
    const req = http.get(url, (res) => {
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
    
    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`   TIMEOUT: ${description}\n`);
      resolve({ success: false, error: "Timeout" });
    });
  });
}

async function runTests() {
  const tests = [
    { url: `${LOCAL_API_URL}/`, description: "API Root" },
    { url: `${LOCAL_API_URL}/trending`, description: "Trending API" },
    { url: `${LOCAL_API_URL}/rag/manifest.json`, description: "RAG Manifest API" },
    { url: `${LOCAL_WEB_URL}/rag/manifest.json`, description: "Frontend RAG Manifest" },
    { url: `${LOCAL_WEB_URL}/rag/docs.jsonl`, description: "Frontend RAG Docs" }
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
    console.log("Development environment is ready!");
  } else {
    console.log("Some tests failed. Please check if services are running.");
  }
}

runTests().catch(console.error);
