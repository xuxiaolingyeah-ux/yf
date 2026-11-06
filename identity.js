/* 统一演示身份：未登录时默认中心药房审核人赵敏，供各业务模块在页面初始化前读取 */
(function () {
  try {
    if (sessionStorage.getItem("SEL_USER")) return;
    sessionStorage.setItem("SEL_USER", JSON.stringify({
      id: "u3", account: "zhaomin", name: "赵敏",
      org: "区域中心药房", role: "center", roleName: "中心药房审核人"
    }));
  } catch (e) { /* ignore */ }
})();
