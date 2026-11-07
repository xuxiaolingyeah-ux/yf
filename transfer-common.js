/* ==========================================================================
   调拨管理：共享逻辑（数据 / 状态机 / 权限 / 追溯码 / 单号 / 审核页渲染）
   依赖：mock.js（MOCK.users、MOCK.transfers、MOCK.drugs、MOCK.batches）
        selection-common.js（SEL）
   ========================================================================== */
(function () {
  "use strict";

  var DATA_KEY = "TRANSFER_DATA";

  var AUDIT = {
    draft: "草稿",
    member: "待成员机构审核",
    center: "待中心药房审核",
    approved: "审核通过",
    rejected: "已拒绝"
  };

  var TRANSFER = { out: "待调拨", in: "待签收", done: "已完成" };

  var ORGS = {
    "village-1": "青河村卫生室",
    "member-1": "城东社区卫生服务中心",
    "org-c": "区域中心药房"
  };

  var BAD_REASONS = ["包装不合格", "外观质量不合格", "内在质量不合格"];

  /* ---------------- 基础数据 ---------------- */
  function load() {
    var raw = sessionStorage.getItem(DATA_KEY);
    var list = null;
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { list = null; }
    }
    if (!list) {
      list = JSON.parse(JSON.stringify(MOCK.transfers || []));
      list.push(extraSeed());
      normalize(list);
      sessionStorage.setItem(DATA_KEY, JSON.stringify(list));
    }
    return list;
  }

  function save(list) {
    sessionStorage.setItem(DATA_KEY, JSON.stringify(list));
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function persist(bill) {
    var all = load();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === bill.id) { all[i] = bill; save(all); return; }
    }
    all.push(bill);
    save(all);
  }

  /* 旧种子兼容：中文调拨状态 → 内部键；补齐申请机构 / 规格下标 / 提交时间 */
  function normalize(list) {
    list.forEach(function (b) {
      if (b.transferStatus === "待调拨") b.transferStatus = "out";
      if (b.transferStatus === "待签收") b.transferStatus = "in";
      if (b.transferStatus === "已完成") b.transferStatus = "done";
      if (!b.transferStatus) b.transferStatus = "";

      b.applyOrg = b.applyOrg || (b.createType === "village" ? "village-1" : "member-1");
      b.applyOrgName = b.applyOrgName || ORGS[b.applyOrg] || b.creatorOrg || "";
      if (b.outOrg) b.outOrgName = b.outOrgName || ORGS[b.outOrg] || "";
      b.submitTime = b.submitTime || (b.auditStatus === "draft" ? "" : b.createdAt);
      b.deleted = !!b.deleted;

      (b.items || []).forEach(function (it) {
        if (it.si === undefined || it.si === null) it.si = findSi(it);
        if (it.specCode === undefined) {
          var d = drugOf(it.drugId);
          it.specCode = d && d.specs[it.si] ? d.specs[it.si].code : "";
        }
        if (it.stock === undefined) it.stock = orgStock(b.applyOrg, it.drugId, it.si);
      });

      b.batches = b.batches || [];
      b.batches.forEach(function (g) {
        if (g.si === undefined || g.si === null) g.si = findSi(g);
        (g.rows || []).forEach(function (r) {
          if (!r.traceCodes || !r.traceCodes.length) {
            r.traceCodes = codesFor(g.drugId, g.si, r.batchNo, r.outQty || 0);
          }
          if (b.transferStatus === "done") {
            if (r.inQty === undefined) r.inQty = r.outQty;
            if (r.badQty === undefined) r.badQty = 0;
            if (!r.badCodes) r.badCodes = [];
            if (!r.badReason) r.badReason = "";
          }
        });
      });

      b.records = b.records || [];

      /* 旧种子缺出/入库时间：已有单据号时按提交时间兜底，避免详情页展示「—」 */
      if (b.outCode && !b.outTime) b.outTime = b.submitTime || b.createdAt || "";
      if (b.inCode && !b.inTime) b.inTime = b.outTime || b.submitTime || b.createdAt || "";
    });
    return list;
  }

  /* 补一条「审核通过 · 待调拨（中心药房出库）」，覆盖需求要求的分支 */
  function extraSeed() {
    return {
      id: "t9", code: "DB20261021009",
      createType: "village",
      creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
      applyOrg: "village-1", applyOrgName: "青河村卫生室",
      applyPharmacy: "ph-v1", applyPharmacyName: "青河村卫生室·药房",
      applyLocation: "loc-v1-A", applyLocationName: "西药柜-A1",
      shortageDesc: "头孢类药品库存不足，申请中心药房调拨。",
      createdAt: "2026-10-21 09:10", submitTime: "2026-10-21 09:10",
      auditStatus: "approved", transferStatus: "out",
      outOrg: "org-c", outOrgName: "区域中心药房",
      outPharmacy: "", outPharmacyName: "", outLocation: "", outLocationName: "",
      outCode: "", inCode: "", nextStep: "center-review",
      items: [
        { drugId: "d5", si: 0, drugCode: "1210500305", drugName: "头孢呋辛酯片", specCode: "1010400501", spec: "0.25g * 12片/盒", stock: 6, applyQty: 20 }
      ],
      batches: [], records: [
        { node: "提交", person: "王芳", org: "青河村卫生室", result: "已提交", opinion: "—", time: "2026-10-21 09:10" },
        { node: "成员机构审核", person: "李强", org: "城东社区卫生服务中心", result: "同意", opinion: "同意，转中心药房审核。", time: "2026-10-22 09:05" },
        { node: "中心药房审核", person: "赵敏", org: "区域中心药房", result: "同意", opinion: "—", time: "2026-10-23 10:20" }
      ]
    };
  }

  /* ---------------- 药品 / 规格 ---------------- */
  function drugOf(drugId) {
    for (var i = 0; i < MOCK.drugs.length; i++) {
      if (MOCK.drugs[i].id === drugId) return MOCK.drugs[i];
    }
    return null;
  }

  function findSi(it) {
    var d = drugOf(it.drugId);
    if (d) {
      for (var i = 0; i < d.specs.length; i++) {
        if (it.specCode && d.specs[i].code === it.specCode) return i;
        if (it.spec && d.specs[i].title === it.spec) return i;
      }
    }
    return 0;
  }

  function specList() {
    var out = [];
    MOCK.drugs.forEach(function (d) {
      d.specs.forEach(function (s, si) {
        out.push({
          key: d.id + "_" + si, drugId: d.id, si: si,
          drugCode: d.code, drugName: d.name,
          specCode: s.code, spec: s.title, kind: d.kind
        });
      });
    });
    return out;
  }

  function specByKey(key) {
    var arr = specList();
    for (var i = 0; i < arr.length; i++) if (arr[i].key === key) return arr[i];
    return null;
  }

  function batchesOf(drugId, si) {
    return (MOCK.batches && MOCK.batches[drugId + "_" + si]) || [];
  }

  /* 机构某规格总库存（演示用确定性数值） */
  function orgStock(org, drugId, si) {
    var s = String(org || "") + "_" + drugId + "_" + si;
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
    return h % 48;
  }

  /* 追溯码：优先取 mock 预置池，不足时按规则生成 */
  function codesFor(drugId, si, batchNo, qty) {
    qty = Number(qty) || 0;
    var base = (MOCK.traceCodes && MOCK.traceCodes[drugId + "_" + si + "_" + batchNo]) || [];
    var out = base.slice(0, Math.min(qty, base.length));
    for (var i = out.length; i < qty; i++) {
      var seq = String(i + 1);
      while (seq.length < 4) seq = "0" + seq;
      out.push("TRC" + batchNo + seq);
    }
    return out;
  }

  /* ---------------- 登录 / 机构 ---------------- */
  function user() {
    var u = SEL.currentUser();
    if (u) return u;
    for (var i = 0; i < MOCK.users.length; i++) {
      if (MOCK.users[i].account === "wangfang") {
        var c = MOCK.users[i];
        u = { id: c.id, account: c.account, name: c.name, org: c.org, role: c.role, roleName: c.roleName };
        SEL.login(u);
        return u;
      }
    }
    return null;
  }

  function orgKey(u) {
    if (!u) return "";
    if (u.role === "village") return "village-1";
    if (u.role === "member") return "member-1";
    if (u.role === "center" || u.role === "pharmacist") return "org-c";
    return "";
  }

  function orgName(key) { return ORGS[key] || "—"; }

  /* 库位全量：取机构下所有库位的并集（不再做上级级联） */
  function locationsOfOrg(key) {
    var seen = {}, out = [];
    ((MOCK.pharmacies && MOCK.pharmacies[key]) || []).forEach(function (p) {
      ((MOCK.locations && MOCK.locations[p.id]) || []).forEach(function (l) {
        if (!seen[l.id]) { seen[l.id] = 1; out.push(l); }
      });
    });
    return out;
  }

  function locationNameOfOrg(key, locId) {
    var out = "";
    locationsOfOrg(key).forEach(function (l) { if (l.id === locId) out = l.name; });
    return out;
  }

  /* ---------------- 权限（角色 × 状态 × 操作） ---------------- */
  function isCreator(b, u) { return b.creatorId === u.id; }

  function isMemberAuditor(b, u) {
    return b.auditStatus === "member" && u.role === "member" && b.createType === "village";
  }

  function isCenterAuditor(b, u) {
    return b.auditStatus === "center" && u.role === "center";
  }

  function canOutbound(b, u) {
    return b.auditStatus === "approved" && b.transferStatus === "out" &&
      b.outOrg !== "" && orgKey(u) === b.outOrg;
  }

  function canInbound(b, u) {
    return b.auditStatus === "approved" && b.transferStatus === "in" && orgKey(u) === b.applyOrg;
  }

  function canEdit(b, u) {
    return isCreator(b, u) && (b.auditStatus === "draft" || b.auditStatus === "rejected");
  }

  function canWithdraw(b, u) {
    return isCreator(b, u) && (b.auditStatus === "member" || b.auditStatus === "center");
  }

  function related(b, u) {
    if (b.deleted) return false;
    var key = orgKey(u);
    if (b.creatorId === u.id) return true;
    if (b.applyOrg === key || b.outOrg === key) return true;
    if (b.auditStatus === "member" && u.role === "member") return true;
    if (b.auditStatus === "center" && u.role === "center") return true;
    return b.records.some(function (r) { return r.person && r.person === u.name; });
  }

  /* 列表操作按钮：按「角色 × 状态」矩阵渲染 */
  function actionsFor(b, u) {
    var acts = [{ key: "view", label: "查看" }];
    if (canEdit(b, u)) {
      acts.push({ key: "edit", label: "编辑" });
      acts.push({ key: "submit", label: "提交" });
      acts.push({ key: "delete", label: "删除", danger: true });
    }
    if (canWithdraw(b, u)) acts.push({ key: "withdraw", label: "撤回" });
    if (isMemberAuditor(b, u)) acts.push({ key: "audit", label: "审核" });
    if (isCenterAuditor(b, u)) acts.push({ key: "audit", label: "审核" });
    if (canOutbound(b, u)) acts.push({ key: "outbound", label: "出库" });
    if (canInbound(b, u)) acts.push({ key: "inbound", label: "入库" });
    return acts;
  }

  /* ---------------- 审批记录 / 状态流转 ---------------- */
  function addRecord(b, node, person, org, result, opinion) {
    b.records.push({
      node: node, person: person, org: org || "—",
      result: result, opinion: opinion || "—", time: SEL.fmtNow()
    });
  }

  function submitBill(b) {
    b.auditStatus = b.createType === "village" ? "member" : "center";
    b.transferStatus = "";
    b.submitTime = SEL.fmtNow();
    addRecord(b, "提交", b.creator, b.applyOrgName || b.creatorOrg, "已提交", "—");
  }

  function withdrawBill(b) {
    b.auditStatus = "draft";
    addRecord(b, "撤回", b.creator, b.applyOrgName || b.creatorOrg, "已撤回", "—");
  }

  /* ---------------- 单号 ---------------- */
  function ymd() {
    var d = new Date();
    return d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate());
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  function seqCode(list, prefix, field) {
    var p = prefix + ymd();
    var max = 0;
    list.forEach(function (b) {
      var code = field ? b[field] : b.code;
      if (code && code.indexOf(p) === 0) {
        var n = parseInt(code.slice(p.length), 10);
        if (n > max) max = n;
      }
    });
    var seq = String(max + 1);
    while (seq.length < 3) seq = "0" + seq;
    return p + seq;
  }

  function newCode(list) { return seqCode(list, "DB"); }
  function newOutCode(list) { return seqCode(list, "CK", "outCode"); }
  function newInCode(list) { return seqCode(list, "RK", "inCode"); }

  /* ---------------- 计算 ---------------- */
  function money(n) {
    n = Math.round((Number(n) || 0) * 100) / 100;
    return n.toFixed(2);
  }
  function intVal(v) {
    return /^\d+$/.test(String(v).trim()) ? parseInt(v, 10) : NaN;
  }
  function allocated(g) {
    var sum = 0;
    (g.rows || []).forEach(function (r) { sum += Number(r.outQty) || 0; });
    return sum;
  }
  function scanned(g) {
    var sum = 0;
    (g.rows || []).forEach(function (r) { sum += (r.traceCodes || []).length; });
    return sum;
  }
  function outSums(b) {
    var qty = 0, purchase = 0, retail = 0;
    (b.batches || []).forEach(function (g) {
      (g.rows || []).forEach(function (r) {
        var q = Number(r.outQty) || 0;
        qty += q;
        purchase += q * (Number(r.purchase) || 0);
        retail += q * (Number(r.retail) || 0);
      });
    });
    return { qty: qty, purchase: money(purchase), retail: money(retail) };
  }
  function inSums(b) {
    var totalIn = 0, totalBad = 0, purchase = 0, retail = 0;
    (b.batches || []).forEach(function (g) {
      (g.rows || []).forEach(function (r) {
        var iq = Number(r.inQty) || 0;
        var bq = Number(r.badQty) || 0;
        var good = Math.max(0, iq - bq);
        totalIn += iq;
        totalBad += bq;
        purchase += good * (Number(r.purchase) || 0);
        retail += good * (Number(r.retail) || 0);
      });
    });
    return {
      totalIn: totalIn, totalBad: totalBad, good: totalIn - totalBad,
      purchase: money(purchase), retail: money(retail)
    };
  }

  /* ---------------- 审核页（成员机构 / 中心药房共用） ---------------- */
  function mountAudit(kind) {
    var $ = SEL.$;
    var esc = SEL.esc;
    var u = user();
    if (!u) return;

    var bill = byId(load(), SEL.qs("id"));
    if (!bill) { location.href = "transfer.html"; return; }

    var isMember = kind === "member";
    var allowed = isMember ? isMemberAuditor(bill, u) : isCenterAuditor(bill, u);
    if (!allowed) { location.href = "transfer-detail.html?id=" + bill.id; return; }

    var pageTitle = isMember ? "成员机构审核" : "中心药房审核";

    function renderInfo() {
      $("infoGrid").innerHTML =
        item("申请机构", bill.applyOrgName) +
        item("申请库位", bill.applyLocationName) +
        item("提交人", bill.creator) +
        item("提交时间", bill.submitTime) +
        item("审核状态", AUDIT[bill.auditStatus]) +
        '<div class="form-item span-2of4">' + label("缺药说明") +
          '<span class="text-value">' + esc(bill.shortageDesc || "—") + "</span></div>";
    }
    function item(l, v) {
      return '<div class="form-item">' + label(l) + '<span class="text-value">' + esc(v || "—") + "</span></div>";
    }
    function label(l) {
      return '<span class="form-label">' + esc(l) + "</span>";
    }

    function renderItems() {
      $("itemBody").innerHTML = bill.items.map(function (it) {
        return "<tr>" +
          "<td>" + esc(it.drugName) + "</td>" +
          "<td>" + esc(it.drugCode) + "</td>" +
          "<td>" + esc(it.spec) + "</td>" +
          '<td class="num">' + it.stock + "</td>" +
          '<td class="num">' + it.applyQty + "</td>" +
        "</tr>";
      }).join("");
      $("itemCount").textContent = "（" + bill.items.length + "）";
    }

    function renderRecords() {
      $("recordBody").innerHTML = bill.records.length
        ? bill.records.map(function (r) {
            return "<tr>" +
              "<td>" + esc(r.node) + "</td>" +
              "<td>" + esc(r.person) + "</td>" +
              "<td>" + esc(r.org) + "</td>" +
              "<td>" + esc(r.result) + "</td>" +
              '<td><div class="cell-ellipsis" title="' + esc(r.opinion) + '">' + esc(r.opinion) + "</div></td>" +
              "<td>" + esc(r.time) + "</td>" +
            "</tr>";
          }).join("")
        : '<tr><td colspan="6" class="pa-empty">暂无审批记录</td></tr>';
    }

    function renderFoot() {
      $("detailCard").classList.add("has-foot");
      $("pageFoot").innerHTML =
        '<div class="tr-audit-row">' +
          '<span class="tr-audit-label"><span class="req">*</span>审核意见</span>' +
          '<div class="tr-audit-ctrl">' +
            '<label class="radio"><input type="radio" name="decision" value="pass" checked><span>同意</span></label>' +
            '<label class="radio"><input type="radio" name="decision" value="reject"><span>拒绝</span></label>' +
          "</div>" +
        "</div>" +
        (isMember ? '<div class="tr-audit-row" id="rowNext">' +
          '<span class="tr-audit-label"><span class="req">*</span>下一步骤</span>' +
          '<div class="tr-audit-ctrl">' +
            '<label class="radio"><input type="radio" name="nextStep" value="direct" checked><span>直接出库（本机构出库）</span></label>' +
            '<label class="radio"><input type="radio" name="nextStep" value="center"><span>转中心药房审核</span></label>' +
          "</div>" +
        "</div>" : "") +
        '<div class="tr-audit-row is-textarea">' +
          '<span class="tr-audit-label"><span class="req">*</span>审核意见说明</span>' +
          '<textarea class="textarea" id="fOpinion" maxlength="200" placeholder="拒绝时必填，同意时选填"></textarea>' +
        "</div>" +
        '<div class="tr-audit-row tr-audit-btns">' +
          '<button class="btn" data-cancel="1">取消</button>' +
          '<button class="btn btn-primary" id="btnAuditSubmit">提交</button>' +
        "</div>";

      $("fOpinion").addEventListener("input", function () { this.classList.remove("is-invalid"); });
      [].slice.call($("pageFoot").querySelectorAll('input[name="decision"]')).forEach(function (r) {
        r.addEventListener("change", function () {
          $("fOpinion").classList.remove("is-invalid");
          var next = $("rowNext");
          if (next) next.style.display = this.value === "pass" ? "flex" : "none";
        });
      });
      $("btnAuditSubmit").addEventListener("click", decide);
      $("pageFoot").querySelector("[data-cancel]").addEventListener("click", goBack);
    }

    function decide() {
      var choice = $("pageFoot").querySelector('input[name="decision"]:checked');
      var passed = choice ? choice.value === "pass" : true;
      var opinionEl = $("fOpinion");
      var opinion = opinionEl.value.trim();
      if (!passed && !opinion) {
        opinionEl.classList.add("is-invalid");
        SEL.toast("拒绝时必须填写审核意见说明");
        return;
      }

      var node = isMember ? "成员机构审核" : "中心药房审核";
      if (passed) {
        var next = isMember
          ? ($("pageFoot").querySelector('input[name="nextStep"]:checked') || {}).value
          : "center";
        if (isMember && next === "center") {
          bill.auditStatus = "center";
          bill.nextStep = "center-review";
          addRecord(bill, node, u.name, u.org, "同意", opinion);
        } else {
          bill.auditStatus = "approved";
          bill.transferStatus = "out";
          bill.outOrg = orgKey(u);
          bill.outOrgName = ORGS[bill.outOrg];
          bill.nextStep = "direct-outbound";
          addRecord(bill, node, u.name, u.org, isMember ? "同意（直接出库）" : "同意", opinion);
        }
      } else {
        bill.auditStatus = "rejected";
        bill.nextStep = "";
        addRecord(bill, node, u.name, u.org, "拒绝", opinion);
      }
      persist(bill);
      SEL.toast(passed ? "审核已通过" : "已拒绝，调拨单退回发起人");
      setTimeout(goBack, 500);
    }

    function goBack() { location.href = "transfer.html"; }

    $("headCode").textContent = "调拨单号：" + bill.code;
    $("headStatus").textContent = "审核状态：" + AUDIT[bill.auditStatus];
    $("pageTitle").textContent = pageTitle;
    $("tabName").textContent = pageTitle;
    document.title = pageTitle + " " + bill.code + " · 区域药房协同管理系统";
    $("btnBack").addEventListener("click", goBack);
    $("tabClose").addEventListener("click", goBack);
    SEL.renderHeaderUser(u);
    SEL.bindNav();

    renderInfo();
    renderItems();
    renderRecords();
    renderFoot();
    bindJump();
  }

  /* 详情页 / 审核页：页签快速定位滚动 */
  function bindJump() {
    var $ = SEL.$;
    var body = $("detailBody");
    var tabs = $("jumpTabs");
    if (!body || !tabs) return;

    function setActive(name) {
      [].slice.call(tabs.children).forEach(function (t) {
        t.classList.toggle("active", t.getAttribute("data-jump") === name);
      });
    }
    function jumpTo(name) {
      var top = 0;
      if (name === "records") {
        top = $("secRecords").getBoundingClientRect().top
          - body.getBoundingClientRect().top + body.scrollTop;
      }
      body.scrollTo({ top: top, behavior: "auto" });
      setActive(name);
    }
    tabs.addEventListener("click", function (e) {
      var tab = e.target.closest(".page-tab");
      if (tab) jumpTo(tab.getAttribute("data-jump"));
    });
    body.addEventListener("scroll", function () {
      var offset = $("secRecords").getBoundingClientRect().top - body.getBoundingClientRect().top;
      var atBottom = body.scrollTop > 0 &&
        body.scrollTop >= body.scrollHeight - body.clientHeight - 2;
      setActive(offset <= 24 || atBottom ? "records" : "top");
    });
  }

  window.TR = {
    AUDIT: AUDIT, TRANSFER: TRANSFER, ORGS: ORGS, BAD_REASONS: BAD_REASONS,
    load: load, save: save, byId: byId, persist: persist,
    user: user, orgKey: orgKey, orgName: orgName,
    locationsOfOrg: locationsOfOrg, locationNameOfOrg: locationNameOfOrg,
    isCreator: isCreator, isMemberAuditor: isMemberAuditor, isCenterAuditor: isCenterAuditor,
    canEdit: canEdit, canWithdraw: canWithdraw, canOutbound: canOutbound, canInbound: canInbound,
    related: related, actionsFor: actionsFor,
    addRecord: addRecord, submitBill: submitBill, withdrawBill: withdrawBill,
    newCode: newCode, newOutCode: newOutCode, newInCode: newInCode,
    money: money, intVal: intVal,
    allocated: allocated, scanned: scanned, outSums: outSums, inSums: inSums,
    drugOf: drugOf, specList: specList, specByKey: specByKey,
    batchesOf: batchesOf, orgStock: orgStock, codesFor: codesFor,
    mountAudit: mountAudit, bindJump: bindJump
  };
})();
