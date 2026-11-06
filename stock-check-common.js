/* ==========================================================================
   药品盘点：共享逻辑（数据存取 / 状态文案 / 计算 / 拆零格式化 / 操作矩阵）
   依赖：mock.js（MOCK.users、MOCK.drugs、MOCK.batches、MOCK.classTree）
         selection-common.js（SEL）
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------- 机构 / 药房 / 库位（盘点专用） ---------------- */
  /* 机构：山东大学齐鲁医院；药房：门诊药房 / 住院药房；库位：各药房下的子库 */
  var ORGS = [{ id: "org-ql", name: "山东大学齐鲁医院" }];

  var PHARMACIES = {
    "org-ql": [
      { name: "门诊药房", locations: ["门诊西药房", "门诊中药房"] },
      { name: "住院药房", locations: ["住院西药房", "住院中药房"] }
    ]
  };

  /* ---------------- 需要录入拆零数量的规格（白名单） ----------------
     业务上大部分药品按整包装（盒/袋/支）盘点即可，只有少数零散发药的
     口服固体制剂需要额外录入拆零散数。此处按「药品名称|规格」声明，
     未列出的规格盘点时只录入整包装数量。 */
  var SPLIT_SPECS = [
    "阿莫西林胶囊|0.25g * 24粒/盒"
  ];

  /* ---------------- 批次扩展：补充盘点需要的字段 ---------------- */
  if (MOCK.batches) {
    Object.keys(MOCK.batches).forEach(function (key) {
      var parts = key.split("_");
      var drugId = parts[0], si = parseInt(parts[1], 10);
      var drug = null, spec = null;
      for (var i = 0; i < MOCK.drugs.length; i++) {
        if (MOCK.drugs[i].id === drugId) { drug = MOCK.drugs[i]; break; }
      }
      if (drug && drug.specs && drug.specs[si]) spec = drug.specs[si];

      MOCK.batches[key].forEach(function (b) {
        b.drugId = drugId;
        b.si = si;
        b.drugName = drug ? drug.name : "";
        b.drugKind = drug ? drug.kind : "";
        b.drugForm = drug ? drug.form : "";
        b.drugSpec = spec ? spec.title : "";
        b.specCode = spec ? spec.code : "";

        /* 单位与拆零：仅白名单规格且规格启用时才录入拆零数量 */
        b.unit = spec ? (spec.pkgUnit || "盒") : "盒";
        b.factor = spec ? (parseFloat(spec.pkgFactor) || 1) : 1;
        var specKey = (drug ? drug.name : "") + "|" + (spec ? spec.title : "");
        var allowSplit = spec && spec.status !== "off" && SPLIT_SPECS.indexOf(specKey) >= 0;
        b.splitUnit = allowSplit ? (spec.splitUnit || "") : "";
        b.minFactor = spec ? (parseFloat(spec.minFactor) || 1) : 1;
        /* 规格级停用：spec.status === "off" 为停用药品 */
        b.stop = !!(spec && spec.status === "off");

        /* 药品分类：取最后一级 */
        var cat = drug ? (drug.category || "") : "";
        b.drugCategory = cat.split("/").pop().trim();

        /* 停用数量 / 预减数量：均为整盒（整包装）数量 */
        b.stopQty = b.stock > 290 ? 2 : (b.stock > 100 ? 1 : 0);
        b.preReduce = b.stock > 200 ? 3 : (b.stock > 50 ? 1 : 0);
      });
    });
  }

  /* ---------------- 盘点单 mock 种子 ---------------- */
  if (!MOCK.stockChecks) {
    MOCK.stockChecks = [
      {
        id: "sc1", code: "PD20261101001",
        name: "2026年11月门诊西药房盘点",
        orgId: "org-ql", orgName: "山东大学齐鲁医院",
        pharmacy: "门诊药房", location: "门诊西药房",
        kind: "西药", checkTime: "2026-11-01 09:00",
        auditStatus: "draft",
        creatorId: "u4", creator: "陈静", createdAt: "2026-11-01 09:00",
        items: [], records: []
      },
      {
        id: "sc2", code: "PD20261102001",
        name: "11月上旬住院西药房盘点",
        orgId: "org-ql", orgName: "山东大学齐鲁医院",
        pharmacy: "住院药房", location: "住院西药房",
        kind: "西药", checkTime: "2026-11-02 10:15",
        auditStatus: "pending",
        creatorId: "u4", creator: "陈静", createdAt: "2026-11-02 10:15",
        items: [],
        records: [
          { node: "提交", person: "陈静", org: "区域中心药房", result: "已提交", opinion: "—", time: "2026-11-02 10:15" }
        ]
      },
      {
        id: "sc3", code: "PD20261025001",
        name: "10月月末中药饮片盘点",
        orgId: "org-ql", orgName: "山东大学齐鲁医院",
        pharmacy: "门诊药房", location: "门诊中药房",
        kind: "中药饮片", checkTime: "2026-10-25 08:30",
        auditStatus: "approved",
        creatorId: "u4", creator: "陈静", createdAt: "2026-10-25 08:30",
        items: [],
        records: [
          { node: "提交", person: "陈静", org: "区域中心药房", result: "已提交", opinion: "—", time: "2026-10-25 08:30" },
          { node: "审核", person: "赵敏", org: "区域中心药房", result: "通过", opinion: "盘点结果属实。", time: "2026-10-25 14:20" }
        ],
        inCode: "RK20261025001",
        outCode: "CK20261025001"
      },
      {
        id: "sc4", code: "PD20261028001",
        name: "10月门诊西药房复盘",
        orgId: "org-ql", orgName: "山东大学齐鲁医院",
        pharmacy: "门诊药房", location: "门诊西药房",
        kind: "西药", checkTime: "2026-10-28 09:40",
        auditStatus: "rejected",
        creatorId: "u4", creator: "陈静", createdAt: "2026-10-28 09:40",
        items: [],
        records: [
          { node: "提交", person: "陈静", org: "区域中心药房", result: "已提交", opinion: "—", time: "2026-10-28 09:40" },
          { node: "审核", person: "赵敏", org: "区域中心药房", result: "拒绝", opinion: "盈亏金额较大，请重新核对后提交。", time: "2026-10-28 16:30" }
        ]
      },
      {
        id: "sc5", code: "PD20261030001",
        name: "10月底配方颗粒盘点",
        orgId: "org-ql", orgName: "山东大学齐鲁医院",
        pharmacy: "住院药房", location: "住院中药房",
        kind: "配方颗粒", checkTime: "2026-10-30 11:00",
        auditStatus: "draft",
        creatorId: "u4", creator: "陈静", createdAt: "2026-10-30 11:00",
        items: [],
        records: [
          { node: "提交", person: "陈静", org: "区域中心药房", result: "已提交", opinion: "—", time: "2026-10-30 11:00" },
          { node: "撤回", person: "陈静", org: "区域中心药房", result: "已撤回", opinion: "—", time: "2026-10-30 17:20" }
        ]
      }
    ];
  }

  /* ==========================================================================
     SC 命名空间
     ========================================================================== */
  var DATA_KEY = "SC_DATA";
  var DATA_VER = "v5";

  var AUDIT = {
    draft: "草稿",
    pending: "待审核",
    approved: "审核通过",
    rejected: "已拒绝"
  };

  /* ---------------- 数据 ---------------- */
  function load() {
    if (sessionStorage.getItem(DATA_KEY + "_V") !== DATA_VER) {
      sessionStorage.removeItem(DATA_KEY);
      sessionStorage.setItem(DATA_KEY + "_V", DATA_VER);
    }
    var raw = sessionStorage.getItem(DATA_KEY);
    var list = null;
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { list = null; }
    }
    if (!list) {
      list = JSON.parse(JSON.stringify(MOCK.stockChecks));
      list.forEach(fillItems);
      sessionStorage.setItem(DATA_KEY, JSON.stringify(list));
    } else {
      /* 兼容旧结构：补齐新增字段 */
      list.forEach(function (bill) {
        if (!bill.items || bill.items.length === 0) fillItems(bill);
        else bill.items.forEach(normalizeItem);
      });
      sessionStorage.setItem(DATA_KEY, JSON.stringify(list));
    }
    return list;
  }

  function save(list) { sessionStorage.setItem(DATA_KEY, JSON.stringify(list)); }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function persist(bill) {
    var all = load();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === bill.id) { all[i] = bill; save(all); return; }
    }
    all.unshift(bill);
    save(all);
  }

  /* 兼容旧明细行 */
  function normalizeItem(it) {
    if (it.countBox == null) it.countBox = it.bookQty;
    if (it.countSplit == null) it.countSplit = 0;
    if (it.stopQty == null) it.stopQty = 0;
    if (it.preReduce == null) it.preReduce = 0;
    if (it.factor == null) it.factor = it.splitFactor || 1;
    if (it.stop == null) it.stop = false;
  }

  /* ---------------- 生成明细：锁定该时间点的批次账面库存 ---------------- */
  function fillItems(bill) {
    var items = [];
    Object.keys(MOCK.batches).forEach(function (key) {
      MOCK.batches[key].forEach(function (b, bi) {
        if (b.drugKind !== bill.kind) return;
        items.push({
          key: key + "_" + bi,
          drugId: b.drugId, si: b.si,
          drugName: b.drugName, drugForm: b.drugForm, drugSpec: b.drugSpec,
          specCode: b.specCode, drugCategory: b.drugCategory,
          vendor: b.vendor, batchNo: b.batchNo, expDate: b.expDate,
          bookQty: b.stock,           /* 账面数量：整包装（盒）数 */
          countBox: b.stock,          /* 盘点数量：盒 */
          countSplit: 0,              /* 盘点数量：拆零散数 */
          stopQty: b.stopQty,         /* 停用数量：整盒 */
          preReduce: b.preReduce,     /* 预减数量：整盒 */
          purchase: b.purchase, retail: b.retail,
          unit: b.unit, splitUnit: b.splitUnit, factor: b.factor,
          minFactor: b.minFactor,
          stop: b.stop
        });
      });
    });
    bill.items = items;
  }

  /* ---------------- 登录态 ---------------- */
  function user() {
    var u = SEL.currentUser();
    if (u) return u;
    /* 未登录 → 记住来源页并去登录页选账号 */
    try { sessionStorage.setItem("SC_RETURN", location.pathname.split("/").pop() + location.search); } catch (e) {}
    location.href = "login.html";
    return null;
  }

  /* 退出登录：记住当前页，登录后自动回到本页（便于切换审核人账号） */
  function logout() {
    try { sessionStorage.setItem("SC_RETURN", location.pathname.split("/").pop() + location.search); } catch (e) {}
    SEL.logout();
  }

  /* ---------------- 单号：PD + yyyymmdd + 3位流水 ---------------- */
  function newCode(list) {
    var d = new Date();
    function p2(n) { return (n < 10 ? "0" : "") + n; }
    var prefix = "PD" + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate());
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

  /* ---------------- 数量计算 ---------------- */
  function money(n) { return (Math.round((Number(n) || 0) * 100) / 100).toFixed(2); }

  /* 盘点数量换算成「盒」数（含小数） */
  function countBoxes(it) {
    var factor = it.factor || 1;
    return (Number(it.countBox) || 0) + (Number(it.countSplit) || 0) / factor;
  }

  /* 盈亏：盒数差 + 散数差 */
  function diffOf(it) {
    var factor = it.factor || 1;
    var box = (Number(it.countBox) || 0) - (Number(it.bookQty) || 0);
    var split = Number(it.countSplit) || 0;
    return { box: box, split: split, pieces: box * factor + split };
  }

  /* 金额按「盒」计价 */
  function diffPurchase(it) { return money((diffOf(it).box + diffOf(it).split / (it.factor || 1)) * (it.purchase || 0)); }
  function diffRetail(it) { return money((diffOf(it).box + diffOf(it).split / (it.factor || 1)) * (it.retail || 0)); }

  function sums(bill) {
    var bookP = 0, bookR = 0, diffP = 0, diffR = 0;
    (bill.items || []).forEach(function (it) {
      var book = Number(it.bookQty) || 0;
      var diffBoxes = diffOf(it).box + diffOf(it).split / (it.factor || 1);
      bookP += book * (it.purchase || 0);
      bookR += book * (it.retail || 0);
      diffP += diffBoxes * (it.purchase || 0);
      diffR += diffBoxes * (it.retail || 0);
    });
    return {
      bookPurchase: money(bookP), bookRetail: money(bookR),
      diffPurchase: money(diffP), diffRetail: money(diffR)
    };
  }

  /* ---------------- 数量格式化 ---------------- */
  /* 整盒展示：320盒 */
  function fmtBoxes(boxes, unit) { return (Number(boxes) || 0) + (unit || "盒"); }

  /* 盈亏（带正负号）：+1盒8粒 / -2盒 / 0盒
     无需拆零的规格只按整包装展示（不再换算成散数） */
  function fmtDiff(pieces, factor, unit, splitUnit) {
    pieces = Number(pieces) || 0;
    var sign = pieces > 0 ? "+" : pieces < 0 ? "-" : "";
    var abs = Math.abs(pieces);
    var f = factor > 1 ? factor : 1;
    if (!splitUnit || f <= 1) {
      var q = Math.round((abs / f) * 100) / 100;
      return sign + q + (unit || "盒");
    }
    var b = Math.floor(abs / f);
    var r = abs % f;
    if (r === 0) return sign + b + unit;
    return sign + b + unit + r + splitUnit;
  }

  /* ---------------- 操作矩阵 ---------------- */
  function actionsFor(bill, u) {
    var isCreator = bill.creatorId === u.id;
    var isAuditor = isAuditorFlag(bill, u);
    var st = bill.auditStatus;
    var acts = [];
    if (st === "draft" || st === "rejected") {
      if (isCreator) acts.push("查看", "编辑", "提交", "删除");
      else acts.push("查看");
    } else if (st === "pending") {
      acts.push("查看");
      if (isCreator) acts.push("撤回");
      if (isAuditor) acts.push("审核");
    } else {
      acts.push("查看");
    }
    return acts;
  }

  /* 审核人判定：中心药房发起（陈静）→ 中心药房审核（赵敏）；
     成员机构发起 → 中心药房审核；村室发起 → 成员机构审核 */
  function isAuditor(bill, u) { return isAuditorFlag(bill, u); }

  function isAuditorFlag(bill, u) {
    var creatorRole = "center";
    for (var i = 0; i < MOCK.users.length; i++) {
      if (MOCK.users[i].id === bill.creatorId) { creatorRole = MOCK.users[i].role; break; }
    }
    if (creatorRole === "village") return u.role === "member";
    return u.role === "center";
  }

  window.SC = {
    AUDIT: AUDIT,
    ORGS: ORGS, PHARMACIES: PHARMACIES,
    load: load, save: save, byId: byId, persist: persist, fillItems: fillItems,
    user: user, logout: logout, newCode: newCode,
    money: money,
    countBoxes: countBoxes, diffOf: diffOf, diffPurchase: diffPurchase, diffRetail: diffRetail, sums: sums,
    fmtBoxes: fmtBoxes, fmtDiff: fmtDiff,
    actionsFor: actionsFor, isAuditor: isAuditor
  };
})();
