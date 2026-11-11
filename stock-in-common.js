/* =========================================================
 * 药品入库 · 共享逻辑（SI 命名空间）
 * 依赖：无（独立 IIFE，挂 window.SI）
 * 数据：sessionStorage "SI_DATA" / "SI_USER"，首次从种子生成
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

  var SUPPLIERS = ["山东医药集团", "济南医药供应站", "上海医药分销", "广州医药集团", "天津医药集团", "辉瑞制药", "扬子江药业", "常州药业股份"];

  /* ---------- 入库方式 ----------
   * 新增仅开放：购货入库 / 捐赠入库；
   * 列表筛选用全量 6 类 —— 调拨入库 / 报增入库 / 退库入库 / 院内调拨入库
   * 由上游业务单据（药品调拨、药品增损、药品退库、院内调拨出库）自动生成，不提供手工新增入口 */
  var CREATE_METHODS = ["购货入库", "捐赠入库"];
  var FILTER_METHODS = ["调拨入库", "报增入库", "退库入库", "院内调拨入库", "购货入库", "捐赠入库"];
  var METHODS = FILTER_METHODS; /* 兼容旧引用（列表筛选） */
  var REASONS = ["包装不合格", "外观质量不合格", "内在质量不合格"];

  /* ---------- 药品库（选药弹窗数据源） ---------- */
  var DRUGS = [
    { name: "阿莫西林胶囊", py: "AMXLJN", code: "1210500301", spec: "0.25g×24粒", packSpec: "24粒/盒", vendor: "华北制药股份有限公司", approval: "国药准字H13023917", factor: 24, packUnit: "盒", insCode: "XJ01CA0401010101032", insName: "阿莫西林" },
    { name: "阿莫西林胶囊", py: "AMXLJN", code: "1210500302", spec: "0.5g×12粒", packSpec: "12粒/盒", vendor: "石药集团中诺药业（石家庄）有限公司", approval: "国药准字H20033293", factor: 12, packUnit: "盒", insCode: "XJ01CA0401010102032", insName: "阿莫西林" },
    { name: "头孢克肟分散片", py: "TBKFFSP", code: "1210500501", spec: "0.1g×6片", packSpec: "6片/盒", vendor: "上海信谊药厂有限公司", approval: "国药准字H31020315", factor: 6, packUnit: "盒", insCode: "XJ01DD0401010101032", insName: "头孢克肟" },
    { name: "布洛芬缓释胶囊", py: "BLFHSJN", code: "1210500601", spec: "0.3g×20粒", packSpec: "20粒/盒", vendor: "中美天津史克制药有限公司", approval: "国药准字H10900089", factor: 20, packUnit: "盒", insCode: "XJ02CA0301010101032", insName: "布洛芬" },
    { name: "奥美拉唑肠溶胶囊", py: "AMLZCRJN", code: "1210500901", spec: "20mg×14粒", packSpec: "14粒/盒", vendor: "常州四药制药有限公司", approval: "国药准字H10950185", factor: 14, packUnit: "盒", insCode: "XA02BC0101010101032", insName: "奥美拉唑" },
    { name: "复方甘草片", py: "FFGCP", code: "1210501101", spec: "100片", packSpec: "100片/瓶", vendor: "广州白云山制药股份有限公司", approval: "国药准字Z44021234", factor: 100, packUnit: "瓶", insCode: "ZC09AA0101010101032", insName: "复方甘草" },
    { name: "硝苯地平控释片", py: "XBDPKSP", code: "1210501201", spec: "30mg×7片", packSpec: "7片/盒", vendor: "拜耳医药保健有限公司", approval: "国药准字J20180015", factor: 7, packUnit: "盒", insCode: "XC08CA0101010101032", insName: "硝苯地平" },
    { name: "盐酸二甲双胍片", py: "YSEJGP", code: "1210501301", spec: "0.5g×20片", packSpec: "20片/盒", vendor: "中美上海施贵宝制药有限公司", approval: "国药准字H31020246", factor: 20, packUnit: "盒", insCode: "XA10BA0101010101032", insName: "二甲双胍" },
    { name: "左氧氟沙星片", py: "ZYFSXP", code: "1210501401", spec: "0.5g×4片", packSpec: "4片/盒", vendor: "第一三共制药（北京）有限公司", approval: "国药准字H20000567", factor: 4, packUnit: "盒", insCode: "XJ01MA0101010101032", insName: "左氧氟沙星" },
    { name: "阿托伐他汀钙片", py: "ATFTGP", code: "1210501601", spec: "20mg×7片", packSpec: "7片/盒", vendor: "辉瑞制药有限公司", approval: "国药准字H20051408", factor: 7, packUnit: "盒", insCode: "XC10AA0101010101032", insName: "阿托伐他汀" }
  ];

  /* ---------- 批次库（按药品编码） ---------- */
  var BATCHES = {
    "1210500301": [
      { batch: "20260101A", expiry: "2028-01-01", purchase: 8.20, retail: 12.50 },
      { batch: "20260315B", expiry: "2028-03-14", purchase: 8.35, retail: 12.80 }
    ],
    "1210500302": [
      { batch: "20260115A", expiry: "2028-01-14", purchase: 12.50, retail: 18.80 }
    ],
    "1210500501": [
      { batch: "20260201A", expiry: "2028-01-31", purchase: 16.80, retail: 24.60 }
    ],
    "1210500601": [
      { batch: "20251201A", expiry: "2027-11-30", purchase: 15.00, retail: 22.00 }
    ],
    "1210500901": [
      { batch: "20260301A", expiry: "2028-02-28", purchase: 24.00, retail: 35.80 }
    ],
    "1210501101": [
      { batch: "20260215A", expiry: "2027-08-14", purchase: 5.20, retail: 8.50 }
    ],
    "1210501201": [
      { batch: "20260310A", expiry: "2028-03-09", purchase: 20.50, retail: 29.80 }
    ],
    "1210501301": [
      { batch: "20260120A", expiry: "2028-01-19", purchase: 10.20, retail: 15.60 }
    ],
    "1210501401": [
      { batch: "20260220A", expiry: "2028-02-19", purchase: 22.00, retail: 32.00 }
    ],
    "1210501601": [
      { batch: "20260208A", expiry: "2028-02-07", purchase: 26.50, retail: 38.90 }
    ]
  };

  /* ---------- 批次扩展（入库单提交后新增的批次，跨页面持久于 sessionStorage） ---------- */
  var BATCH_EXTRA_KEY = "SI_BATCH_EXTRA";
  (function mergeBatchExtra() {
    try {
      var m = JSON.parse(sessionStorage.getItem(BATCH_EXTRA_KEY) || "{}");
      Object.keys(m).forEach(function (code) {
        (m[code] || []).forEach(function (b) {
          var arr = BATCHES[code] = BATCHES[code] || [];
          if (!arr.some(function (x) { return x.batch === b.batch; })) arr.push(b);
        });
      });
    } catch (e) {}
  })();
  function addBatchExtra(code, b) {
    if (!code || !b || !b.batch) return;
    var arr = BATCHES[code] = BATCHES[code] || [];
    if (arr.some(function (x) { return x.batch === b.batch; })) return;
    arr.push(b);
    try {
      var m = JSON.parse(sessionStorage.getItem(BATCH_EXTRA_KEY) || "{}");
      (m[code] = m[code] || []).push(b);
      sessionStorage.setItem(BATCH_EXTRA_KEY, JSON.stringify(m));
    } catch (e) {}
  }

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

  /* ---------- 当前用户 ---------- */
  function currentUser() {
    try {
      /* 优先跟随全站统一身份，按姓名映射到本模块用户 */
      var sel = JSON.parse(sessionStorage.getItem("SEL_USER") || "null");
      if (sel && sel.name) {
        var matched = USERS.filter(function (x) { return x.name === sel.name; })[0];
        if (matched) return matched;
      }
      var u = JSON.parse(sessionStorage.getItem("SI_USER") || "null");
      if (u && u.id) return u;
    } catch (e) {}
    return USERS[0]; /* 默认王芳（村室） */
  }
  function setUser(id) {
    var u = USERS.filter(function (x) { return x.id === id; })[0];
    if (u) sessionStorage.setItem("SI_USER", JSON.stringify(u));
  }
  function orgOf(id) { return ORGS.filter(function (o) { return o.id === id; })[0] || null; }

  /* ---------- 入库单种子数据 ---------- */
  function item(drugCode, batchIdx, qty, unq, reason, invoiceNo, traces) {
    var d = DRUGS.filter(function (x) { return x.code === drugCode; })[0];
    var b = BATCHES[drugCode][batchIdx];
    return {
      name: d.name, code: d.code, spec: d.spec, packSpec: d.packSpec, vendor: d.vendor,
      approval: d.approval, factor: d.factor, packUnit: d.packUnit,
      insCode: d.insCode, insName: d.insName,
      batch: b.batch, expiry: b.expiry, purchase: b.purchase, retail: b.retail,
      qty: qty, unq: unq || 0, reason: reason || "",
      invoiceNo: invoiceNo || "", traces: traces || []
    };
  }
  function trace(n, d) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push({ code: "8100" + String(Math.floor(Math.random() * 1e15)).padStart(15, "0"), name: d.name, spec: d.spec, approval: d.approval });
    return arr;
  }

  function seed() {
    var d1 = DRUGS[0], d3 = DRUGS[2], d5 = DRUGS[4], d7 = DRUGS[6];
    return [
      { id: "b1", code: "RK20261028001", orgId: "o1", pharmacyId: "p11", location: "A 区药柜", method: "购货入库", supplier: "山东医药集团", accept: "外包装完好，数量核对无误", invoiceMode: "sum", invoiceNo: "INV20261028001", invoiceAmount: "2580.00", invoiceDate: "2026-10-28", creatorId: "u1", creatorName: "王芳", submitTime: "2026-10-28 09:12:30", status: "draft", auditorRole: "member", uploadStatus: "none",
        items: [ item("1210500301", 0, 100, 0, "", "", trace(2, d1)), item("1210500501", 0, 60, 0) ],
        records: [] },
      { id: "b2", code: "RK20261029002", orgId: "o1", pharmacyId: "p11", location: "B 区药柜", method: "购货入库", supplier: "济南医药供应站", accept: "", invoiceMode: "detail", invoiceNo: "", invoiceAmount: "4428.00", invoiceDate: "2026-10-29", creatorId: "u1", creatorName: "王芳", submitTime: "2026-10-29 14:05:11", status: "pending", auditorRole: "member", uploadStatus: "none",
        items: [ item("1210500501", 0, 180, 4, "包装不合格", "INV20261029011", trace(3, d3)) ],
        records: [ { node: "提交", person: "王芳", org: "幸福村卫生室", time: "2026-10-29 14:05:11", result: "已提交", opinion: "" } ] },
      { id: "b3", code: "RK20261025003", orgId: "o1", pharmacyId: "p11", location: "A 区药柜", method: "捐赠入库", supplier: "", accept: "捐赠物资清单已核对", invoiceMode: "sum", invoiceNo: "", invoiceAmount: "", invoiceDate: "", creatorId: "u1", creatorName: "王芳", submitTime: "2026-10-27 10:22:40", status: "rejected", auditorRole: "member", uploadStatus: "none",
        items: [ item("1210500601", 0, 50, 0) ],
        records: [
          { node: "提交", person: "王芳", org: "幸福村卫生室", time: "2026-10-25 16:40:02", result: "已提交", opinion: "" },
          { node: "审核", person: "李强", org: "城东社区卫生服务中心", time: "2026-10-27 10:22:40", result: "拒绝", opinion: "批号与随货同行单不一致，请核对后重新提交" }
        ] },
      { id: "b4", code: "RK20261030004", orgId: "o2", pharmacyId: "p21", location: "货架一区", method: "调拨入库", supplier: "", accept: "冷链运输，温度记录完整", invoiceMode: "sum", invoiceNo: "", invoiceAmount: "", invoiceDate: "", creatorId: "u2", creatorName: "李强", submitTime: "2026-10-30 11:18:55", status: "pending", auditorRole: "center", uploadStatus: "none",
        items: [ item("1210500901", 0, 120, 0, "", "", trace(2, d5)), item("1210501201", 0, 90, 0) ],
        records: [ { node: "提交", person: "李强", org: "城东社区卫生服务中心", time: "2026-10-30 11:18:55", result: "已提交", opinion: "" } ] },
      { id: "b5", code: "RK20261031005", orgId: "o3", pharmacyId: "p31", location: "A 区库房", method: "购货入库", supplier: "辉瑞制药", accept: "抽检合格", invoiceMode: "detail", invoiceNo: "", invoiceAmount: "13615.00", invoiceDate: "2026-10-31", creatorId: "u3", creatorName: "陈静", submitTime: "2026-10-31 15:30:20", status: "approved", auditorRole: "center", uploadStatus: "wait",
        items: [ item("1210501601", 0, 350, 0, "", "INV20261031021", trace(2, DRUGS[9])), item("1210501201", 0, 210, 0, "", "INV20261031022") ],
        records: [
          { node: "提交", person: "陈静", org: "区域中心药房", time: "2026-10-31 09:02:14", result: "已提交", opinion: "" },
          { node: "审核", person: "赵敏", org: "区域中心药房", time: "2026-10-31 15:30:20", result: "通过", opinion: "单据齐全，同意入库" }
        ] },
      { id: "b6", code: "RK20261026006", orgId: "o2", pharmacyId: "p22", location: "病房药柜", method: "退库入库", supplier: "", accept: "退回药品外观完好", invoiceMode: "sum", invoiceNo: "", invoiceAmount: "", invoiceDate: "", creatorId: "u2", creatorName: "李强", submitTime: "2026-10-26 10:02:33", status: "approved", auditorRole: "center", uploadStatus: "success",
        items: [ item("1210501301", 0, 60, 0) ],
        records: [
          { node: "提交", person: "李强", org: "城东社区卫生服务中心", time: "2026-10-26 09:12:00", result: "已提交", opinion: "" },
          { node: "审核", person: "赵敏", org: "区域中心药房", time: "2026-10-26 10:02:33", result: "通过", opinion: "" }
        ] },
      { id: "b7", code: "RK20261024007", orgId: "o3", pharmacyId: "p31", location: "冷链柜", method: "购货入库", supplier: "上海医药分销", accept: "冷链药品验收合格", invoiceMode: "sum", invoiceNo: "INV20261024007", invoiceAmount: "10024.00", invoiceDate: "2026-10-24", creatorId: "u3", creatorName: "陈静", submitTime: "2026-10-24 17:20:10", status: "approved", auditorRole: "center", uploadStatus: "fail",
        items: [ item("1210500901", 0, 280, 0, "", "", trace(2, d5)) ],
        records: [
          { node: "提交", person: "陈静", org: "区域中心药房", time: "2026-10-24 16:08:45", result: "已提交", opinion: "" },
          { node: "审核", person: "赵敏", org: "区域中心药房", time: "2026-10-24 17:20:10", result: "通过", opinion: "" }
        ] }
    ];
  }

  /* ---------- 存取 ---------- */
  function load() {
    try {
      var d = JSON.parse(sessionStorage.getItem("SI_DATA") || "null");
      if (d && d.length) return d;
    } catch (e) {}
    var s = seed();
    sessionStorage.setItem("SI_DATA", JSON.stringify(s));
    return s;
  }
  function save(list) { sessionStorage.setItem("SI_DATA", JSON.stringify(list)); }
  function billOf(id) { return load().filter(function (b) { return b.id === id; })[0] || null; }

  function newCode(list) {
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
    var prefix = "RK" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate());
    var max = 0;
    list.forEach(function (b) {
      if (b.code && b.code.indexOf(prefix) === 0) {
        var n = parseInt(b.code.slice(prefix.length), 10);
        if (!isNaN(n) && n > max) max = n;
      }
    });
    return prefix + ("00" + (max + 1)).slice(-3);
  }

  /* ---------- 文案映射 ---------- */
  var STATUS = { draft: "草稿", pending: "待审核", approved: "审核通过", rejected: "已驳回" };
  var UPLOAD = { none: "—", wait: "未上传", success: "上传成功", fail: "上传失败" };

  /* ---------- 权限与操作矩阵 ---------- */
  function canAudit(bill, user) {
    return bill.status === "pending" && user.role === bill.auditorRole && user.id !== bill.creatorId;
  }
  /* 返回 [{key,label,danger}] */
  function opsFor(bill, user) {
    var mine = bill.creatorId === user.id;
    var ops = [{ key: "view", label: "查看" }];
    if (bill.status === "draft" || bill.status === "rejected") {
      if (mine) ops.push({ key: "edit", label: "编辑" }, { key: "submit", label: "提交" }, { key: "del", label: "删除", danger: true });
    } else if (bill.status === "pending") {
      if (canAudit(bill, user)) ops.push({ key: "audit", label: "审批" });
      else if (mine) ops.push({ key: "withdraw", label: "撤回" });
    } else if (bill.status === "approved") {
      if (bill.uploadStatus !== "success") ops.push({ key: "upload", label: "上传" });
    }
    return ops;
  }

  /* ---------- 明细计算 ---------- */
  /* ---------- 院内调拨配对 ----------
   * 出库单（院内调拨出库）审核通过后，接收库位所在机构自动生成一张「院内调拨入库」入库单，
   * 来源单号 = 出库单号；同一出库单只生成一次（幂等）。由 outbound-detail 审核通过时调用。 */
  function siItemFromOut(it) {
    var d = DRUGS.filter(function (x) { return x.code === it.code; })[0] || {};
    return {
      name: it.name || d.name || "", code: it.code, spec: it.spec || d.spec || "",
      packSpec: it.packSpec || d.packSpec || "", vendor: it.vendor || d.vendor || "",
      approval: d.approval || "", factor: d.factor || "", packUnit: d.packUnit || "",
      insCode: d.insCode || "", insName: d.insName || "",
      batch: it.batch || "", expiry: it.expiry || "",
      purchase: it.purchase || 0, retail: it.retail || 0,
      qty: Number(it.qty || 0), unq: 0, reason: "", invoiceNo: "",
      traces: (it.traces || []).map(function (t) {
        if (typeof t === "object") return t;
        return { code: t, name: it.name || d.name || "", spec: it.spec || d.spec || "", approval: d.approval || "" };
      })
    };
  }
  function createInnerInBill(ob) {
    if (!ob || ob.method !== "院内调拨出库" || !ob.inOrgId) return null;
    var list = load();
    /* 幂等：同一出库单已生成过则跳过 */
    if (list.some(function (b) { return b.srcId === ob.id; })) return null;
    var org = orgOf(ob.inOrgId);
    var pharmacy = org && org.pharmacies[0];
    var now = fmtNow();
    var bill = {
      id: "b" + Date.now(), code: newCode(list),
      orgId: ob.inOrgId, pharmacyId: pharmacy ? pharmacy.id : "",
      location: ob.inLocation || (pharmacy && pharmacy.locations[0]) || "",
      method: "院内调拨入库",
      supplier: "", accept: "院内调拨自动入库（来源：" + (ob.code || "出库单") + "）",
      invoiceMode: "", invoiceNo: "", invoiceAmount: "", invoiceDate: "",
      srcCode: ob.code || "", srcId: ob.id,
      creatorId: "", creatorName: "系统自动生成",
      submitTime: now, status: "approved", auditorRole: "center", uploadStatus: "none",
      items: (ob.items || []).map(siItemFromOut),
      records: [
        { node: "提交", person: "系统自动生成", org: org ? org.name : "", time: now, result: "已提交", opinion: "院内调拨出库单 " + (ob.code || "") + " 审核通过，自动生成" },
        { node: "审核", person: "系统自动审批", org: org ? org.name : "", time: now, result: "通过", opinion: "院内调拨配对入库，自动通过" }
      ]
    };
    list.push(bill);
    save(list);
    return bill;
  }

  /* ---------- 明细计算 ---------- */
  function qualified(it) { return Math.max(0, Number(it.qty || 0) - Number(it.unq || 0)); }
  function purchaseAmt(it) { return Number(it.qty || 0) * Number(it.purchase || 0); }
  function retailAmt(it) { return Number(it.qty || 0) * Number(it.retail || 0); }
  function sums(bill) {
    var p = 0, r = 0;
    (bill.items || []).forEach(function (it) { p += purchaseAmt(it); r += retailAmt(it); });
    return { purchase: p, retail: r };
  }

  window.SI = {
    USERS: USERS, ORGS: ORGS, SUPPLIERS: SUPPLIERS, METHODS: METHODS, REASONS: REASONS,
    CREATE_METHODS: CREATE_METHODS, FILTER_METHODS: FILTER_METHODS,
    DRUGS: DRUGS, BATCHES: BATCHES,
    STATUS: STATUS, UPLOAD: UPLOAD,
    qs: qs, esc: esc, raw: raw, fmtNow: fmtNow, money: money, num2: num2,
    currentUser: currentUser, setUser: setUser, orgOf: orgOf,
    load: load, save: save, billOf: billOf, newCode: newCode, addBatchExtra: addBatchExtra,
    canAudit: canAudit, opsFor: opsFor, createInnerInBill: createInnerInBill,
    qualified: qualified, purchaseAmt: purchaseAmt, retailAmt: retailAmt, sums: sums
  };
})();
