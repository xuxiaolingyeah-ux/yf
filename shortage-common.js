/* ==========================================================================
   基层缺药：共享逻辑（数据 / 状态机 / 权限 / 单号 / 药品选择数据源）
   依赖：mock.js（MOCK.users、MOCK.shortages、MOCK.drugs）
        selection-common.js（SEL）
   页面需含节点：#toast #toastText #modalMask
   ========================================================================== */
(function () {
  "use strict";

  var DATA_KEY = "SHORTAGE_DATA";

  var STATUS = {
    draft: "草稿",
    pending: "待受理",
    accepted: "已受理",
    rejected: "已拒绝",
    resolved: "已解决"
  };

  var CATEGORY = { catalog: "药品目录缺失", stock: "库存不足" };
  var URGENCY = { normal: "一般", urgent: "紧急" };
  var REASONS = ["库存不足", "临床新增需求", "季节性需求", "其他"];
  var SOLUTIONS = {
    "center-transfer": "中心调拨",
    "org-transfer": "机构调拨",
    "purchase": "临时采购",
    "catalog-add": "目录增配"
  };

  var ORGS = {
    "village-1": "青河村卫生室",
    "member-1": "城东社区卫生服务中心",
    "org-c": "区域中心药房"
  };

  /* ---------------- 数据 ---------------- */
  function load() {
    var raw = sessionStorage.getItem(DATA_KEY);
    var list = null;
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { list = null; }
    }
    if (!list) {
      list = JSON.parse(JSON.stringify(MOCK.shortages || []));
      normalize(list);
      sessionStorage.setItem(DATA_KEY, JSON.stringify(list));
    }
    return list;
  }

  function normalize(list) {
    list.forEach(function (b) {
      b.deleted = !!b.deleted;
      b.records = b.records || [];
      if (!b.submitTime && b.status !== "draft") b.submitTime = b.createdAt;
    });
    return list;
  }

  function save(list) {
    sessionStorage.setItem(DATA_KEY, JSON.stringify(list));
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function persist(bill) {
    var all = load();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === bill.id) { all[i] = bill; save(all); return; }
    }
    all.push(bill);
    save(all);
  }

  /* ---------------- 登录 / 机构 ---------------- */
  function user() {
    var u = SEL.currentUser();
    if (u) return u;
    for (var i = 0; i < MOCK.users.length; i++) {
      if (MOCK.users[i].account === "wangfang") {
        var c = MOCK.users[i];
        u = { id: c.id, account: c.account, name: c.name, org: c.org, role: c.role, roleName: c.roleName };
        SEL.login(u);
        return u;
      }
    }
    return null;
  }

  function orgKey(u) {
    if (!u) return "";
    if (u.role === "village") return "village-1";
    if (u.role === "member") return "member-1";
    if (u.role === "center" || u.role === "pharmacist") return "org-c";
    return "";
  }

  function orgName(key) { return ORGS[key] || "—"; }

  /* 提交方 = 基层机构（成员机构 / 村卫生室） */
  function isGrassroots(u) {
    return u && (u.role === "member" || u.role === "village");
  }

  /* 受理 / 解决 = 中心药房审核人（与调拨一致：仅 role==="center"） */
  function isCenterAuditor(u) {
    return u && u.role === "center";
  }

  /* ---------------- 权限（角色 × 状态 × 操作） ---------------- */
  function isCreator(b, u) { return b.creatorId === u.id; }

  function canEdit(b, u) {
    return isCreator(b, u) && (b.status === "draft" || b.status === "rejected");
  }

  function canWithdraw(b, u) {
    return isCreator(b, u) && b.status === "pending";
  }

  function canAudit(b, u) {
    return b.status === "pending" && isCenterAuditor(u);
  }

  function canSolve(b, u) {
    return b.status === "accepted" && isCenterAuditor(u);
  }

  function related(b, u) {
    if (b.deleted) return false;
    if (isCreator(b, u)) return true;
    if (isCenterAuditor(u)) return true;
    return !!u && b.creatorOrg === u.org;
  }

  /* 列表操作按钮：按「角色 × 状态」矩阵渲染 */
  function actionsFor(b, u) {
    var acts = [{ key: "view", label: "查看" }];
    if (canEdit(b, u)) {
      acts.push({ key: "edit", label: "编辑" });
      acts.push({ key: "submit", label: "提交" });
      acts.push({ key: "delete", label: "删除", danger: true });
    }
    if (canWithdraw(b, u)) acts.push({ key: "withdraw", label: "撤回" });
    if (canAudit(b, u)) acts.push({ key: "audit", label: "受理" });
    if (canSolve(b, u)) acts.push({ key: "solve", label: "解决" });
    return acts;
  }

  /* ---------------- 状态流转 ---------------- */
  function addRecord(b, node, person, org, result, opinion) {
    b.records.push({
      node: node, person: person, org: org || "—",
      result: result, opinion: opinion || "—", time: SEL.fmtNow()
    });
  }

  function submitBill(b) {
    b.status = "pending";
    b.submitTime = SEL.fmtNow();
    addRecord(b, "提交登记", b.creator, b.creatorOrg, "已提交", "—");
  }

  function withdrawBill(b) {
    b.status = "draft";
    addRecord(b, "撤回", b.creator, b.creatorOrg, "已撤回", "—");
  }

  function auditBill(b, u, passed, opinion) {
    b.status = passed ? "accepted" : "rejected";
    addRecord(b, "中心药房受理", u.name, u.org, passed ? "受理" : "拒绝", opinion);
  }

  function solveBill(b, u, method, desc) {
    b.status = "resolved";
    b.solveMethod = method;
    b.solveDesc = desc || "";
    var label = SOLUTIONS[method] || method;
    var opinion = "解决方式：" + label + (desc ? "；" + desc : "");
    addRecord(b, "解决登记", u.name, u.org, "已解决", opinion);
  }

  /* ---------------- 单号 ---------------- */
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function ymd() {
    var d = new Date();
    return d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate());
  }

  function newCode(list) {
    var p = "QY" + ymd();
    var max = 0;
    list.forEach(function (b) {
      if (b.code && b.code.indexOf(p) === 0) {
        var n = parseInt(b.code.slice(p.length), 10);
        if (n > max) max = n;
      }
    });
    var seq = String(max + 1);
    while (seq.length < 3) seq = "0" + seq;
    return p + seq;
  }

  /* ---------------- 药品选择数据源 ----------------
     一行 = 药品 + 规格 + 生产企业 + 批准文号 组合，选中后四字段全带出 */
  function pickList() {
    var out = [];
    MOCK.drugs.forEach(function (d) {
      if (d.status !== "on") return;
      d.specs.forEach(function (s, si) {
        if (s.status !== "on") return;
        var vendors = (s.vendors && s.vendors.length) ? s.vendors : [{ name: "", approval: "" }];
        vendors.forEach(function (v, vi) {
          out.push({
            key: d.id + "_" + si + "_" + vi,
            drugId: d.id, si: si,
            drugCode: d.code, drugName: d.name,
            specCode: s.code, spec: s.title,
            vendor: v.name || "—", approval: v.approval || "—"
          });
        });
      });
    });
    return out;
  }

  function pickByKey(key) {
    var arr = pickList();
    for (var i = 0; i < arr.length; i++) if (arr[i].key === key) return arr[i];
    return null;
  }

  /* ---------------- 工具 ---------------- */
  function intVal(v) {
    return /^\d+$/.test(String(v).trim()) ? parseInt(v, 10) : NaN;
  }

  window.SC = {
    STATUS: STATUS, CATEGORY: CATEGORY, URGENCY: URGENCY,
    REASONS: REASONS, SOLUTIONS: SOLUTIONS, ORGS: ORGS,
    load: load, save: save, byId: byId, persist: persist,
    user: user, orgKey: orgKey, orgName: orgName,
    isGrassroots: isGrassroots, isCenterAuditor: isCenterAuditor,
    isCreator: isCreator, canEdit: canEdit, canWithdraw: canWithdraw,
    canAudit: canAudit, canSolve: canSolve,
    related: related, actionsFor: actionsFor,
    addRecord: addRecord, submitBill: submitBill, withdrawBill: withdrawBill,
    auditBill: auditBill, solveBill: solveBill,
    newCode: newCode, intVal: intVal,
    pickList: pickList, pickByKey: pickByKey
  };
})();
