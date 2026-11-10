/* ==========================================================================
   审批流程配置 · 公共数据层
   被 approval-flow-config.html（业务流程 ↔ 审批规则 绑定）与
   approval-rule-config.html（审批规则与节点维护）共用。
   数据结构：
     DB = { rules: [ { id, name, updated, nodes: [...] } ],
            bind:  { bizKey: ruleId } }
   节点 = { id, name, orgType, slot, orgName, role, transfer }
     orgType: self（发起机构内部）/ superior（发起人上级机构）
              / slot（申请单内机构，需 slot）/ fixed（指定机构，需 orgName）
   ========================================================================== */
(function (global) {
  "use strict";

  var STORE_KEY = "APPROVAL_CFG_V1";

  /* 机构槽位：全系统仅三种 */
  var SLOTS = [
    { key: "apply", name: "申请机构" },
    { key: "out", name: "出库机构" },
    { key: "in", name: "入库机构" }
  ];

  /* 业务流程（系统内置，不可增删）+ 该业务支持的机构槽位 */
  var BIZ = [
    { key: "stock-in", name: "入库审核", slots: ["apply", "in"] },
    { key: "outbound", name: "出库审核", slots: ["apply", "out"] },
    { key: "stock-adjust", name: "药品增损", slots: ["apply"] },
    { key: "stock-check", name: "库存盘点", slots: ["apply"] },
    { key: "stock-return", name: "库存退货", slots: ["apply", "out", "in"] },
    { key: "purchase-need", name: "采购需求", slots: ["apply"] },
    { key: "purchase-plan", name: "采购计划", slots: ["apply"] },
    { key: "price-adjust", name: "调价申请", slots: ["apply"] },
    { key: "transfer-v", name: "纵向调拨", slots: ["apply", "out"] },
    { key: "transfer-h", name: "横向调拨", slots: ["apply", "out"] }
  ];

  /* 机构树（指定机构下拉） */
  var ORGS = [
    "区域中心药房",
    "城东社区卫生服务中心",
    "城西社区卫生服务中心",
    "城南社区卫生服务中心",
    "青河村卫生室"
  ];

  /* 审核角色来自 IAM 统一角色字典 */
  var ROLES = ["审核人", "药房负责人", "库管员", "财务复核人"];

  var ORG_TYPES = [
    { key: "self", name: "发起机构内部" },
    { key: "superior", name: "发起人上级机构" },
    { key: "slot", name: "申请单内机构" },
    { key: "fixed", name: "指定机构" }
  ];

  var SEED = {
    rules: [
      {
        id: "r1", name: "默认单级审核", updated: "2026-10-18 09:12",
        nodes: [
          { id: "r1n1", name: "上级机构审核", orgType: "superior", slot: "", orgName: "", role: "审核人", transfer: false }
        ]
      },
      {
        id: "r2", name: "退库两级审核", updated: "2026-10-22 14:36",
        nodes: [
          { id: "r2n1", name: "上级机构审核", orgType: "superior", slot: "", orgName: "", role: "审核人", transfer: false },
          { id: "r2n2", name: "接收机构审核", orgType: "slot", slot: "in", orgName: "", role: "审核人", transfer: false }
        ]
      },
      {
        id: "r3", name: "纵向调拨审核", updated: "2026-11-06 10:20",
        nodes: [
          { id: "r3n1", name: "上级机构审核", orgType: "superior", slot: "", orgName: "", role: "审核人", transfer: true }
        ]
      },
      {
        id: "r4", name: "横向调拨审核", updated: "2026-10-28 16:45",
        nodes: [
          { id: "r4n1", name: "中心药房审核", orgType: "fixed", slot: "", orgName: "区域中心药房", role: "审核人", transfer: false }
        ]
      }
    ],
    bind: {
      "stock-in": "r1",
      "outbound": "r1",
      "stock-adjust": "r1",
      "stock-check": "r1",
      "stock-return": "r2",
      "purchase-need": "r1",
      "purchase-plan": "r1",
      "price-adjust": "r1",
      "transfer-v": "r3",
      "transfer-h": "r4"
    }
  };

  var DB = null;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function load() {
    if (DB) return DB;
    var raw = null;
    try { raw = localStorage.getItem(STORE_KEY); } catch (e) { /* ignore */ }
    if (raw) {
      try { DB = JSON.parse(raw); } catch (e) { DB = null; }
    }
    if (!DB || !DB.rules || !DB.bind) DB = clone(SEED);
    return DB;
  }

  function save() {
    load();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(DB)); } catch (e) { /* ignore */ }
  }

  function rules() { return load().rules; }

  function ruleById(id) {
    return rules().filter(function (r) { return r.id === id; })[0] || null;
  }

  function bizByKey(key) {
    return BIZ.filter(function (b) { return b.key === key; })[0] || null;
  }

  function bindOf(bizKey) { return load().bind[bizKey] || ""; }

  function setBind(bizKey, ruleId) {
    load();
    DB.bind[bizKey] = ruleId;
    save();
  }

  function bizBoundTo(ruleId) {
    return BIZ.filter(function (b) { return bindOf(b.key) === ruleId; });
  }

  function slotName(key) {
    var s = SLOTS.filter(function (x) { return x.key === key; })[0];
    return s ? s.name : "";
  }

  function orgTypeName(key) {
    var t = ORG_TYPES.filter(function (x) { return x.key === key; })[0];
    return t ? t.name : "";
  }

  /* 节点的审核机构描述，如「申请单内机构 · 入库机构」「指定机构 · 区域中心药房」 */
  function nodeOrgText(node) {
    if (!node) return "";
    if (node.orgType === "slot") return "申请单内机构 · " + (slotName(node.slot) || "未选" );
    if (node.orgType === "fixed") return "指定机构 · " + (node.orgName || "未选");
    return orgTypeName(node.orgType);
  }

  /* 规则链路文案：上级机构审核 → 接收机构审核 */
  function chainText(rule) {
    if (!rule || !rule.nodes || !rule.nodes.length) return "未配置节点";
    return rule.nodes.map(function (n) { return n.name || nodeOrgText(n); }).join(" → ");
  }

  /* 规则用到的槽位集合 */
  function ruleSlots(rule) {
    var used = [];
    ((rule && rule.nodes) || []).forEach(function (n) {
      if (n.orgType === "slot" && n.slot && used.indexOf(n.slot) < 0) used.push(n.slot);
    });
    return used;
  }

  /* 绑定校验：规则槽位 ⊆ 业务槽位。通过返回空字符串，不通过返回提示 */
  function checkBind(bizKey, rule) {
    var biz = bizByKey(bizKey);
    if (!biz || !rule) return "";
    var miss = ruleSlots(rule).filter(function (s) { return biz.slots.indexOf(s) < 0; });
    if (!miss.length) return "";
    return "该规则包含「" + miss.map(slotName).join("、") + "」审核节点，" +
      biz.name + "不支持此机构";
  }

  /* 槽位下拉候选 = 该规则所有已绑定业务槽位的交集；未绑定则列全部 */
  function slotCandidates(ruleId) {
    var list = bizBoundTo(ruleId);
    if (!list.length) return SLOTS.slice();
    var inter = list[0].slots.slice();
    list.forEach(function (b) {
      inter = inter.filter(function (s) { return b.slots.indexOf(s) >= 0; });
    });
    return SLOTS.filter(function (s) { return inter.indexOf(s.key) >= 0; });
  }

  function uid(prefix) {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function newNode() {
    return {
      id: uid("n"), name: "", orgType: "superior",
      slot: "", orgName: "", role: "", transfer: false
    };
  }

  function stamp() {
    var d = new Date();
    var p = function (n) { return n < 10 ? "0" + n : String(n); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) +
      " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  global.APPROVAL = {
    SLOTS: SLOTS,
    BIZ: BIZ,
    ORGS: ORGS,
    ROLES: ROLES,
    ORG_TYPES: ORG_TYPES,
    rules: rules,
    ruleById: ruleById,
    bizByKey: bizByKey,
    bindOf: bindOf,
    setBind: setBind,
    bizBoundTo: bizBoundTo,
    slotName: slotName,
    orgTypeName: orgTypeName,
    nodeOrgText: nodeOrgText,
    chainText: chainText,
    ruleSlots: ruleSlots,
    checkBind: checkBind,
    slotCandidates: slotCandidates,
    newNode: newNode,
    stamp: stamp,
    uid: uid,
    save: save,
    reset: function () { DB = clone(SEED); save(); }
  };
})(window);
