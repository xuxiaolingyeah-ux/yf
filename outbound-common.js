/* =========================================================
 * 药品出库 · 共享逻辑（OB 命名空间）
 * 依赖：无（独立 IIFE，挂 window.OB）
 * 数据：sessionStorage "OB_DATA_V2" / "OB_STOCK" / "OB_USER"
 * 说明：
 *   1) 历史单据由调拨 / 退库 / 报损 / 盘亏 / 退货业务自动生成，审核状态统一为
 *      「审核通过」，审核人「系统自动审批」；
 *   2) 新增出库 = 直接出库，提交时生成单号并预占可用库存；
 *      驳回 / 撤回 / 删除释放预占，审核通过转为实际扣减。
 * ========================================================= */
(function () {
  "use strict";

  /* ---------- 演示账号（顶栏可切换） ---------- */
  var USERS = [
    { id: "u1", name: "王芳", role: "village", roleName: "村室", orgId: "o1" },
    { id: "u2", name: "李强", role: "member", roleName: "成员机构", orgId: "o2" },
    { id: "u3", name: "赵敏", role: "center", roleName: "中心药房·审核", orgId: "o3" },
    { id: "u4", name: "陈静", role: "center", roleName: "中心药房·药师", orgId: "o3" }
  ];

  /* ---------- 机构 / 库位 ---------- */
  var ORGS = [
    { id: "o1", name: "幸福村卫生室", type: "village" },
    { id: "o2", name: "城东社区卫生服务中心", type: "member" },
    { id: "o3", name: "区域中心药房", type: "center" }
  ];

  /* 库位字典：出库库位 / 接收库位共用 */
  var LOCATIONS = ["西药房", "中药房", "门诊药房", "西药库"];

  /* ---------- 出库方式 / 来源单据 ---------- */
  var METHODS = ["直接出库", "调拨出库", "退库出库", "报损出库", "盘亏出库", "退货出库"];
  var SRC_TYPE = {
    "调拨出库": "调拨单号",
    "退库出库": "退库单号",
    "报损出库": "报损单号",
    "盘亏出库": "盘亏单号",
    "退货出库": "退货单号"
  };

  /* ---------- 审核状态 ---------- */
  var AUDIT_STATUS = {
    draft: "草稿",
    pending: "待审核",
    approved: "审核通过",
    rejected: "已驳回"
  };

  /* ---------- 药品库 ---------- */
  var DRUGS = [
    { code: "1210500301", name: "阿莫西林胶囊", spec: "0.25g×24粒", packSpec: "24粒/盒", minFactor: 24, vendor: "华北制药股份有限公司" },
    { code: "1210500302", name: "阿莫西林胶囊", spec: "0.5g×12粒", packSpec: "12粒/盒", minFactor: 12, vendor: "石药集团中诺药业（石家庄）有限公司" },
    { code: "1210500501", name: "头孢克肟分散片", spec: "0.1g×6片", packSpec: "6片/盒", minFactor: 6, vendor: "上海信谊药厂有限公司" },
    { code: "1210500601", name: "布洛芬缓释胶囊", spec: "0.3g×20粒", packSpec: "20粒/盒", minFactor: 20, vendor: "中美天津史克制药有限公司" },
    { code: "1210500901", name: "奥美拉唑肠溶胶囊", spec: "20mg×14粒", packSpec: "14粒/盒", minFactor: 14, vendor: "常州四药制药有限公司" },
    { code: "1210501101", name: "复方甘草片", spec: "100片", packSpec: "100片/瓶", minFactor: 100, vendor: "广州白云山制药股份有限公司" },
    { code: "1210501201", name: "硝苯地平控释片", spec: "30mg×7片", packSpec: "7片/盒", minFactor: 7, vendor: "拜耳医药保健有限公司" },
    { code: "1210501301", name: "盐酸二甲双胍片", spec: "0.5g×20片", packSpec: "20片/盒", minFactor: 20, vendor: "中美上海施贵宝制药有限公司" },
    { code: "1210501401", name: "左氧氟沙星片", spec: "0.5g×4片", packSpec: "4片/盒", minFactor: 4, vendor: "第一三共制药（北京）有限公司" },
    { code: "1210501601", name: "阿托伐他汀钙片", spec: "20mg×7片", packSpec: "7片/盒", minFactor: 7, vendor: "辉瑞制药有限公司" }
  ];

  /* ---------- 批次库（按药品编码）：stock = 中心药房库存总量 ---------- */
  var BATCHES = {
    "1210500301": [
      { batch: "20260101A", expiry: "2028-01-01", purchase: 8.20, retail: 12.50, stock: 320 },
      { batch: "20260102B", expiry: "2028-01-31", purchase: 8.35, retail: 12.80, stock: 150 }
    ],
    "1210500302": [{ batch: "20260115A", expiry: "2028-01-14", purchase: 12.50, retail: 18.80, stock: 86 }],
    "1210500501": [{ batch: "20260201A", expiry: "2028-01-31", purchase: 16.80, retail: 24.60, stock: 260 }],
    "1210500601": [
      { batch: "20251201A", expiry: "2027-11-30", purchase: 15.00, retail: 22.00, stock: 540 },
      { batch: "20251202B", expiry: "2027-12-31", purchase: 15.20, retail: 22.40, stock: 230 }
    ],
    "1210500901": [{ batch: "20260301A", expiry: "2028-02-28", purchase: 24.00, retail: 35.80, stock: 175 }],
    "1210501101": [{ batch: "20260215A", expiry: "2027-08-14", purchase: 5.20, retail: 8.50, stock: 680 }],
    "1210501201": [{ batch: "20260310A", expiry: "2028-03-09", purchase: 20.50, retail: 29.80, stock: 260 }],
    "1210501301": [
      { batch: "20260120A", expiry: "2028-01-19", purchase: 10.20, retail: 15.60, stock: 420 },
      { batch: "20260121B", expiry: "2028-02-18", purchase: 10.35, retail: 15.80, stock: 120 }
    ],
    "1210501401": [{ batch: "20260220A", expiry: "2028-02-19", purchase: 22.00, retail: 32.00, stock: 90 }],
    "1210501601": [{ batch: "20260208A", expiry: "2028-02-07", purchase: 26.50, retail: 38.90, stock: 120 }]
  };

  /* ---------- 工具 ---------- */
  function qs(k) {
    var m = location.search.match(new RegExp("[?&]" + k + "=([^&]*)"));
    return m ? decodeURIComponent(m[1]) : "";
  }
  function esc(v) {
    if (v === null || v === undefined || v === "") return "—";
    return String(v).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }
  function num2(n) { return Number(n || 0).toFixed(2); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fmtNow() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " "
      + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }
  function orgOf(id) { return ORGS.filter(function (o) { return o.id === id; })[0] || null; }
  function orgName(id) { var o = orgOf(id); return o ? o.name : ""; }
  function drugOf(code) { return DRUGS.filter(function (d) { return d.code === code; })[0] || null; }

  /* ---------- 当前用户 ---------- */
  function currentUser() {
    try {
      var u = JSON.parse(sessionStorage.getItem("OB_USER") || "null");
      if (u && u.id) return u;
    } catch (e) {}
    return USERS[3]; /* 默认陈静（中心药房·发起人） */
  }
  function setUser(id) {
    var u = USERS.filter(function (x) { return x.id === id; })[0];
    if (u) sessionStorage.setItem("OB_USER", JSON.stringify(u));
  }

  /* ---------- 明细构造 ---------- */
  function item(code, batchIdx, qty) {
    var d = drugOf(code);
    var b = BATCHES[code][batchIdx];
    return {
      code: d.code, name: d.name, spec: d.spec, packSpec: d.packSpec,
      minFactor: d.minFactor, vendor: d.vendor,
      batch: b.batch, expiry: b.expiry,
      purchase: b.purchase, retail: b.retail, qty: qty,
      traces: []
    };
  }

  /* ---------- 追溯码（演示用） ---------- */
  function hashStr(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000000;
    return h;
  }
  function makeTraces(billCode, idx, qty) {
    var out = [], h = hashStr(billCode + "|" + idx);
    for (var i = 0; i < qty; i++) {
      out.push("81" + ("00000000000000" + String(h * 1000 + i + 1)).slice(-14));
    }
    return out;
  }

  /* ---------- 出库单种子（历史自动生成单据） ----------
   * outOrgId 空缺 = 患者退药（无出库方）；inOrgId 空缺 = 报损 / 盘亏（无接收方） */
  function seed() {
    var raw = [
      { id: "c1", code: "CK20261101001", method: "调拨出库",
        outOrgId: "o3", outLocation: "西药库",
        inOrgId: "o2", inLocation: "门诊药房",
        creatorId: "u4", creatorName: "陈静", submitTime: "2026-11-01 09:20:15",
        srcCode: "DB20261101001", srcId: "t1",
        items: [item("1210500301", 0, 100), item("1210500501", 0, 60)] },

      { id: "c2", code: "CK20261101002", method: "调拨出库",
        outOrgId: "o3", outLocation: "西药库",
        inOrgId: "o1", inLocation: "西药房",
        creatorId: "u4", creatorName: "陈静", submitTime: "2026-11-01 14:05:40",
        srcCode: "DB20261030002", srcId: "t2",
        items: [item("1210500601", 0, 80)] },

      { id: "c3", code: "CK20261031003", method: "报损出库",
        outOrgId: "o3", outLocation: "中药房",
        creatorId: "u3", creatorName: "赵敏", submitTime: "2026-10-31 17:21:55",
        srcCode: "BS20261031003",
        items: [item("1210501601", 0, 6)] },

      { id: "c4", code: "CK20261031004", method: "盘亏出库",
        outOrgId: "o3", outLocation: "西药库",
        creatorId: "u4", creatorName: "陈静", submitTime: "2026-10-31 15:48:30",
        srcCode: "PK20261031004",
        items: [item("1210501301", 0, 8), item("1210501401", 0, 3)] },

      { id: "c5", code: "CK20261030005", method: "退货出库",
        inOrgId: "o3", inLocation: "西药库",
        creatorId: "u3", creatorName: "赵敏", submitTime: "2026-10-30 09:05:12",
        srcCode: "TH20261030005",
        items: [item("1210500601", 1, 2)] },

      { id: "c6", code: "CK20261030006", method: "退货出库",
        inOrgId: "o3", inLocation: "西药库",
        creatorId: "u4", creatorName: "陈静", submitTime: "2026-10-30 14:20:45",
        srcCode: "TH20261030006",
        items: [item("1210500901", 0, 3)] },

      { id: "c7", code: "CK20261029007", method: "报损出库",
        outOrgId: "o3", outLocation: "西药库",
        creatorId: "u4", creatorName: "陈静", submitTime: "2026-10-29 16:33:18",
        srcCode: "BS20261029007",
        items: [item("1210500501", 0, 5)] },

      { id: "c8", code: "CK20261028008", method: "盘亏出库",
        outOrgId: "o3", outLocation: "西药库",
        creatorId: "u3", creatorName: "赵敏", submitTime: "2026-10-28 11:30:05",
        srcCode: "PK20261028008",
        items: [item("1210501201", 0, 5)] },

      { id: "c9", code: "CK20261027009", method: "调拨出库",
        outOrgId: "o3", outLocation: "中药房",
        inOrgId: "o2", inLocation: "西药房",
        creatorId: "u4", creatorName: "陈静", submitTime: "2026-10-27 11:22:09",
        srcCode: "DB20261022005", srcId: "t5",
        items: [item("1210501601", 0, 40)] },

      { id: "c10", code: "CK20261026010", method: "调拨出库",
        outOrgId: "o3", outLocation: "西药库",
        inOrgId: "o1", inLocation: "西药房",
        creatorId: "u4", creatorName: "陈静", submitTime: "2026-10-26 09:12:30",
        srcCode: "DB20261028003", srcId: "t3",
        items: [item("1210501101", 0, 30)] },

      { id: "c11", code: "CK20261025011", method: "退货出库",
        inOrgId: "o3", inLocation: "中药房",
        creatorId: "u3", creatorName: "赵敏", submitTime: "2026-10-25 15:06:18",
        srcCode: "TH20261025011",
        items: [item("1210501601", 0, 1)] },

      { id: "c12", code: "CK20261025012", method: "退库出库",
        outOrgId: "o2", outLocation: "门诊药房",
        inOrgId: "o3", inLocation: "西药库",
        creatorId: "u2", creatorName: "李强", submitTime: "2026-10-25 10:02:33",
        srcCode: "TK20261025012",
        items: [item("1210500901", 0, 30)] },

      { id: "c13", code: "CK20261024013", method: "报损出库",
        outOrgId: "o2", outLocation: "西药房",
        creatorId: "u2", creatorName: "李强", submitTime: "2026-10-24 16:33:18",
        srcCode: "BS20261024013",
        items: [item("1210500601", 0, 4)] },

      { id: "c14", code: "CK20261024014", method: "调拨出库",
        outOrgId: "o2", outLocation: "西药房",
        inOrgId: "o1", inLocation: "西药房",
        creatorId: "u2", creatorName: "李强", submitTime: "2026-10-24 10:10:00",
        srcCode: "DB20261025004", srcId: "t4",
        items: [item("1210500302", 0, 40)] },

      { id: "c15", code: "CK20261023015", method: "退库出库",
        outOrgId: "o1", outLocation: "西药房",
        inOrgId: "o2", inLocation: "西药房",
        creatorId: "u1", creatorName: "王芳", submitTime: "2026-10-23 16:40:22",
        srcCode: "TK20261023015",
        items: [item("1210501101", 0, 20)] },

      { id: "c16", code: "CK20261023016", method: "盘亏出库",
        outOrgId: "o1", outLocation: "西药房",
        creatorId: "u1", creatorName: "王芳", submitTime: "2026-10-23 11:30:05",
        srcCode: "PK20261023016",
        items: [item("1210501201", 0, 3)] },

      { id: "c17", code: "CK20261022017", method: "退货出库",
        inOrgId: "o1", inLocation: "西药房",
        creatorId: "u1", creatorName: "王芳", submitTime: "2026-10-22 09:05:12",
        srcCode: "TH20261022017",
        items: [item("1210500601", 1, 2)] },

      { id: "c18", code: "CK20261022018", method: "报损出库",
        outOrgId: "o1", outLocation: "西药房",
        creatorId: "u1", creatorName: "王芳", submitTime: "2026-10-22 17:21:55",
        srcCode: "BS20261022018",
        items: [item("1210500301", 1, 4)] }
    ];

    /* 历史自动生成单据：审核通过 + 系统自动审批；除盘亏外都需要追溯码 */
    return raw.map(function (b, bi) {
      var noTrace = b.method === "盘亏出库";
      b.auditStatus = "approved";
      b.auditorId = "";
      b.auditorName = "系统自动审批";
      b.auditorOrg = "区域中心药房";
      b.auditTime = b.submitTime;
      b.traceRequired = !noTrace;
      b.remark = "业务单据自动生成";
      b.records = [
        { node: "提交", person: b.creatorName, org: orgName(ownerOrg(b)) || "系统", time: b.submitTime, result: "已提交", opinion: "业务单据自动生成" },
        { node: "系统自动审批", person: "系统自动审批", org: "区域中心药房", time: b.submitTime, result: "审核通过", opinion: "自动生成单据，系统自动审批" }
      ];
      b.items = (b.items || []).map(function (it, ii) {
        it.minFactor = (drugOf(it.code) || {}).minFactor || "";
        it.traces = noTrace ? [] : makeTraces(b.code, ii, Number(it.qty || 0));
        return it;
      });
      return b;
    });
  }

  /* ---------- 库存（总量 - 待审核预占 = 可用） ---------- */
  function seedStock() {
    var s = {};
    Object.keys(BATCHES).forEach(function (code) {
      BATCHES[code].forEach(function (b) { s[code + "|" + b.batch] = Number(b.stock || 0); });
    });
    return s;
  }
  function stockData() {
    try {
      var s = JSON.parse(sessionStorage.getItem("OB_STOCK") || "null");
      if (s && typeof s === "object") return s;
    } catch (e) {}
    var init = seedStock();
    sessionStorage.setItem("OB_STOCK", JSON.stringify(init));
    return init;
  }
  function stockOf(code, batch) { return Number(stockData()[code + "|" + batch] || 0); }
  function reservedOf(list, code, batch) {
    var r = 0;
    (list || load()).forEach(function (b) {
      if (b.auditStatus !== "pending") return;
      (b.items || []).forEach(function (it) {
        if (it.code === code && it.batch === batch) r += Number(it.qty || 0);
      });
    });
    return r;
  }
  function availableOf(list, code, batch) {
    return Math.max(0, stockOf(code, batch) - reservedOf(list, code, batch));
  }
  function deductStock(bill) {
    var s = stockData();
    (bill.items || []).forEach(function (it) {
      var k = it.code + "|" + it.batch;
      s[k] = Math.max(0, Number(s[k] || 0) - Number(it.qty || 0));
    });
    sessionStorage.setItem("OB_STOCK", JSON.stringify(s));
  }

  /* ---------- 存取 ---------- */
  function load() {
    try {
      var d = JSON.parse(sessionStorage.getItem("OB_DATA_V2") || "null");
      if (d && d.length) return d;
    } catch (e) {}
    var s = seed();
    sessionStorage.setItem("OB_DATA_V2", JSON.stringify(s));
    return s;
  }
  function save(list) { sessionStorage.setItem("OB_DATA_V2", JSON.stringify(list)); }
  function billOf(id) { return load().filter(function (b) { return b.id === id; })[0] || null; }

  /* ---------- 归属机构：出库方优先，退货出库取接收方 ---------- */
  function ownerOrg(b) { return b.outOrgId || b.inOrgId || ""; }

  /* ---------- 审核人映射 ----------
   * 村室出库 → 成员机构审核；成员机构 / 中心药房出库 → 中心药房审核 */
  function auditorFor(orgId) {
    if (orgId === "o1") return { id: "u2", name: "李强", org: "城东社区卫生服务中心", roleName: "成员机构审核" };
    return { id: "u3", name: "赵敏", org: "区域中心药房", roleName: "中心药房审核" };
  }
  function canAudit(bill, user) {
    return !!bill && bill.auditStatus === "pending" && bill.auditorId === user.id;
  }

  /* ---------- 单号：提交时生成 CK + yyyymmdd + 3 位流水 ---------- */
  function newCode(list) {
    var d = new Date(), prefix = "CK" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
    var max = 0;
    (list || []).forEach(function (b) {
      var c = b.code || "";
      if (c.indexOf(prefix) === 0) {
        var n = parseInt(c.slice(prefix.length), 10);
        if (!isNaN(n) && n > max) max = n;
      }
    });
    return prefix + ("00" + (max + 1)).slice(-3);
  }

  /* ---------- 追溯码进度 ---------- */
  function traceProgress(it) {
    return (it.traces || []).length + "/" + Number(it.qty || 0);
  }
  function traceOk(it) {
    return (it.traces || []).length === Number(it.qty || 0);
  }

  /* ---------- 明细计算 ---------- */
  function purchaseAmt(it) { return Number(it.qty || 0) * Number(it.purchase || 0); }
  function retailAmt(it) { return Number(it.qty || 0) * Number(it.retail || 0); }
  function sums(bill) {
    var p = 0, r = 0;
    (bill.items || []).forEach(function (it) { p += purchaseAmt(it); r += retailAmt(it); });
    return { purchase: p, retail: r };
  }

  window.OB = {
    USERS: USERS, ORGS: ORGS, LOCATIONS: LOCATIONS,
    METHODS: METHODS, SRC_TYPE: SRC_TYPE, AUDIT_STATUS: AUDIT_STATUS,
    DRUGS: DRUGS, BATCHES: BATCHES,
    qs: qs, esc: esc, num2: num2, fmtNow: fmtNow,
    currentUser: currentUser, setUser: setUser,
    orgOf: orgOf, orgName: orgName, drugOf: drugOf,
    load: load, save: save, billOf: billOf, ownerOrg: ownerOrg,
    stockOf: stockOf, reservedOf: reservedOf, availableOf: availableOf, deductStock: deductStock,
    auditorFor: auditorFor, canAudit: canAudit, newCode: newCode,
    traceProgress: traceProgress, traceOk: traceOk,
    purchaseAmt: purchaseAmt, retailAmt: retailAmt, sums: sums
  };
})();
