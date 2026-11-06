/* ==========================================================================
   采购管理 · 采购申请：共享逻辑（数据存取 / 状态机 / 单号 / 校验）
   依赖：mock.js（MOCK.users、MOCK.purchaseRequests）、selection-common.js（SEL）
   ========================================================================== */
(function () {
  "use strict";

  var DATA_KEY = "PUR_REQUESTS";

  var STATUS = { draft: "草稿", pending: "待审核", approved: "审核通过", rejected: "已驳回" };

  /* ---------------- 数据 ---------------- */
  function load() {
    var raw = sessionStorage.getItem(DATA_KEY);
    var list = null;
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { list = null; }
    }
    if (!list) {
      list = JSON.parse(JSON.stringify(MOCK.purchaseRequests || []));
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

  function persist(req) {
    var all = load();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === req.id) { all[i] = req; save(all); return; }
    }
    all.push(req);
    save(all);
  }

  /* ---------------- 登录态（未登录时以村室发起人王芳演示） ---------------- */
  function user() {
    var u = SEL.currentUser();
    if (u) return u;
    for (var i = 0; i < MOCK.users.length; i++) {
      if (MOCK.users[i].role === "village") {
        var c = MOCK.users[i];
        u = { id: c.id, account: c.account, name: c.name, org: c.org, role: c.role, roleName: c.roleName };
        SEL.login(u);
        return u;
      }
    }
    return null;
  }

  function isCreator(req, u) { return req.creatorId === u.id; }
  function isAuditor(u) { return u.role === "member"; }
  function canAccess(u) { return u.role === "village" || u.role === "member"; }
  function auditorName() {
    for (var i = 0; i < MOCK.users.length; i++) {
      if (MOCK.users[i].role === "member") return MOCK.users[i].name;
    }
    return "—";
  }

  /* ---------------- 单号：PR + yyyymmdd + 3位流水 ---------------- */
  function newCode(list) {
    var d = new Date();
    function p2(n) { return (n < 10 ? "0" : "") + n; }
    var prefix = "PR" + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate());
    var max = 0;
    list.forEach(function (r) {
      if (r.code && r.code.slice(0, prefix.length) === prefix) {
        var n = parseInt(r.code.slice(prefix.length), 10);
        if (n > max) max = n;
      }
    });
    var seq = String(max + 1);
    while (seq.length < 3) seq = "0" + seq;
    return prefix + seq;
  }

  /* ---------------- 明细合计 / 校验 ---------------- */
  function totalQty(req) {
    var n = 0;
    (req.items || []).forEach(function (it) { n += Number(it.qty) || 0; });
    return n;
  }

  /* 需求量：正整数 */
  function isQty(v) {
    return /^\d+$/.test(String(v).trim()) && parseInt(v, 10) > 0;
  }

  /* 审批记录行 = 已发生记录 + 未到节点（草稿=未执行；待审核=待审核） */
  function recordRows(req) {
    var rows = (req.records || []).slice();
    if (req.status === "draft") {
      rows.push({ node: "成员机构审核", person: auditorName(), result: "未执行", opinion: "—", time: "—" });
    } else if (req.status === "pending") {
      rows.push({ node: "成员机构审核", person: auditorName(), result: "待审核", opinion: "—", time: "—" });
    }
    return rows;
  }

  window.PUR = {
    STATUS: STATUS,
    load: load, save: save, byId: byId, persist: persist,
    user: user, isCreator: isCreator, isAuditor: isAuditor, canAccess: canAccess,
    auditorName: auditorName, newCode: newCode,
    totalQty: totalQty, isQty: isQty, recordRows: recordRows
  };
})();
