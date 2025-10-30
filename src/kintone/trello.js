// trello.js - Trello 同期サンプル
// 注意: Trello API のキー/トークンはクライアントに置かないでください。本例は説明目的。
// 実運用はサーバー経由で API を呼ぶか、OAuth を適切に実装すること。

const TRELLO_PROXY = 'https://example.com/your-proxy/trello'; // 自前サーバ経由が望ましい

export async function syncToTrello(record) {
  // レコードからカード情報を作る
  const title = record.$title ? record.$title.value : `レコード${record.$id.value}`;
  const description = Object.keys(record)
    .filter(k => !k.startsWith('$'))
    .map(k => `${k}: ${getFieldValue(record[k])}`)
    .join('\n');

  const res = await fetch(TRELLO_PROXY, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      action: 'createCard',
      name: title,
      desc: description,
      // optionally: listId, boardId
    })
  });
  if (!res.ok) throw new Error('Trello sync failed');
  return res.json();
}

function getFieldValue(field) {
  // kintone フィールドオブジェクトから文字列化
  if (!field) return '';
  if (field.type === 'SINGLE_LINE_TEXT' || field.type === 'NUMBER' || field.type === 'RICH_TEXT') return field.value;
  if (field.type === 'CREATOR' || field.type === 'MODIFIER') return field.value?.name || '';
  if (field.type === 'CHECK_BOX' || field.type === 'MULTI_SELECT') return (field.value || []).join(', ');
  if (field.type === 'RECORD_NUMBER') return field.value;
  return JSON.stringify(field.value);
}
