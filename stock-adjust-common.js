/* =========================================================
 * 药品增损 · 共享逻辑（SA 命名空间）
 * 依赖：无（独立 IIFE，挂 window.SA）
 * 数据：sessionStorage "SA_DATA" / "SA_USER"，首次从种子生成
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

  /* ---------- 增损原因（15 项） ---------- */
  var REASONS = ["过期","鼠咬","晒损","抽检","自然损坏","包装损坏","外来捐赠","破损","捐赠","盘亏","盘盈","期初数据错误","数据丢失","霉烂变质","其他"];

  /* ---------- 批次库（12 条，含库存） ---------- */
  var BATCHES = [
    { code: "1210500301", name: "阿莫西林胶囊", spec: "0.25g×24粒", vendor: "华北制药股份有限公司", batchNo: "20260101A", expire: "2028-01-01", stockQty: 480, inPrice: 8.20, outPrice: 12.50, supplier: "山东医药集团", approval: "国药准字H13023917", prepUnit: "盒" },
    { code: "1210500301", name: "阿莫西林胶囊", spec: "0.25g×24粒", vendor: "华北制药股份有限公司", batchNo: "20260315B", expire: "2028-03-14", stockQty: 220, inPrice: 8.35, outPrice: 12.80, supplier: "济南医药供应站", approval: "国药准字H13023917", prepUnit: "盒" },
    { code: "1210500302", name: "阿莫西林胶囊", spec: "0.5g×12粒", vendor: "石药集团中诺药业（石家庄）有限公司", batchNo: "20260115A", expire: "2028-01-14", stockQty: 240, inPrice: 12.50, outPrice: 18.80, supplier: "济南医药供应站", approval: "国药准字H20033293", prepUnit: "盒" },
    { code: "1210500501", name: "头孢克肟分散片", spec: "0.1g×6片", vendor: "上海信谊药厂有限公司", batchNo: "20260201A", expire: "2028-01-31", stockQty: 180, inPrice: 16.80, outPrice: 24.60, supplier: "上海医药分销", approval: "国药准字H31020315", prepUnit: "盒" },
    { code: "1210500601", name: "布洛芬缓释胶囊", spec: "0.3g×20粒", vendor: "中美天津史克制药有限公司", batchNo: "20251201A", expire: "2027-11-30", stockQty: 0,   inPrice: 15.00, outPrice: 22.00, supplier: "天津医药集团", approval: "国药准字H10900089", prepUnit: "盒" },
    { code: "1210500901", name: "奥美拉唑肠溶胶囊", spec: "20mg×14粒", vendor: "常州四药制药有限公司", batchNo: "20260301A", expire: "2028-02-28", stockQty: 280, inPrice: 24.00, outPrice: 35.80, supplier: "常州药业股份", approval: "国药准字H10950185", prepUnit: "盒" },
    { code: "1210501101", name: "复方甘草片", spec: "100片", vendor: "广州白云山制药股份有限公司", batchNo: "20260215A", expire: "2027-08-14", stockQty: 500, inPrice: 5.20, outPrice: 8.50, supplier: "广州医药集团", approval: "国药准字Z44021234", prepUnit: "瓶" },
    { code: "1210501201", name: "硝苯地平控释片", spec: "30mg×7片", vendor: "拜耳医药保健有限公司", batchNo: "20260310A", expire: "2028-03-09", stockQty: 210, inPrice: 20.50, outPrice: 29.80, supplier: "拜耳医药保健", approval: "国药准字J20180015", prepUnit: "盒" },
    { code: "1210501301", name: "盐酸二甲双胍片", spec: "0.5g×20片", vendor: "中美上海施贵宝制药有限公司", batchNo: "20260120A", expire: "2028-01-19", stockQty: 400, inPrice: 10.20, outPrice: 15.60, supplier: "上海施贵宝", approval: "国药准字H31020246", prepUnit: "盒" },
    { code: "1210501401", name: "左氧氟沙星片", spec: "0.5g×4片", vendor: "第一三共制药（北京）有限公司", batchNo: "20260220A", expire: "2028-02-19", stockQty: 120, inPrice: 22.00, outPrice: 32.00, supplier: "第一三共制药", approval: "国药准字H20000567", prepUnit: "盒" },
    { code: "1210501501", name: "双歧杆菌三联活菌胶囊", spec: "0.21g×24粒", vendor: "上海上药信谊药厂有限公司", batchNo: "20260305A", expire: "2027-09-04", stockQty: 192, inPrice: 18.00, outPrice: 26.50, supplier: "上海信谊", approval: "国药准字S10950031", prepUnit: "盒" },
    { code: "1210501601", name: "阿托伐他汀钙片", spec: "20mg×7片", vendor: "辉瑞制药有限公司", batchNo: "20260208A", expire: "2028-02-07", stockQty: 350, inPrice: 26.50, outPrice: 38.90, supplier: "辉瑞制药", approval: "国药准字H20051408", prepUnit: "盒" }
  ];

  /* ---------- 工具 ---------- */
  function qs(k) { var m = location.search.match(new RegExp("[?&]" + k + "=([^&]*)")); return m ? decodeURIComponent(m[1]) : ""; }
  function esc(v) {
    return (v === null || v === undefined || v === "") ? "—" : String(v)
      .replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; });
  }
  function fmtNow() {
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }
  function num2(n) { return Number(n || 0).toFixed(2); }

  /* ---------- 当前用户 ---------- */
  function currentUser() {
    try { var u = JSON.parse(sessionStorage.getItem("SA_USER") || "null"); if (u && u.id) return u; } catch (e) {}
    return USERS[0];
  }
  function setUser(id) {
    var u = USERS.filter(function (x) { return x.id === id; })[0];
    if (u) sessionStorage.setItem("SA_USER", JSON.stringify(u));
  }
  function orgOf(id) { return ORGS.filter(function (o) { return o.id === id; })[0] || null; }
  function pharmacyOf(orgId, pid) {
    var o = orgOf(orgId); if (!o) return null;
    return o.pharmacies.filter(function (p) { return p.id === pid; })[0] || null;
  }

  /* ---------- 批次查找 ---------- */
  function findBatchesByDrug(code) {
    return BATCHES.filter(function (b) { return b.code === code; });
  }
  function findBatchByRow(row) {
    return BATCHES.filter(function (b) {
      return b.code === row.code && b.spec === row.spec && b.vendor === row.vendor && b.batchNo === row.batch;
    })[0] || null;
  }
  /* 四元组唯一 key：code + spec + vendor + batch */
  function rowKey(r) { return [r.code, r.spec, r.vendor, r.batch].join("|"); }

  /* ---------- 明细构造 ---------- */
  function blankItem() {
    return {
      name: "", code: "", spec: "", packSpec: "", vendor: "", approval: "", packUnit: "",
      batch: "", expiry: "", supplier: "",
      purchase: "", retail: "", qty: "", stockQty: 0,
      traces: []
    };
  }
  function itemFromBatch(b) {
    return {
      name: b.name, code: b.code, spec: b.spec, packSpec: b.spec + "/" + b.prepUnit,
      vendor: b.vendor, approval: b.approval, packUnit: b.prepUnit,
      batch: b.batchNo, expiry: b.expire, supplier: b.supplier,
      purchase: b.inPrice, retail: b.outPrice, qty: "", stockQty: b.stockQty,
      traces: []
    };
  }

  /* ---------- 增损单种子 ---------- */
  function seed() {
    var now = "2026-11-03 10:20:11";
    return [
      // 审核通过 + 未上传（报增）
      { id: "zs1", code: "ZS20261103001", orgId: "o3", pharmacyId: "p31", location: "A 区库房", method: "报增入库", reason: "盘盈", remark: "定期盘点多出 50 盒阿莫西林",
        creatorId: "u3", creatorName: "陈静", submitTime: now, status: "approved", auditorRole: "center", uploadStatus: "wait", inoutCode: "RK20261103001",
        items: [ itemFromBatch(BATCHES[0]) ],
        records: [
          { node: "提交", person: "陈静", org: "区域中心药房", time: now, result: "已提交", opinion: "" },
          { node: "审核", person: "赵敏", org: "区域中心药房", time: "2026-11-03 14:20:11", result: "通过", opinion: "盘点记录齐全，同意入库" }
        ] },
      // 待审核 + 报损
      { id: "zs2", code: "ZS20261102002", orgId: "o1", pharmacyId: "p11", location: "A 区药柜", method: "报损出库", reason: "过期", remark: "2027 年 11 月到期的布洛芬 10 盒",
        creatorId: "u1", creatorName: "王芳", submitTime: "2026-11-02 16:45:30", status: "pending", auditorRole: "member", uploadStatus: "none",
        items: [ Object.assign(itemFromBatch(BATCHES[4]), { qty: 10 }) ],
        records: [ { node: "提交", person: "王芳", org: "幸福村卫生室", time: "2026-11-02 16:45:30", result: "已提交", opinion: "" } ] },
      // 已驳回 + 待重提
      { id: "zs3", code: "ZS20261101003", orgId: "o2", pharmacyId: "p21", location: "货架一区", method: "报损出库", reason: "霉烂变质", remark: "受潮变质 20 盒",
        creatorId: "u2", creatorName: "李强", submitTime: "2026-11-01 09:12:00", status: "rejected", auditorRole: "center", uploadStatus: "none",
        items: [ Object.assign(itemFromBatch(BATCHES[9]), { qty: 20 }) ],
        records: [
          { node: "提交", person: "李强", org: "城东社区卫生服务中心", time: "2026-11-01 09:12:00", result: "已提交", opinion: "" },
          { node: "审核", person: "赵敏", org: "区域中心药房", time: "2026-11-01 10:30:00", result: "拒绝", opinion: "请附现场照片" }
        ] },
      // 草稿
      { id: "zs4", code: "ZS20261101004", orgId: "o3", pharmacyId: "p31", location: "B 区库房", method: "报增入库", reason: "外来捐赠", remark: "爱心捐赠 100 盒",
        creatorId: "u3", creatorName: "陈静", submitTime: "2026-11-01 15:00:00", status: "draft", auditorRole: "center", uploadStatus: "none",
        items: [ itemFromBatch(BATCHES[11]) ], records: [] },
      // 审核通过 + 上传成功
      { id: "zs5", code: "ZS20261031005", orgId: "o2", pharmacyId: "p22", location: "病房药柜", method: "报损出库", reason: "自然损坏", remark: "",
        creatorId: "u2", creatorName: "李强", submitTime: "2026-10-31 11:20:00", status: "approved", auditorRole: "center", uploadStatus: "success", inoutCode: "CK20261031001",
        items: [ Object.assign(itemFromBatch(BATCHES[6]), { qty: 30 }) ],
        records: [
          { node: "提交", person: "李强", org: "城东社区卫生服务中心", time: "2026-10-31 11:20:00", result: "已提交", opinion: "" },
          { node: "审核", person: "赵敏", org: "区域中心药房", time: "2026-10-31 14:30:00", result: "通过", opinion: "" }
        ] },
      // 审核通过 + 上传失败
      { id: "zs6", code: "ZS20261030006", orgId: "o3", pharmacyId: "p31", location: "冷链柜", method: "报增入库", reason: "盘盈", remark: "",
        creatorId: "u3", creatorName: "陈静", submitTime: "2026-10-30 09:05:00", status: "approved", auditorRole: "center", uploadStatus: "fail", inoutCode: "RK20261030001",
        items: [ Object.assign(itemFromBatch(BATCHES[7]), { qty: 20 }) ],
        records: [
          { node: "提交", person: "陈静", org: "区域中心药房", time: "2026-10-30 09:05:00", result: "已提交", opinion: "" },
          { node: "审核", person: "赵敏", org: "区域中心药房", time: "2026-10-30 11:15:00", result: "通过", opinion: "" }
        ] },
      // 撤回后重提（状态仍是 pending，审核记录含撤回节点）
      { id: "zs7", code: "ZS20261029007", orgId: "o1", pharmacyId: "p11", location: "B 区药柜", method: "报损出库", reason: "包装损坏", remark: "运输途中 5 盒破损",
        creatorId: "u1", creatorName: "王芳", submitTime: "2026-10-29 10:00:00", status: "pending", auditorRole: "member", uploadStatus: "none",
        items: [ Object.assign(itemFromBatch(BATCHES[3]), { qty: 5 }) ],
        records: [
          { node: "提交", person: "王芳", org: "幸福村卫生室", time: "2026-10-29 10:00:00", result: "已提交", opinion: "" },
          { node: "撤回", person: "王芳", org: "幸福村卫生室", time: "2026-10-29 11:00:00", result: "已撤回", opinion: "补充说明后重提" },
          { node: "提交", person: "王芳", org: "幸福村卫生室", time: "2026-10-29 11:05:00", result: "已提交", opinion: "补充：物流公司编号 SF12345" }
        ] },
      // 报增 + 报损混合（一张单多条）
      { id: "zs8", code: "ZS20261028008", orgId: "o2", pharmacyId: "p21", location: "货架二区", method: "报增入库", reason: "捐赠", remark: "社区公益捐赠 2026 年版",
        creatorId: "u2", creatorName: "李强", submitTime: "2026-10-28 14:30:00", status: "draft", auditorRole: "center", uploadStatus: "none",
        items: [ itemFromBatch(BATCHES[8]), itemFromBatch(BATCHES[10]) ], records: [] }
    ];
  }

  /* ---------- 存取：会话内保存修改，首次加载写入种子 ---------- */
  function load() {
    /* 优先读取本次会话已保存的数据，保证新增/编辑/审核结果在页面间流转时不被重置 */
    try { var d = JSON.parse(sessionStorage.getItem("SA_DATA") || "null"); if (d && d.length) return d; } catch (e) {}
    var s = seed(); sessionStorage.setItem("SA_DATA", JSON.stringify(s)); return s;
  }
  function reset() { sessionStorage.removeItem("SA_DATA"); return load(); }
  function save(list) { sessionStorage.setItem("SA_DATA", JSON.stringify(list)); }
  function billOf(id) { return load().filter(function (b) { return b.id === id; })[0] || null; }

  function newCode(list) {
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
    var prefix = "ZS" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate());
    var max = 0;
    list.forEach(function (b) {
      if (b.code && b.code.indexOf(prefix) === 0) {
        var n = parseInt(b.code.slice(prefix.length), 10);
        if (!isNaN(n) && n > max) max = n;
      }
    });
    return prefix + ("00" + (max + 1)).slice(-3);
  }

  /* 审核通过后自动生成出/入库单号：报增入库 RK、报损出库 CK，格式 RK/CK + yyyymmdd + 3 位流水 */
  function makeInoutCode(bill, list) {
    var pfx = bill.method === "报损出库" ? "CK" : "RK";
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
    var head = pfx + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate());
    var max = 0;
    (list || []).forEach(function (b) {
      if (b.inoutCode && b.inoutCode.indexOf(head) === 0) {
        var n = parseInt(b.inoutCode.slice(head.length), 10);
        if (!isNaN(n) && n > max) max = n;
      }
    });
    return head + ("00" + (max + 1)).slice(-3);
  }

  /* ---------- 文案映射 ---------- */
  var STATUS = { draft: "草稿", pending: "待审核", approved: "审核通过", rejected: "已驳回" };
  var UPLOAD = { none: "—", wait: "未上传", success: "上传成功", fail: "上传失败" };
  var METHODS = { add: "报增入库", minus: "报损出库" };

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
      if (canAudit(bill, user)) ops.push({ key: "audit", label: "审核" });
      else if (mine) ops.push({ key: "withdraw", label: "撤回" });
    } else if (bill.status === "approved") {
      if ((bill.uploadStatus === "wait" || bill.uploadStatus === "fail")) ops.push({ key: "upload", label: "上传" });
    }
    return ops;
  }

  /* ---------- 明细金额合计 ---------- */
  function purchaseAmt(it) { return Number(it.qty || 0) * Number(it.purchase || 0); }
  function retailAmt(it) { return Number(it.qty || 0) * Number(it.retail || 0); }
  function sums(bill) {
    var p = 0, r = 0;
    (bill.items || []).forEach(function (it) { p += purchaseAmt(it); r += retailAmt(it); });
    return { purchase: p, retail: r };
  }

  window.SA = {
    USERS: USERS, ORGS: ORGS, REASONS: REASONS, BATCHES: BATCHES,
    STATUS: STATUS, UPLOAD: UPLOAD, METHODS: METHODS,
    qs: qs, esc: esc, fmtNow: fmtNow, num2: num2,
    currentUser: currentUser, setUser: setUser, orgOf: orgOf, pharmacyOf: pharmacyOf,
    findBatchesByDrug: findBatchesByDrug, findBatchByRow: findBatchByRow, rowKey: rowKey,
    blankItem: blankItem, itemFromBatch: itemFromBatch,
    load: load, save: save, billOf: billOf, newCode: newCode, makeInoutCode: makeInoutCode,
    canAudit: canAudit, opsFor: opsFor,
    purchaseAmt: purchaseAmt, retailAmt: retailAmt, sums: sums
  };
})();
