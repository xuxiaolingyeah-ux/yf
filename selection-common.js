/* ==========================================================================
   药品目录遴选：共享逻辑（登录态 / 数据存取 / 流程 / 通用 UI）
   依赖：mock.js（MOCK.users、MOCK.selections）
   页面需含节点：#toast #toastText #modalMask
   ========================================================================== */
(function () {
  "use strict";

  var USER_KEY = "SEL_USER";
  var DATA_KEY = "SEL_DATA";

  var STATUS = {
    draft: "草稿",
    member: "待成员机构审核",
    center: "待中心药房审核",
    rejected: "已驳回",
    approved: "审核通过"
  };

  /* 流程节点预置（未到节点展示用） */
  var FLOW = {
    village: [
      { node: "成员机构审核", org: "城东社区卫生服务中心", person: "李强", role: "member" },
      { node: "中心药房审核", org: "区域中心药房", person: "赵敏", role: "center" }
    ],
    member: [
      { node: "中心药房审核", org: "区域中心药房", person: "赵敏", role: "center" }
    ]
  };

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ---------------- 数据 ---------------- */
  function loadData() {
    var raw = sessionStorage.getItem(DATA_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fallthrough */ }
    }
    var seed = JSON.parse(JSON.stringify(MOCK.selections));
    sessionStorage.setItem(DATA_KEY, JSON.stringify(seed));
    return seed;
  }

  function saveData(list) {
    sessionStorage.setItem(DATA_KEY, JSON.stringify(list));
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  /* ---------------- 登录态 ---------------- */
  function currentUser() {
    var raw = sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  function requireAuth() {
    var u = currentUser();
    if (!u) { location.href = "login.html"; return null; }
    return u;
  }
  function login(user) { sessionStorage.setItem(USER_KEY, JSON.stringify(user)); }
  function logout() {
    sessionStorage.removeItem(USER_KEY);
    location.href = "login.html";
  }

  /* ---------------- 工具 ---------------- */
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function fmtNow() {
    var d = new Date();
    return d.getFullYear() + "-" + pad2c(d.getMonth() + 1) + "-" + pad2c(d.getDate()) +
      " " + pad2c(d.getHours()) + ":" + pad2c(d.getMinutes());
    function pad2c(n) { return pad2(n); }
  }
  function newId() {
    return "s" + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  }

  function qs(name) {
    /* window.__QS 仅供无头测试注入 */
    if (window.__QS && window.__QS[name] !== undefined) return window.__QS[name];
    var m = location.search.match(new RegExp("[?&]" + name + "=([^&]*)"));
    return m ? decodeURIComponent(m[1]) : "";
  }

  /* ---------------- 流程 ---------------- */
  function flowNodes(app) { return FLOW[app.orgType] || FLOW.village; }

  /* 提交 / 同意 后的下一个状态 */
  function nextStatus(app) {
    if (app.status === "draft" || app.status === "rejected") {
      return app.orgType === "village" ? "member" : "center";
    }
    if (app.status === "member") return "center";
    if (app.status === "center") return "approved";
    return app.status;
  }

  /* 当前登录人是否为该申请当前节点的审核人 */
  function canApprove(app, user) {
    return (app.status === "member" && user.role === "member") ||
      (app.status === "center" && user.role === "center");
  }

  function isApplicant(app, user) { return app.applicantId === user.id; }

  /*
   * 审批记录行 = 已发生记录 + 未到节点行
   * 未到节点：status 为 member/center → 对应节点「待审核」，其后节点「待审核」；
   *           rejected/draft → 未产生记录的节点显示「未执行」；
   *           approved → 无未到节点。
   */
  function recordRows(app) {
    var rows = app.records.slice();
    var nodes = flowNodes(app);
    if (app.status === "approved") return rows;

    nodes.forEach(function (n) {
      var happened = app.records.some(function (r) {
        return r.node === n.node && (r.result === "同意" || r.result === "拒绝");
      });
      if (happened) return;
      var future;
      if (app.status === "member" || app.status === "center") {
        future = { node: n.node, org: n.org, person: n.person, result: "待审核", opinion: "—", time: "—" };
      } else {
        future = { node: n.node, org: "—", person: "—", result: "未执行", opinion: "—", time: "—" };
      }
      rows.push(future);
    });
    return rows;
  }

  /* ---------------- 通用 UI ---------------- */
  var toastTimer = null;
  function toast(msg) {
    var el = $("toast");
    if (!el) return;
    $("toastText").textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  function openModal(html) {
    var mask = $("modalMask");
    mask.innerHTML = '<div class="modal">' + html + "</div>";
    mask.classList.add("show");
  }

  function closeModal() {
    var mask = $("modalMask");
    mask.classList.remove("show");
    mask.innerHTML = "";
  }

  function confirmDialog(opt) {
    openModal(
      '<div class="modal-head">' +
        '<span class="modal-title">' + esc(opt.title) + "</span>" +
        '<button class="drawer-close" data-close="1">' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>' +
        "</button>" +
      "</div>" +
      '<div class="modal-body"><p class="modal-text">' + esc(opt.text) + "</p></div>" +
      '<div class="modal-foot">' +
        '<button class="btn" data-close="1">取消</button>' +
        '<button class="btn btn-primary" data-ok="1">' + esc(opt.okText || "确定") + "</button>" +
      "</div>"
    );
    $("modalMask").querySelector("[data-ok]").addEventListener("click", function () {
      closeModal();
      if (opt.onOk) opt.onOk();
    });
  }

  /* 弹窗通用点击关闭（data-close / 点击遮罩空白） */
  document.addEventListener("click", function (e) {
    var mask = $("modalMask");
    if (!mask || !mask.classList.contains("show")) return;
    if (e.target === mask || e.target.closest("[data-close]")) closeModal();
  });

  /* 顶栏用户区：姓名 + 退出登录；同时按角色隐藏无权限的菜单项 */
  function renderHeaderUser(user) {
    var box = $("headerUser");
    if (box) box.querySelector(".header-user-name").textContent = user.name + " · " + user.org;
    document.querySelectorAll("[data-only-roles]").forEach(function (el) {
      var roles = el.getAttribute("data-only-roles").split(",");
      if (roles.indexOf(user.role) < 0) el.style.display = "none";
    });
  }

  /* 左侧导航跳转 */
  function bindNav() {
    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-href]");
      if (el) location.href = el.getAttribute("data-href");
    });
  }

  window.SEL = {
    STATUS: STATUS,
    $: $, esc: esc,
    loadData: loadData, saveData: saveData, byId: byId,
    currentUser: currentUser, requireAuth: requireAuth, login: login, logout: logout,
    fmtNow: fmtNow, newId: newId, qs: qs,
    flowNodes: flowNodes, nextStatus: nextStatus,
    canApprove: canApprove, isApplicant: isApplicant, recordRows: recordRows,
    toast: toast, openModal: openModal, closeModal: closeModal, confirmDialog: confirmDialog,
    renderHeaderUser: renderHeaderUser, bindNav: bindNav
  };
})();
