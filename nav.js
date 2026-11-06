(function () {
  "use strict";

  var ICO = {
    home: '<path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    drug: '<path d="M4 4h6l2 3h8v13H4z"/>',
    stock: '<path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 8v8l9 5 9-5V8"/>',
    price: '<path d="M20 12l-8 8-9-9V3h11l6 6z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
    alert: '<path d="M12 3l9 16H3z"/><path d="M12 8v5"/><circle cx="12" cy="16" r="1"/>',
    rx: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M9 10h6M9 14h6"/>',
    stat: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    sys: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>'
  };

  /* 一级 → 二级 → 页面。左侧导航只渲染到二级，三级页面由页面内按钮进入。 */
  var NAV = [
    { name: "首页", icon: "home", href: "home.html", files: ["home.html"] },
    { name: "药品管理", icon: "drug", items: [
      { name: "药品目录管理", href: "drug-catalog.html", files: ["drug-catalog.html", "drug-create.html"] },
      { name: "机构药品目录", href: "org-drug-catalog.html", files: ["org-drug-catalog.html", "org-drug-select.html"] },
      { name: "药品目录遴选", href: "drug-selection.html", files: ["drug-selection.html", "drug-selection-create.html", "drug-selection-detail.html"] }
    ] },
    { name: "库存管理", icon: "stock", items: [
      { name: "药品期初管理", href: "init-stock.html", files: ["init-stock.html"] },
      { name: "药品批次管理", href: "batch-management.html", files: ["batch-management.html"] },
      { name: "药品入库", href: "stock-in.html", files: ["stock-in.html", "stock-in-create.html", "stock-in-detail.html"] },
      { name: "药品出库", href: "outbound.html", files: ["outbound.html", "outbound-create.html", "outbound-detail.html"] },
      { name: "药品增损", href: "stock-adjust.html", files: ["stock-adjust.html", "stock-adjust-create.html", "stock-adjust-detail.html"] },
      { name: "药品调拨管理", href: "transfer.html", files: ["transfer.html", "transfer-create.html", "transfer-detail.html", "transfer-outbound.html", "transfer-inbound.html", "transfer-audit-center.html", "transfer-audit-member.html"] },
      { name: "药品退库", href: "stock-return.html", files: ["stock-return.html", "stock-return-create.html", "stock-return-detail.html"] },
      { name: "库存盘点", href: "stock-check.html", files: ["stock-check.html", "stock-check-count.html", "stock-check-detail.html"] }
    ] },
    { name: "物价管理", icon: "price", items: [
      { name: "药品调价", href: "price-adjust.html", files: ["price-adjust.html", "price-adjust-create.html", "price-adjust-detail.html"] }
    ] },
    { name: "预警管理", icon: "alert", items: [
      { name: "药品效期预警", href: "drug-expiry-warning.html", files: ["drug-expiry-warning.html"] },
      { name: "药品高低储设置", href: "stock-level.html", files: ["stock-level.html"] },
      { name: "药品高低储预警", href: "stock-alert.html", files: ["stock-alert.html"] }
    ] },
    { name: "门诊处方管理", icon: "rx", items: [
      { name: "中药饮片处方开具", href: "prescription-tcm.html", files: ["prescription-tcm.html"] },
      { name: "西药处方开具", href: "prescription-western.html", files: ["prescription-western.html"] },
      { name: "门诊处方发药", href: "prescription-dispensing.html", files: ["prescription-dispensing.html"] },
      { name: "门诊处方退药", href: "prescription-return.html", files: ["prescription-return.html"] },
      { name: "预减管理", href: "pre-deduction.html", files: ["pre-deduction.html"] }
    ] },
    { name: "统计查询", icon: "stat", items: [
      { name: "库存查询", href: "stock-query.html", files: ["stock-query.html"] },
      { name: "处方查询", href: "prescription-query.html", files: ["prescription-query.html"] },
      { name: "药品消耗明细", href: "drug-consumption.html", files: ["drug-consumption.html"] }
    ] },
    { name: "系统维护", icon: "sys", items: [
      { name: "企业管理", href: "manufacturer-manage.html", files: ["manufacturer-manage.html", "blacklist-manage.html"] },
      { name: "供应商分配", href: "supplier-allocation.html", files: ["supplier-allocation.html"] },
      { name: "医保对码", href: "medical-insurance-mapping.html", files: ["medical-insurance-mapping.html"] },
      { name: "库位维护", href: "pharmacy-maintenance.html", files: ["pharmacy-maintenance.html"] },
      { name: "特殊参数设置", href: "param-settings.html", files: ["param-settings.html"] }
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

  function render() {
    var side = document.getElementById("appSide") || document.querySelector(".app-side");
    if (!side) return;
    var g = activeGroup();
    var html = "";

    NAV.forEach(function (group, gi) {
      if (group.href) {
        var homeActive = group.files.indexOf(current) >= 0;
        html += '<div class="nav-group"><div class="nav-item' + (homeActive ? " nav-home-active" : "") +
          '" data-href="' + group.href + '">' + svg(ICO[group.icon] || ICO.home) +
          '<span class="nav-label">' + group.name + "</span></div></div>";
        return;
      }
      var open = gi === g;
      html += '<div class="nav-group' + (open ? " open" : "") + '">' +
        '<div class="nav-item nav-toggle">' + svg(ICO[group.icon] || ICO.home) +
        '<span class="nav-label">' + group.name + "</span>" +
        svg('<path d="M9 6l6 6-6 6"/>', "nav-arrow") + "</div>" +
        '<div class="nav-sub">' +
        group.items.map(function (item) {
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

  function syncUser() {
    var name = "赵敏";
    try {
      var raw = sessionStorage.getItem("SEL_USER");
      if (raw) {
        var u = JSON.parse(raw);
        if (u && u.name) name = u.name;
      }
    } catch (e) { /* ignore */ }
    var nameEl = document.querySelector(".header-user-name");
    var avatarEl = document.querySelector(".header-avatar");
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.charAt(0);
  }

  render();
  syncUser();
})();
