(function () {
  "use strict";

  var ICO = {
    home: '<path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    drug: '<path d="M4 4h6l2 3h8v13H4z"/>',
    stock: '<path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 8v8l9 5 9-5V8"/>',
    cart: '<path d="M3 4h2l2.6 12.4a1 1 0 0 0 1 .8h9.8a1 1 0 0 0 1-.8L21 8H6"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/>',
    price: '<path d="M20 12l-8 8-9-9V3h11l6 6z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
    alert: '<path d="M12 3l9 16H3z"/><path d="M12 8v5"/><circle cx="12" cy="16" r="1"/>',
    shortage: '<path d="M4 4h16v12H4z"/><path d="M8 20h8M12 16v4"/><path d="M9 10h6"/>',
    rx: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M9 10h6M9 14h6"/>',
    stat: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    sys: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>'
  };

  /* 一级 → 二级 → 页面。左侧导航只渲染到二级，三级页面由页面内按钮进入。
     roles 省略 = 四角色均可见；
     ["center"] 仅中心药房（含 pharmacist，发起人/审核人共享权限）；
     ["center","member","village"] = 三类药房人员可见、HIS 对接人员不可见；
     ["his"] 仅 HIS 对接人员可见。
     hideFor = 账号例外名单：命中账号（如 zhaomin/chenjing）即使角色匹配也隐藏该项。 */
  var C3 = ["center", "member", "village"];
  var NAV = [
    { name: "首页", icon: "home", href: "home.html", files: ["home.html"], roles: C3 },
    { name: "药品管理", icon: "drug", items: [
      { name: "药品目录管理", href: "drug-catalog.html", files: ["drug-catalog.html", "drug-create.html"], roles: ["center"] },
      { name: "机构药品目录", href: "org-drug-catalog.html", files: ["org-drug-catalog.html", "org-drug-select.html"], roles: C3 },
      { name: "药品目录遴选", href: "drug-selection.html", files: ["drug-selection.html", "drug-selection-create.html", "drug-selection-detail.html"], roles: ["center", "member", "village", "expert"] },
      { name: "企业管理", href: "manufacturer-manage.html", files: ["manufacturer-manage.html", "blacklist-manage.html"], roles: ["center"] },
      { name: "供应商分配", href: "supplier-allocation.html", files: ["supplier-allocation.html"], roles: ["center"] },
      { name: "医保对码", href: "medical-insurance-mapping.html", files: ["medical-insurance-mapping.html"], roles: ["center"] }
    ] },
    { name: "采购管理", icon: "cart", items: [
      { name: "采购需求", href: "purchase-need.html", files: ["purchase-need.html", "purchase-need-create.html", "purchase-need-detail.html"], roles: C3 },
      { name: "采购计划", href: "purchase-plan.html", files: ["purchase-plan.html", "purchase-plan-create.html", "purchase-plan-detail.html"], roles: ["center", "member"] },
      { name: "采购订单", href: "purchase-order.html", files: ["purchase-order.html"], roles: ["center"] }
    ] },
    { name: "库存管理", icon: "stock", items: [
      { name: "药品期初管理", href: "init-stock.html", files: ["init-stock.html"], roles: C3 },
      { name: "药品批次管理", href: "batch-management.html", files: ["batch-management.html"], roles: ["center"] },
      { name: "药品入库", href: "stock-in.html", files: ["stock-in.html", "stock-in-create.html", "stock-in-detail.html"], roles: C3 },
      { name: "药品出库", href: "outbound.html", files: ["outbound.html", "outbound-create.html", "outbound-detail.html"], roles: C3 },
      { name: "药品增损", href: "stock-adjust.html", files: ["stock-adjust.html", "stock-adjust-create.html", "stock-adjust-detail.html"], roles: C3 },
      { name: "药品调拨管理", href: "transfer.html", files: ["transfer.html", "transfer-create.html", "transfer-h-create.html", "transfer-detail.html", "transfer-outbound.html", "transfer-inbound.html", "transfer-audit-center.html", "transfer-audit-member.html"], roles: C3 },
      { name: "药品退库", href: "stock-return.html", files: ["stock-return.html", "stock-return-create.html", "stock-return-detail.html"], roles: C3 },
      { name: "库存盘点", href: "stock-check.html", files: ["stock-check.html", "stock-check-count.html", "stock-check-detail.html"], roles: ["center"] }
    ] },
    { name: "物价管理", icon: "price", items: [
      { name: "药品调价", href: "price-adjust.html", files: ["price-adjust.html", "price-adjust-create.html", "price-adjust-detail.html"], roles: ["center"] }
    ], roles: ["center"] },
    { name: "预警管理", icon: "alert", items: [
      { name: "药品效期预警", href: "drug-expiry-warning.html", files: ["drug-expiry-warning.html"], roles: ["center"] },
      { name: "药品高低储设置", href: "stock-level.html", files: ["stock-level.html"], roles: ["center"] },
      { name: "药品高低储预警", href: "stock-alert.html", files: ["stock-alert.html"], roles: ["center"] }
    ], roles: ["center"] },
    { name: "基层缺药", icon: "shortage", items: [
      { name: "缺药登记", href: "shortage.html", files: ["shortage.html", "shortage-create.html", "shortage-detail.html"], roles: C3 }
    ], roles: C3 },
    { name: "门诊处方管理", icon: "rx", items: [
      { name: "中药饮片处方开具", href: "prescription-tcm.html", files: ["prescription-tcm.html"] },
      { name: "西药处方开具", href: "prescription-western.html", files: ["prescription-western.html"] },
      { name: "门诊处方发药", href: "prescription-dispensing.html", files: ["prescription-dispensing.html"] },
      { name: "门诊处方送药", href: "prescription-delivery.html", files: ["prescription-delivery.html"] },
      { name: "门诊处方退药", href: "prescription-return.html", files: ["prescription-return.html"] },
      { name: "预减管理", href: "pre-deduction.html", files: ["pre-deduction.html"] }
    ], roles: ["his"] },
    { name: "统计查询", icon: "stat", items: [
      { name: "库存查询", href: "stock-query.html", files: ["stock-query.html"], roles: ["center"] },
      { name: "处方查询", href: "prescription-query.html", files: ["prescription-query.html"], roles: ["center", "his"], hideFor: ["zhaomin", "chenjing"] },
      { name: "药品发药明细", href: "drug-consumption.html", files: ["drug-consumption.html"], roles: ["center", "his"] },
      { name: "药品构成查询", href: "drug-composition-query.html", files: ["drug-composition-query.html"], roles: ["center"] }
    ], roles: ["center", "his"] },
    { name: "系统维护", icon: "sys", items: [
      { name: "库位维护", href: "pharmacy-maintenance.html", files: ["pharmacy-maintenance.html"], roles: C3 },
      { name: "特殊参数设置", href: "param-settings.html", files: ["param-settings.html"], roles: ["center"] },
      { name: "审批流程配置", href: "approval-flow-config.html", files: ["approval-flow-config.html", "approval-rule-config.html"], roles: ["center"] }
    ] }
  ];

  var current = location.pathname.split("/").pop() || "index.html";

  function svg(path, cls) {
    return '<svg class="' + (cls || "nav-ico") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + path + "</svg>";
  }

  function activeGroup() {
    for (var i = 0; i < NAV.length; i++) {
      if (NAV[i].files && NAV[i].files.indexOf(current) >= 0) return -1;
      var items = NAV[i].items || [];
      for (var j = 0; j < items.length; j++) {
        if (items[j].files.indexOf(current) >= 0) return i;
      }
    }
    return -1;
  }

  function hasRole(roles, role) {
    if (!roles) return true;
    /* pharmacist（中心药房·发起人）与 center（中心药房审核人）共享全部权限 */
    var normalized = role === "pharmacist" ? "center" : role;
    return roles.indexOf(normalized) >= 0;
  }

  /* 账号级例外：hideFor 名单中的账号即使角色匹配也隐藏 */
  function hiddenFor(item, me) {
    return !!(item.hideFor && me && item.hideFor.indexOf(me.account) >= 0);
  }

  function render() {
    var side = document.getElementById("appSide") || document.querySelector(".app-side");
    if (!side) return;
    var me = currentUser();
    var role = me.role || "center";
    var g = activeGroup();
    var html = "";

    NAV.forEach(function (group, gi) {
      /* 一级菜单权限 */
      if (!hasRole(group.roles, role)) return;

      if (group.href) {
        var homeActive = group.files.indexOf(current) >= 0;
        html += '<div class="nav-group"><div class="nav-item' + (homeActive ? " nav-home-active" : "") +
          '" data-href="' + group.href + '">' + svg(ICO[group.icon] || ICO.home) +
          '<span class="nav-label">' + group.name + "</span></div></div>";
        return;
      }
      /* 过滤二级子项 */
      var visibleItems = (group.items || []).filter(function (item) {
        return hasRole(item.roles, role) && !hiddenFor(item, me);
      });
      if (!visibleItems.length) return;

      var open = gi === g;
      html += '<div class="nav-group' + (open ? " open" : "") + '">' +
        '<div class="nav-item nav-toggle">' + svg(ICO[group.icon] || ICO.home) +
        '<span class="nav-label">' + group.name + "</span>" +
        svg('<path d="M9 6l6 6-6 6"/>', "nav-arrow") + "</div>" +
        '<div class="nav-sub">' +
        visibleItems.map(function (item) {
          var itemActive = item.files.indexOf(current) >= 0;
          return '<div class="nav-sub-item' + (itemActive ? " active" : "") + '" data-href="' + item.href + '">' +
            item.name + "</div>";
        }).join("") +
        "</div></div>";
    });

    side.innerHTML = html;

    side.querySelectorAll("[data-href]").forEach(function (el) {
      el.addEventListener("click", function () { location.href = el.getAttribute("data-href"); });
    });
    side.querySelectorAll(".nav-toggle").forEach(function (el) {
      el.addEventListener("click", function () { el.parentNode.classList.toggle("open"); });
    });
  }

  /* ---------- 统一账号菜单 ---------- */
  var FALLBACK_USERS = [
    { id: "u1", account: "wangfang", name: "王芳", org: "青河村卫生室", role: "village", roleName: "村室发起人" },
    { id: "u2", account: "liqiang", name: "李强", org: "城东社区卫生服务中心", role: "member", roleName: "成员机构（可发起、可审核）" },
    { id: "u3", account: "zhaomin", name: "赵敏", org: "区域中心药房", role: "center", roleName: "中心药房审核人" },
    { id: "u4", account: "chenjing", name: "陈静", org: "区域中心药房", role: "pharmacist", roleName: "中心药房·发起人" },
    { id: "u5", account: "sunlei", name: "孙磊", org: "信息中心 · HIS 对接", role: "his", roleName: "HIS 对接人员" },
    { id: "u6", account: "zhouwen", name: "周雯", org: "县域医共体药学专家库", role: "expert", roleName: "药学专家" },
    { id: "u7", account: "fengtao", name: "冯涛", org: "县域医共体药学专家库", role: "expert", roleName: "临床专家" }
  ];

  function demoUsers() {
    return (window.MOCK && MOCK.users && MOCK.users.length) ? MOCK.users : FALLBACK_USERS;
  }

  function currentUser() {
    try {
      var raw = sessionStorage.getItem("SEL_USER");
      if (raw) {
        var u = JSON.parse(raw);
        if (u && u.name) return u;
      }
    } catch (e) { /* ignore */ }
    var list = demoUsers();
    return list.filter(function (u) { return u.name === "赵敏"; })[0] || list[0];
  }

  function renderUser() {
    var right = document.querySelector(".header-right") || document.querySelector(".header-inner");
    if (!right) return;
    var old = document.getElementById("sysUser");
    if (old) old.parentNode.removeChild(old);

    var me = currentUser();
    var list = demoUsers();
    var items = list.map(function (u) {
      var active = u.account === me.account || u.name === me.name;
      return '<div class="sys-pop-item' + (active ? " active" : "") + '" data-acc="' + u.account + '">' +
        '<span class="sys-pop-avatar" style="width:26px;height:26px;font-size:12px;">' + u.name.charAt(0) + "</span>" +
        '<span class="sys-pop-item-info"><span class="sys-pop-item-name">' + u.name + "</span>" +
        '<span class="sys-pop-item-role">' + u.org + " · " + u.roleName + "</span></span>" +
        (active ? '<span class="sys-pop-check">当前</span>' : "") + "</div>";
    }).join("");

    var wrap = document.createElement("div");
    wrap.className = "sys-user";
    wrap.id = "sysUser";
    wrap.innerHTML =
      '<div class="sys-user-btn" id="sysUserBtn">' +
        '<span class="sys-user-name">' + me.name + "</span>" +
        svg('<path d="M6 9l6 6 6-6"/>', "sys-user-caret") +
      "</div>" +
      '<div class="sys-user-pop" id="sysUserPop">' +
        '<div class="sys-pop-head"><span class="sys-pop-avatar">' + me.name.charAt(0) + "</span>" +
          '<div><div class="sys-pop-name">' + me.name + "</div>" +
          '<div class="sys-pop-org">' + me.org + " · " + me.roleName + "</div></div></div>" +
        '<div class="sys-pop-label">切换演示身份</div>' + items +
        '<div class="sys-pop-foot"><button type="button" data-act="home">返回首页</button>' +
        '<button type="button" data-act="logout">退出登录</button></div>' +
      "</div>";
    right.appendChild(wrap);

    var btn = document.getElementById("sysUserBtn");
    var pop = document.getElementById("sysUserPop");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      pop.classList.toggle("show");
    });
    document.addEventListener("click", function () { pop.classList.remove("show"); });
    pop.addEventListener("click", function (e) { e.stopPropagation(); });

    wrap.querySelectorAll(".sys-pop-item").forEach(function (el) {
      el.addEventListener("click", function () {
        var acc = el.getAttribute("data-acc");
        var user = demoUsers().filter(function (u) { return u.account === acc; })[0];
        if (!user) return;
        try {
          sessionStorage.setItem("SEL_USER", JSON.stringify({
            id: user.id, account: user.account, name: user.name,
            org: user.org, role: user.role, roleName: user.roleName
          }));
        } catch (err) { /* ignore */ }
        location.reload();
      });
    });

    pop.querySelectorAll("[data-act]").forEach(function (el) {
      el.addEventListener("click", function () {
        var act = el.getAttribute("data-act");
        if (act === "home") { location.href = "home.html"; return; }
        try {
          ["SEL_USER", "OB_USER", "SI_USER", "SA_USER", "SR_USER", "SC_RETURN"].forEach(function (k) {
            sessionStorage.removeItem(k);
          });
        } catch (err) { /* ignore */ }
        location.href = "login.html";
      });
    });
  }

  render();
  renderUser();
})();
