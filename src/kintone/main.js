// main.js - kintone カスタマイズのエントリポイント
// 使い方: Kintoneのカスタマイズにバンドルした main.js を登録する

import { renderDashboard, addCustomButtons } from './ui.js';
import { notifyChatwork } from './chatwork.js';
import { syncToTrello } from './trello.js';
import { callGASCreateFolder } from './api.js';

(function() {
  'use strict';

  // レコード一覧表示時にダッシュボードを差し込む（index）
  kintone.events.on('app.record.index.show', function(event) {
    // 1回だけ描画する
    if (document.getElementById('my-dashboard')) return event;
    renderDashboard(event.records);
    return event;
  });

  // レコード詳細にカスタムボタンを追加
  kintone.events.on('app.record.detail.show', function(event) {
    const record = event.record;
    addCustomButtons(record, {
      onNotifyChatwork: () => {
        notifyChatwork({
          roomId: 'ROOM_ID_OR_WEBHOOK',
          title: record.$title ? record.$title.value : `レコード ${record.$id.value}`,
          url: location.href
        }).then(() => {
          alert('Chatwork に通知しました');
        }).catch(err => {
          console.error(err);
          alert('Chatwork 通知に失敗しました');
        });
      },
      onSyncTrello: () => {
        syncToTrello(record).then(() => {
          alert('Trello に同期しました');
        }).catch(err => {
          console.error(err);
          alert('Trello 同期に失敗しました');
        });
      },
      onCreateDriveFolder: () => {
        // GAS の Web App URL を使って Drive フォルダを作成
        callGASCreateFolder({ recordId: record.$id.value, name: record.$title?.value || `record-${record.$id.value}` })
          .then(res => alert('Google Drive にフォルダを作成しました: ' + res.folderUrl))
          .catch(err => { console.error(err); alert('フォルダ作成に失敗しました'); });
      }
    });

    return event;
  });

  // 新規登録成功時などに外部連携を自動で呼ぶ例
  kintone.events.on('app.record.create.submit.success', function(event) {
    const r = event.record;
    // 例：Chatwork に通知して Trello にカード作成
    notifyChatwork({ roomId: 'ROOM_ID', title: `新規レコード: ${r.$title?.value}`, url: '' }).catch(()=>{});
    syncToTrello(r).catch(()=>{});
    return event;
  });

})();
