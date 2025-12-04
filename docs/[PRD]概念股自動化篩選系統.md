# \[PRD\]概念股自動化篩選系統

### **1\. 產品目標與使命 (Product Goal & Mission)**

#### **1\.1 問題陳述 (Problem Statement)**

目前台灣股市投資人，特別是散戶，在追蹤「概念股」或「題材股」時面臨四大痛點：資訊更新不及時、主題歸類缺乏標準、人工維護成本高昂，以及專業工具的入門門檻過高。投資人高度依賴論壇、新聞報導或手動維護的 Excel 表格，往往在市場行情發酵後才得到資訊，錯失先機。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/281da332-d911-4b74-b633-6b1247c807e3#20d62b61-d15d-4293-bee9-36143eed9fde,d357e9c4-19f2-4675-ad49-410b1fcf7e9d)

#### **1\.2 產品使命 (Product Mission)**

我們的使命是打造一個**「免登入、三秒內回應」**的 AI 概念股探索引擎。我們旨在運用 Google Gemini AI 的自然語言處理能力，將抽象的投資概念與具體的股票清單無縫對接，徹底解決資訊不對稱與維護成本高昂的問題，讓所有投資人都能即時、輕鬆地發掘市場新機會。 [\[2\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#ed46a7a7-aa23-4751-b498-b3e0fa6874c4,15a7d60e-558e-4bdb-88f7-65648035a8e2,961b6fa7-1aa4-42dc-9128-ecad73956bf7)[\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

#### **1\.3 核心價值 (Core Value)**

本產品提供兩大核心功能，以一個直覺的搜尋介面整合：

1. **主題到個股 (Theme-to-Stock)：** 使用者輸入一個投資概念（如：「AI 伺服器」、「旅遊復甦」），AI 能即時生成一份包含主題說明、市場熱度評分，以及最多 10 檔相關個股的清單，並解釋每支股票入選的理由。 [\[4\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#6828faf4-21ab-42a7-af76-22d0d522e991,bc7a1308-af33-4b74-b225-c25c36da85fc,62dbc1cc-a224-43b0-9e93-da0ecdd1d288,ee2cbcb6-7a44-4dde-b3a9-14f254870f48,a1a6ef5e-7d4b-409d-b6cc-190afa0a2788,d9c62d34-4009-4361-8088-bcba171c4c80,d7e4781f-32d8-4673-8a85-b78a021a2319,1e2f2159-7f95-49e2-80a9-d44b20ba4201,e9a96fd5-ec09-42e5-af82-93f535dfdeb3,b2c38850-4cfb-4edb-af5c-3c1658dd69f5,026aed4e-275e-4c1f-afe1-f024c7056669,c2e446d6-4ef9-48c0-b5d7-45694f6ebf64,d6b2d5ad-2aff-43d8-9e2c-bf7262ccb57b,07b2cb9e-14a5-42f4-a106-cf0274f9274d,8569cdda-6de0-4d0a-b23f-cd8202ddcb4a,f29ddabf-1efd-49a3-b05d-06a11c81811c,986bc683-a9ce-4c60-b012-ae7b57bdc4d3,72f818b2-625d-4a2b-b188-eaa4271c8348,b02aaa82-240a-4c06-8a5a-75a3fd8191dc,90e9ea88-8296-4b13-a766-03aaecbea226,aa82ea3e-e45d-442e-9c3e-bf4692093cd8,d57e958b-1427-4afe-997f-8ac3bf7c0c9a,54145e03-c21e-45c4-b6ab-43069d34bf0f,56724541-9ee4-446f-9dfc-1fd6e862c36f,310f124f-a5a7-4ed3-89d4-d8034c1b003e)

2. **個股到主題 (Stock-to-Theme)：** 使用者輸入一支股票代號或名稱（如：「2330」或「台積電」），AI 能反向分析並找出該股票所屬的至少 5 個關鍵投資主題，並說明其在各主題中扮演的角色。 [\[4\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#6828faf4-21ab-42a7-af76-22d0d522e991,bc7a1308-af33-4b74-b225-c25c36da85fc,62dbc1cc-a224-43b0-9e93-da0ecdd1d288,ee2cbcb6-7a44-4dde-b3a9-14f254870f48,a1a6ef5e-7d4b-409d-b6cc-190afa0a2788,d9c62d34-4009-4361-8088-bcba171c4c80,d7e4781f-32d8-4673-8a85-b78a021a2319,1e2f2159-7f95-49e2-80a9-d44b20ba4201,e9a96fd5-ec09-42e5-af82-93f535dfdeb3,b2c38850-4cfb-4edb-af5c-3c1658dd69f5,026aed4e-275e-4c1f-afe1-f024c7056669,c2e446d6-4ef9-48c0-b5d7-45694f6ebf64,d6b2d5ad-2aff-43d8-9e2c-bf7262ccb57b,07b2cb9e-14a5-42f4-a106-cf0274f9274d,8569cdda-6de0-4d0a-b23f-cd8202ddcb4a,f29ddabf-1efd-49a3-b05d-06a11c81811c,986bc683-a9ce-4c60-b012-ae7b57bdc4d3,72f818b2-625d-4a2b-b188-eaa4271c8348,b02aaa82-240a-4c06-8a5a-75a3fd8191dc,90e9ea88-8296-4b13-a766-03aaecbea226,aa82ea3e-e45d-442e-9c3e-bf4692093cd8,d57e958b-1427-4afe-997f-8ac3bf7c0c9a,54145e03-c21e-45c4-b6ab-43069d34bf0f,56724541-9ee4-446f-9dfc-1fd6e862c36f,310f124f-a5a7-4ed3-89d4-d8034c1b003e)

#### **1\.4 MVP 成功指標 (MVP Success Metrics)**

為驗證產品核心價值，MVP 階段（上線後第 7 週）的成功標準訂為：

- **使用者觸及：** 7 天內累積不重複訪客 (UV) ≥ 300 人。 [\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

- **核心功能使用率：** 至少 50% 的訪客完成一次有效的主題或個股搜尋。 [\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

- **系統效能：** API 平均回應時間 < 800 毫秒，P99 回應時間 < 1.5 秒。 [\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

- **系統穩定性：** 自動化更新排程成功率 ≥ 95%。 [\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

### 2\. 目標市場與使用者 (Target Market & Users)

#### 2\.1 市場區隔 (Market Segmentation)

根據市場研究，我們將目標市場劃分為以下四個主要區隔，MVP 階段將優先服務核心目標與潛在轉換用戶。[\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/281da332-d911-4b74-b633-6b1247c807e3#20d62b61-d15d-4293-bee9-36143eed9fde,d357e9c4-19f2-4675-ad49-410b1fcf7e9d)[\[2\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/281da332-d911-4b74-b633-6b1247c807e3#60218b84-0a53-46e5-ae22-9c92d567f459)

- **核心目標：半專業散戶 (Semi-professional Retail Investors)**
  - **市場規模:** 約 45 萬人。

  - **特徵:** 具備一定投資經驗，積極尋找市場題材與輪動機會，但缺乏昂貴的專業工具，高度依賴手動整理資訊。[\[2\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/281da332-d911-4b74-b633-6b1247c807e3#60218b84-0a53-46e5-ae22-9c92d567f459)

- **潛在轉換：新手投資者 (Novice Investors)**
  - **市場規模:** 約 60 萬人 (30 歲以下)。

  - **特徵:** 投資經驗較少，對市場術語不熟悉，需要一個低門檻、易於學習的工具來探索熱門題材。[\[2\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/281da332-d911-4b74-b633-6b1247c807e3#60218b84-0a53-46e5-ae22-9c92d567f459)

- **次要目標：專業投資人 (Professional Investors)**
  - **市場規模:** 約 2,000 人 (券商研究員、自營部)。

  - **特徵:** 需求更為深入，可能成為未來 B2B 企業方案的潛在客戶。[\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/281da332-d911-4b74-b633-6b1247c807e3#20d62b61-d15d-4293-bee9-36143eed9fde,d357e9c4-19f2-4675-ad49-410b1fcf7e9d)

- **次要目標：金融 B2B (Financial B2B)**
  - **市場規模:** 約 30-50 家 (券商、財經媒體)。

  - **特徵:** 需要可嵌入、自動更新的內容 API 或 Widget，以豐富其平台資訊。[\[2\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/281da332-d911-4b74-b633-6b1247c807e3#60218b84-0a53-46e5-ae22-9c92d567f459)

#### 2\.2 使用者畫像 (User Personas)

**Persona A — Kevin (半專業散戶)** [\[2\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/281da332-d911-4b74-b633-6b1247c807e3#60218b84-0a53-46e5-ae22-9c92d567f459)

- **背景:** 35 歲，科技業後端工程師，投資經驗 8 年。

- **目標:** 需要即時掌握市場題材輪動，提升投資決策效率。

- **痛點:** 手動透過新聞和論壇維護概念股 Excel 表非常耗時，且資訊常常落後於市場反應。

- **情境:** 「半夜看到一則 CoWoS 產能吃緊的新聞，我希望能立刻打開網站，輸入『CoWoS』，在 3 秒內就看到一份附帶市場熱度分析的股票清單，整個研究過程不超過 1 分鐘。」

**Persona B — Irene (投資新手)** [\[2\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/281da332-d911-4b74-b633-6b1247c807e3#60218b84-0a53-46e5-ae22-9c92d567f459)

- **背景:** 26 歲，自由接案行銷，投資經驗 1 年。

- **目標:** 想要快速學習市場上的熱門話題，了解大家在討論什麼股票。

- **痛點:** 對許多投資術語不熟悉，專業的看盤軟體介面複雜，難以入門。

- **情境:** 「在通勤時聽到別人提到『光通訊』，我希望能用手機打開一個免登入的網站，直接點擊熱門主題，快速了解這個主題是什麼、包含哪些代表性股票，整個過程簡單直覺。」

#### 2\.3 使用者故事 (User Stories)

根據上述使用者畫像，我們定義出 MVP 階段的核心使用者故事：

1. **主題式搜尋 (For Kevin):**

   > 作為一位**半專業投資者**，我想要**輸入一個市場主題或新聞關鍵字**，以便**立即獲得一份相關的股票清單與市場熱度**，從而快速評估新的投資機會。[\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#6828faf4-21ab-42a7-af76-22d0d522e991,bc7a1308-af33-4b74-b225-c25c36da85fc,62dbc1cc-a224-43b0-9e93-da0ecdd1d288,ee2cbcb6-7a44-4dde-b3a9-14f254870f48,a1a6ef5e-7d4b-409d-b6cc-190afa0a2788,d9c62d34-4009-4361-8088-bcba171c4c80,d7e4781f-32d8-4673-8a85-b78a021a2319,1e2f2159-7f95-49e2-80a9-d44b20ba4201,e9a96fd5-ec09-42e5-af82-93f535dfdeb3,b2c38850-4cfb-4edb-af5c-3c1658dd69f5,026aed4e-275e-4c1f-afe1-f024c7056669,c2e446d6-4ef9-48c0-b5d7-45694f6ebf64,d6b2d5ad-2aff-43d8-9e2c-bf7262ccb57b,07b2cb9e-14a5-42f4-a106-cf0274f9274d,8569cdda-6de0-4d0a-b23f-cd8202ddcb4a,f29ddabf-1efd-49a3-b05d-06a11c81811c,986bc683-a9ce-4c60-b012-ae7b57bdc4d3,72f818b2-625d-4a2b-b188-eaa4271c8348,b02aaa82-240a-4c06-8a5a-75a3fd8191dc,90e9ea88-8296-4b13-a766-03aaecbea226,aa82ea3e-e45d-442e-9c3e-bf4692093cd8,d57e958b-1427-4afe-997f-8ac3bf7c0c9a,54145e03-c21e-45c4-b6ab-43069d34bf0f,56724541-9ee4-446f-9dfc-1fd6e862c36f,310f124f-a5a7-4ed3-89d4-d8034c1b003e)[\[4\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

2. **反向個股分析 (For Kevin):**

   > 作為一位**半專業投資者**，我想要**輸入一支特定的股票代號**，以便**了解它目前隸屬於哪些熱門概念主題**，從而驗證我的持股邏輯並發掘相關機會。[\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#6828faf4-21ab-42a7-af76-22d0d522e991,bc7a1308-af33-4b74-b225-c25c36da85fc,62dbc1cc-a224-43b0-9e93-da0ecdd1d288,ee2cbcb6-7a44-4dde-b3a9-14f254870f48,a1a6ef5e-7d4b-409d-b6cc-190afa0a2788,d9c62d34-4009-4361-8088-bcba171c4c80,d7e4781f-32d8-4673-8a85-b78a021a2319,1e2f2159-7f95-49e2-80a9-d44b20ba4201,e9a96fd5-ec09-42e5-af82-93f535dfdeb3,b2c38850-4cfb-4edb-af5c-3c1658dd69f5,026aed4e-275e-4c1f-afe1-f024c7056669,c2e446d6-4ef9-48c0-b5d7-45694f6ebf64,d6b2d5ad-2aff-43d8-9e2c-bf7262ccb57b,07b2cb9e-14a5-42f4-a106-cf0274f9274d,8569cdda-6de0-4d0a-b23f-cd8202ddcb4a,f29ddabf-1efd-49a3-b05d-06a11c81811c,986bc683-a9ce-4c60-b012-ae7b57bdc4d3,72f818b2-625d-4a2b-b188-eaa4271c8348,b02aaa82-240a-4c06-8a5a-75a3fd8191dc,90e9ea88-8296-4b13-a766-03aaecbea226,aa82ea3e-e45d-442e-9c3e-bf4692093cd8,d57e958b-1427-4afe-997f-8ac3bf7c0c9a,54145e03-c21e-45c4-b6ab-43069d34bf0f,56724541-9ee4-446f-9dfc-1fd6e862c36f,310f124f-a5a7-4ed3-89d4-d8034c1b003e)

3. **趨勢探索 (For Irene):**

   > 作為一位**投資新手**，我想要**在網站首頁看到當前最熱門的投資主題列表**，以便**輕鬆探索市場趨勢並學習新知識**。[\[5\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#dcdda3b4-2450-4981-bc15-566a8c4fcf78,493a06bb-7b71-42a7-acfa-3f627b49e338,376ce417-4cf0-455a-8e97-c6a610d0bc42,665ef241-5d6c-422f-b407-bb74daa0a84c,20f8bc2e-2bf6-4a2c-a1ff-9a12f8728ea5,550e276a-500c-40e0-8ee5-727ffb3e0887,096d8bf4-11cd-4139-9df0-4f51a338e6c8,fb7b6f15-42d7-45a4-833e-2922792183f2,df91afbb-6a28-438f-8f8f-6a9cebb88820,a701bd2b-ae54-4041-ab29-5eb2461136f7,42d2f9cb-3c26-4199-898f-ee36d68e1289,b610adbd-5362-42d4-a40f-6cb0d8a944cf,85a34104-9338-4007-83c9-f05b3bc54d7c,000d700d-e12c-44a3-8089-6b81f9daa395,98428bfd-65a2-4de8-941f-ce6acfbd5334,36ee3b4b-18f4-4db9-b409-36aecb3cb296,efa06e9c-82e6-497c-841a-bd6f18cd636e,83cda4db-57b9-4991-9671-63bddc2b07c5,dbfe576a-50a7-40b8-8264-672e801cf454)[\[6\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/748d97d5-5318-4c4b-ab99-b20acdb65fb9#47a767b0-184c-49eb-a43c-f342520a06b7,9b4e4fa1-9621-42c9-8a7c-47f467f22577,f0bebbe7-ec53-47eb-a0bf-cb3c8dd9e24e,941992f1-06a5-49bd-98d3-3e45ecf3824e)

4. **個人化追蹤 (For Both):**

   > 作為一位**活躍使用者**，我想要**收藏我感興趣的主題**，以便**未來可以一鍵快速查詢**，持續追蹤其發展。[\[5\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#dcdda3b4-2450-4981-bc15-566a8c4fcf78,493a06bb-7b71-42a7-acfa-3f627b49e338,376ce417-4cf0-455a-8e97-c6a610d0bc42,665ef241-5d6c-422f-b407-bb74daa0a84c,20f8bc2e-2bf6-4a2c-a1ff-9a12f8728ea5,550e276a-500c-40e0-8ee5-727ffb3e0887,096d8bf4-11cd-4139-9df0-4f51a338e6c8,fb7b6f15-42d7-45a4-833e-2922792183f2,df91afbb-6a28-438f-8f8f-6a9cebb88820,a701bd2b-ae54-4041-ab29-5eb2461136f7,42d2f9cb-3c26-4199-898f-ee36d68e1289,b610adbd-5362-42d4-a40f-6cb0d8a944cf,85a34104-9338-4007-83c9-f05b3bc54d7c,000d700d-e12c-44a3-8089-6b81f9daa395,98428bfd-65a2-4de8-941f-ce6acfbd5334,36ee3b4b-18f4-4db9-b409-36aecb3cb296,efa06e9c-82e6-497c-841a-bd6f18cd636e,83cda4db-57b9-4991-9671-63bddc2b07c5,dbfe576a-50a7-40b8-8264-672e801cf454)[\[7\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/748d97d5-5318-4c4b-ab99-b20acdb65fb9#63266294-55ad-4135-8154-818d944603a7,e3162af3-150d-4a07-80e8-01266c3b8503,08434843-7f1d-46ad-80a2-7aee07577bad,3c9223ed-f029-4557-9842-91882c32c2f4,51aafcbf-8ace-4f3c-b07c-7bcafaa8f7cb)

### 3\. 功能列表與優先級 (Features & Priority)

我們採用 MoSCoW 方法來劃分 MVP 階段的功能優先級，確保核心價值能被優先驗證。

#### 3\.1 Must-have (必要功能)

這些是構成產品核心價值不可或缺的功能，若缺少任一項，產品將無法解決目標用戶的核心痛點。

- **AI 雙向搜尋引擎 (Dual-Mode AI Search Engine)**
  - **說明:** 這是產品的核心。使用者可透過單一搜尋框，切換「主題模式」與「個股模式」。
    - **主題到個股 (Theme-to-Stock):** 輸入一個投資概念（例如：「光通訊」），AI 引擎會回傳一份結構化的 JSON 資料，包含主題說明、市場熱度評分，以及最多 10 檔相關個股列表，並附上每支個股的入選理由。

    - **個股到主題 (Stock-to-Theme):** 輸入股票代號或名稱（例如：「2330」），AI 引擎會反向分析並回傳該個股所屬的至少 5 個關鍵概念主題，並解釋其在各主題中的角色。

  - **驗證目標:** 解決 Kevin (半專業散戶) 快速評估機會與 Irene (投資新手) 學習探索的核心需求。

- **市場熱度指標 (Market Heat Indicator)**
  - **說明:** 在所有主題與個股列表中，以視覺化的「熱度條 (Heat Bar)」呈現 AI 評估的市場關注度（分數 0-100）。熱度條的顏色會從冷色（藍/青）動態變為暖色（黃/紅），讓使用者能一眼判斷題材的熱度。

  - **驗證目標:** 解決資訊標準不一的痛點，提供一個量化的參考指標。

- **趨勢主題探索 (Trending Themes)**
  - **說明:** **左欄固定清單**顯示近 24 小時熱門主題 **Top 15**；**排序支援 Popular / Latest**；點擊後更新中欄主題詳情與 Heat Bar；每列顯示【主題名稱｜Heat Bar｜（可選）關聯個股數】

  - **驗證目標:** 預設載入 15 條；點擊後中欄結果在 ≤1.5 秒內顯示；同步規則見 4.2。

- **後端自動化更新機制 (Backend Automation)**
  - **說明:** 建立每日執行的自動化排程，透過 RAG (檢索增強生成) 技術分析最新新聞與數據，更新概念股清單與熱度指標，並存入 KV Storage 供前端快速讀取。

  - **驗證目標:** 確保資訊的即時性，解決使用者手動維護成本高昂的痛點。

- **概念強度排名 (Concept Strength Ranking)**
  - **說明**：針對每個投資主題，計算多維度的強度指標，包括：
    1. 市值佔比

    2. 漲幅貢獻度

    3. 新聞與社群討論度\
       最終生成「概念強度分數」並提供排名。

  - **驗證目標**：幫助用戶快速判斷主題投資價值，提升決策效率。

- **個股歸因分析 (Stock Attribution Analysis)**
  - **說明**：在個股詳情面板中，顯示該股被納入主題的依據，包含新聞來源、財報摘要或公開資訊，確保 AI 判斷可追溯。

  - **驗證目標**：增強透明度與可解釋性，提升用戶信任度。

#### 3\.2 Should-have (應有功能)

這些功能對提升使用者體驗至關重要，能在 MVP 階段顯著增強產品的黏性。

- **主題收藏 (Theme Saving / Favorites)**
  - **說明:** 在每個主題卡片上提供一個「星號」圖示，使用者點擊後可將該主題儲存於瀏覽器的 Local Storage 中。已收藏的主題會顯示在左側邊欄，方便使用者一鍵快速查詢。

  - **驗證目標:** 滿足活躍使用者個人化追蹤的需求，提升 D7 留存率。

- **情緒 / 輿情分析 (Sentiment Analysis)**
  - **說明**：系統每日分析新聞與社群內容，提取投資相關的情緒指標，並以分數或正/負向比例顯示。這能補充市場熱度之外的「市場情緒溫度」。

  - **驗證目標**：提供使用者即時的市場脈動訊號，幫助判斷主題是否具備短期爆發力或潛在風險。

#### 3\.3 Could-have (可有功能)

這些是具備潛力但非 MVP 核心的功能，可在資源允許或未來版本中考慮。

- **嵌入式 Widget (Embeddable Widget)**
  - **說明:** 提供一段簡單的 HTML `<iframe>` 程式碼片段，讓財經部落客或媒體能將特定主題的自動更新清單嵌入到自己的文章或網站中。

  - **驗證目標:** 探索 B2B 合作的可能性，擴大產品觸及範圍。

- **異常波動警示 (Anomaly Alerting)**
  - **說明**：當某一主題相關股票群出現異常波動（例如單日漲跌幅 >5%，或成交量大幅異常），系統會在介面上即時提示。未來可延伸至簡訊或推播通知。

  - **驗證目標**：強化用戶對風險與市場異動的即時掌握，避免錯失機會或承受過高風險。

- **跨市場概念對照 (Cross-Market Mapping)**
  - **說明**：提供台股與美股的跨市場主題映射。例如輸入「台股：矽智財」，系統可自動顯示對應的美股公司（如 ARM）。

  - **驗證目標**：幫助投資者發現國際市場的投資對應標的，拓展應用價值。

#### 3\.4 Won't-have (本次不考慮)

為了確保 MVP 能在時程內專注於核心價值，以下功能在本次迭代中明確排除。

- **會員系統 (User Accounts)**
  - **理由:** 核心使命之一是「免登入」，導入會員系統會增加使用者摩擦力，且跨裝置同步收藏並非 MVP 的首要驗證項目。

- **進階圖表與即時數據整合 (Advanced Charts & Real-time Data)**
  - **理由:** MVP 專注於「概念探索」，而非即時交易。詳細的股價圖表與財務數據將透過外部連結至 Yahoo Finance 提供，以降低開發複雜度與 API 成本。

- **社區交流功能 (Community Features)**
  - **理由:** 建立社群需要額外的營運資源，與 MVP 階段專注於工具價值的目標不符。

### 4\. 核心流程與介面設計 (User Flow & UI Design)

#### 4\.1 核心使用者流程 (Core User Flow)

本產品設計了兩個主要的使用者旅程，分別對應我們的兩位核心使用者畫像。

**A. 探索導向流程 (Discovery Flow - for Irene, 投資新手)**

1. **進入首頁**: 使用者打開網站，左側邊欄立即載入並顯示當前市場上最熱門的 15 個投資主題。

2. **探索與點擊**: Irene 對「綠能概念股」感興趣，於是點擊了側邊欄上的該主題標籤。

3. **查看結果**: 中間主內容區塊更新，顯示出「綠能概念股」的詳細主題卡片，包含 AI 生成的主題說明、市場熱度條，以及最多 10 檔相關個股列表。

4. **收藏主題**: Irene 覺得這個主題值得長期追蹤，便點擊了主題卡片右上角的「星號」圖示，將其收藏。該主題立即出現在左側邊欄的「我的收藏」清單中。

**B. 搜尋導向流程 (Search Flow - for Kevin, 半專業散戶)**

1. **輸入查詢**: Kevin 在新聞中看到「CoWoS」這個關鍵字，於是在頂部的搜尋框中輸入「CoWoS」，並確認模式為「主題」。

2. **分析結果**: 中間主內容區塊顯示出「CoWoS」主題的分析結果。Kevin 瀏覽了個股列表，並點擊了其中一支股票「台積電」。

3. **查看個股詳情**: 右側的「詳情面板 (Detail Panel)」從右側滑入，顯示了 AI 對於「台積電」為何被歸類於 CoWoS 主題的具體原因，同時提供一個直接前往 Yahoo Finance 的外部連結。這個設計讓 Kevin 不會失去當前搜尋結果的上下文。

4. **反向查詢**: 為了進一步驗證，Kevin 在搜尋框中切換至「個股」模式，輸入「2330」。主內容區塊更新為台積電的個股分析視圖，列出了它所屬的所有相關概念主題，如「AI 伺服器」、「半導體設備」等，再次確認了其市場定位。

#### 4\.2 資訊架構與介面佈局 (Information Architecture & UI Layout)

我們採用了經典的三欄式佈局，旨在創造一個從「探索」到「分析」再到「詳情」的清晰資訊流。

- **左側邊欄 (Left Sidebar)**: 這是「探索與個人化」區域。它固定顯示「熱門趨勢」和使用者的「收藏主題」，作為探索新機會和快速存取關注項目的入口。在行動裝置上，此側邊欄會自動隱藏，以最大化內容可視區域。

- **中間主內容 (Center Main Content)**: 這是「分析與行動」的核心工作區。所有搜尋結果，無論是主題卡片還是個股分析，都在此處呈現。

- **右側詳情面板 (Right Detail Panel)**: 這是「深入上下文」的區域。當使用者點擊任何一支股票或特定主題時，此面板會以滑入動畫出現，提供更詳細的資訊，而不會跳轉頁面或遺失當前的搜尋結果。

- **清單與面板狀態同步規則**
  1.  **清單 → 主題詳情**：點擊左欄任一主題，搜尋框自動切至 **theme** 模式並填入該主題；中欄刷新主題詳情與 Heat Bar，保留左欄滾動位置。

  2.  **主題詳情 → 個股詳情**：在中欄點擊個股，右欄開啟個股詳情面板；返回中欄時保留原滾動位置與展開狀態。

  3.  **返回／重整還原**：返回上一層保留先前選取與滾動位置；若 URL 帶有 `mode`、`q` 參數則依參數還原頁面狀態，否則載入預設 Trending Themes。

### 5\. 非功能性需求 (Non-functional Requirements)

非功能性需求定義了系統的品質屬性與操作標準，確保產品不僅功能完整，更能提供穩定、高效且安全的使用者體驗。

#### 5\.1 效能 (Performance)

- **API 回應時間**:
  - 核心查詢 API (主題搜尋、個股分析) 的平均回應時間必須低於 **800 毫秒**。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)[\[2\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/8d572272-ea2b-432e-8622-70a339a1b36a#5c711bea-3183-4b9c-ba6f-a20948d8c606,e1f702a1-bb31-4476-875e-c2325fbfa123,63c8500b-0fd3-4515-872c-aed958e7dae8,bb3f3eb7-5208-42d0-8e04-c48cc361c533,2c982622-bf87-499e-a4c0-27ae018b870e,d0027929-8f98-43a1-af02-913aa661cd9a)

  - 在 99% 的情況下 (P99)，回應時間不得超過 **1\.5 秒**。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)[\[2\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/8d572272-ea2b-432e-8622-70a339a1b36a#5c711bea-3183-4b9c-ba6f-a20948d8c606,e1f702a1-bb31-4476-875e-c2325fbfa123,63c8500b-0fd3-4515-872c-aed958e7dae8,bb3f3eb7-5208-42d0-8e04-c48cc361c533,2c982622-bf87-499e-a4c0-27ae018b870e,d0027929-8f98-43a1-af02-913aa661cd9a)

- **前端載入速度**:
  - 網站的首次內容繪製 (LCP) 時間應小於 **2\.5 秒**，以符合 Google 的 SEO 核心網頁指標 (Core Web Vitals)。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

- **使用者輸入反饋**:
  - 禁止提交空白或僅有空白鍵的查詢，以節省 API 資源並避免無效請求。 [\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#abe101d9-3689-4be4-8893-fc351311c459,9ac90407-1402-4e29-ad11-8211434d9a80,2c445fc6-9950-4a38-a81c-ab7937e98771,e1f35604-6b6e-4c27-b84e-1dc3a90a4709,1e820e31-a64e-4647-8863-e105338f54a1,dc92e612-fec3-43bb-9e6b-1b79c10766a7,d30abeeb-0991-4c43-a292-a05896b0bcf5,cb7822b0-c9ee-41ed-9a22-7a4cbd0c39d5,ae4bb5f8-cf9c-4dfe-b064-5f49f230ae82,4aa4960d-560e-4ced-952f-cfebcb71661c,3483078f-2ef3-43ad-82bd-204a3ab9f94b,595685a6-0c0d-4f09-9874-d9e584300d79,e856f7b4-6058-4933-be04-5b5c2152de8c)

  - 在 AI 運算期間，搜尋按鈕必須處於禁用狀態並顯示載入動畫，提供明確的狀態反饋。 [\[4\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#dcdda3b4-2450-4981-bc15-566a8c4fcf78,493a06bb-7b71-42a7-acfa-3f627b49e338,376ce417-4cf0-455a-8e97-c6a610d0bc42,665ef241-5d6c-422f-b407-bb74daa0a84c,20f8bc2e-2bf6-4a2c-a1ff-9a12f8728ea5,550e276a-500c-40e0-8ee5-727ffb3e0887,096d8bf4-11cd-4139-9df0-4f51a338e6c8,fb7b6f15-42d7-45a4-833e-2922792183f2,df91afbb-6a28-438f-8f8f-6a9cebb88820,a701bd2b-ae54-4041-ab29-5eb2461136f7,42d2f9cb-3c26-4199-898f-ee36d68e1289,b610adbd-5362-42d4-a40f-6cb0d8a944cf,85a34104-9338-4007-83c9-f05b3bc54d7c,000d700d-e12c-44a3-8089-6b81f9daa395,98428bfd-65a2-4de8-941f-ce6acfbd5334,36ee3b4b-18f4-4db9-b409-36aecb3cb296,efa06e9c-82e6-497c-841a-bd6f18cd636e,83cda4db-57b9-4991-9671-63bddc2b07c5,dbfe576a-50a7-40b8-8264-672e801cf454)[\[5\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#326a594d-d05b-400b-b0d7-8d00791d25d0,b997d2a6-3235-40ec-8519-d1d68ccf01ba,28a582ac-89a1-40dd-927d-7e27e0acfd4f,7b1bcaa4-d9d5-4e55-91bd-ba3263c873d6,f121004b-4ed3-4900-85df-9cd46f2d1312,747ab8ee-96dc-4fcb-b137-231d0445a903,fee19ba9-f74f-4b32-89d3-bcd635720a8a,dcd4a81a-90e5-4843-b5ad-d1bb2bf98e00,55f44ade-146e-4c2b-bebe-f5ace5122116,d0dbbea3-cc4b-4627-9be5-b94f491b071d,e120ae89-2e55-49b4-b7ee-5ec5801227f4,6cf1cd15-b189-4cd9-8928-1863ae2eb508,b29cd103-cb7b-46a1-9983-e6872fb59968,3e770351-cdc7-469f-91c0-3e9fa8b32a6d,876842f1-5820-4bf4-b892-c4920304ce1e,470cfa12-8ff9-4911-8682-d38d086121e5,37438af3-2df9-49e7-8e88-3f0fc92bd549,dc3f23e6-2cdd-4e5e-b05e-bbce9fd491bf,52ffa19d-bf74-4b07-907e-4b43a8d41b08,89f5f9ee-ffb2-422b-a901-c0aff13cd88f,7e21ec53-167a-4ab3-b07c-531d9996a0bf,48949cd6-17cd-4921-9a77-714e7915c7a1,8ed11583-6348-44a8-a6a0-cde41feb9b91,9f54b3ba-5927-41d9-ba48-ccb5a453d015,cc2a7b45-bad1-42e5-9f35-99c68daf527b,4bb72a67-762f-43d0-a0c9-8e77a6f5b070,e6879017-2252-4f79-8349-37c59b9828a7,3eb968a9-4968-4d97-810d-86c2e42e4928,4d4726f1-f6c6-4c69-8634-31bef57eb61f,a4e016d0-69c2-44b6-86e0-f878fbd951c1,38fcab02-79b7-4ff5-ab46-d27b2e2ff1d1,3e8df5d6-8af2-41f5-bf6d-273da0bf29f3)

#### 5\.2 可用性與穩定性 (Availability & Stability)

- **系統上線時間 (Uptime)**:
  - 網站服務的可用性目標為 \*\*≥ 99.5%\*\*。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)[\[6\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/748d97d5-5318-4c4b-ab99-b20acdb65fb9#74a8c7ce-9864-4e90-b7fa-c40b84b1f6ec,f0ec7bb0-7c81-4ff3-8248-fffaea756137,23add587-4d5a-4a55-9fa8-78f8fffb9e1f,00dd893b-566a-480f-9b48-a81d47197b45,6ea319ec-99de-4a34-8e3f-ce11acc6a001)

- **後端排程穩定性**:
  - 每日自動更新概念股清單的 ETL (Extract, Transform, Load) 排程，其執行成功率必須 \*\*≥ 95%\*\*。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)[\[2\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/8d572272-ea2b-432e-8622-70a339a1b36a#5c711bea-3183-4b9c-ba6f-a20948d8c606,e1f702a1-bb31-4476-875e-c2325fbfa123,63c8500b-0fd3-4515-872c-aed958e7dae8,bb3f3eb7-5208-42d0-8e04-c48cc361c533,2c982622-bf87-499e-a4c0-27ae018b870e,d0027929-8f98-43a1-af02-913aa661cd9a)

- **錯誤處理 (Error Handling)**:
  - **API 錯誤**: 系統必須能優雅地處理來自 AI 服務的各種錯誤，包括但不限於：
    - 內容觸發安全過濾器 (`response was blocked`)。 [\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#abe101d9-3689-4be4-8893-fc351311c459,9ac90407-1402-4e29-ad11-8211434d9a80,2c445fc6-9950-4a38-a81c-ab7937e98771,e1f35604-6b6e-4c27-b84e-1dc3a90a4709,1e820e31-a64e-4647-8863-e105338f54a1,dc92e612-fec3-43bb-9e6b-1b79c10766a7,d30abeeb-0991-4c43-a292-a05896b0bcf5,cb7822b0-c9ee-41ed-9a22-7a4cbd0c39d5,ae4bb5f8-cf9c-4dfe-b064-5f49f230ae82,4aa4960d-560e-4ced-952f-cfebcb71661c,3483078f-2ef3-43ad-82bd-204a3ab9f94b,595685a6-0c0d-4f09-9874-d9e584300d79,e856f7b4-6058-4933-be04-5b5c2152de8c)

    - AI 未能遵循預設的 JSON 格式。 [\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#abe101d9-3689-4be4-8893-fc351311c459,9ac90407-1402-4e29-ad11-8211434d9a80,2c445fc6-9950-4a38-a81c-ab7937e98771,e1f35604-6b6e-4c27-b84e-1dc3a90a4709,1e820e31-a64e-4647-8863-e105338f54a1,dc92e612-fec3-43bb-9e6b-1b79c10766a7,d30abeeb-0991-4c43-a292-a05896b0bcf5,cb7822b0-c9ee-41ed-9a22-7a4cbd0c39d5,ae4bb5f8-cf9c-4dfe-b064-5f49f230ae82,4aa4960d-560e-4ced-952f-cfebcb71661c,3483078f-2ef3-43ad-82bd-204a3ab9f94b,595685a6-0c0d-4f09-9874-d9e584300d79,e856f7b4-6058-4933-be04-5b5c2152de8c)

    - 一般網路或伺服器錯誤。 [\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#abe101d9-3689-4be4-8893-fc351311c459,9ac90407-1402-4e29-ad11-8211434d9a80,2c445fc6-9950-4a38-a81c-ab7937e98771,e1f35604-6b6e-4c27-b84e-1dc3a90a4709,1e820e31-a64e-4647-8863-e105338f54a1,dc92e612-fec3-43bb-9e6b-1b79c10766a7,d30abeeb-0991-4c43-a292-a05896b0bcf5,cb7822b0-c9ee-41ed-9a22-7a4cbd0c39d5,ae4bb5f8-cf9c-4dfe-b064-5f49f230ae82,4aa4960d-560e-4ced-952f-cfebcb71661c,3483078f-2ef3-43ad-82bd-204a3ab9f94b,595685a6-0c0d-4f09-9874-d9e584300d79,e856f7b4-6058-4933-be04-5b5c2152de8c)

  - 以上情況都應向使用者顯示清晰、易於理解的錯誤訊息，而非程式崩潰。 [\[4\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#dcdda3b4-2450-4981-bc15-566a8c4fcf78,493a06bb-7b71-42a7-acfa-3f627b49e338,376ce417-4cf0-455a-8e97-c6a610d0bc42,665ef241-5d6c-422f-b407-bb74daa0a84c,20f8bc2e-2bf6-4a2c-a1ff-9a12f8728ea5,550e276a-500c-40e0-8ee5-727ffb3e0887,096d8bf4-11cd-4139-9df0-4f51a338e6c8,fb7b6f15-42d7-45a4-833e-2922792183f2,df91afbb-6a28-438f-8f8f-6a9cebb88820,a701bd2b-ae54-4041-ab29-5eb2461136f7,42d2f9cb-3c26-4199-898f-ee36d68e1289,b610adbd-5362-42d4-a40f-6cb0d8a944cf,85a34104-9338-4007-83c9-f05b3bc54d7c,000d700d-e12c-44a3-8089-6b81f9daa395,98428bfd-65a2-4de8-941f-ce6acfbd5334,36ee3b4b-18f4-4db9-b409-36aecb3cb296,efa06e9c-82e6-497c-841a-bd6f18cd636e,83cda4db-57b9-4991-9671-63bddc2b07c5,dbfe576a-50a7-40b8-8264-672e801cf454)[\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#abe101d9-3689-4be4-8893-fc351311c459,9ac90407-1402-4e29-ad11-8211434d9a80,2c445fc6-9950-4a38-a81c-ab7937e98771,e1f35604-6b6e-4c27-b84e-1dc3a90a4709,1e820e31-a64e-4647-8863-e105338f54a1,dc92e612-fec3-43bb-9e6b-1b79c10766a7,d30abeeb-0991-4c43-a292-a05896b0bcf5,cb7822b0-c9ee-41ed-9a22-7a4cbd0c39d5,ae4bb5f8-cf9c-4dfe-b064-5f49f230ae82,4aa4960d-560e-4ced-952f-cfebcb71661c,3483078f-2ef3-43ad-82bd-204a3ab9f94b,595685a6-0c0d-4f09-9874-d9e584300d79,e856f7b4-6058-4933-be04-5b5c2152de8c)

- **空狀態 (Empty States)**:
  - 系統必須為各種「空狀態」提供引導性文案，例如：首次進入網站的歡迎頁面、收藏清單為空、以及搜尋無結果時的提示。 [\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#abe101d9-3689-4be4-8893-fc351311c459,9ac90407-1402-4e29-ad11-8211434d9a80,2c445fc6-9950-4a38-a81c-ab7937e98771,e1f35604-6b6e-4c27-b84e-1dc3a90a4709,1e820e31-a64e-4647-8863-e105338f54a1,dc92e612-fec3-43bb-9e6b-1b79c10766a7,d30abeeb-0991-4c43-a292-a05896b0bcf5,cb7822b0-c9ee-41ed-9a22-7a4cbd0c39d5,ae4bb5f8-cf9c-4dfe-b064-5f49f230ae82,4aa4960d-560e-4ced-952f-cfebcb71661c,3483078f-2ef3-43ad-82bd-204a3ab9f94b,595685a6-0c0d-4f09-9874-d9e584300d79,e856f7b4-6058-4933-be04-5b5c2152de8c)

#### 5\.3 安全性 (Security)

- **傳輸加密**:
  - 網站必須全面啟用 HTTPS 加密連線，並設定內容安全策略 (Content Security Policy, CSP) 以防止跨網站指令碼 (XSS) 攻擊。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

- **資料最小化原則**:
  - 由於 MVP 階段採用「免登入」策略，系統不應要求或儲存任何使用者個人身份資訊 (PII)，僅在使用者本機瀏覽器的 Local Storage 中儲存其收藏的主題清單。 [\[7\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#f9111c30-7e68-4419-b3fc-a1abc51d5ca9,2c6e14d2-7498-4d34-8939-e80776d1cfaf,7dc04442-28a6-4038-a644-ec58dd2e9963,1d2440ce-a9eb-4fa3-8d22-f772eddcdd40,b26b744c-5af7-4e87-b64d-a8b91b81638f,3ea40ff9-1a7d-4b11-b3fb-9c9e2d49cd5d,b4979430-82f2-421c-999b-941b0ce467e7)[\[4\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#dcdda3b4-2450-4981-bc15-566a8c4fcf78,493a06bb-7b71-42a7-acfa-3f627b49e338,376ce417-4cf0-455a-8e97-c6a610d0bc42,665ef241-5d6c-422f-b407-bb74daa0a84c,20f8bc2e-2bf6-4a2c-a1ff-9a12f8728ea5,550e276a-500c-40e0-8ee5-727ffb3e0887,096d8bf4-11cd-4139-9df0-4f51a338e6c8,fb7b6f15-42d7-45a4-833e-2922792183f2,df91afbb-6a28-438f-8f8f-6a9cebb88820,a701bd2b-ae54-4041-ab29-5eb2461136f7,42d2f9cb-3c26-4199-898f-ee36d68e1289,b610adbd-5362-42d4-a40f-6cb0d8a944cf,85a34104-9338-4007-83c9-f05b3bc54d7c,000d700d-e12c-44a3-8089-6b81f9daa395,98428bfd-65a2-4de8-941f-ce6acfbd5334,36ee3b4b-18f4-4db9-b409-36aecb3cb296,efa06e9c-82e6-497c-841a-bd6f18cd636e,83cda4db-57b9-4991-9671-63bddc2b07c5,dbfe576a-50a7-40b8-8264-672e801cf454)[\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

#### 5\.4 可及性 (Accessibility, A11y)

為了確保身心障礙者也能順利使用，前端開發需遵循以下原則：

- **語意化 HTML**: 使用正確的 HTML 標籤（如 `<main>`, `<aside>`, `<button>`）來建構頁面結構。 [\[8\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#0ce2b7ea-655c-4dbb-96f6-cd9df68c2a21,49ee445b-888a-4ae1-a3b6-589a1a1bfd8c,5aed50fd-0299-4189-aadd-13cab6e4acfc,b6077625-8006-45b0-8d61-2e2ade9b0821,0958d3f9-c68e-4a9f-9152-4fd031bd2365,1fcb6df3-9d72-43d6-916e-7fe719fa6ee8,b5c26ce8-7d35-4ce2-8320-d771031e8d57,996ed83a-d350-4267-b917-f7c2f58381fb,912c5534-3b2e-473a-a542-d9ced4a362a9,fce03be2-88de-4ae1-bcff-c09cfdb2e534,142d1067-fa7d-42fc-866b-ae941dfe61c1,b5e32615-7252-45eb-8254-fdf45cf8a698,e6dc2b18-41c1-411d-b49b-18434086e5f0,cca29d43-f2ab-484d-98f7-1510345cc013,653249b1-5c06-43dc-a3e1-92e636763195,9e1d53f0-e996-4564-8d79-a194654b5a89,912bcf23-434b-4d67-9916-b15ece7cab8f,4c529601-09c8-4e25-9443-ba85398c577a)

- **輔助技術支援**:
  - 為所有僅有圖示的按鈕提供 `aria-label` 屬性，讓螢幕閱讀器能讀出其功能。 [\[8\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#0ce2b7ea-655c-4dbb-96f6-cd9df68c2a21,49ee445b-888a-4ae1-a3b6-589a1a1bfd8c,5aed50fd-0299-4189-aadd-13cab6e4acfc,b6077625-8006-45b0-8d61-2e2ade9b0821,0958d3f9-c68e-4a9f-9152-4fd031bd2365,1fcb6df3-9d72-43d6-916e-7fe719fa6ee8,b5c26ce8-7d35-4ce2-8320-d771031e8d57,996ed83a-d350-4267-b917-f7c2f58381fb,912c5534-3b2e-473a-a542-d9ced4a362a9,fce03be2-88de-4ae1-bcff-c09cfdb2e534,142d1067-fa7d-42fc-866b-ae941dfe61c1,b5e32615-7252-45eb-8254-fdf45cf8a698,e6dc2b18-41c1-411d-b49b-18434086e5f0,cca29d43-f2ab-484d-98f7-1510345cc013,653249b1-5c06-43dc-a3e1-92e636763195,9e1d53f0-e996-4564-8d79-a194654b5a89,912bcf23-434b-4d67-9916-b15ece7cab8f,4c529601-09c8-4e25-9443-ba85398c577a)

  - 切換按鈕需使用 `aria-pressed` 屬性來標示其當前狀態。 [\[8\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#0ce2b7ea-655c-4dbb-96f6-cd9df68c2a21,49ee445b-888a-4ae1-a3b6-589a1a1bfd8c,5aed50fd-0299-4189-aadd-13cab6e4acfc,b6077625-8006-45b0-8d61-2e2ade9b0821,0958d3f9-c68e-4a9f-9152-4fd031bd2365,1fcb6df3-9d72-43d6-916e-7fe719fa6ee8,b5c26ce8-7d35-4ce2-8320-d771031e8d57,996ed83a-d350-4267-b917-f7c2f58381fb,912c5534-3b2e-473a-a542-d9ced4a362a9,fce03be2-88de-4ae1-bcff-c09cfdb2e534,142d1067-fa7d-42fc-866b-ae941dfe61c1,b5e32615-7252-45eb-8254-fdf45cf8a698,e6dc2b18-41c1-411d-b49b-18434086e5f0,cca29d43-f2ab-484d-98f7-1510345cc013,653249b1-5c06-43dc-a3e1-92e636763195,9e1d53f0-e996-4564-8d79-a194654b5a89,912bcf23-434b-4d67-9916-b15ece7cab8f,4c529601-09c8-4e25-9443-ba85398c577a)

#### 5\.5 可維護性與擴展性 (Maintainability & Scalability)

- **持續整合與部署 (CI/CD)**:
  - 開發流程需導入自動化部署，確保程式碼合併後能自動完成測試與線上發佈。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

- **模組化架構**:
  - 專案程式碼應遵循關注點分離原則，劃分為三個獨立的 Repo/目錄： [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)
    - `data-pipeline/`: 負責數據處理與 RAG 的 Python 專案。

    - `edge-api/`: 處理 API 請求的 Cloudflare Workers 專案。

    - `web/`: 使用者介面的 React/Next.js 專案。

- **程式碼品質**:
  - 全專案使用 TypeScript 並定義嚴格的資料模型介面，以確保型別安全與數據一致性。 [\[9\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#b5d2e1ee-82e6-426b-ab35-64a8ae6be8f1,a53e9b8b-b401-4879-a728-180ac14acd15,a46104e8-7081-4793-8fa6-c0a6fcc345ba,7ac499ea-4ba5-4253-a6a4-81bff735bf03,b74e3fa5-e894-4ed0-bff0-1065bbf5ab51,4651de28-1f2f-47ae-8886-138520c06188,bf3dd49e-1787-4aff-a4e2-9a8e1f314a22)[\[5\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#326a594d-d05b-400b-b0d7-8d00791d25d0,b997d2a6-3235-40ec-8519-d1d68ccf01ba,28a582ac-89a1-40dd-927d-7e27e0acfd4f,7b1bcaa4-d9d5-4e55-91bd-ba3263c873d6,f121004b-4ed3-4900-85df-9cd46f2d1312,747ab8ee-96dc-4fcb-b137-231d0445a903,fee19ba9-f74f-4b32-89d3-bcd635720a8a,dcd4a81a-90e5-4843-b5ad-d1bb2bf98e00,55f44ade-146e-4c2b-bebe-f5ace5122116,d0dbbea3-cc4b-4627-9be5-b94f491b071d,e120ae89-2e55-49b4-b7ee-5ec5801227f4,6cf1cd15-b189-4cd9-8928-1863ae2eb508,b29cd103-cb7b-46a1-9983-e6872fb59968,3e770351-cdc7-469f-91c0-3e9fa8b32a6d,876842f1-5820-4bf4-b892-c4920304ce1e,470cfa12-8ff9-4911-8682-d38d086121e5,37438af3-2df9-49e7-8e88-3f0fc92bd549,dc3f23e6-2cdd-4e5e-b05e-bbce9fd491bf,52ffa19d-bf74-4b07-907e-4b43a8d41b08,89f5f9ee-ffb2-422b-a901-c0aff13cd88f,7e21ec53-167a-4ab3-b07c-531d9996a0bf,48949cd6-17cd-4921-9a77-714e7915c7a1,8ed11583-6348-44a8-a6a0-cde41feb9b91,9f54b3ba-5927-41d9-ba48-ccb5a453d015,cc2a7b45-bad1-42e5-9f35-99c68daf527b,4bb72a67-762f-43d0-a0c9-8e77a6f5b070,e6879017-2252-4f79-8349-37c59b9828a7,3eb968a9-4968-4d97-810d-86c2e42e4928,4d4726f1-f6c6-4c69-8634-31bef57eb61f,a4e016d0-69c2-44b6-86e0-f878fbd951c1,38fcab02-79b7-4ff5-ab46-d27b2e2ff1d1,3e8df5d6-8af2-41f5-bf6d-273da0bf29f3)

- **AI 邏輯抽象化**: 所有與 Gemini API 的互動都應封裝在一個獨立的 `geminiService.ts` 服務層中，便於未來更換模型或增加新的 AI 功能。 [\[10\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#72d8ca5c-81e0-4795-b452-9aa83dd214c6,1e06322c-21b7-4124-b871-ae47f9acc08a,d9cfcece-6cbe-401d-acf0-6f261a57d07c,65492499-afd3-4136-808a-9e9b7931e6e2,2caa51e6-401d-4c27-8b87-cd7cec6f9dad,4524c5b2-40a2-45b7-a5de-f384c8d3aa39,996b279f-ecda-4157-bfe3-fec474683e09,ba8587d8-0a1c-4f96-b048-f8d04387692b,7df0592f-c9a4-4353-a897-848154be4ec1,35ed4396-6383-4265-977f-136b49749fa1,0810112d-3802-4f71-bcc6-6f14b25578b7,688b212c-71d1-4bf2-a81a-715188cc79c2,a68a1b27-cebd-40bb-ab33-3fdf0cc358d1,77e6c095-8b15-4ad4-89b8-26d09e4be31d,8c9e9cd5-8f5c-4e72-844e-8a9d993ed3d3,d0f8ead0-d7be-4ab4-bda8-ad11062cd17d,47512012-99c7-41c8-8fff-38ca46d4c512,0945c4aa-2187-4d4c-a5e6-cd0dbba97637,e2054995-3c3c-4d7f-8ca2-a29ee0494f33,4b4a381b-5ea6-428f-83dd-dc663bcf3bbc,52900f93-2119-4e2b-ab9a-bdd16183331c,a0bd4908-49fe-4fda-8e06-8b24ebf7225d,0b1ec697-53f9-433f-90cb-842e35446520,a016059f-2490-4299-a0ff-26d35b0b7880,ba85fb6e-a4f7-417b-ac07-2ccc77bb34b2,6d1f7b2b-507b-467e-81ee-13854d80935f,ef8da62f-c336-43a4-83a0-32f3193c13f2,54430bee-6dc8-4663-936b-b063897cb81c,0ad2d524-3d01-4cab-906d-df91bd19771b)

### **6\. 技術棧與發佈計劃 (Tech Stack & Release Plan)**

#### **6\.1 技術棧 (Technology Stack)**

為達成 MVP 階段「低成本、高效能、快速迭代」的目標，我們選擇了一套以免費方案 (Free Tier) 為主、基於 Serverless 與 Edge Computing 的現代化技術棧。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)[\[2\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/281da332-d911-4b74-b633-6b1247c807e3#20d62b61-d15d-4293-bee9-36143eed9fde,d357e9c4-19f2-4675-ad49-410b1fcf7e9d)

- **前端 (Frontend):** **React (Next.js)** 搭配 **Tailwind CSS** 進行開發。React 提供強大的組件化能力，而 Next.js 簡化了靜態網站生成 (SSG) 與部署，Tailwind CSS 則能快速建構一個響應式、深色模式優先的介面。 [\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#f9111c30-7e68-4419-b3fc-a1abc51d5ca9,2c6e14d2-7498-4d34-8939-e80776d1cfaf,7dc04442-28a6-4038-a644-ec58dd2e9963,1d2440ce-a9eb-4fa3-8d22-f772eddcdd40,b26b744c-5af7-4e87-b64d-a8b91b81638f,3ea40ff9-1a7d-4b11-b3fb-9c9e2d49cd5d,b4979430-82f2-421c-999b-941b0ce467e7)[\[4\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#0ce2b7ea-655c-4dbb-96f6-cd9df68c2a21,49ee445b-888a-4ae1-a3b6-589a1a1bfd8c,5aed50fd-0299-4189-aadd-13cab6e4acfc,b6077625-8006-45b0-8d61-2e2ade9b0821,0958d3f9-c68e-4a9f-9152-4fd031bd2365,1fcb6df3-9d72-43d6-916e-7fe719fa6ee8,b5c26ce8-7d35-4ce2-8320-d771031e8d57,996ed83a-d350-4267-b917-f7c2f58381fb,912c5534-3b2e-473a-a542-d9ced4a362a9,fce03be2-88de-4ae1-bcff-c09cfdb2e534,142d1067-fa7d-42fc-866b-ae941dfe61c1,b5e32615-7252-45eb-8254-fdf45cf8a698,e6dc2b18-41c1-411d-b49b-18434086e5f0,cca29d43-f2ab-484d-98f7-1510345cc013,653249b1-5c06-43dc-a3e1-92e636763195,9e1d53f0-e996-4564-8d79-a194654b5a89,912bcf23-434b-4d67-9916-b15ece7cab8f,4c529601-09c8-4e25-9443-ba85398c577a)[\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

- **AI 引擎 (AI Engine):** **Google Gemini 1.5-flash** 模型。此模型透過 `@google/genai` SDK 呼叫，專為需要快速回應且成本敏感的應用設計，其強大的 JSON 結構化輸出能力是本專案的核心。 [\[5\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#ed46a7a7-aa23-4751-b498-b3e0fa6874c4,15a7d60e-558e-4bdb-88f7-65648035a8e2,961b6fa7-1aa4-42dc-9128-ecad73956bf7)[\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#f9111c30-7e68-4419-b3fc-a1abc51d5ca9,2c6e14d2-7498-4d34-8939-e80776d1cfaf,7dc04442-28a6-4038-a644-ec58dd2e9963,1d2440ce-a9eb-4fa3-8d22-f772eddcdd40,b26b744c-5af7-4e87-b64d-a8b91b81638f,3ea40ff9-1a7d-4b11-b3fb-9c9e2d49cd5d,b4979430-82f2-421c-999b-941b0ce467e7)[\[6\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#72d8ca5c-81e0-4795-b452-9aa83dd214c6,1e06322c-21b7-4124-b871-ae47f9acc08a,d9cfcece-6cbe-401d-acf0-6f261a57d07c,65492499-afd3-4136-808a-9e9b7931e6e2,2caa51e6-401d-4c27-8b87-cd7cec6f9dad,4524c5b2-40a2-45b7-a5de-f384c8d3aa39,996b279f-ecda-4157-bfe3-fec474683e09,ba8587d8-0a1c-4f96-b048-f8d04387692b,7df0592f-c9a4-4353-a897-848154be4ec1,35ed4396-6383-4265-977f-136b49749fa1,0810112d-3802-4f71-bcc6-6f14b25578b7,688b212c-71d1-4bf2-a81a-715188cc79c2,a68a1b27-cebd-40bb-ab33-3fdf0cc358d1,77e6c095-8b15-4ad4-89b8-26d09e4be31d,8c9e9cd5-8f5c-4e72-844e-8a9d993ed3d3,d0f8ead0-d7be-4ab4-bda8-ad11062cd17d,47512012-99c7-41c8-8fff-38ca46d4c512,0945c4aa-2187-4d4c-a5e6-cd0dbba97637,e2054995-3c3c-4d7f-8ca2-a29ee0494f33,4b4a381b-5ea6-428f-83dd-dc663bcf3bbc,52900f93-2119-4e2b-ab9a-bdd16183331c,a0bd4908-49fe-4fda-8e06-8b24ebf7225d,0b1ec697-53f9-433f-90cb-842e35446520,a016059f-2490-4299-a0ff-26d35b0b7880,ba85fb6e-a4f7-417b-ac07-2ccc77bb34b2,6d1f7b2b-507b-467e-81ee-13854d80935f,ef8da62f-c336-43a4-83a0-32f3193c13f2,54430bee-6dc8-4663-936b-b063897cb81c,0ad2d524-3d01-4cab-906d-df91bd19771b)

- **邊緣 API (Edge API):** **Cloudflare Workers**。所有前端對 AI 的請求都透過此無伺服器 API 代理，它能提供極低的延遲並處理 API 金鑰等敏感資訊，每日 **10 萬次免費請求**足以支撐 MVP 階段的流量。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

- **快取與儲存 (Cache & Storage):**
  - **Cloudflare KV:** 用於儲存每日由後端排程生成的熱門主題與概念股清單，提供毫秒級的讀取速度，是達成「三秒回應」目標的關鍵。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

  - **Browser Local Storage:** 用於儲存使用者收藏的主題，實現免登入的個人化追蹤功能。 [\[3\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#f9111c30-7e68-4419-b3fc-a1abc51d5ca9,2c6e14d2-7498-4d34-8939-e80776d1cfaf,7dc04442-28a6-4038-a644-ec58dd2e9963,1d2440ce-a9eb-4fa3-8d22-f772eddcdd40,b26b744c-5af7-4e87-b64d-a8b91b81638f,3ea40ff9-1a7d-4b11-b3fb-9c9e2d49cd5d,b4979430-82f2-421c-999b-941b0ce467e7)[\[7\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#dcdda3b4-2450-4981-bc15-566a8c4fcf78,493a06bb-7b71-42a7-acfa-3f627b49e338,376ce417-4cf0-455a-8e97-c6a610d0bc42,665ef241-5d6c-422f-b407-bb74daa0a84c,20f8bc2e-2bf6-4a2c-a1ff-9a12f8728ea5,550e276a-500c-40e0-8ee5-727ffb3e0887,096d8bf4-11cd-4139-9df0-4f51a338e6c8,fb7b6f15-42d7-45a4-833e-2922792183f2,df91afbb-6a28-438f-8f8f-6a9cebb88820,a701bd2b-ae54-4041-ab29-5eb2461136f7,42d2f9cb-3c26-4199-898f-ee36d68e1289,b610adbd-5362-42d4-a40f-6cb0d8a944cf,85a34104-9338-4007-83c9-f05b3bc54d7c,000d700d-e12c-44a3-8089-6b81f9daa395,98428bfd-65a2-4de8-941f-ce6acfbd5334,36ee3b4b-18f4-4db9-b409-36aecb3cb296,efa06e9c-82e6-497c-841a-bd6f18cd636e,83cda4db-57b9-4991-9671-63bddc2b07c5,dbfe576a-50a7-40b8-8264-672e801cf454)

- **後端數據管道 (Backend Data Pipeline):** **GitHub Actions** 搭配 **Python**。每日定時觸發 GitHub Actions 工作流程，執行 Python 腳本，透過 RAG 技術分析最新資訊源，生成新的概念股清單與熱度，並寫入 Cloudflare KV。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)[\[8\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/8d572272-ea2b-432e-8622-70a339a1b36a#540fb297-642b-4215-9285-d862168d1bbf)

- **部署與監控 (Deployment & Analytics):**
  - **Vercel:** 用於託管與部署前端 Next.js 應用，提供全球 CDN 與自動化的 CI/CD 流程。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

  - **Plausible Analytics (Self-hosted):** 用於匿名的使用者行為追蹤，以驗證 MVP 成功指標，同時確保使用者隱私。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

#### **6\.2 專案架構 (Project Architecture)**

專案採用模組化的 **Monorepo** 架構，將不同職責的程式碼分離至獨立的目錄中，以提高可維護性。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)[\[9\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/19945860-b8f9-48f9-978a-76d5cab11e87#b5d2e1ee-82e6-426b-ab35-64a8ae6be8f1,a53e9b8b-b401-4879-a728-180ac14acd15,a46104e8-7081-4793-8fa6-c0a6fcc345ba,7ac499ea-4ba5-4253-a6a4-81bff735bf03,b74e3fa5-e894-4ed0-bff0-1065bbf5ab51,4651de28-1f2f-47ae-8886-138520c06188,bf3dd49e-1787-4aff-a4e2-9a8e1f314a22)

- `data-pipeline/`: 存放所有 Python 相關的 ETL 與 RAG 腳本，負責每日的數據處理與分析。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

- `edge-api/`: 存放 Cloudflare Workers 的 TypeScript 程式碼，作為前端與後端服務 (如 Gemini API) 之間的中介層。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

- `web/`: 存放 Next.js 前端應用程式的所有程式碼，包含 UI 組件、狀態管理與頁面邏輯。 [\[1\]](https://app.heptabase.com/59be1831-d44b-418b-8c2e-8bd383448194/card/3e6e8db4-c1f0-48ec-bec7-957bcb9790da#1c739250-d54f-4701-9b1d-a8eed2904dbb,7d49f35e-4799-490a-b910-c6cddc7c4108,a93bba2d-b165-4e41-b0b1-de547b392917)

#### **6\.3 發佈計劃與里程碑 (Release Plan & Milestones)**

**2025/08/27（Week 6）**：MVP 凍結（功能範圍、資料模型、路由、同步規則）；完成前後端骨架與假資料。

**2025/08/29（Week 6+2）**：串接最小 API（`/search`、`/trending`、錯誤/空狀態/快取）；完成 E2E 驗收腳本並通過。

**2025/09/03（Week 7）**：Demo 版上線（Cursor 專案 + Demo Script）；收斂 UX 文案與收藏（`localStorage`），正式展示。

#### **6\.4 未來迭代與擴展規劃 (Future Iterations & Scaling Plan)**

- 資料源擴充與自動提醒（主題升溫／股價異常）。

- 個人化權重與排序、多市場擴張。

- 回測模組、報表匯出與通知整合。

#### 6\.5 資料模型（Data Models）

**欄位與清單約束（MVP）**

- `heatScore` 範圍：0–100（整數）；不足資料以 Skeleton 與空狀態處理。

- Trending 清單長度：預設 15 條；個股關聯清單上限 10 檔。

- 文字欄位（`reason`、`description`）需可顯示省略與展開。

```ts
// 個股
interface Stock {
  ticker: string; // 例：2330
  name: string; // 例：台積電
  exchange?: string; // 例：TWSE
  reason?: string; // 入選理由（對應主題）
}

// 主題（含關聯個股）
interface StockConcept {
  id: string; // 唯一識別
  theme: string; // 主題名稱
  description?: string;
  heatScore: number; // 0–100（整數）
  stocks: Stock[]; // 關聯個股清單
}

// 個股 → 主題的對應
interface ThemeForStock {
  theme: string;
  description?: string;
  heatScore: number; // 0–100（整數）
}

// 個股分析結果（供右欄使用）
interface StockAnalysisResult {
  stock: { ticker: string; name: string };
  themes: ThemeForStock[]; // 至少 5 筆（若不足呈現空狀態）
}
```

### 7\. 範圍界定（Scope Definition）

**In-Scope（MVP）**

- 雙向搜尋：**主題→個股**、**個股→主題**（SearchBar 模式切換）。

- **Trending Themes** 清單（Top 15）與 **Heat Bar** 指標視覺化。

- 三欄式佈局（左：主題清單／中：主題詳情／右：個股詳情）。

- 收藏（本地 `localStorage`）、Loading／Empty／Error／Retry 反饋。

- URL 參數還原（`mode`, `q`）與基本快取（同查詢二次點擊 1 分鐘內快取）。

**Out-of-Scope（本階段不做）**

- 多市場支援（非台股）、即時報價串流、技術線圖疊加。

- 登入／雲端同步收藏、權限系統。

- 回測、報表匯出、通知推送。

**Future（潛在後續）**

- 自動提醒（主題升溫／股價異常）、更豐富資料源整合。

- 個人化排序與權重設定、多語系與無障礙最佳化。

- 回測模組與策略模板、跨市場擴張。
