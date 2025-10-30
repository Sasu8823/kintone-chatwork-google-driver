// api.js - kintone API / 外部 API 呼び出しラッパー
// ここでは kintone REST API の呼び出し例と、GAS の WebApp 呼び出しラッパーを示す

const KINTONE_BASE = location.origin;
const KINTONE_APP_ID = kintone.app.getId();

export async function getRecords(query = '') {
  const body = {
    app: KINTONE_APP_ID,
    query: query,
    totalCount: true
  };
  const res = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body);
  return res.records;
}

// GAS の WebApp を叩いて Drive フォルダを作る（GAS 側で権限を持たせる）
// GAS_URL はデプロイした WebApp の URL に置き換える
export async function callGASCreateFolder({ recordId, name }) {
  const GAS_URL = 'https://script.google.com/macros/s/YOUR_GAS_DEPLOY_ID/exec';
  // POST する例
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'createFolder', recordId, name })
  });
  if (!res.ok) throw new Error('GAS request failed');
  return res.json();
}
