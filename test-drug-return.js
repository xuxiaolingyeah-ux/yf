/* 药品退货模块冒烟测试（jsdom，参考采购管理测试方式） */
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
let passed = 0, failed = 0;
function ok(cond, name) {
  if (cond) { passed++; console.log("  ✓ " + name); }
  else { failed++; console.log("  ✗ " + name); }
}

function loadDom(file, qs) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const dom = new JSDOM(html, {
    url: "file://" + path.join(ROOT, file) + (qs || ""),
    runScripts: "outside-only",
    pretendToBeVisual: true
  });
  const w = dom.window;
  /* sessionStorage / localStorage stub */
  const store = {};
  Object.defineProperty(w, "sessionStorage", {
    value: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    }
  });
  w.scrollTo = () => {};
  return dom;
}

function runScripts(dom, files) {
  const w = dom.window;
  for (const f of files) {
    const code = fs.readFileSync(path.join(ROOT, f), "utf8");
    w.eval(code);
  }
  /* 执行页面内联脚本 */
  Array.prototype.slice.call(w.document.querySelectorAll("script:not([src])")).forEach(function (s) {
    if (s.textContent.trim()) w.eval(s.textContent);
  });
}

console.log("== common.js 逻辑测试 ==");
{
  const dom = loadDom("drug-return.html");
  const w = dom.window;
  runScripts(dom, ["mock.js", "selection-common.js", "purchase-mgmt-common.js", "stock-in-common.js", "drug-return-common.js"]);
  const DR = w.DR, PC = w.PC, SI = w.SI, MOCK = w.MOCK;

  ok(!!DR, "DR 命名空间已挂载");
  ok(DR.newCode([]).indexOf("TH") === 0, "单号前缀 TH");

  const u = DR.user();
  ok(u && u.role === "center" && u.name === "赵敏", "默认登录人 = 中心药房·赵敏");

  /* 状态机 */
  const vdoc = { creatorRole: "village" }, mdoc = { creatorRole: "member" }, cdoc = { creatorRole: "center" };
  ok(DR.nextStatus(vdoc) === "member", "村室提交 → 成员机构审核");
  ok(DR.nextStatus(mdoc) === "center", "成员机构提交 → 中心药房审核");
  ok(DR.nextStatus(cdoc) === "platform", "中心药房提交 → 上级机构审核（不例外）");
  ok(DR.passStatus(cdoc) === "approved", "单级审核，通过即生效");

  /* canAudit */
  ok(DR.canAudit({ status: "member", creatorId: "x" }, { role: "member", id: "y" }), "成员机构可审村室单");
  ok(!DR.canAudit({ status: "member", creatorId: "x" }, { role: "member", id: "x" }), "创建人不能自审");
  ok(!DR.canAudit({ status: "platform", creatorId: "x" }, { role: "center", id: "y" }), "上级机构节点不接受中心药房审核");

  /* 种子数据 + 数据权限 */
  const seeds = DR.load();
  ok(seeds.length === 7, "种子退货单 7 条");
  ok(seeds.some(r => r.status === "platform"), "含中心药房发起·待上级审核的单据");
  const memberUser = { id: "u2", role: "member", org: "城东社区卫生服务中心" };
  const visible = seeds.filter(r => DR.inScope(r, memberUser));
  ok(visible.length === 6 && visible.every(r => r.creatorOrg !== "区域中心药房"), "成员机构可见本机构+下属村室（6 条），不可见中心药房单据");
  const villageUser = { id: "u1", role: "village", org: "青河村卫生室" };
  ok(seeds.filter(r => DR.inScope(r, villageUser)).every(r => r.creatorOrg === "青河村卫生室"), "村室仅可见本村室");

  /* 金额 */
  const s = DR.sums(seeds[0]);
  ok(Math.abs(s.purchase - (10 * 8.20 + 5 * 16.80)) < 1e-6, "进货价金额合计 = Σ(退货量×进货价)");
  ok(DR.fmtMoney(1234.5) === "¥1,234.50", "金额格式化");

  /* 入库单 + 库存行 */
  const villageBills = DR.inboundBills("village");
  ok(villageBills.every(b => b.status === "approved" && b.orgId === "o1"), "村室入库单均已审核通过且属本机构");
  const vRows = DR.stockRows("village");
  const amx = vRows.filter(r => r.drugCode === "1210500301" && r.batch === "20260101A")[0];
  ok(amx && amx.stock === 90, "库存量 = 入库合计 − 已生效退货量（100 − 10 = 90）");
  ok(amx.approvalNo === "国药准字H13023917", "库存行带批准文号");
  const cRows = DR.stockRows("center");
  ok(cRows.some(r => r.drugCode === "1210501601"), "中心药房库存行含阿托伐他汀（SI 已审核入库单）");
  ok(DR.returnedQty("village", "1210500301", "20260101A") === 10, "已生效退货量统计（排除草稿/已拒绝）");

  /* 供应商 */
  ok(DR.suppliersOn().every(s2 => s2.status === "on") && DR.suppliersOn().length >= 6, "供应商下拉仅含启用中档案");

  /* recordRows */
  const pending = seeds.filter(r => r.status === "member")[0];
  const rows = DR.recordRows(pending);
  ok(rows.some(r => r.result === "待审核" && r.node === "成员机构审核"), "待审核单展示未到节点");
}

console.log("== drug-return.html 列表页测试 ==");
{
  const dom = loadDom("drug-return.html");
  const w = dom.window;
  runScripts(dom, ["mock.js", "selection-common.js", "purchase-mgmt-common.js", "stock-in-common.js", "drug-return-common.js", "nav.js"]);
  const doc = w.document;
  ok(!!w.DR, "页面脚本执行完成");

  const rows = doc.querySelectorAll("#tbody tr");
  ok(rows.length === 7, "默认登录（中心药房）可见全部 7 条单据");

  const html = doc.getElementById("tbody").innerHTML;
  ok(html.indexOf("新增退货") === -1 && doc.getElementById("btnCreate"), "标题栏含「新增退货」按钮");
  ok(html.indexOf("待审核（上级机构）") >= 0, "中心药房发起单显示「待审核（上级机构）」");
  ok(html.indexOf("查看") >= 0, "操作列含查看");
  ok(html.indexOf("撤销") >= 0, "待审核单创建人显示「撤销」");
  ok(html.indexOf("TH20261111001") >= 0, "草稿单号渲染");
  ok(doc.getElementById("fSupplier").options.length > 1, "供应商筛选下拉已填充");
}

console.log("== drug-return-create.html 新增页测试 ==");
{
  const dom = loadDom("drug-return-create.html");
  const w = dom.window;
  runScripts(dom, ["mock.js", "selection-common.js", "purchase-mgmt-common.js", "stock-in-common.js", "drug-return-common.js", "nav.js"]);
  const doc = w.document;

  ok(doc.getElementById("fSupplier").options.length > 1, "供应商下拉（必填）已填充");
  ok(doc.getElementById("fSupplier").value === "", "新单供应商默认为空（必填校验生效）");
  ok(doc.getElementById("itemsBody").innerHTML.indexOf("暂未添加药品") >= 0, "空明细提示");
  ok(doc.getElementById("btnInBill"), "含「关联入库单代入」入口");
  ok(doc.getElementById("btnPick"), "含「添加药品」入口");
  ok(doc.getElementById("traceDrawer"), "含追溯码抽屉");
  ok(doc.getElementById("traceDrawer").textContent.indexOf("不强制与退货量相等") >= 0, "追溯码提示为「不强制」口径");
  ok(doc.getElementById("headCode").textContent.indexOf("TH") >= 0, "页面标题行展示 TH 单号");
}

console.log("== drug-return-detail.html 详情页测试 ==");
{
  const dom = loadDom("drug-return-detail.html", "?id=dr1");
  const w = dom.window;
  runScripts(dom, ["mock.js", "selection-common.js", "purchase-mgmt-common.js", "stock-in-common.js", "drug-return-common.js", "nav.js"]);
  const doc = w.document;

  ok(doc.getElementById("vCode").textContent === "TH20261109001", "详情展示退货单号");
  ok(doc.getElementById("vSupplier").textContent === "国药控股江苏有限公司", "详情展示供应商");
  ok(doc.getElementById("itemBody").children.length === 2, "明细 2 行");
  ok(doc.getElementById("recordBody").textContent.indexOf("成员机构审核") >= 0, "审批记录含成员机构审核节点");
  ok(doc.getElementById("vInBills").textContent.indexOf("RK") >= 0, "关联入库单号展示（RK 前缀）");
  ok(doc.getElementById("pageFoot").innerHTML === "", "非审核模式无审批区（查看）");
}

console.log("\n结果：" + passed + " 通过，" + failed + " 失败");
process.exit(failed ? 1 : 0);
