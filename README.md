# 工務小幫手 Toolbox

版本 **v1.2.0**（2026-08-22）

個人常用工具與 prompt 的入口網站，單一 `index.html`，資料放在 Google Sheets，前端即時讀取 CSV。
線上位址：https://aimaster888.github.io/toolbox/

## 後台資料（Google Sheets）

| 欄 | 名稱 | 說明 |
|---|---|---|
| A | id | 流水號 |
| B | name | 工具名稱（必填，沒填不顯示） |
| C | description | 卡片上的一行說明 |
| D | link | 工具網址。**有填 → 一般工具卡片，點了開新分頁** |
| E | category | 分類，前端自動產生篩選標籤 |
| F | prompt | prompt 全文。**D 欄空白時 → Prompt 卡片，點了跳彈窗顯示全文並可一鍵複製** |
| G | status | 填「已完成」才會顯示，其餘一律不顯示 |

規則：`name` 有填，且 `link` 或 `prompt` 至少有一個有內容，`status` 為「已完成」，該列才會出現在網頁上。
D 欄和 F 欄同時有內容時，以 D 欄的連結為準（顯示成一般工具卡片）。

資料來源網址不是整張表的 `export?format=csv`，而是 gviz 查詢，只取 A~G 欄：

```
https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?tqx=out:csv&gid=<SHEET_GID>&headers=1&tq=select A,B,C,D,E,F,G
```

這樣 H 欄以後的備份資料（例如存放原始碼的 code 欄）就不會被訪客下載。
換試算表時改 `index.html` 裡的 `SHEET_ID` 與 `SHEET_GID`；欄位有增減再改 `select` 後面的欄位代號。
**注意：試算表必須維持「知道連結的人可檢視」，否則前端讀不到資料。**

## 版本歷程

- **v1.2.0（2026-08-22）**
  - 資料來源改用 gviz 查詢只取 A~G 欄，載入量由 105 KB 降為 21 KB（減少約 80%）
  - 移除已無作用的「尚未設定網址」檢查
- **v1.1.0（2026-08-22）**
  - 站名由「工務智庫」改為「工務小幫手」
  - 新增 Prompt 卡片：沒有連結、只有 F 欄 prompt 的項目不再被略過，改以虛線卡片呈現
  - 新增 Prompt 彈窗，支援一鍵複製、Esc 或點背景關閉；不支援剪貼簿 API 時自動退回「全選文字請使用者按 Ctrl+C」
  - 搜尋範圍加入 prompt 內文
- **v1.0.0**：初版，讀 Google Sheets CSV 顯示工具卡片、分類篩選、關鍵字搜尋
