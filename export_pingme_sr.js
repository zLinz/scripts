// export_pingme_sr.js — 放在 Shadowrocket 里执行一次，复制控制台输出
const storeKey = "pingme_accounts_v1";
const raw = $persistentStore.read(storeKey);

if (!raw) {
  console.log("❌ 未找到 PingMe 账号存储，请先在 PingMe 里触发一次抓包");
  $done({});
}

const store = JSON.parse(raw);
const output = { version: 1, accounts: {}, order: [] };

for (const id of (store.order || [])) {
  const acc = store.accounts[id];
  if (!acc) continue;
  output.accounts[id] = {
    id: acc.id,
    alias: acc.alias || id,
    uaSeed: acc.uaSeed || 0,
    baseUA: acc.baseUA || "",
    params: acc.capture ? acc.capture.paramsRaw : {},
    headers: acc.capture ? acc.capture.headers : {}
  };
  output.order.push(id);
}

console.log("===== 复制下面整段 JSON 到 pingme_accounts.json =====");
console.log(JSON.stringify(output, null, 2));
console.log("===== 结束 =====");
console.log("账号数: " + output.order.length);
$done({});
