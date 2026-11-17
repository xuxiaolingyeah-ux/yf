/* =========================================================
 * 列表页统一范围页签（我的申请 / 待处理 / 全部记录）
 * 依赖：无（独立 IIFE，挂 window.ScopeTabs）
 *
 * 设计要点：
 *  1) 本脚本只负责"页签渲染 + 切换 + 在既有过滤结果上叠加范围过滤"，
 *     不接管各页面原有的筛选、分页、权限判断。
 *  2) 身份永远使用各模块自身的 currentUser() 与自身数据 id 空间，
 *     isMine / isPending / isVisible 一律由页面传入，避免跨模块 id 张冠李戴。
 *  3) 文案：mine=我的申请、pending=待处理、all=全部记录。
 *
 * 用法：
 *   <div id="scopeTabs" class="page-tabs"></div>
 *   var tabs = ScopeTabs.create({
 *     el: "#scopeTabs",
 *     user: user,                       // 模块自身当前用户（仅用于默认页签提示，可不传）
 *     data: function(){ return list; }, // 原始单据数组
 *     isVisible: function(b){ ... },    // 可选：有权限查看的范围；默认全部可见
 *     isMine: function(b){ ... },       // 我的申请：创建人/申请人
 *     isPending: function(b){ ... },    // 待处理：当前身份有可执行动作
 *     onChange: function(){ applyFilter(); } // 切换后重渲染
 *   });
 *   // 在页面原有过滤末尾叠加：
 *   ST.filtered = tabs.apply(ST.filtered);
 * ========================================================= */
(function () {
  "use strict";

  var LABELS = {
    mine: "我的申请",
    pending: "待处理",
    all: "全部记录"
  };
  var ORDER = ["mine", "pending", "all"];

  function create(opt) {
    opt = opt || {};
    var el = typeof opt.el === "string" ? document.querySelector(opt.el) : opt.el;
    var state = { scope: "mine" };

    function data() {
      try { return opt.data() || []; } catch (e) { return []; }
    }
    function visible(b) {
      if (typeof opt.isVisible === "function") return !!opt.isVisible(b);
      return true;
    }
    function mine(b) {
      return typeof opt.isMine === "function" && !!opt.isMine(b);
    }
    function pending(b) {
      return typeof opt.isPending === "function" && !!opt.isPending(b);
    }

    /* 默认页签：存在待我处理的单据则落到「待处理」，否则「我的申请」 */
    function pickDefault() {
      var hasPending = data().some(function (b) { return visible(b) && pending(b); });
      return hasPending ? "pending" : "mine";
    }

    function renderTabs() {
      if (!el) return;
      el.innerHTML = ORDER.map(function (k) {
        return '<span class="page-tab' + (state.scope === k ? " active" : "") +
          '" data-scope="' + k + '">' + LABELS[k] + "</span>";
      }).join("");
    }

    /* 在页面既有过滤结果上叠加范围过滤 */
    function apply(rows) {
      rows = rows || [];
      if (state.scope === "mine") return rows.filter(mine);
      if (state.scope === "pending") return rows.filter(pending);
      return rows; /* all：有权限查看的全部单据 */
    }

    if (el) {
      el.addEventListener("click", function (e) {
        var t = e.target.closest("[data-scope]");
        if (!t) return;
        var k = t.getAttribute("data-scope");
        if (!LABELS[k] || k === state.scope) return;
        state.scope = k;
        renderTabs();
        if (typeof opt.onChange === "function") opt.onChange();
      });
    }

    state.scope = pickDefault();
    renderTabs();

    return {
      apply: apply,
      scope: function () { return state.scope; },
      setScope: function (k) {
        if (!LABELS[k]) return;
        state.scope = k;
        renderTabs();
        if (typeof opt.onChange === "function") opt.onChange();
      },
      refreshDefault: function () {
        state.scope = pickDefault();
        renderTabs();
      },
      labels: LABELS
    };
  }

  window.ScopeTabs = { create: create, labels: LABELS, order: ORDER };
})();
