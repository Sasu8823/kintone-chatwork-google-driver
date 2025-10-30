// ui.js - UI調整ユーティリティ（ダッシュボード描画、ボタン追加等）

export function renderDashboard(records) {
  const container = document.createElement('div');
  container.id = 'my-dashboard';
  container.style.padding = '12px';
  container.style.border = '1px solid #e5e7eb';
  container.style.borderRadius = '8px';
  container.innerHTML = `
    <h3 style="margin:0 0 8px 0">カスタムダッシュボード</h3>
    <div id="my-dashboard-content">レコード数: ${records.length}</div>
  `;
  // kintoneのヘッダーエリアへ挿入（一覧の場合）
  const header = kintone.app.getHeaderMenuSpaceElement();
  header.appendChild(container);
}

export function addCustomButtons(record, { onNotifyChatwork, onSyncTrello, onCreateDriveFolder }) {
  const spaceEl = kintone.app.record.getSpaceElement('custom_buttons_space'); // app に設置したスペースフィールドのコード
  if (!spaceEl) return;

  // Clear
  spaceEl.innerHTML = '';

  const btn = (label, cb) => {
    const b = document.createElement('button');
    b.innerText = label;
    b.style.marginRight = '8px';
    b.className = 'custom-btn';
    b.addEventListener('click', cb);
    return b;
  };

  spaceEl.appendChild(btn('Chatwork通知', onNotifyChatwork));
  spaceEl.appendChild(btn('Trello同期', onSyncTrello));
  spaceEl.appendChild(btn('Driveフォルダ作成', onCreateDriveFolder));
}
