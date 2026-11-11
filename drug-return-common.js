/* ==========================================================================
   药品退货（退给供应商）：共享逻辑（DR 命名空间）
   依赖：mock.js（MOCK.users、MOCK.suppliers）、selection-common.js（SEL）、
        purchase-mgmt-common.js（PC：机构层级 / 数据权限 / 金额工具）、
        stock-in-common.js（SI：入库单数据，用于「关联入库单代入」）
   业务口径（2026-11-11 已确认，详见 docs/库存管理-药品退货-需求整理.md）：
     1) 药品退货 = 退给供应商，与「药品退库」（退其他机构）是两个流程，并存分开；
     2) 单号前缀 TH；「出库时间」列口径 = 退货申请提交时间；
     3) 关联入库单：仅限已审核通过，可关联多个；明细发票号默认取入库时录入的发票号；
     4) 追溯码：参考出库页录入方式（扫码 / 手工、格式 / 一致性 / 防重校验），
        但不强制追溯码数量与退货量相等，未录满也可提交审核；
     5) 审核链路：提交后由上一级机构审核（村室→成员机构；成员→中心药房；
        中心药房→上级机构〔区域医药监管平台·模拟，落点待定〕），中心药房发起不例外；
     6) 可见角色 C3（HIS 不可见）；数据权限按发起机构向上汇总（复用 PC.visibleOrgs / inScope）。
   库存口径（线稿演示）：本机构已审核通过入库单的批次数量合计 − 已生效退货量
     （已生效 = 状态为待审核 / 审核通过的本机构退货单），避免同一批次超退。
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "DR_RETURNS";
  var KEY_IN_EXTRA = "DR_IN_EXTRA";

  /* 展示状态（member / center / platform 统一显示为「待审核」，列表中带括号注明层级） */
  var STATUS = {
    draft: "草稿", member: "待审核", center: "待审核", platform: "待审核",
    approved: "审核通过", rejected: "已拒绝"
  };
  var STATUS_OPTIONS = [
    { v: "", t: "全部状态" },
    { v: "draft", t: "草稿" },
    { v: "audit", t: "待审核" },
    { v: "approved", t: "审核通过" },
    { v: "rejected", t: "已拒绝" }
  ];

  /* 流程节点：提交后由「上一级机构」审核（单级）。
     中心药房发起 → 上级机构审核（落点待定，线稿以区域医药监管平台模拟） */
  var FLOW = {
    village: [{ node: "成员机构审核", org: "城东社区卫生服务中心", person: "李强", role: "member" }],
    member: [{ node: "中心药房审核", org: "区域中心药房", person: "赵敏", role: "center" }],
    center: [{ node: "上级机构审核", org: "区域医药监管平台（模拟）", person: "平台审核员", role: "platform" }]
  };

  /* 角色 → 入库单机构 id（SI 数据源的 orgId） */
  var ROLE_ORG = { village: "o1", member: "o2", center: "o3" };

  /* ---------------- 数据 ---------------- */
  function load() {
    var raw = sessionStorage.getItem(KEY);
    var list = null;
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { list = null; }
    }
    if (!list) {
      list = JSON.parse(JSON.stringify(SEED));
      sessionStorage.setItem(KEY, JSON.stringify(list));
    }
    return list;
  }

  function save(list) { sessionStorage.setItem(KEY, JSON.stringify(list)); }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function persist(doc) {
    var all = load();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === doc.id) { all[i] = doc; save(all); return; }
    }
    all.push(doc);
    save(all);
  }

  /* ---------------- 单号：TH + yyyymmdd + 3 位流水 ---------------- */
  function newCode(list) {
    var d = new Date();
    function p2(n) { return (n < 10 ? "0" : "") + n; }
    var prefix = "TH" + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate());
    var max = 0;
    list.forEach(function (r) {
      if (r.code && r.code.slice(0, prefix.length) === prefix) {
        var n = parseInt(r.code.slice(prefix.length), 10);
        if (!isNaN(n) && n > max) max = n;
      }
    });
    var seq = String(max + 1);
    while (seq.length < 3) seq = "0" + seq;
    return prefix + seq;
  }

  /* ---------------- 登录态（未登录时以中心药房·赵敏演示） ---------------- */
  function user() { return PC.user(); }

  function isCreator(doc, u) { return doc.creatorId === u.id; }

  /* 登录人是否为该单据当前审核节点的人（上级机构节点线稿中无对应演示账号） */
  function canAudit(doc, u) {
    if (!u || u.id === doc.creatorId) return false;
    return (doc.status === "member" && u.role === "member") ||
      (doc.status === "center" && u.role === "center") ||
      (doc.status === "platform" && u.role === "platform");
  }

  function flowNodes(doc) { return FLOW[doc.creatorRole] || FLOW.village; }

  /* 提交后的下一个状态：一律进入上一级机构审核 */
  function nextStatus(doc) {
    if (doc.creatorRole === "village") return "member";
    if (doc.creatorRole === "member") return "center";
    return "platform";
  }

  /* 审核通过后的状态（单级审核，通过即生效） */
  function passStatus(doc) { return "approved"; }

  /* 审批记录行 = 已发生记录 + 未到节点（draft/rejected=未执行；待审核=待审核） */
  function recordRows(doc) {
    var rows = (doc.records || []).slice();
    if (doc.status === "approved") return rows;
    var nodes = flowNodes(doc);
    nodes.forEach(function (n) {
      var happened = rows.some(function (r) {
        return r.node === n.node && (r.result === "通过" || r.result === "拒绝");
      });
      if (happened) return;
      if (doc.status === "member" || doc.status === "center" || doc.status === "platform") {
        rows.push({ node: n.node, org: n.org, person: n.person, result: "待审核", opinion: "—", time: "—" });
      } else {
        rows.push({ node: n.node, org: "—", person: "—", result: "未执行", opinion: "—", time: "—" });
      }
    });
    return rows;
  }

  /* ---------------- 入库单（已审核通过）：SI 数据 + 补充演示数据 ---------------- */
  function siItem(code, batchIdx, qty, invoiceNo) {
    var d = SI.DRUGS.filter(function (x) { return x.code === code; })[0];
    var b = SI.BATCHES[code][batchIdx];
    return {
      name: d.name, code: d.code, spec: d.spec, packSpec: d.packSpec, vendor: d.vendor,
      approval: d.approval, factor: d.factor, packUnit: d.packUnit,
      insCode: d.insCode, insName: d.insName,
      batch: b.batch, expiry: b.expiry, purchase: b.purchase, retail: b.retail,
      qty: qty, unq: 0, reason: "", invoiceNo: invoiceNo || "", traces: []
    };
  }

  function inExtraSeed() {
    return [
      {
        id: "drx1", code: "RK20261105008", orgId: "o1", pharmacyId: "p11", location: "A 区药柜",
        method: "购货入库", supplier: "山东医药集团", accept: "外包装完好，数量核对无误",
        invoiceMode: "sum", invoiceNo: "INV20261105008", invoiceAmount: "1828.00", invoiceDate: "2026-11-05",
        creatorId: "u1", creatorName: "王芳", submitTime: "2026-11-05 09:30:12",
        status: "approved", auditorRole: "member", uploadStatus: "none",
        items: [siItem("1210500301", 0, 100), siItem("1210500501", 0, 60)],
        records: [
          { node: "提交", person: "王芳", org: "幸福村卫生室", time: "2026-11-05 09:30:12", result: "已提交", opinion: "" },
          { node: "审核", person: "李强", org: "城东社区卫生服务中心", time: "2026-11-05 14:02:36", result: "通过", opinion: "验收合格" }
        ]
      },
      {
        id: "drx2", code: "RK20261108009", orgId: "o2", pharmacyId: "p21", location: "货架一区",
        method: "购货入库", supplier: "华润医药商业集团上海有限公司", accept: "抽检合格",
        invoiceMode: "sum", invoiceNo: "INV20261108009", invoiceAmount: "4752.00", invoiceDate: "2026-11-08",
        creatorId: "u2", creatorName: "李强", submitTime: "2026-11-08 10:15:44",
        status: "approved", auditorRole: "center", uploadStatus: "none",
        items: [siItem("1210500901", 0, 120, "INV20261108091"), siItem("1210501201", 0, 90)],
        records: [
          { node: "提交", person: "李强", org: "城东社区卫生服务中心", time: "2026-11-08 10:15:44", result: "已提交", opinion: "" },
          { node: "审核", person: "赵敏", org: "区域中心药房", time: "2026-11-08 15:48:20", result: "通过", opinion: "" }
        ]
      }
    ];
  }

  function loadInExtra() {
    var raw = sessionStorage.getItem(KEY_IN_EXTRA);
    var list = null;
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { list = null; }
    }
    if (!list) {
      list = inExtraSeed();
      sessionStorage.setItem(KEY_IN_EXTRA, JSON.stringify(list));
    }
    return list;
  }

  /* 本机构已审核通过的入库单（可多个关联） */
  function inboundBills(role) {
    var orgId = ROLE_ORG[role];
    return SI.load().filter(function (b) { return b.status === "approved" && b.orgId === orgId; })
      .concat(loadInExtra().filter(function (b) { return b.orgId === orgId; }));
  }

  /* 已生效退货量（同批次）：待审核 / 审核通过的本机构退货单 */
  function returnedQty(role, code, batch) {
    var n = 0;
    load().forEach(function (doc) {
      if (doc.creatorRole !== role) return;
      if (doc.status === "draft" || doc.status === "rejected") return;
      (doc.items || []).forEach(function (it) {
        if (it.drugCode === code && it.batch === batch) n += Number(it.qty || 0);
      });
    });
    return n;
  }

  /* 本机构可退批次库存行（供选药弹窗 / 关联入库单代入） */
  function stockRows(role) {
    var m = {};
    inboundBills(role).forEach(function (b) {
      (b.items || []).forEach(function (it) {
        var k = it.code + "|" + it.batch;
        var row = m[k];
        if (!row) {
          row = m[k] = {
            key: k, drugCode: it.code, drugName: it.name, spec: it.spec, vendor: it.vendor,
            batch: it.batch, approvalNo: it.approval || "", unit: it.packUnit || "",
            purchase: it.purchase, retail: it.retail,
            invoiceNo: it.invoiceNo || b.invoiceNo || "", stock: 0
          };
        }
        row.stock += Number(it.qty || 0);
        if (!row.invoiceNo) row.invoiceNo = it.invoiceNo || b.invoiceNo || "";
      });
    });
    var arr = [];
    Object.keys(m).forEach(function (k) {
      m[k].stock = Math.max(0, m[k].stock - returnedQty(role, m[k].drugCode, m[k].batch));
      arr.push(m[k]);
    });
    return arr;
  }

  /* ---------------- 供应商（启用中） ---------------- */
  function suppliersOn() {
    return (MOCK.suppliers || []).filter(function (s) { return s.status === "on"; });
  }

  /* ---------------- 金额工具 ---------------- */
  function fmtMoney(n) { return PC.fmtMoney(n); }
  function num2(n) { return Number(n || 0).toFixed(2); }
  function purchaseAmt(it) { return Number(it.qty || 0) * Number(it.purchase || 0); }
  function retailAmt(it) { return Number(it.qty || 0) * Number(it.retail || 0); }
  function sums(doc) {
    var p = 0, r = 0;
    (doc.items || []).forEach(function (it) { p += purchaseAmt(it); r += retailAmt(it); });
    return { purchase: p, retail: r };
  }
  function isQty(v) { return PC.isQty(v); }

  /* ---------------- 种子数据 ---------------- */
  function it(key, drugCode, drugName, spec, vendor, batch, approvalNo, stock, unit, qty, purchase, retail, invoiceNo, traces) {
    return {
      key: key, drugCode: drugCode, drugName: drugName, spec: spec, vendor: vendor,
      batch: batch, approvalNo: approvalNo, stock: stock, unit: unit, qty: qty,
      purchase: purchase, retail: retail, invoiceNo: invoiceNo || "", traces: traces || []
    };
  }

  var SEED = [
    {
      id: "dr1", code: "TH20261109001", creatorRole: "village",
      creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
      supplier: "国药控股江苏有限公司", invoiceNo: "INV20261109012",
      desc: "近效期批次退回供应商处理。", createdAt: "2026-11-09 10:20",
      status: "approved", inIds: ["drx1"],
      items: [
        it("1210500301|20260101A", "1210500301", "阿莫西林胶囊", "0.25g×24粒", "华北制药股份有限公司", "20260101A", "国药准字H13023917", 100, "盒", 10, 8.20, 12.50, "", ["8100221109000001", "8100221109000002"]),
        it("1210500501|20260201A", "1210500501", "头孢克肟分散片", "0.1g×6片", "上海信谊药厂有限公司", "20260201A", "国药准字H31020315", 60, "盒", 5, 16.80, 24.60, "INV20261105008", [])
      ],
      records: [
        { node: "提交", org: "青河村卫生室", person: "王芳", result: "已提交", opinion: "—", time: "2026-11-09 10:20" },
        { node: "成员机构审核", org: "城东社区卫生服务中心", person: "李强", result: "通过", opinion: "近效期药品退供应商，同意。", time: "2026-11-09 15:12" }
      ]
    },
    {
      id: "dr2", code: "TH20261110002", creatorRole: "village",
      creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
      supplier: "华润医药商业集团上海有限公司", invoiceNo: "",
      desc: "运输破损，与供应商协商退回。", createdAt: "2026-11-10 14:35",
      status: "member", inIds: ["drx1"],
      items: [
        it("1210500501|20260201A", "1210500501", "头孢克肟分散片", "0.1g×6片", "上海信谊药厂有限公司", "20260201A", "国药准字H31020315", 60, "盒", 8, 16.80, 24.60, "INV20261105008", [])
      ],
      records: [
        { node: "提交", org: "青河村卫生室", person: "王芳", result: "已提交", opinion: "—", time: "2026-11-10 14:35" }
      ]
    },
    {
      id: "dr3", code: "TH20261110003", creatorRole: "member",
      creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
      supplier: "九州通医药集团股份有限公司", invoiceNo: "INV20261108091",
      desc: "包装印刷批次有误，按协议退回。", createdAt: "2026-11-10 16:12",
      status: "center", inIds: ["drx2"],
      items: [
        it("1210500901|20260301A", "1210500901", "奥美拉唑肠溶胶囊", "20mg×14粒", "常州四药制药有限公司", "20260301A", "国药准字H10950185", 120, "盒", 10, 24.00, 35.80, "INV20261108091", [])
      ],
      records: [
        { node: "提交", org: "城东社区卫生服务中心", person: "李强", result: "已提交", opinion: "—", time: "2026-11-10 16:12" }
      ]
    },
    {
      id: "dr4", code: "TH20261110004", creatorRole: "center",
      creatorId: "u3", creator: "赵敏", creatorOrg: "区域中心药房",
      supplier: "上海医药集团股份有限公司", invoiceNo: "",
      desc: "中心药房年度质量回退批次。", createdAt: "2026-11-10 17:40",
      status: "platform", inIds: ["b5"],
      items: [
        it("1210501601|20260208A", "1210501601", "阿托伐他汀钙片", "20mg×7片", "辉瑞制药有限公司", "20260208A", "国药准字H20051408", 350, "盒", 5, 26.50, 38.90, "INV20261031021", []),
        it("1210501201|20260310A", "1210501201", "硝苯地平控释片", "30mg×7片", "拜耳医药保健有限公司", "20260310A", "国药准字J20180015", 210, "盒", 8, 20.50, 29.80, "INV20261031022", [])
      ],
      records: [
        { node: "提交", org: "区域中心药房", person: "赵敏", result: "已提交", opinion: "—", time: "2026-11-10 17:40" }
      ]
    },
    {
      id: "dr5", code: "TH20261111001", creatorRole: "village",
      creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
      supplier: "国药控股江苏有限公司", invoiceNo: "",
      desc: "（草稿）退货量待与供应商确认后填写。",
      createdAt: "2026-11-11 09:05", status: "draft", inIds: [],
      items: [
        it("1210500301|20260101A", "1210500301", "阿莫西林胶囊", "0.25g×24粒", "华北制药股份有限公司", "20260101A", "国药准字H13023917", 100, "盒", "", 8.20, 12.50, "", [])
      ],
      records: []
    },
    {
      id: "dr6", code: "TH20261106002", creatorRole: "member",
      creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
      supplier: "华润医药商业集团上海有限公司", invoiceNo: "",
      desc: "零售价与配送单据不符，申请退回。",
      createdAt: "2026-11-06 11:00", status: "rejected", inIds: ["drx2"],
      items: [
        it("1210501201|20260310A", "1210501201", "硝苯地平控释片", "30mg×7片", "拜耳医药保健有限公司", "20260310A", "国药准字J20180015", 90, "盒", 15, 20.50, 29.80, "", [])
      ],
      records: [
        { node: "提交", org: "城东社区卫生服务中心", person: "李强", result: "已提交", opinion: "—", time: "2026-11-06 11:00" },
        { node: "中心药房审核", org: "区域中心药房", person: "赵敏", result: "拒绝", opinion: "退货原因与随货同行单不符，请补充凭证后重新提交。", time: "2026-11-06 15:20" }
      ]
    },
    {
      id: "dr7", code: "TH20261107003", creatorRole: "member",
      creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
      supplier: "九州通医药集团股份有限公司", invoiceNo: "",
      desc: "临床停止使用，整批退回。",
      createdAt: "2026-11-07 15:30", status: "approved", inIds: ["b6"],
      items: [
        it("1210501301|20260120A", "1210501301", "盐酸二甲双胍片", "0.5g×20片", "中美上海施贵宝制药有限公司", "20260120A", "国药准字H31020246", 60, "盒", 12, 10.20, 15.60, "", [])
      ],
      records: [
        { node: "提交", org: "城东社区卫生服务中心", person: "李强", result: "已提交", opinion: "—", time: "2026-11-07 15:30" },
        { node: "中心药房审核", org: "区域中心药房", person: "赵敏", result: "通过", opinion: "同意。", time: "2026-11-08 09:26" }
      ]
    }
  ];

  window.DR = {
    STATUS: STATUS, STATUS_OPTIONS: STATUS_OPTIONS, FLOW: FLOW,
    load: load, save: save, byId: byId, persist: persist, newCode: newCode,
    user: user, isCreator: isCreator, canAudit: canAudit,
    visibleOrgs: PC.visibleOrgs, inScope: PC.inScope,
    flowNodes: flowNodes, nextStatus: nextStatus, passStatus: passStatus,
    recordRows: recordRows,
    inboundBills: inboundBills, stockRows: stockRows, returnedQty: returnedQty,
    suppliersOn: suppliersOn,
    fmtMoney: fmtMoney, num2: num2, purchaseAmt: purchaseAmt, retailAmt: retailAmt,
    sums: sums, isQty: isQty
  };
})();
