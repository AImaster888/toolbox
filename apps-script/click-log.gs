/**
 * 工務小幫手 點擊統計（v1.3.0 ／ 2026-10-09）
 *
 * 用法：
 * 1. 在「工務小幫手後台」試算表：擴充功能 → Apps Script，把本檔全部貼上、儲存。
 * 2. 上方函式選 setup → 執行（第一次會要求授權）。會建立「點擊紀錄」「點擊統計」兩個分頁。
 * 3. 部署 → 新增部署作業 → 類型選「網頁應用程式」；執行身分「我」；誰可以存取「所有人」。
 * 4. 把部署後的網址（…/exec）填進 index.html 的 LOG_URL。
 *
 * 之後改了本檔要重新部署：部署 → 管理部署作業 → 編輯 → 版本選「新版本」，網址不變。
 */

const LOG_SHEET = '點擊紀錄';
const STAT_SHEET = '點擊統計';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const log = ss.getSheetByName(LOG_SHEET) || ss.insertSheet(LOG_SHEET);
  if (log.getLastRow() === 0) {
    log.appendRow(['時間', '類型', '工具id', '工具名稱', '分類', '訪客代號']);
    log.setFrozenRows(1);
  }

  const stat = ss.getSheetByName(STAT_SHEET) || ss.insertSheet(STAT_SHEET);
  stat.clear();
  const L = `'${LOG_SHEET}'!`;
  const views = `${L}B2:B="瀏覽"`;
  const today = `INT(${L}A2:A)=TODAY()`;
  stat.getRange('A1:B5').setValues([
    ['項目', '數值'],
    // 用 ROWS(UNIQUE()) 而非 COUNTUNIQUE：沒有資料時 COUNTUNIQUE 會把錯誤值算成 1
    ['今日瀏覽人數', `=IFERROR(ROWS(UNIQUE(FILTER(${L}F2:F, ${views}, ${today}))), 0)`],
    ['累計瀏覽人數', `=IFERROR(ROWS(UNIQUE(FILTER(${L}F2:F, ${views}))), 0)`],
    ['今日瀏覽次數', `=IFERROR(ROWS(FILTER(${L}A2:A, ${views}, ${today})), 0)`],
    ['累計瀏覽次數', `=COUNTIF(${L}B2:B, "瀏覽")`]
  ]);
  stat.getRange('A7').setFormula(
    `=QUERY(${L}A:F, "select D, E, count(A), max(A) where B = '點擊' group by D, E ` +
    `order by count(A) desc label D '工具名稱', E '分類', count(A) '點擊次數', max(A) '最後點擊'", 1)`
  );
}

function doPost(e) {
  const log = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG_SHEET);
  if (!log) return ContentService.createTextOutput('no sheet');

  const p = e.parameter || {};
  // 只收固定的類型；文字截短並擋掉公式開頭，避免有人亂送資料進試算表
  const clean = (v) => String(v || '').slice(0, 100).replace(/^[=+\-@]/, "'$&");
  log.appendRow([
    new Date(),
    p.type === '點擊' ? '點擊' : '瀏覽',
    clean(p.id),
    clean(p.name),
    clean(p.category),
    clean(p.visitor)
  ]);
  return ContentService.createTextOutput('ok');
}
