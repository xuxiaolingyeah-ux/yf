/* =========================================================
 * 台账管理 · 共享逻辑（LG 命名空间）
 * 依赖：mock.js（可选，用于库位/药房档案）
 * 数据：sessionStorage "LG_BOOKS"（账簿）/ "LG_PERIODS"（台账期间）
 * 说明：台账明细按「账簿 × 会计年度 × 会计月度」确定性生成，
 *       同一账簿相邻月份期初 = 上月结存，保证账面连续可核。
 * ========================================================= */
(function () {
  "use strict";

  /* ---------- 药品种类（与「库位维护」的分类字典一致） ---------- */
  var KINDS = ["西药", "中成药", "中药饮片", "中药直服饮片", "配方颗粒", "疫苗"];

  /* ---------- 库位（优先取药房档案中的库位） ---------- */
  var FALLBACK_LOCS = [
    { name: "西药库位A", pharmacy: "中心药房", org: "山东大学齐鲁医院", cats: ["西药", "中成药", "疫苗"] },
    { name: "中药库位B", pharmacy: "中心药房", org: "山东大学齐鲁医院", cats: ["中药饮片", "中药直服饮片", "配方颗粒"] },
    { name: "门诊西药库位", pharmacy: "门诊西药房", org: "山东大学齐鲁医院", cats: ["西药", "中成药", "疫苗"] },
    { name: "住院西药库位", pharmacy: "东院区住院药房", org: "山东大学齐鲁医院（东院区）", cats: ["西药", "中成药"] },
    { name: "住院中药库位", pharmacy: "东院区住院药房", org: "山东大学齐鲁医院（东院区）", cats: ["中药饮片", "配方颗粒"] },
    { name: "注射剂库位", pharmacy: "住院部药房", org: "济南市中心医院", cats: ["西药", "疫苗"] },
    { name: "饮片库位", pharmacy: "门诊中药房", org: "扬州市江都区人民医院", cats: ["中药饮片", "中药直服饮片"] }
  ];

  function buildLocs() {
    var M = window.MOCK || {};
    var list = [];
    (M.pharmacyFacilities || []).forEach(function (f) {
      (f.slots || []).forEach(function (s) {
        list.push({
          name: s.name, pharmacy: f.name, org: f.mgr || "",
          cats: (s.cats || []).filter(function (c) { return KINDS.indexOf(c) >= 0; })
        });
      });
    });
    if (!list.length) return FALLBACK_LOCS;
    /* 档案里没有的示例库位补齐，保证演示账簿都能选到库位 */
    FALLBACK_LOCS.forEach(function (l) {
      var hit = list.filter(function (x) { return x.name === l.name; })[0];
      if (!hit) list.push(l);
    });
    return list;
  }
  var LOCS = buildLocs();

  /* ---------- 药品主数据（台账明细行来源） ---------- */
  var DRUGS = [
    { code: "1210500301", name: "阿莫西林胶囊", py: "AMXLJN", spec: "0.25g×24粒", vendor: "华北制药股份有限公司", kind: "西药", purchase: 8.20, retail: 12.50 },
    { code: "1210500302", name: "阿莫西林胶囊", py: "AMXLJN", spec: "0.5g×12粒", vendor: "石药集团中诺药业（石家庄）有限公司", kind: "西药", purchase: 12.50, retail: 18.80 },
    { code: "1210500501", name: "头孢克肟分散片", py: "TBKWFSP", spec: "0.1g×6片", vendor: "上海信谊药厂有限公司", kind: "西药", purchase: 16.80, retail: 24.60 },
    { code: "1210500601", name: "布洛芬缓释胶囊", py: "BLFHSJN", spec: "0.3g×20粒", vendor: "中美天津史克制药有限公司", kind: "西药", purchase: 15.00, retail: 22.00 },
    { code: "1210500901", name: "奥美拉唑肠溶胶囊", py: "AMLZCRJN", spec: "20mg×14粒", vendor: "常州四药制药有限公司", kind: "西药", purchase: 24.00, retail: 35.80 },
    { code: "1210501101", name: "复方甘草片", py: "FFGCP", spec: "100片/瓶", vendor: "广州白云山制药股份有限公司", kind: "中成药", purchase: 5.20, retail: 8.50 },
    { code: "1210501201", name: "硝苯地平控释片", py: "XBDPKSP", spec: "30mg×7片", vendor: "拜耳医药保健有限公司", kind: "西药", purchase: 20.50, retail: 29.80 },
    { code: "1210501301", name: "盐酸二甲双胍片", py: "YSEJSGP", spec: "0.5g×20片", vendor: "中美上海施贵宝制药有限公司", kind: "西药", purchase: 10.20, retail: 15.60 },
    { code: "1210501401", name: "左氧氟沙星片", py: "ZYFSXP", spec: "0.5g×4片", vendor: "第一三共制药（北京）有限公司", kind: "西药", purchase: 22.00, retail: 32.00 },
    { code: "1210501501", name: "双歧杆菌三联活菌胶囊", py: "SQGJSLHJJN", spec: "0.21g×24粒", vendor: "上海上药信谊药厂有限公司", kind: "西药", purchase: 18.00, retail: 26.50 },
    { code: "1210501601", name: "阿托伐他汀钙片", py: "ATFTTGP", spec: "20mg×7片", vendor: "辉瑞制药有限公司", kind: "西药", purchase: 26.50, retail: 38.90 },
    { code: "1210700101", name: "连花清瘟胶囊", py: "LHQWJN", spec: "0.35g×24粒", vendor: "石家庄以岭药业股份有限公司", kind: "中成药", purchase: 14.80, retail: 21.50 },
    { code: "1410100101", name: "重组乙型肝炎疫苗", py: "ZZYXXGYM", spec: "10μg/0.5ml×1支", vendor: "深圳康泰生物制品股份有限公司", kind: "疫苗", purchase: 68.00, retail: 98.00 },
    { code: "1310100101", name: "黄芪饮片", py: "HQYP", spec: "500g/袋", vendor: "亳州中药饮片厂", kind: "中药饮片", purchase: 32.00, retail: 45.00 },
    { code: "1310100201", name: "当归饮片", py: "DGYP", spec: "500g/袋", vendor: "亳州中药饮片厂", kind: "中药饮片", purchase: 56.00, retail: 78.00 },
    { code: "1310100301", name: "金银花饮片", py: "JYHYP", spec: "500g/袋", vendor: "亳州中药饮片厂", kind: "中药饮片", purchase: 78.00, retail: 108.00 },
    { code: "1310100401", name: "麸炒白术饮片", py: "FCBZYP", spec: "500g/袋", vendor: "亳州中药饮片厂", kind: "中药饮片", purchase: 41.00, retail: 58.00 },
    { code: "1310200101", name: "黄芪配方颗粒", py: "HQPFKL", spec: "1g×15袋/盒", vendor: "江阴天江药业有限公司", kind: "配方颗粒", purchase: 36.00, retail: 52.00 }
  ];

  /* ---------- 增减维度 ---------- */
  var IN_DIMS = [
    { key: "transferIn", label: "调拨入库" },
    { key: "gainIn", label: "报增入库" },
    { key: "returnIn", label: "退库入库" },
    { key: "rxReturnIn", label: "退药入库" },
    { key: "otherIn", label: "入库" }
  ];
  var OUT_DIMS = [
    { key: "transferOut", label: "调拨出库" },
    { key: "lossOut", label: "报损出库" },
    { key: "returnOut", label: "退库出库" },
    { key: "dispenseOut", label: "发药出库" },
    { key: "otherOut", label: "出库" }
  ];

  /* ---------- 工具 ---------- */
  function esc(v) {
    return (v === null || v === undefined || v === "") ? "—" : String(v)
      .replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fmtNow() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " +
      pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }
  function money(n) {
    var v = Number(n || 0);
    var s = Math.abs(v).toFixed(2).split(".");
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (v < 0 ? "-" : "") + s.join(".");
  }
  function int(n) { return String(Math.round(Number(n || 0))); }

  /* ---------- 确定性伪随机（同一账簿/药品/月份永远得到同一组数） ---------- */
  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;   /* 32 位乘法，避免超出安全整数丢失低位 */
    }
    return h;
  }

  /* ---------- 当前用户 ---------- */
  function currentUser() {
    try {
      var u = JSON.parse(sessionStorage.getItem("SEL_USER") || "null");
      if (u && u.name) return u;
    } catch (e) { /* ignore */ }
    return { name: "赵敏", role: "center", org: "区域中心药房", roleName: "中心药房审核人" };
  }

  /* ---------- 账簿种子 ---------- */
  function seedBooks() {
    return [
      { id: "b1", code: "ZB2025001", name: "中心药房西药台账", location: "西药库位A",
        kinds: ["西药", "中成药", "疫苗"], status: "on", createdBy: "赵敏",
        createdAt: "2025-01-01 09:20:00", remark: "按西药库位登记的西药、中成药、疫苗明细账" },
      { id: "b2", code: "ZB2025002", name: "中心药房中药台账", location: "中药库位B",
        kinds: ["中药饮片", "中药直服饮片", "配方颗粒"], status: "on", createdBy: "赵敏",
        createdAt: "2025-01-01 09:26:00", remark: "中药饮片按 500g/袋 记账" },
      { id: "b3", code: "ZB2025003", name: "门诊西药房台账", location: "门诊西药库位",
        kinds: ["西药", "中成药"], status: "on", createdBy: "赵敏",
        createdAt: "2025-03-01 10:05:00", remark: "门诊药房独立建账，不含疫苗" }
    ];
  }

  /* ---------- 期间种子：2025 全年 + 2026 年 1-11 月，当前月未生成 ---------- */
  function genTimeOf(y, m) {
    var ny = m === 12 ? y + 1 : y, nm = m === 12 ? 1 : m + 1;
    return ny + "-" + pad(nm) + "-01 06:12:03";
  }
  function seedPeriods(books) {
    var rows = [];
    books.forEach(function (b) {
      [2025, 2026].forEach(function (y) {
        var maxM = y === 2026 ? 11 : 12;
        for (var m = 1; m <= maxM; m++) {
          /* 2026 年 11 月（当前会计月）保持未生成，用于演示「生成」操作 */
          var done = !(y === 2026 && m === 11);
          rows.push({
            id: b.id + "-" + y + "-" + pad(m), bookId: b.id, year: y, month: m,
            status: done ? "done" : "todo",
            genTime: done ? genTimeOf(y, m) : "",
            genBy: done ? "系统自动" : ""
          });
        }
      });
    });
    return rows;
  }

  /* ---------- 存取 ---------- */
  function loadBooks() {
    try {
      var d = JSON.parse(sessionStorage.getItem("LG_BOOKS") || "null");
      if (d && d.length) return d;
    } catch (e) { /* ignore */ }
    var s = seedBooks();
    sessionStorage.setItem("LG_BOOKS", JSON.stringify(s));
    return s;
  }
  function saveBooks(list) { sessionStorage.setItem("LG_BOOKS", JSON.stringify(list)); }

  function loadPeriods() {
    try {
      var d = JSON.parse(sessionStorage.getItem("LG_PERIODS") || "null");
      if (d && d.length) return d;
    } catch (e) { /* ignore */ }
    var s = seedPeriods(loadBooks());
    sessionStorage.setItem("LG_PERIODS", JSON.stringify(s));
    return s;
  }
  function savePeriods(list) { sessionStorage.setItem("LG_PERIODS", JSON.stringify(list)); }

  function bookOf(id) {
    return loadBooks().filter(function (b) { return b.id === id; })[0] || null;
  }
  function locOf(name) {
    return LOCS.filter(function (l) { return l.name === name; })[0] || null;
  }
  function periodOf(id) {
    return loadPeriods().filter(function (p) { return p.id === id; })[0] || null;
  }

  /* ---------- 明细生成 ---------- */
  function monthFlows(bookId, code, y, m) {
    var key = bookId + "|" + code + "|" + y + "-" + m;
    var quiet = hash(key) % 4 === 0;   /* 约 1/4 的月份该药品无任何发生额 */
    var f = { __quiet: quiet };
    IN_DIMS.forEach(function (d) {
      f[d.key] = quiet ? 0 : pickFlow(key + d.key, 60);
    });
    OUT_DIMS.forEach(function (d) {
      f[d.key] = quiet ? 0 : pickFlow(key + d.key, 90);
    });
    return f;
  }
  function pickFlow(key, max) {
    var h = hash(key);
    if (h % 5 === 0) return 0;         /* 单个维度留白，贴近真实账面 */
    return 1 + (h % max);
  }

  /* 返回某账簿某期间的整表行（数量口径；金额由页面按价格口径换算） */
  function rowsOf(period) {
    var book = bookOf(period.bookId);
    if (!book) return [];
    var drugs = DRUGS.filter(function (d) { return book.kinds.indexOf(d.kind) >= 0; });
    return drugs.map(function (drug) {
      var openQty = 120 + (hash(book.id + drug.code + "|open") % 480);
      var qty = openQty;
      var last = null;
      for (var y = 2025; y <= period.year; y++) {
        var mEnd = (y === period.year) ? period.month : 12;
        for (var m = 1; m <= mEnd; m++) {
          var f = monthFlows(book.id, drug.code, y, m);
          var ins = 0, outs = 0;
          IN_DIMS.forEach(function (d) { ins += f[d.key]; });
          OUT_DIMS.forEach(function (d) { outs += f[d.key]; });
          var closeQty = qty + ins - outs;
          if (closeQty < 0) {
            /* 出库量超过可用量时，从出库维度（自「出库」起）扣减，保证结存不为负 */
            var excess = -closeQty;
            for (var oi = OUT_DIMS.length - 1; oi >= 0 && excess > 0; oi--) {
              var dk = OUT_DIMS[oi].key;
              var cut = Math.min(f[dk], excess);
              f[dk] -= cut; excess -= cut;
            }
            ins = 0; outs = 0;
            IN_DIMS.forEach(function (d) { ins += f[d.key]; });
            OUT_DIMS.forEach(function (d) { outs += f[d.key]; });
            closeQty = qty + ins - outs;
          }
          /* 低储补货：结存过低时按基准补货（通过「入库」维度），避免库存长期趴零 */
          if (!f.__quiet && closeQty < 100) {
            var base = 220 + (hash(book.id + drug.code + "|base") % 480);
            var need = base - closeQty + (hash(book.id + drug.code + "|" + y + "-" + m + "|rp") % 80);
            if (need > 0) { f.otherIn += need; closeQty += need; }
          }
          last = { open: qty, flows: f, inSum: 0, outSum: 0, close: closeQty };
          IN_DIMS.forEach(function (d) { last.inSum += f[d.key]; });
          OUT_DIMS.forEach(function (d) { last.outSum += f[d.key]; });
          qty = closeQty;
        }
      }
      return {
        code: drug.code, name: drug.name, py: drug.py, spec: drug.spec, vendor: drug.vendor,
        kind: drug.kind, purchase: drug.purchase, retail: drug.retail,
        openQty: last.open, inQty: last.flows, inSumQty: last.inSum,
        outQty: last.flows, outSumQty: last.outSum, closeQty: last.close
      };
    });
  }

  /* ---------- 生成台账 ---------- */
  function generate(ids, user) {
    var list = loadPeriods();
    var now = fmtNow();
    var n = 0;
    list.forEach(function (p) {
      if (ids.indexOf(p.id) >= 0 && p.status !== "done") {
        p.status = "done"; p.genTime = now; p.genBy = (user && user.name) || "系统";
        n++;
      }
    });
    savePeriods(list);
    return n;
  }

  window.LG = {
    KINDS: KINDS, LOCS: LOCS, DRUGS: DRUGS, IN_DIMS: IN_DIMS, OUT_DIMS: OUT_DIMS,
    esc: esc, money: money, int: int, fmtNow: fmtNow, currentUser: currentUser,
    loadBooks: loadBooks, saveBooks: saveBooks, loadPeriods: loadPeriods, savePeriods: savePeriods,
    bookOf: bookOf, locOf: locOf, periodOf: periodOf,
    rowsOf: rowsOf, generate: generate,
    MONTH_LABEL: function (m) { return m + "月"; }
  };
})();
