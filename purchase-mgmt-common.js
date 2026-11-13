/* ==========================================================================
   采购管理（采购需求 / 采购计划 / 采购订单）：共享逻辑
   依赖：mock.js（MOCK.users、MOCK.drugs、MOCK.stockLevels、MOCK.drugKinds）、
        selection-common.js（SEL）
   审核链路：村室发起→成员机构审核→中心药房终审；成员机构发起→中心药房审核；
            中心药房发起→提交后自动生效（无需人工审核）
   ========================================================================== */
(function () {
  "use strict";

  var KEYS = { need: "PC_NEEDS", plan: "PC_PLANS", order: "PC_ORDERS", addr: "PC_ADDRESSES" };

  /* 展示状态（member/center 统一显示为「待审核」） */
  var STATUS = {
    draft: "草稿", member: "待审核", center: "待审核",
    approved: "审核通过", rejected: "已拒绝"
  };
  var STATUS_OPTIONS = [
    { v: "", t: "全部状态" },
    { v: "draft", t: "草稿" },
    { v: "audit", t: "待审核" },
    { v: "approved", t: "审核通过" },
    { v: "rejected", t: "已拒绝" }
  ];

  /* --------------------------------------------------------------------------
     订单明细状态字典（省医药采购平台 orderDetailState）
     各省字典不一致（部分省仅「待发货/已发货/已收货/已作废」），这里按本次对接省口径落地；
     如需换省，只改这份字典即可，页面不写死文案。
     -------------------------------------------------------------------------- */
  var ORDER_STATE = {
    0: "已保存待提交",
    1: "已提交待响应",
    2: "已响应待配送",
    3: "拒绝响应",
    4: "已配送待收货",
    5: "拒绝配送",
    6: "未及时配送",
    7: "收货中",
    8: "已收货",
    9: "已撤单"
  };

  /* 状态色：待办(4/7) 主色，完成(8) 绿，异常(3/5/6) 红，其余中性 */
  var ORDER_STATE_TONE = {
    0: "muted", 1: "muted", 2: "info",
    3: "danger", 4: "primary", 5: "danger", 6: "danger",
    7: "primary", 8: "success", 9: "muted"
  };

  function orderStateLabel(code) {
    var k = Number(code);
    return ORDER_STATE.hasOwnProperty(k) ? ORDER_STATE[k] : "—";
  }
  function orderStateTone(code) {
    var k = Number(code);
    return ORDER_STATE_TONE.hasOwnProperty(k) ? ORDER_STATE_TONE[k] : "muted";
  }
  /* 订单明细状态筛选项（按字典顺序） */
  function orderStateOptions() {
    return Object.keys(ORDER_STATE).map(function (k) {
      return { v: k, t: ORDER_STATE[k] + "（" + k + "）" };
    });
  }

  /* --------------------------------------------------------------------------
     配送明细（订单明细 1 : n 配送明细）
     一个订单明细可被供应商多次配送；每次配送独立记录发票、批号、有效期、
     配送/收货数量与时间。status 用于区分整单收货 / 部分收货 / 未收货，
     由「收货数量 vs 配送数量」推导，不单独存字段。
     -------------------------------------------------------------------------- */
  function shipmentsOf(item) { return (item && item.shipments) || []; }

  /* 配送进度汇总：配送次数 / 累计配送数量 / 累计收货数量 */
  function shipStats(item) {
    var list = shipmentsOf(item), qty = 0, recv = 0, waiting = 0;
    list.forEach(function (s) {
      var q = Number(s.qty) || 0, r = Number(s.recvQty) || 0;
      qty += q; recv += r;
      if (r < q) waiting++;
    });
    return { times: list.length, qty: qty, recv: recv, waiting: waiting };
  }

  /* 流程节点（未到节点展示用） */
  var FLOW = {
    village: [
      { node: "成员机构审核", org: "城东社区卫生服务中心", person: "李强", role: "member" },
      { node: "中心药房审核", org: "区域中心药房", person: "赵敏", role: "center" }
    ],
    member: [
      { node: "中心药房审核", org: "区域中心药房", person: "赵敏", role: "center" }
    ],
    center: []
  };

  /* 机构 → 可选库位 */
  var ORG_LOCS = {
    "青河村卫生室": [{ id: "loc-v1-A", name: "西药柜-A1" }, { id: "loc-v1-B", name: "中成药柜-B2" }],
    "城东社区卫生服务中心": [{ id: "loc-a1-1-A", name: "门诊区-A1" }, { id: "loc-a1-1-B", name: "门诊区-B2" }],
    "区域中心药房": [{ id: "loc-c1-A", name: "A区-01" }, { id: "loc-c1-B", name: "B区-03" }]
  };

  /* 机构层级：村室 → 成员机构 → 中心药房。数据权限按此向下汇总。 */
  var ORG_PARENT = {
    "青河村卫生室": "城东社区卫生服务中心",
    "河西村卫生室": "城东社区卫生服务中心",
    "城东社区卫生服务中心": "区域中心药房"
  };

  /* 当前登录人可见的机构范围：中心药房返回 null（不限制） */
  function visibleOrgs(u) {
    if (!u) return [];
    if (u.role === "center" || u.role === "pharmacist") return null;
    if (u.role === "member") {
      var arr = [u.org];
      Object.keys(ORG_PARENT).forEach(function (o) {
        if (ORG_PARENT[o] === u.org && arr.indexOf(o) < 0) arr.push(o);
      });
      return arr;
    }
    return [u.org]; /* 村室：仅本村室 */
  }

  /* 单据是否在当前登录人的数据权限内（按发起机构判断） */
  function inScope(doc, u) {
    var orgs = visibleOrgs(u);
    if (!orgs) return true;
    return orgs.indexOf(doc.creatorOrg) >= 0;
  }

  /* 订单可见性：按所关联采购计划的发起机构判断；未关联任何计划的订单仅中心药房可见 */
  function orderInScope(order, u) {
    var orgs = visibleOrgs(u);
    if (!orgs) return true;
    var plans = load("plan");
    var ids = order.planIds || [];
    for (var i = 0; i < ids.length; i++) {
      var p = byId(plans, ids[i]);
      if (p && orgs.indexOf(p.creatorOrg) >= 0) return true;
    }
    return false;
  }

  /* ---------------- 数据 ---------------- */
  function load(type) {
    var key = KEYS[type];
    var raw = sessionStorage.getItem(key);
    var list = null;
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { list = null; }
    }
    if (!list) {
      list = JSON.parse(JSON.stringify(SEED[type] || []));
      sessionStorage.setItem(key, JSON.stringify(list));
    }
    return list;
  }

  function save(type, list) {
    sessionStorage.setItem(KEYS[type], JSON.stringify(list));
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function persist(type, doc) {
    var all = load(type);
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === doc.id) { all[i] = doc; save(type, all); return; }
    }
    all.push(doc);
    save(type, all);
  }

  /* ---------------- 单号：XQ/JH + yyyymmdd + 3位流水 ---------------- */
  function newCode(type, list) {
    var d = new Date();
    function p2(n) { return (n < 10 ? "0" : "") + n; }
    var prefix = (type === "plan" ? "JH" : "XQ") +
      d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate());
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

  /* ---------------- 登录态（未登录时以中心药房·赵敏演示） ---------------- */
  function user() {
    var u = SEL.currentUser();
    if (u) return u;
    for (var i = 0; i < MOCK.users.length; i++) {
      if (MOCK.users[i].role === "center") {
        var c = MOCK.users[i];
        u = { id: c.id, account: c.account, name: c.name, org: c.org, role: c.role, roleName: c.roleName };
        SEL.login(u);
        return u;
      }
    }
    return null;
  }

  function isCreator(doc, u) { return doc.creatorId === u.id; }

  /* 登录人是否为该单据当前审核节点的人 */
  function canAudit(doc, u) {
    return (doc.status === "member" && u.role === "member") ||
      (doc.status === "center" && u.role === "center");
  }

  function flowNodes(doc) { return FLOW[doc.creatorRole] || FLOW.village; }

  /* 提交后的下一个状态 */
  function nextStatus(doc) {
    if (doc.creatorRole === "village") return "member";
    if (doc.creatorRole === "member") return "center";
    return "approved";
  }

  /* 审核通过后的下一个状态 */
  function passStatus(doc) {
    return doc.status === "member" ? "center" : "approved";
  }

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
      if (doc.status === "member" || doc.status === "center") {
        rows.push({ node: n.node, org: n.org, person: n.person, result: "待审核", opinion: "—", time: "—" });
      } else {
        rows.push({ node: n.node, org: "—", person: "—", result: "未执行", opinion: "—", time: "—" });
      }
    });
    return rows;
  }

  /* ---------------- 药品规格行（带库存 / 高低储） ---------------- */
  function specRows() {
    var rows = [];
    MOCK.drugs.forEach(function (d) {
      (d.specs || []).forEach(function (s, si) {
        if (s.status === "off") return;
        var lv = MOCK.stockLevels[d.id + "_" + si] || { stock: 0, upper: 0, lower: 0, unit: "" };
        (s.vendors || []).forEach(function (v, vi) {
          rows.push({
            key: d.id + "_" + si + "_" + vi,
            drugCode: s.code || d.code,
            drugName: d.name,
            spec: s.title,
            pkgSpec: s.pkgSpec || "",
            vendor: v.name,
            kind: d.kind,
            essential: !!(d.marks && d.marks.essential),
            stock: lv.stock, upper: lv.upper, lower: lv.lower, unit: lv.unit
          });
        });
      });
    });
    return rows;
  }

  function locsFor(org) { return ORG_LOCS[org] || []; }

  /* ---------------- 配送地址（按机构维护：可多条 + 唯一默认） ---------------- */
  function addressesOf(org) {
    return load("addr").filter(function (a) { return a.org === org; })
      .sort(function (x, y) { return (y.isDefault ? 1 : 0) - (x.isDefault ? 1 : 0); });
  }
  function defaultAddress(org) {
    var list = addressesOf(org);
    for (var i = 0; i < list.length; i++) if (list[i].isDefault) return list[i];
    return list[0] || null;
  }
  function addrFull(a) {
    if (!a) return "";
    if (a.address) return a.address;                 /* v1.3 起：单文本地址 */
    /* 兼容旧四级地址数据 */
    var region = [a.province, a.city, a.district, a.town].filter(Boolean).join("");
    return region + (a.detail ? " " + a.detail : "");
  }
  /* 地址一行展示（与 addrFull 一致，保留函数以便扩展） */
  function addrLine(a) {
    return a ? addrFull(a) : "";
  }
  /* 写回某机构地址列表（全量中剔除该机构后合并，避免覆盖其他机构） */
  function setAddresses(org, list) {
    var all = load("addr").filter(function (a) { return a.org !== org; });
    save("addr", all.concat(list));
  }

  /* ---------------- 金额工具 ---------------- */
  function fmtMoney(n) {
    var v = Math.round((Number(n) || 0) * 100) / 100;
    var s = v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "¥" + s;
  }

  function planTotal(items) {
    var t = 0;
    (items || []).forEach(function (it) { t += (Number(it.qty) || 0) * (Number(it.price) || 0); });
    return t;
  }

  function planEssentialRatio(items) {
    var all = planTotal(items), es = 0;
    (items || []).forEach(function (it) {
      if (it.essential) es += (Number(it.qty) || 0) * (Number(it.price) || 0);
    });
    if (!all) return "0%";
    return (Math.round(es / all * 1000) / 10).toFixed(1) + "%";
  }

  function isQty(v) {
    return /^\d+$/.test(String(v).trim()) && parseInt(v, 10) > 0;
  }
  /* 从规格标题提取最小包装单位，如 "0.25g * 24粒/盒" → "盒"（items 缺 unit 字段时兜底） */
  function unitOfSpec(spec) {
    var m = /\/\s*([^/]+?)\s*$/.exec(String(spec || "").trim());
    return m ? m[1] : "";
  }
  function isPrice(v) {
    var n = Number(v);
    return isFinite(n) && n > 0 && /^\d+(\.\d{1,2})?$/.test(String(v).trim());
  }

  /* ---------------- 种子数据 ---------------- */
  var SEED = {
    need: [
      {
        id: "n1", code: "XQ20261030001", creatorRole: "village",
        creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
        loc: "西药柜-A1", desc: "补充感冒类常用药，库存已接近下限。",
        createdAt: "2026-10-30 09:15", status: "approved", linkedPlanIds: [],
        items: [
          { key: "d1_0_0", drugCode: "1010400101", drugName: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", vendor: "华北制药股份有限公司", qty: 100, stock: 180, upper: 100, lower: 20, unit: "盒" },
          { key: "d6_0_0", drugCode: "1010400601", drugName: "布洛芬缓释胶囊", spec: "0.3g * 20粒/盒", vendor: "中美天津史克制药有限公司", qty: 60, stock: 950, upper: 300, lower: 80, unit: "盒" }
        ],
        records: [
          { node: "提交", org: "青河村卫生室", person: "王芳", result: "已提交", opinion: "—", time: "2026-10-30 09:15" },
          { node: "成员机构审核", org: "城东社区卫生服务中心", person: "李强", result: "通过", opinion: "同意补充。", time: "2026-10-30 15:40" },
          { node: "中心药房审核", org: "区域中心药房", person: "赵敏", result: "通过", opinion: "同意。", time: "2026-10-31 09:02" }
        ]
      },
      {
        id: "n2", code: "XQ20261102002", creatorRole: "village",
        creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
        loc: "中成药柜-B2", desc: "呼吸类中成药季节性备货。",
        createdAt: "2026-11-02 14:20", status: "approved", linkedPlanIds: [],
        items: [
          { key: "d7_0_0", drugCode: "1010400701", drugName: "连花清瘟胶囊", spec: "0.35g * 24粒/盒", vendor: "石家庄以岭药业股份有限公司", qty: 80, stock: 910, upper: 400, lower: 100, unit: "盒" }
        ],
        records: [
          { node: "提交", org: "青河村卫生室", person: "王芳", result: "已提交", opinion: "—", time: "2026-11-02 14:20" },
          { node: "成员机构审核", org: "城东社区卫生服务中心", person: "李强", result: "通过", opinion: "—", time: "2026-11-02 16:05" },
          { node: "中心药房审核", org: "区域中心药房", person: "赵敏", result: "通过", opinion: "—", time: "2026-11-03 10:22" }
        ]
      },
      {
        id: "n3", code: "XQ20261104003", creatorRole: "member",
        creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
        loc: "门诊区-A1", desc: "门诊呼吸道用药周转补充。",
        createdAt: "2026-11-04 10:05", status: "approved", linkedPlanIds: [],
        items: [
          { key: "d3_0_0", drugCode: "1010400301", drugName: "阿莫西林克拉维酸钾片", spec: "0.375g * 10片/盒", vendor: "珠海联邦制药股份有限公司中山分公司", qty: 50, stock: 15, upper: 20, lower: 5, unit: "盒" },
          { key: "d5_0_0", drugCode: "1010400501", drugName: "头孢呋辛酯片", spec: "0.25g * 12片/盒", vendor: "国药集团致君（深圳）制药有限公司", qty: 40, stock: 435, upper: 80, lower: 15, unit: "盒" }
        ],
        records: [
          { node: "提交", org: "城东社区卫生服务中心", person: "李强", result: "已提交", opinion: "—", time: "2026-11-04 10:05" },
          { node: "中心药房审核", org: "区域中心药房", person: "赵敏", result: "通过", opinion: "同意。", time: "2026-11-04 11:30" }
        ]
      },
      {
        id: "n4", code: "XQ20261106001", creatorRole: "member",
        creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
        loc: "门诊区-B2", desc: "",
        createdAt: "2026-11-06 09:40", status: "center", linkedPlanIds: [],
        items: [
          { key: "d8_0_0", drugCode: "1010400801", drugName: "金银花颗粒", spec: "10g * 20袋/盒", vendor: "诚辉医药有限公司", qty: 120, stock: 25, upper: 80, lower: 15, unit: "袋" }
        ],
        records: [
          { node: "提交", org: "城东社区卫生服务中心", person: "李强", result: "已提交", opinion: "—", time: "2026-11-06 09:40" }
        ]
      },
      {
        id: "n5", code: "XQ20261107001", creatorRole: "village",
        creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
        loc: "西药柜-A1", desc: "紧急补货，库存已为零。",
        createdAt: "2026-11-07 08:50", status: "member", linkedPlanIds: [],
        items: [
          { key: "d2_1_0", drugCode: "1010400202", drugName: "阿莫西林胶囊", spec: "0.5g * 24粒/盒", vendor: "山东鲁抗医药股份有限公司", qty: 30, stock: 0, upper: 30, lower: 5, unit: "盒" }
        ],
        records: [
          { node: "提交", org: "青河村卫生室", person: "王芳", result: "已提交", opinion: "—", time: "2026-11-07 08:50" }
        ]
      },
      {
        id: "n6", code: "XQ20261108001", creatorRole: "village",
        creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
        loc: "西药柜-A1", desc: "（草稿）消化类药品待补充完整后提交。",
        createdAt: "2026-11-08 10:12", status: "draft", linkedPlanIds: [],
        items: [
          { key: "d9_0_0", drugCode: "1010400901", drugName: "奥美拉唑肠溶胶囊", spec: "20mg * 14粒/盒", vendor: "华北制药股份有限公司", qty: "", stock: 26, upper: 30, lower: 5, unit: "盒" }
        ],
        records: []
      },
      {
        id: "n7", code: "XQ20261101004", creatorRole: "member",
        creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
        loc: "门诊区-A1", desc: "疫苗类采购（已驳回：需走免疫规划渠道）。",
        createdAt: "2026-11-01 15:30", status: "rejected", linkedPlanIds: [],
        items: [
          { key: "d4_0_0", drugCode: "1010400401", drugName: "流感病毒疫苗", spec: "0.5ml/支", vendor: "先声药业有限公司", qty: 20, stock: 0, upper: 15, lower: 3, unit: "支" }
        ],
        records: [
          { node: "提交", org: "城东社区卫生服务中心", person: "李强", result: "已提交", opinion: "—", time: "2026-11-01 15:30" },
          { node: "中心药房审核", org: "区域中心药房", person: "赵敏", result: "拒绝", opinion: "疫苗需走免疫规划渠道，不走药品采购。", time: "2026-11-01 17:10" }
        ]
      },
      {
        id: "n8", code: "XQ20261105001", creatorRole: "center",
        creatorId: "u3", creator: "赵敏", creatorOrg: "区域中心药房",
        loc: "A区-01", desc: "中心药房自备库存补充（已生成采购计划）。",
        createdAt: "2026-11-05 10:20", status: "approved", linkedPlanIds: ["p1"],
        items: [
          { key: "d1_0_0", drugCode: "1010400101", drugName: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", vendor: "华北制药股份有限公司", qty: 200, stock: 64, upper: 300, lower: 50, unit: "盒" },
          { key: "d6_0_0", drugCode: "1010400601", drugName: "布洛芬缓释胶囊", spec: "0.3g * 20粒/盒", vendor: "中美天津史克制药有限公司", qty: 100, stock: 38, upper: 160, lower: 30, unit: "盒" }
        ],
        records: [
          { node: "提交", org: "区域中心药房", person: "赵敏", result: "已提交", opinion: "—", time: "2026-11-05 10:20" },
          { node: "中心药房审核", org: "区域中心药房", person: "赵敏", result: "通过", opinion: "中心药房发起，提交后自动生效。", time: "2026-11-05 10:20" }
        ]
      }
    ],

    plan: [
      {
        id: "p1", code: "JH20261104001", creatorRole: "center",
        creatorId: "u3", creator: "赵敏", creatorOrg: "区域中心药房",
        loc: "A区-01", desc: "中心药房 11 月常规采购计划。",
        addressId: "ad1", address: "山东省济南市历下区文化东路街道文化西路107号 中心药房收货区",
        createdAt: "2026-11-04 14:00", status: "approved", linkedNeedIds: [],
        items: [
          { key: "d1_0_0", drugCode: "1010400101", drugName: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", vendor: "华北制药股份有限公司", essential: true, qty: 200, price: "6.80", unit: "盒" },
          { key: "d6_0_0", drugCode: "1010400601", drugName: "布洛芬缓释胶囊", spec: "0.3g * 20粒/盒", vendor: "中美天津史克制药有限公司", essential: true, qty: 100, price: "7.50", unit: "盒" }
        ],
        records: [
          { node: "提交", org: "区域中心药房", person: "赵敏", result: "已提交", opinion: "—", time: "2026-11-04 14:00" },
          { node: "中心药房审核", org: "区域中心药房", person: "赵敏", result: "通过", opinion: "中心药房发起，提交后自动生效。", time: "2026-11-04 14:00" }
        ]
      },
      {
        id: "p5", code: "JH20261106002", creatorRole: "center",
        creatorId: "u3", creator: "赵敏", creatorOrg: "区域中心药房",
        loc: "A区-01", desc: "慢病用药季度备货计划。",
        addressId: "ad1", address: "山东省济南市历下区文化东路街道文化西路107号 中心药房收货区",
        createdAt: "2026-11-06 09:30", status: "approved", linkedNeedIds: [],
        items: [
          { key: "d2_0_0", drugCode: "1010400201", drugName: "苯磺酸氨氯地平片", spec: "5mg * 28片/盒", vendor: "辉瑞制药有限公司", essential: true, qty: 120, price: "15.40" },
          { key: "d5_0_0", drugCode: "1010400501", drugName: "头孢呋辛酯片", spec: "0.25g * 12片/盒", vendor: "国药集团致君（深圳）制药有限公司", essential: false, qty: 50, price: "18.60" }
        ],
        records: [
          { node: "提交", org: "区域中心药房", person: "赵敏", result: "已提交", opinion: "—", time: "2026-11-06 09:30" },
          { node: "中心药房审核", org: "区域中心药房", person: "赵敏", result: "通过", opinion: "中心药房发起，提交后自动生效。", time: "2026-11-06 09:30" }
        ]
      },
      {
        id: "p2", code: "JH20261107002", creatorRole: "member",
        creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
        loc: "门诊区-A1", desc: "关联村室采购需求编制计划。",
        addressId: "ad3", address: "山东省济南市历下区姚家街道城东路12号 门诊楼一层药库",
        createdAt: "2026-11-07 11:20", status: "center", linkedNeedIds: ["n1"],
        items: [
          { key: "d1_0_0", drugCode: "1010400101", drugName: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", vendor: "华北制药股份有限公司", essential: true, qty: 150, price: "6.95" },
          { key: "d7_0_0", drugCode: "1010400701", drugName: "连花清瘟胶囊", spec: "0.35g * 24粒/盒", vendor: "石家庄以岭药业股份有限公司", essential: true, qty: 80, price: "11.20" }
        ],
        records: [
          { node: "提交", org: "城东社区卫生服务中心", person: "李强", result: "已提交", opinion: "—", time: "2026-11-07 11:20" }
        ]
      },
      {
        id: "p3", code: "JH20261108003", creatorRole: "center",
        creatorId: "u3", creator: "赵敏", creatorOrg: "区域中心药房",
        loc: "B区-03", desc: "（草稿）待补充单价后提交。",
        createdAt: "2026-11-08 15:45", status: "draft", linkedNeedIds: ["n1", "n2"],
        items: [
          { key: "d1_0_0", drugCode: "1010400101", drugName: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", vendor: "华北制药股份有限公司", essential: true, qty: 250, price: "" },
          { key: "d7_0_0", drugCode: "1010400701", drugName: "连花清瘟胶囊", spec: "0.35g * 24粒/盒", vendor: "石家庄以岭药业股份有限公司", essential: true, qty: 80, price: "" }
        ],
        records: []
      },
      {
        id: "p4", code: "JH20261103001", creatorRole: "member",
        creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
        loc: "门诊区-B2", desc: "（已拒绝）单价与省平台挂网价偏差过大。",
        addressId: "ad3", address: "山东省济南市历下区姚家街道城东路12号 门诊楼一层药库",
        createdAt: "2026-11-03 10:10", status: "rejected", linkedNeedIds: [],
        items: [
          { key: "d5_0_0", drugCode: "1010400501", drugName: "头孢呋辛酯片", spec: "0.25g * 12片/盒", vendor: "国药集团致君（深圳）制药有限公司", essential: false, qty: 60, price: "18.60" }
        ],
        records: [
          { node: "提交", org: "城东社区卫生服务中心", person: "李强", result: "已提交", opinion: "—", time: "2026-11-03 10:10" },
          { node: "中心药房审核", org: "区域中心药房", person: "赵敏", result: "拒绝", opinion: "单价与省平台挂网价偏差过大，请核实后重新编制。", time: "2026-11-03 14:25" }
        ]
      }
    ],

    order: [
      {
        id: "o1", code: "PROV202611010001",
        submitTime: "2026-11-01 08:30", syncAt: "2026-11-01 09:05",
        planIds: ["p1"],
        items: [
          {
            detailId: "PROV202611010001-01", drugName: "阿莫西林胶囊", spec: "0.25g * 24粒/盒",
            vendor: "华北制药股份有限公司", qty: 200, price: "6.80", state: 8, addressId: "ad1",
            responseTime: "2026-11-01 10:12", responseReason: "",
            shipments: [
              {
                shipId: "PS20261102001", price: "6.80", invoiceNo: "3700241188", invoiceCode: "3700221140",
                batchNo: "A251018", expiry: "2028-09-30", qty: 120,
                shipTime: "2026-11-02 14:20", recvQty: 120, recvTime: "2026-11-03 09:15"
              },
              {
                shipId: "PS20261105002", price: "6.80", invoiceNo: "3700242013", invoiceCode: "3700221140",
                batchNo: "A251102", expiry: "2028-10-31", qty: 80,
                shipTime: "2026-11-05 10:05", recvQty: 80, recvTime: "2026-11-06 08:40"
              }
            ]
          },
          {
            detailId: "PROV202611010001-02", drugName: "布洛芬缓释胶囊", spec: "0.3g * 20粒/盒",
            vendor: "中美天津史克制药有限公司", qty: 100, price: "7.50", state: 8, addressId: "ad1",
            responseTime: "2026-11-01 10:30", responseReason: "",
            shipments: [
              {
                shipId: "PS20261103003", price: "7.50", invoiceNo: "3700241190", invoiceCode: "3700221140",
                batchNo: "B251020", expiry: "2029-03-31", qty: 100,
                shipTime: "2026-11-03 15:40", recvQty: 100, recvTime: "2026-11-04 09:05"
              }
            ]
          }
        ]
      },
      {
        id: "o2", code: "PROV202611060002",
        submitTime: "2026-11-06 09:10", syncAt: "2026-11-06 09:40",
        planIds: [],
        items: [
          {
            detailId: "PROV202611060002-01", drugName: "苯磺酸氨氯地平片", spec: "5mg * 28片/盒",
            vendor: "辉瑞制药有限公司", qty: 120, price: "15.40", state: 8, addressId: "ad1",
            responseTime: "2026-11-06 11:00", responseReason: "",
            shipments: [
              {
                shipId: "PS20261107004", price: "15.40", invoiceNo: "3700242201", invoiceCode: "3700221195",
                batchNo: "C250915", expiry: "2028-08-31", qty: 120,
                shipTime: "2026-11-07 09:30", recvQty: 120, recvTime: "2026-11-08 10:20"
              }
            ]
          },
          {
            detailId: "PROV202611060002-02", drugName: "头孢呋辛酯片", spec: "0.25g * 12片/盒",
            vendor: "国药集团致君（深圳）制药有限公司", qty: 50, price: "18.60", state: 7, addressId: "ad1",
            responseTime: "2026-11-06 11:20", responseReason: "",
            shipments: [
              {
                shipId: "PS20261109005", price: "18.60", invoiceNo: "3700242305", invoiceCode: "3700221195",
                batchNo: "D250801", expiry: "2027-07-31", qty: 30,
                shipTime: "2026-11-09 14:10", recvQty: 30, recvTime: "2026-11-10 09:30"
              },
              {
                shipId: "PS20261111006", price: "18.60", invoiceNo: "3700242388", invoiceCode: "3700221195",
                batchNo: "D250805", expiry: "2027-07-31", qty: 20,
                shipTime: "2026-11-11 10:40", recvQty: 12, recvTime: ""
              }
            ]
          },
          {
            detailId: "PROV202611060002-03", drugName: "连花清瘟胶囊", spec: "0.35g * 24粒/盒",
            vendor: "石家庄以岭药业股份有限公司", qty: 80, price: "11.20", state: 4, addressId: "ad1",
            responseTime: "2026-11-07 09:00", responseReason: "",
            shipments: [
              {
                shipId: "PS20261111007", price: "11.20", invoiceNo: "3700242402", invoiceCode: "3700221207",
                batchNo: "E251020", expiry: "2028-04-30", qty: 80,
                shipTime: "2026-11-11 16:20", recvQty: "", recvTime: ""
              }
            ]
          },
          {
            detailId: "PROV202611060002-04", drugName: "阿莫西林胶囊", spec: "0.25g * 24粒/盒",
            vendor: "华北制药股份有限公司", qty: 60, price: "6.95", state: 5, addressId: "ad1",
            responseTime: "2026-11-08 09:15",
            responseReason: "该规格厂家产能不足，无法按约定时间配送，建议改由其他厂家供货。",
            shipments: []
          }
        ]
      },
      {
        id: "o3", code: "PROV202611080003",
        submitTime: "2026-11-08 16:00", syncAt: "2026-11-08 16:20",
        planIds: [],
        items: [
          {
            detailId: "PROV202611080003-01", drugName: "奥美拉唑肠溶胶囊", spec: "20mg * 14粒/盒",
            vendor: "华北制药股份有限公司", qty: 60, price: "12.00", state: 1, addressId: "ad2",
            responseTime: "", responseReason: "", shipments: []
          },
          {
            detailId: "PROV202611080003-02", drugName: "金银花颗粒", spec: "10g * 20袋/盒",
            vendor: "诚辉医药有限公司", qty: 120, price: "9.80", state: 6, addressId: "ad2",
            responseTime: "2026-11-09 08:40",
            responseReason: "已响应但未在承诺时限内送达，平台自动置为未及时配送。",
            shipments: []
          }
        ]
      }
    ],

    /* 配送地址库：按机构隔离，每个机构最多一条默认地址 */
    addr: [
      { id: "ad1", org: "区域中心药房", address: "山东省济南市历下区文化东路街道文化西路107号 中心药房收货区", isDefault: true },
      { id: "ad2", org: "区域中心药房", address: "山东省济南市历城区洪家楼街道经十路东段 东院区药库", isDefault: false },
      { id: "ad3", org: "城东社区卫生服务中心", address: "山东省济南市历下区姚家街道城东路12号 门诊楼一层药库", isDefault: true },
      { id: "ad4", org: "青河村卫生室", address: "山东省济南市历下区文化东路街道 青河村卫生室西药房", isDefault: true }
    ]
  };

  window.PC = {
    STATUS: STATUS, STATUS_OPTIONS: STATUS_OPTIONS,
    ORDER_STATE: ORDER_STATE, ORDER_STATE_TONE: ORDER_STATE_TONE,
    orderStateLabel: orderStateLabel, orderStateTone: orderStateTone, orderStateOptions: orderStateOptions,
    shipmentsOf: shipmentsOf, shipStats: shipStats,
    addressesOf: addressesOf, defaultAddress: defaultAddress, addrFull: addrFull, addrLine: addrLine,
    setAddresses: setAddresses,
    load: load, save: save, byId: byId, persist: persist,
    newCode: newCode,
    user: user, isCreator: isCreator, canAudit: canAudit,
    visibleOrgs: visibleOrgs, inScope: inScope, orderInScope: orderInScope,
    flowNodes: flowNodes, nextStatus: nextStatus, passStatus: passStatus,
    recordRows: recordRows,
    specRows: specRows, locsFor: locsFor,
    fmtMoney: fmtMoney, planTotal: planTotal, planEssentialRatio: planEssentialRatio,
    isQty: isQty, isPrice: isPrice, unitOfSpec: unitOfSpec
  };
})();
