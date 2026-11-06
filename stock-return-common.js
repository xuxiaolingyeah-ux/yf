/* =========================================================
 * 药品退库 · 共享逻辑（SR 命名空间）
 * 依赖：无（独立 IIFE，挂 window.SR）
 * 数据：sessionStorage "SR_DATA" / "SR_USER"，首次从种子生成
 * 流程：草稿 → 待上级审核 →（上级==接收机构时跳过）→ 待接收机构审核 → 审核通过
 *       → 待出库 →（出库，生成 CK 单号）→ 待签收 →（入库，生成 RK 单号）→ 已完成
 * ========================================================= */
(function () {
  "use strict";

  /* ---------- 演示账号（顶栏可切换） ---------- */
  var USERS = [
    { id: "u1", name: "王芳", role: "village", roleName: "村室", orgId: "o1" },
    { id: "u2", name: "李强", role: "member", roleName: "成员机构", orgId: "o2" },
    { id: "u3", name: "陈静", role: "center", roleName: "中心药房·药师", orgId: "o3" },
    { id: "u4", name: "赵敏", role: "center", roleName: "中心药房·审核", orgId: "o3" }
  ];

  /* ---------- 机构 / 药房 / 库位 ---------- */
  var ORGS = [
    { id: "o1", name: "幸福村卫生室", pharmacies: [
      { id: "p11", name: "村卫生室药房", locations: ["A 区药柜", "B 区药柜"] }
    ] },
    { id: "o2", name: "城东社区卫生服务中心", pharmacies: [
      { id: "p21", name: "门诊药房", locations: ["货架一区", "货架二区"] },
      { id: "p22", name: "住院药房", locations: ["病房药柜"] }
    ] },
    { id: "o3", name: "区域中心药房", pharmacies: [
      { id: "p31", name: "中心药房", locations: ["A 区库房", "B 区库房", "冷链柜"] }
    ] }
  ];

  /* 上级审核机构：村室 → 成员机构 → 中心药房 */
  var UPPER = { o1: "o2", o2: "o3", o3: "o3" };

  var REASONS = ["包装不合格", "外观质量不合格", "内在质量不合格"];

  /* ---------- 药品库 ---------- */
  var DRUGS = [
    { name: "阿莫西林胶囊", py: "AMXLJN", code: "1210500301", spec: "0.25g×24粒", packSpec: "24粒/盒", vendor: "华北制药股份有限公司", approval: "国药准字H13023917" },
    { name: "阿莫西林胶囊", py: "AMXLJN", code: "1210500302", spec: "0.5g×12粒", packSpec: "12粒/盒", vendor: "石药集团中诺药业（石家庄）有限公司", approval: "国药准字H20033293" },
    { name: "头孢克肟分散片", py: "TBKFFSP", code: "1210500501", spec: "0.1g×6片", packSpec: "6片/盒", vendor: "上海信谊药厂有限公司", approval: "国药准字H31020315" },
    { name: "布洛芬缓释胶囊", py: "BLFHSJN", code: "1210500601", spec: "0.3g×20粒", packSpec: "20粒/盒", vendor: "中美天津史克制药有限公司", approval: "国药准字H10900089" },
    { name: "奥美拉唑肠溶胶囊", py: "AMLZCRJN", code: "1210500901", spec: "20mg×14粒", packSpec: "14粒/盒", vendor: "常州四药制药有限公司", approval: "国药准字H10950185" },
    { name: "复方甘草片", py: "FFGCP", code: "1210501101", spec: "100片", packSpec: "100片/瓶", vendor: "广州白云山制药股份有限公司", approval: "国药准字Z44021234" },
    { name: "硝苯地平控释片", py: "XBDPKSP", code: "1210501201", spec: "30mg×7片", packSpec: "7片/盒", vendor: "拜耳医药保健有限公司", approval: "国药准字J20180015" },
    { name: "盐酸二甲双胍片", py: "YSEJGP", code: "1210501301", spec: "0.5g×20片", packSpec: "20片/盒", vendor: "中美上海施贵宝制药有限公司", approval: "国药准字H31020246" },
    { name: "左氧氟沙星片", py: "ZYFSXP", code: "1210501401", spec: "0.5g×4片", packSpec: "4片/盒", vendor: "第一三共制药（北京）有限公司", approval: "国药准字H20000567" },
    { name: "阿托伐他汀钙片", py: "ATFTGP", code: "1210501601", spec: "20mg×7片", packSpec: "7片/盒", vendor: "辉瑞制药有限公司", approval: "国药准字H20051408" }
  ];

  /* ---------- 批次库（按药品编码，含当前库存量） ---------- */
  var BATCHES = {
    "1210500301": [
      { batch: "20260101A", expiry: "2028-01-01", purchase: 8.20, retail: 12.50, stock: 120 },
      { batch: "20260315B", expiry: "2028-03-14", purchase: 8.35, retail: 12.80, stock: 80 }
    ],
    "1210500302": [
      { batch: "20260115A", expiry: "2028-01-14", purchase: 12.50, retail: 18.80, stock: 60 }
    ],
    "1210500501": [
      { batch: "20260201A", expiry: "2028-01-31", purchase: 16.80, retail: 24.60, stock: 200 }
    ],
    "1210500601": [
      { batch: "20251201A", expiry: "2027-11-30", purchase: 15.00, retail: 22.00, stock: 0 }
    ],
    "1210500901": [
      { batch: "20260301A", expiry: "2028-02-28", purchase: 24.00, retail: 35.80, stock: 150 }
    ],
    "1210501101": [
      { batch: "20260215A", expiry: "2027-08-14", purchase: 5.20, retail: 8.50, stock: 90 }
    ],
    "1210501201": [
      { batch: "20260310A", expiry: "2028-03-09", purchase: 20.50, retail: 29.80, stock: 45 }
    ],
    "1210501301": [
      { batch: "20260120A", expiry: "2028-01-19", purchase: 10.20, retail: 15.60, stock: 130 }
    ],
    "1210501401": [
      { batch: "20260220A", expiry: "2028-02-19", purchase: 22.00, retail: 32.00, stock: 75 }
    ],
    "1210501601": [
      { batch: "20260208A", expiry: "2028-02-07", purchase: 26.50, retail: 38.90, stock: 100 }
    ]
  };

  /* ---------- 原入库单（关联带入数据源） ----------
   * inType：调拨入库 / 采购入库
   * 调拨入库：fromOrg/fromPharmacy/fromLocation = 出库机构/药房/库位
   * 采购入库：fromOrg = 供应商名称，fromPharmacy/fromLocation 为空（页面显示 —） */
  var INBOUNDS = [
    { code: "RK20261028001", time: "2026-10-28 09:12:30", inType: "采购入库",
      fromOrg: "山东医药集团", fromPharmacy: "", fromLocation: "",
      items: [ { code: "1210500301", batch: "20260101A", qty: 100 }, { code: "1210500501", batch: "20260201A", qty: 60 } ] },
    { code: "RK20261029002", time: "2026-10-29 14:05:11", inType: "调拨入库",
      fromOrg: "城东社区卫生服务中心", fromPharmacy: "门诊药房", fromLocation: "货架一区",
      items: [ { code: "1210500501", batch: "20260201A", qty: 180 } ] },
    { code: "RK20261030003", time: "2026-10-30 10:48:02", inType: "调拨入库",
      fromOrg: "区域中心药房", fromPharmacy: "中心药房", fromLocation: "A 区库房",
      items: [ { code: "1210500901", batch: "20260301A", qty: 50 }, { code: "1210501301", batch: "20260120A", qty: 40 } ] },
    { code: "RK20261031005", time: "2026-10-31 15:30:20", inType: "采购入库",
      fromOrg: "辉瑞制药有限公司", fromPharmacy: "", fromLocation: "",
      items: [ { code: "1210501601", batch: "20260208A", qty: 200 }, { code: "1210501201", batch: "20260310A", qty: 120 } ] }
  ];

  /* ---------- 工具 ---------- */
  function qs(k) { var m = location.search.match(new RegExp("[?&]" + k + "=([^&]*)")); return m ? decodeURIComponent(m[1]) : ""; }
  function esc(v) {
    return (v === null || v === undefined || v === "") ? "—" : String(v)
      .replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; });
  }
  function raw(v) { return (v === null || v === undefined) ? "" : String(v); }
  function fmtNow() {
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }
  function money(n) { return "¥" + Number(n || 0).toFixed(2); }
  function num2(n) { return Number(n || 0).toFixed(2); }

  /* ---------- 当前用户（默认与入库模块登录态保持一致） ---------- */
  function currentUser() {
    try {
      /* 优先跟随全站统一身份，按姓名映射到本模块用户 */
      var sel = JSON.parse(sessionStorage.getItem("SEL_USER") || "null");
      if (sel && sel.name) {
        var matched = USERS.filter(function (x) { return x.name === sel.name; })[0];
        if (matched) return matched;
      }
      var u = JSON.parse(sessionStorage.getItem("SR_USER") || "null");
      if (u && u.id) return u;
      u = JSON.parse(sessionStorage.getItem("SI_USER") || "null");
      if (u && u.id) return u;
    } catch (e) {}
    return USERS[0];
  }
  function setUser(id) {
    var u = USERS.filter(function (x) { return x.id === id; })[0];
    if (u) { sessionStorage.setItem("SR_USER", JSON.stringify(u)); sessionStorage.setItem("SI_USER", JSON.stringify(u)); }
  }
  function orgOf(id) { return ORGS.filter(function (o) { return o.id === id; })[0] || null; }
  function pharmacyOf(orgId, pid) {
    var o = orgOf(orgId); if (!o) return null;
    return o.pharmacies.filter(function (p) { return p.id === pid; })[0] || null;
  }
  function orgName(id) { var o = orgOf(id); return o ? o.name : "—"; }
  function upperOrgOf(orgId) { return UPPER[orgId] || "o3"; }

  /* ---------- 批次追溯码：TRC + 批次号 + 4 位序号（确定性生成） ---------- */
  function traceCodes(batch, n) {
    var arr = [];
    for (var i = 1; i <= n; i++) arr.push("TRC" + batch + ("000" + i).slice(-4));
    return arr;
  }

  /* ---------- 明细行构造 ---------- */
  function drugOf(code) { return DRUGS.filter(function (d) { return d.code === code; })[0] || null; }
  function batchOf(code, batchNo) {
    return (BATCHES[code] || []).filter(function (b) { return b.batch === batchNo; })[0] || null;
  }
  function blankItem() {
    return { name: "", code: "", spec: "", packSpec: "", vendor: "", approval: "",
      batch: "", expiry: "", purchase: "", retail: "", stock: 0, qty: "",
      traces: [], inQty: "", unqQty: 0, unqReason: "", badCodes: [] };
  }
  function itemOf(code, batchNo, qty) {
    var d = drugOf(code), b = batchOf(code, batchNo);
    if (!d || !b) return null;
    var it = blankItem();
    it.name = d.name; it.code = d.code; it.spec = d.spec; it.packSpec = d.packSpec;
    it.vendor = d.vendor; it.approval = d.approval;
    it.batch = b.batch; it.expiry = b.expiry; it.purchase = b.purchase; it.retail = b.retail; it.stock = b.stock;
    it.qty = (qty === undefined) ? "" : qty;
    return it;
  }

  /* ---------- 种子数据（覆盖全状态 + 撤回历史 + 跳级/两级两种路径） ---------- */
  function seed() {
    function mk(o) {
      var b = blankItem();
      for (var k in o) b[k] = o[k];
      return b;
    }
    function itm(code, batchNo, qty, extra) {
      var it = itemOf(code, batchNo, qty);
      if (extra) for (var k in extra) it[k] = extra[k];
      return mk(it);
    }
    return [
      /* r1 草稿 */
      { id: "r1", code: "TK20261103001", fromOrgId: "o1", fromPharmacyId: "p11", fromLocation: "A 区药柜",
        toOrgId: "o3", toPharmacyId: "p31", toLocation: "A 区库房",
        outCode: "", outTime: "", inCode: "", inTime: "",
        creatorId: "u1", creatorName: "王芳", submitTime: "",
        auditStatus: "draft", receiveStatus: "",
        items: [ itm("1210500301", "20260101A", 20) ],
        records: [] },
      /* r2 待上级审核（两级路径：上级 o2 ≠ 接收 o3） */
      { id: "r2", code: "TK20261102002", fromOrgId: "o1", fromPharmacyId: "p11", fromLocation: "A 区药柜",
        toOrgId: "o3", toPharmacyId: "p31", toLocation: "A 区库房",
        outCode: "", outTime: "", inCode: "", inTime: "",
        creatorId: "u1", creatorName: "王芳", submitTime: "2026-11-02 16:40:12",
        auditStatus: "upper", receiveStatus: "",
        items: [ itm("1210500301", "20260101A", 20), itm("1210500501", "20260201A", 5) ],
        records: [ { node: "提交", person: "王芳", org: "幸福村卫生室", time: "2026-11-02 16:40:12", result: "已提交", opinion: "" } ] },
      /* r3 待接收机构审核（上级已通过） */
      { id: "r3", code: "TK20261101003", fromOrgId: "o1", fromPharmacyId: "p11", fromLocation: "B 区药柜",
        toOrgId: "o3", toPharmacyId: "p31", toLocation: "B 区库房",
        outCode: "", outTime: "", inCode: "", inTime: "",
        creatorId: "u1", creatorName: "王芳", submitTime: "2026-11-01 10:20:45",
        auditStatus: "receiver", receiveStatus: "",
        items: [ itm("1210500901", "20260301A", 30) ],
        records: [
          { node: "提交", person: "王芳", org: "幸福村卫生室", time: "2026-11-01 10:20:45", result: "已提交", opinion: "" },
          { node: "审核", person: "李强", org: "城东社区卫生服务中心", time: "2026-11-01 15:02:11", result: "通过", opinion: "数量与库存一致，同意退库" }
        ] },
      /* r4 待出库（跳级路径：o1 退 o2，上级==接收，一次审核通过） */
      { id: "r4", code: "TK20261030004", fromOrgId: "o1", fromPharmacyId: "p11", fromLocation: "A 区药柜",
        toOrgId: "o2", toPharmacyId: "p21", toLocation: "货架一区",
        outCode: "", outTime: "", inCode: "", inTime: "",
        creatorId: "u1", creatorName: "王芳", submitTime: "2026-10-30 14:05:08",
        auditStatus: "approved", receiveStatus: "out",
        items: [ itm("1210501201", "20260310A", 10), itm("1210501301", "20260120A", 15) ],
        records: [
          { node: "提交", person: "王芳", org: "幸福村卫生室", time: "2026-10-30 14:05:08", result: "已提交", opinion: "" },
          { node: "审核", person: "李强", org: "城东社区卫生服务中心", time: "2026-10-30 16:22:40", result: "通过", opinion: "" }
        ] },
      /* r5 待签收（已出库，追溯码已录） */
      { id: "r5", code: "TK20261029005", fromOrgId: "o2", fromPharmacyId: "p21", fromLocation: "货架二区",
        toOrgId: "o3", toPharmacyId: "p31", toLocation: "A 区库房",
        outCode: "CK20261030001", outTime: "2026-10-30 10:15:22", inCode: "", inTime: "",
        creatorId: "u2", creatorName: "李强", submitTime: "2026-10-29 09:30:18",
        auditStatus: "approved", receiveStatus: "sign",
        items: [
          itm("1210501401", "20260220A", 8, { traces: traceCodes("20260220A", 8) }),
          itm("1210501601", "20260208A", 12, { traces: traceCodes("20260208A", 12) })
        ],
        records: [
          { node: "提交", person: "李强", org: "城东社区卫生服务中心", time: "2026-10-29 09:30:18", result: "已提交", opinion: "" },
          { node: "审核", person: "赵敏", org: "区域中心药房", time: "2026-10-29 17:08:44", result: "通过", opinion: "同意退库" },
          { node: "出库", person: "李强", org: "城东社区卫生服务中心", time: "2026-10-30 10:15:22", result: "已出库", opinion: "出库单号：CK20261030001" }
        ] },
      /* r6 已完成（含不合格品记录） */
      { id: "r6", code: "TK20261026006", fromOrgId: "o2", fromPharmacyId: "p22", fromLocation: "病房药柜",
        toOrgId: "o3", toPharmacyId: "p31", toLocation: "A 区库房",
        outCode: "CK20261027001", outTime: "2026-10-27 11:02:36", inCode: "RK20261028001", inTime: "2026-10-28 14:40:05",
        creatorId: "u2", creatorName: "李强", submitTime: "2026-10-26 09:12:00",
        auditStatus: "approved", receiveStatus: "done",
        items: [
          itm("1210501101", "20260215A", 10, { traces: traceCodes("20260215A", 10), inQty: 9, unqQty: 1, unqReason: "包装不合格", badCodes: traceCodes("20260215A", 1) })
        ],
        records: [
          { node: "提交", person: "李强", org: "城东社区卫生服务中心", time: "2026-10-26 09:12:00", result: "已提交", opinion: "" },
          { node: "审核", person: "赵敏", org: "区域中心药房", time: "2026-10-26 15:20:31", result: "通过", opinion: "" },
          { node: "出库", person: "李强", org: "城东社区卫生服务中心", time: "2026-10-27 11:02:36", result: "已出库", opinion: "出库单号：CK20261027001" },
          { node: "入库", person: "陈静", org: "区域中心药房", time: "2026-10-28 14:40:05", result: "已入库", opinion: "入库单号：RK20261028001；不合格 1 盒（包装不合格），线下处理" }
        ] },
      /* r7 已拒绝 */
      { id: "r7", code: "TK20261025007", fromOrgId: "o1", fromPharmacyId: "p11", fromLocation: "B 区药柜",
        toOrgId: "o2", toPharmacyId: "p21", toLocation: "货架二区",
        outCode: "", outTime: "", inCode: "", inTime: "",
        creatorId: "u1", creatorName: "王芳", submitTime: "2026-10-25 11:33:20",
        auditStatus: "rejected", receiveStatus: "",
        items: [ itm("1210500301", "20260315B", 10) ],
        records: [
          { node: "提交", person: "王芳", org: "幸福村卫生室", time: "2026-10-25 11:33:20", result: "已提交", opinion: "" },
          { node: "审核", person: "李强", org: "城东社区卫生服务中心", time: "2026-10-27 10:22:40", result: "拒绝", opinion: "批号与库存台账不符，请核对后重新提交" }
        ] },
      /* r8 待上级审核（含撤回历史：提交 → 撤回 → 再提交） */
      { id: "r8", code: "TK20261103008", fromOrgId: "o1", fromPharmacyId: "p11", fromLocation: "A 区药柜",
        toOrgId: "o3", toPharmacyId: "p31", toLocation: "冷链柜",
        outCode: "", outTime: "", inCode: "", inTime: "",
        creatorId: "u1", creatorName: "王芳", submitTime: "2026-11-03 08:50:00",
        auditStatus: "upper", receiveStatus: "",
        items: [ itm("1210501301", "20260120A", 6) ],
        records: [
          { node: "提交", person: "王芳", org: "幸福村卫生室", time: "2026-11-02 09:00:00", result: "已提交", opinion: "" },
          { node: "撤回", person: "王芳", org: "幸福村卫生室", time: "2026-11-02 09:30:00", result: "已撤回", opinion: "退库数量填错，撤回修改" },
          { node: "提交", person: "王芳", org: "幸福村卫生室", time: "2026-11-03 08:50:00", result: "已提交", opinion: "" }
        ] }
    ];
  }

  /* ---------- 存取 ---------- */
  function load() {
    try {
      var d = JSON.parse(sessionStorage.getItem("SR_DATA") || "null");
      if (d && d.length) return d;
    } catch (e) {}
    var s = seed();
    sessionStorage.setItem("SR_DATA", JSON.stringify(s));
    return s;
  }
  function save(list) { sessionStorage.setItem("SR_DATA", JSON.stringify(list)); }
  function billOf(id) { return load().filter(function (b) { return b.id === id; })[0] || null; }

  /* 单号：前缀 + yyyymmdd + 3 位流水（扫所有单据的指定字段） */
  function newCode(list, prefix, field) {
    field = field || "code";
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
    var head = prefix + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate());
    var max = 0;
    list.forEach(function (b) {
      var c = b[field] || "";
      if (c.indexOf(head) === 0) {
        var n = parseInt(c.slice(head.length), 10);
        if (!isNaN(n) && n > max) max = n;
      }
    });
    return head + ("00" + (max + 1)).slice(-3);
  }

  /* ---------- 文案映射 ---------- */
  var AUDIT_STATUS = { draft: "草稿", upper: "待上级审核", receiver: "待接收机构审核", approved: "审核通过", rejected: "已拒绝" };
  var RECV = { "": "—", out: "待出库", sign: "待签收", done: "已完成" };

  /* ---------- 权限与操作矩阵（审核状态 × 接收状态 × 角色） ---------- */
  function canAudit(bill, user) {
    if (user.id === bill.creatorId) return false;
    if (bill.auditStatus === "upper") return user.orgId === upperOrgOf(bill.fromOrgId);
    if (bill.auditStatus === "receiver") return user.orgId === bill.toOrgId;
    return false;
  }
  /* 返回 [{key,label,danger}] */
  function opsFor(bill, user) {
    var mine = bill.creatorId === user.id;
    var ops = [{ key: "view", label: "查看" }];
    var st = bill.auditStatus;
    if (st === "draft" || st === "rejected") {
      if (mine) ops.push({ key: "edit", label: "编辑" }, { key: "submit", label: "提交" }, { key: "del", label: "删除", danger: true });
    } else if (st === "upper" || st === "receiver") {
      if (mine) ops.push({ key: "withdraw", label: "撤回" });
      if (canAudit(bill, user)) ops.push({ key: "audit", label: "审核" });
    } else if (st === "approved") {
      if (bill.receiveStatus === "out" && mine) ops.push({ key: "out", label: "出库" });
      if (bill.receiveStatus === "sign" && user.orgId === bill.toOrgId) ops.push({ key: "in", label: "入库" });
    }
    return ops;
  }

  /* ---------- 明细计算 ---------- */
  function purchaseAmt(it) { return Number(it.qty || 0) * Number(it.purchase || 0); }
  function retailAmt(it) { return Number(it.qty || 0) * Number(it.retail || 0); }
  function sums(bill) {
    var p = 0, r = 0, q = 0;
    (bill.items || []).forEach(function (it) { p += purchaseAmt(it); r += retailAmt(it); q += Number(it.qty || 0); });
    return { purchase: p, retail: r, qty: q };
  }

  window.SR = {
    USERS: USERS, ORGS: ORGS, REASONS: REASONS, DRUGS: DRUGS, BATCHES: BATCHES, INBOUNDS: INBOUNDS,
    AUDIT_STATUS: AUDIT_STATUS, RECV: RECV,
    qs: qs, esc: esc, raw: raw, fmtNow: fmtNow, money: money, num2: num2,
    currentUser: currentUser, setUser: setUser, orgOf: orgOf, pharmacyOf: pharmacyOf, orgName: orgName, upperOrgOf: upperOrgOf,
    traceCodes: traceCodes, drugOf: drugOf, batchOf: batchOf, blankItem: blankItem, itemOf: itemOf,
    load: load, save: save, billOf: billOf, newCode: newCode,
    canAudit: canAudit, opsFor: opsFor,
    purchaseAmt: purchaseAmt, retailAmt: retailAmt, sums: sums
  };
})();
