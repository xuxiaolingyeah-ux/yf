/* ==========================================================================
   药品调价：共享逻辑（数据存取 / 状态文案 / 到点模拟 / 计算）
   依赖：mock.js（MOCK.users、MOCK.priceAdjusts）、selection-common.js（SEL）
   ========================================================================== */
(function () {
  "use strict";

  var DATA_KEY = "PA_DATA";

  var AUDIT = { draft: "草稿", pending: "待审核", approved: "审核通过", rejected: "已拒绝" };
  var ADJUST = { pending: "未调价", adjusted: "已调价" };
  var EFFECT = { immediate: "立即生效", scheduled: "定时生效" };

  /* ---------------- 数据 ---------------- */
  function load() {
    var raw = sessionStorage.getItem(DATA_KEY);
    var list = null;
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { list = null; }
    }
    if (!list) {
      list = JSON.parse(JSON.stringify(MOCK.priceAdjusts));
      sessionStorage.setItem(DATA_KEY, JSON.stringify(list));
    }
    return list;
  }

  function save(list) {
    sessionStorage.setItem(DATA_KEY, JSON.stringify(list));
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  /* 定时生效到点模拟：审核通过 + 定时 + 未调价 + 计划时间已到 → 已调价 */
  function tick(list) {
    var now = SEL.fmtNow();
    var changed = false;
    list.forEach(function (b) {
      if (b.auditStatus === "approved" && b.effectType === "scheduled" &&
          b.adjustStatus === "pending" && b.planTime && b.planTime <= now) {
        b.adjustStatus = "adjusted";
        b.actualTime = b.planTime;
        changed = true;
      }
    });
    if (changed) save(list);
  }

  /* 把当前改动写回 sessionStorage（按 id 定位） */
  function persist(bill) {
    var all = load();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === bill.id) { all[i] = bill; save(all); return; }
    }
    all.push(bill);
    save(all);
  }

  /* ---------------- 登录态（复用遴选；未登录时以发起人陈静演示） ---------------- */
  function user() {
    var u = SEL.currentUser();
    if (u) return u;
    for (var i = 0; i < MOCK.users.length; i++) {
      if (MOCK.users[i].account === "chenjing") {
        var c = MOCK.users[i];
        u = { id: c.id, account: c.account, name: c.name, org: c.org, role: c.role, roleName: c.roleName };
        SEL.login(u);
        return u;
      }
    }
    return null;
  }

  function isCreator(bill, u) { return bill.creatorId === u.id; }
  function isAuditor(u) { return u.role === "center"; }

  /* ---------------- 计算 ---------------- */
  function money(n) {
    n = Math.round((Number(n) || 0) * 100) / 100;
    return n.toFixed(2);
  }
  function rowPurchaseDiff(it) { return (it.newPurchase - it.oldPurchase) * it.stock; }
  function rowRetailDiff(it) { return (it.newRetail - it.oldRetail) * it.stock; }
  function sums(bill) {
    var p = 0, r = 0;
    bill.items.forEach(function (it) {
      p += rowPurchaseDiff(it);
      r += rowRetailDiff(it);
    });
    return { purchase: money(p), retail: money(r) };
  }

  /* 调价单号：TJ + yyyymmdd + 3位流水（按当天已有最大流水 +1） */
  function newCode(list) {
    var d = new Date();
    function p2(n) { return (n < 10 ? "0" : "") + n; }
    var prefix = "TJ" + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate());
    var max = 0;
    list.forEach(function (b) {
      if (b.code && b.code.slice(0, prefix.length) === prefix) {
        var n = parseInt(b.code.slice(prefix.length), 10);
        if (n > max) max = n;
      }
    });
    var seq = String(max + 1);
    while (seq.length < 3) seq = "0" + seq;
    return prefix + seq;
  }

  /* 两位小数价格格式校验（≥0，最多两位小数） */
  function isPrice(v) {
    return /^\d+(\.\d{1,2})?$/.test(String(v).trim());
  }

  window.PA = {
    AUDIT: AUDIT, ADJUST: ADJUST, EFFECT: EFFECT,
    load: load, save: save, byId: byId, tick: tick, persist: persist,
    user: user, isCreator: isCreator, isAuditor: isAuditor,
    money: money, rowPurchaseDiff: rowPurchaseDiff, rowRetailDiff: rowRetailDiff,
    sums: sums, newCode: newCode, isPrice: isPrice
  };
})();
