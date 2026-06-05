// Reset_Accounts.js
// 用于清空 Shadowrocket / Surge / Loon / QuanX 本地保存的 PingMe / WeTalk 账号参数
// 执行后需要重新打开 App 触发 queryBalanceAndBonus 重新入库账号

const scriptName = "账号参数重置";

const keys = [
  // PingMe
  "pingme_accounts_v1",
  "PingMe_run_logs",

  // WeTalk
  "wetalk_accounts_v1",
  "WeTalk_run_logs",

  // 兼容可能写错大小写或旧版本 key
  "PingMe_accounts_v1",
  "WeTalk_accounts_v1",
  "pingme_run_logs",
  "wetalk_run_logs"
];

function writeStore(key, value) {
  if (typeof $persistentStore !== "undefined") {
    return $persistentStore.write(value, key);
  }

  if (typeof $prefs !== "undefined") {
    return $prefs.setValueForKey(value, key);
  }

  return false;
}

function readStore(key) {
  if (typeof $persistentStore !== "undefined") {
    return $persistentStore.read(key);
  }

  if (typeof $prefs !== "undefined") {
    return $prefs.valueForKey(key);
  }

  return null;
}

function notify(title, subtitle, body) {
  if (typeof $notification !== "undefined") {
    $notification.post(title || "", subtitle || "", body || "");
    return;
  }

  if (typeof $notify !== "undefined") {
    $notify(title || "", subtitle || "", body || "");
    return;
  }

  console.log([title, subtitle, body].filter(Boolean).join("\n"));
}

let cleared = [];
let existed = [];

for (const key of keys) {
  const oldValue = readStore(key);

  if (oldValue !== null && oldValue !== undefined && oldValue !== "") {
    existed.push(key);
  }

  const ok = writeStore(key, "");

  if (ok) {
    cleared.push(key);
  }
}

const message = [
  `已尝试清理 ${cleared.length} 个 key`,
  "",
  existed.length
    ? `发现并清空：\n${existed.join("\n")}`
    : "没有检测到已有账号参数，但已执行清空操作。",
  "",
  "下一步：重新打开 PingMe / WeTalk，进入余额、Bonus 或 Rewards 页面，等待重新提示“新账号已入库”。"
].join("\n");

console.log("========== Reset Result ==========");
console.log(message);
console.log("==================================");

notify(scriptName, "重置完成", message);

if (typeof $done === "function") {
  $done();
}
