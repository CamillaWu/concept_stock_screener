// 錯誤處理中間件
export const errorHandler = async (request: Request, env: any, ctx: any) => {
  try {
    // 繼續處理請求
    return await ctx.next();
  } catch (error) {
    console.error('API Error:', error);
    
    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : '內部伺服器錯誤',
      timestamp: new Date().toISOString(),
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
