// chatwork.js - Chatwork 通知（Webhook or API token）
// ここは Chatwork の Incoming Webhook を使う想定。
// Chatwork の Incoming webhook が無い場合は、Chatwork API をサーバー側で代理実行する設計が必要です。

export async function notifyChatwork({ roomId, title, url }) {
  // 例: 自前のサーバ経由で Chatwork API トークンを安全に扱う方法が推奨
  // ここはプレーンな webhook を想定するサンプル。実運用ではトークン直接埋め込みは避ける。
  const CHATWORK_WEBHOOK = 'https://example.com/your-proxy/chatwork-webhook'; // 自前プロキシ推奨

  const payload = {
    body: `[info][title]${escapeHtml(title)}[/title]${url ? `詳細: ${url}` : ''}[/info]`
  };

  const res = await fetch(CHATWORK_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error('Chatwork notify failed: ' + txt);
  }
  return res.json();
}

function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
