/* ============================================================
   address-dialog.js — 外送地址弹窗（收件人姓名 / 电话 / 省市区级联 + 详细地址）
   依赖：无（自包含，自行注入样式与 DOM）
   用法：
     AddrDialog.open({
       title: "配置外送地址",                    // 可选
       defaults: { name, phone, province, city, district, detail }, // 可选，回填
       onSave: function(addr){ ... },           // 点「保存」回调，addr = {name,phone,province,city,district,detail,full}
       onCancel: function(){ ... }              // 可选，点「取消」/ 遮罩 / Esc
     });
   ============================================================ */
(function () {
  "use strict";

  /* 演示省市区数据 */
  var REGIONS = {
    "安徽省": {
      "合肥市": ["蜀山区", "庐阳区", "包河区", "瑶海区"],
      "阜阳市": ["颍州区", "颍泉区", "颍东区"],
      "六安市": ["金安区", "裕安区", "叶集区"]
    },
    "浙江省": {
      "杭州市": ["西湖区", "拱墅区", "滨江区", "余杭区"],
      "宁波市": ["海曙区", "鄞州区", "江北区"],
      "温州市": ["鹿城区", "龙湾区", "瓯海区"]
    },
    "江苏省": {
      "南京市": ["鼓楼区", "建邺区", "栖霞区", "玄武区"],
      "苏州市": ["姑苏区", "虎丘区", "吴中区"],
      "无锡市": ["梁溪区", "滨湖区", "新吴区"]
    },
    "广东省": {
      "广州市": ["天河区", "越秀区", "海珠区", "白云区"],
      "深圳市": ["南山区", "福田区", "罗湖区", "宝安区"]
    }
  };

  var STYLE =
    ".addr-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;display:none;align-items:center;justify-content:center;}" +
    ".addr-mask.show{display:flex;}" +
    ".addr-dlg{width:420px;max-width:92vw;background:var(--panel,#fff);border-radius:10px;box-shadow:0 12px 48px rgba(0,0,0,.24);overflow:hidden;}" +
    ".addr-dlg-title{font-size:14px;font-weight:600;color:var(--text-primary,#1f2329);padding:14px 18px;border-bottom:1px solid var(--border,#e5e6eb);}" +
    ".addr-dlg-body{padding:16px 18px;display:flex;flex-direction:column;gap:12px;}" +
    ".addr-fld{display:flex;align-items:center;gap:8px;}" +
    ".addr-fld>.addr-lbl{width:76px;flex:none;font-size:13px;color:var(--text-secondary,#4e5969);text-align:right;}" +
    ".addr-fld>.addr-lbl .addr-req{color:var(--danger,#f53f3f);margin-right:2px;}" +
    ".addr-input{flex:1;height:30px;padding:0 8px;font-size:13px;border:1px solid var(--border,#dcdfe4);border-radius:5px;background:var(--input-bg,#fff);color:var(--text-primary,#1f2329);outline:none;min-width:0;}" +
    ".addr-input:focus{border-color:var(--primary,#4080ff);}" +
    ".addr-input.is-invalid{border-color:var(--danger,#f53f3f)!important;}" +
    ".addr-cascade{display:flex;gap:8px;flex:1;min-width:0;}" +
    ".addr-cascade select{flex:1;min-width:0;height:30px;font-size:13px;padding:0 4px;border:1px solid var(--border,#dcdfe4);border-radius:5px;background:var(--input-bg,#fff);color:var(--text-primary,#1f2329);outline:none;}" +
    ".addr-cascade select.is-invalid{border-color:var(--danger,#f53f3f)!important;}" +
    ".addr-foot{padding:12px 18px;border-top:1px solid var(--border,#e5e6eb);display:flex;justify-content:flex-end;gap:10px;}" +
    ".addr-btn{height:30px;padding:0 16px;font-size:13px;border-radius:5px;border:1px solid var(--border,#dcdfe4);background:var(--panel,#fff);color:var(--text-primary,#1f2329);cursor:pointer;}" +
    ".addr-btn:hover{background:var(--hover,#f2f3f5);}" +
    ".addr-btn-primary{background:var(--primary,#4080ff);border-color:var(--primary,#4080ff);color:#fff;}" +
    ".addr-btn-primary:hover{opacity:.9;background:var(--primary,#4080ff);}";

  var mounted = false, onSave = null, onCancel = null;

  function $(id) { return document.getElementById(id); }

  function mount() {
    if (mounted) return;
    var style = document.createElement("style");
    style.textContent = STYLE;
    document.head.appendChild(style);

    var provOpts = '<option value="">省份</option>' + Object.keys(REGIONS).map(function (p) {
      return '<option value="' + p + '">' + p + "</option>";
    }).join("");

    var mask = document.createElement("div");
    mask.className = "addr-mask";
    mask.id = "addrMask";
    mask.innerHTML =
      '<div class="addr-dlg">' +
        '<div class="addr-dlg-title" id="addrTitle">配置外送地址</div>' +
        '<div class="addr-dlg-body">' +
          '<div class="addr-fld"><span class="addr-lbl"><span class="addr-req">*</span>收件人：</span>' +
            '<input class="addr-input" id="addrName" placeholder="请输入收件人姓名" maxlength="20"></div>' +
          '<div class="addr-fld"><span class="addr-lbl"><span class="addr-req">*</span>联系电话：</span>' +
            '<input class="addr-input" id="addrPhone" placeholder="请输入 11 位手机号" maxlength="11"></div>' +
          '<div class="addr-fld"><span class="addr-lbl"><span class="addr-req">*</span>所在地区：</span>' +
            '<div class="addr-cascade">' +
              '<select id="addrProv">' + provOpts + "</select>" +
              '<select id="addrCity"><option value="">城市</option></select>' +
              '<select id="addrDist"><option value="">区/县</option></select>' +
            "</div></div>" +
          '<div class="addr-fld"><span class="addr-lbl"><span class="addr-req">*</span>详细地址：</span>' +
            '<input class="addr-input" id="addrDetail" placeholder="街道、门牌号、楼栋单元等" maxlength="60"></div>' +
        "</div>" +
        '<div class="addr-foot">' +
          '<button type="button" class="addr-btn" id="addrCancel">取消</button>' +
          '<button type="button" class="addr-btn addr-btn-primary" id="addrOk">保存</button>' +
        "</div>" +
      "</div>";
    document.body.appendChild(mask);

    /* 级联：省 → 市 → 区 */
    $("addrProv").addEventListener("change", function () {
      var cities = REGIONS[this.value] || {};
      $("addrCity").innerHTML = '<option value="">城市</option>' + Object.keys(cities).map(function (c) {
        return '<option value="' + c + '">' + c + "</option>";
      }).join("");
      $("addrDist").innerHTML = '<option value="">区/县</option>';
      $("addrCity").classList.remove("is-invalid");
      $("addrDist").classList.remove("is-invalid");
    });
    $("addrCity").addEventListener("change", function () {
      var dists = (REGIONS[$("addrProv").value] || {})[this.value] || [];
      $("addrDist").innerHTML = '<option value="">区/县</option>' + dists.map(function (d) {
        return '<option value="' + d + '">' + d + "</option>";
      }).join("");
      $("addrDist").classList.remove("is-invalid");
    });

    $("addrCancel").addEventListener("click", function () {
      var fn = onCancel;
      close();
      if (fn) fn();
    });
    $("addrOk").addEventListener("click", function () {
      var name = $("addrName").value.trim();
      var phone = $("addrPhone").value.trim();
      var prov = $("addrProv").value;
      var city = $("addrCity").value;
      var dist = $("addrDist").value;
      var detail = $("addrDetail").value.trim();
      var bad = false;
      function mark(id, invalid) {
        $(id).classList.toggle("is-invalid", !!invalid);
        if (invalid) bad = true;
      }
      mark("addrName", !name);
      mark("addrPhone", !/^1[3-9]\d{9}$/.test(phone));
      mark("addrProv", !prov);
      mark("addrCity", !city);
      mark("addrDist", !dist);
      mark("addrDetail", !detail);
      if (bad) return;
      var addr = {
        name: name, phone: phone,
        province: prov, city: city, district: dist, detail: detail,
        full: prov + city + dist + " " + detail + "（" + name + " " + phone + "）"
      };
      var fn = onSave;
      close();
      if (fn) fn(addr);
    });
    /* 输入即清除错误态 */
    ["addrName", "addrPhone", "addrDetail"].forEach(function (id) {
      $(id).addEventListener("input", function () { this.classList.remove("is-invalid"); });
    });
    $("addrPhone").addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(0, 11);
    });
    mask.addEventListener("click", function (e) {
      if (e.target === mask) {
        var fn = onCancel;
        close();
        if (fn) fn();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mask.classList.contains("show")) {
        var fn = onCancel;
        close();
        if (fn) fn();
      }
    });

    mounted = true;
  }

  function close() {
    var mask = document.getElementById("addrMask");
    if (mask) mask.classList.remove("show");
    onSave = null;
    onCancel = null;
  }

  function open(opts) {
    mount();
    opts = opts || {};
    $("addrTitle").textContent = opts.title || "配置外送地址";
    var d = opts.defaults || {};
    $("addrName").value = d.name || "";
    $("addrPhone").value = d.phone || "";
    $("addrDetail").value = d.detail || "";
    $("addrProv").value = d.province && REGIONS[d.province] ? d.province : "";
    /* 级联回填市 / 区 */
    var cities = REGIONS[$("addrProv").value] || {};
    $("addrCity").innerHTML = '<option value="">城市</option>' + Object.keys(cities).map(function (c) {
      return '<option value="' + c + '">' + c + "</option>";
    }).join("");
    $("addrCity").value = d.city && cities[d.city] ? d.city : "";
    var dists = cities[$("addrCity").value] || [];
    $("addrDist").innerHTML = '<option value="">区/县</option>' + dists.map(function (x) {
      return '<option value="' + x + '">' + x + "</option>";
    }).join("");
    $("addrDist").value = d.district && dists.indexOf(d.district) >= 0 ? d.district : "";
    ["addrName", "addrPhone", "addrProv", "addrCity", "addrDist", "addrDetail"].forEach(function (id) {
      $(id).classList.remove("is-invalid");
    });
    onSave = opts.onSave || null;
    onCancel = opts.onCancel || null;
    $("addrMask").classList.add("show");
    $("addrName").focus();
  }

  window.AddrDialog = {
    open: open,
    close: close
  };
})();
