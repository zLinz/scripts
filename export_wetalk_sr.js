// export_wetalk_sr.js — 放在 Shadowrocket 里执行一次，复制控制台输出
const storeKey = "wetalk_accounts_v1";
const raw = $persistentStore.read(storeKey);

if (!raw) {
  console.log("❌ 未找到 WeTalk 账号存储，请先在 WeTalk 里触发一次抓包");
  $done({});
}

const store = JSON.parse(raw);
const output = { version: 2, accounts: {}, order: [] };

for (const id of (store.order || [])) {
  const acc = store.accounts[id];
  if (!acc) continue;
  const email = (acc.capture && acc.capture.paramsRaw && acc.capture.paramsRaw.email) || acc.email || id;
  output.accounts[id] = {
    id: id,
    email: email,
    alias: acc.alias || email,
    uaSeed: acc.uaSeed || 0,
    baseUA: acc.baseUA || "",
    params: acc.capture ? acc.capture.paramsRaw : {},
    headers: acc.capture ? acc.capture.headers : {}
  };
  output.order.push(id);
}

console.log("===== 复制下面整段 JSON 到 wetalk_accounts.json =====");
console.log(JSON.stringify(output, null, 2));
console.log("===== 结束 =====");
console.log("账号数: " + output.order.length);
$done({});
