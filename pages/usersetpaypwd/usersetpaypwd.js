var a = require("../../utils/config.js"), o = getApp();

Page({
    data: {
        password: "",
        againPassword: ""
    },
    onLoad: function(a) {
        var t = this;
        o.getSiteSettingData(function(a) {
            t.setData(a);
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    bindpasswordTap: function(a) {
        var o = a.detail.value;
        this.data.password = o;
    },
    bindagainpasswordTap: function(a) {
        var o = a.detail.value;
        this.data.againPassword = o;
    },
    onPullDownRefresh: function() {},
    formSubmit: function(t) {
        var n = this;
        n.data.password ? n.data.password == n.data.againPassword ? o.getOpenId(function(t) {
            wx.request({
                url: o.getUrl("Balance.ashx?action=OpenBalance"),
                data: {
                    openId: t,
                    password: n.data.password,
                    confirmPassword: n.data.againPassword
                },
                success: function(t) {
                    void 0 == t.data.error_response ? "OK" == t.data.Status && (a.showTip("设置成功", "success"), 
                    o.globalData.userInfo.IsSetTradePassword = !0, wx.navigateBack({
                        delta: 1
                    })) : a.showTip(t.data.error_response.sub_msg);
                },
                complete: function() {}
            });
        }) : wx.showToast({
            title: "两次密码不一致",
            icon: "fail",
            duration: 2e3
        }) : wx.showToast({
            title: "请设置交易密码",
            icon: "fail",
            duration: 2e3
        });
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});