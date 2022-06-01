var e = require("../../utils/config.js"), a = getApp();

Page({
    data: {
        PhoneText: "发送验证码",
        PhoneCell: "",
        settradepwd: "",
        openbalance: ""
    },
    onLoad: function(e) {
        var t = this;
        this.setData({
            VcodeUrl: a.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + a.globalData.openId,
            PhoneCell: e.phone,
            openbalance: e.openbalance,
            settradepwd: e.settradepwd
        }), a.getSiteSettingData(function(e) {
            t.setData(e);
        });
    },
    ChangeCode: function() {
        this.setData({
            VcodeUrl: a.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + a.globalData.openId + "&&d=" + new Date()
        });
    },
    InputValue: function(e) {
        var a = e.currentTarget.dataset.key;
        this.data[a] = e.detail.value;
    },
    GetPhoneCode: function() {
        var t = this.data;
        t.PhoneCell && e.checkPhone(t.PhoneCell) ? !t.ImageCode || t.ImageCode.length <= 0 ? e.showTip("输入图形验证码", "tips") : wx.request({
            url: a.getUrl("UserCenter.ashx?action=SendVerifyCode"),
            data: {
                Phone: t.PhoneCell,
                imgCode: t.ImageCode,
                IsValidPhone: !0,
                OpenId: a.globalData.openId
            },
            success: function(a) {
                if (void 0 == a.data.error_response) if ("OK" == a.data.Status) {
                    e.showTip("验证码发送成功", "success");
                    var t = 60, n = setInterval(function() {
                        t > 0 ? (t--, that.setData({
                            PhoneText: t + "s后可重发",
                            IsSend: !0
                        })) : (that.setData({
                            PhoneText: "发送验证码",
                            IsSend: !1
                        }), clearInterval(n));
                    }, 1e3);
                } else e.showTip(a.data.Message, "warning"); else e.showTip(a.data.error_response.sub_msg);
            }
        }) : e.showTip("手机号格式不对", "tips");
    },
    ChangeTradePassword: function() {
        var t = this.data;
        t.oldpwd ? !t.newpwd || !t.surepwd || t.newpwd.length < 6 || t.surepwd.length < 6 ? e.showTip("请输入六位数新密码", "tips") : t.newpwd == t.surepwd ? a.getOpenId(function(n) {
            wx.request({
                url: a.getUrl("UserCenter.ashx?action=ChangeTradePassword"),
                data: {
                    OpenId: n,
                    password: t.newpwd,
                    oldPassword: t.oldpwd
                },
                success: function(a) {
                    void 0 == a.data.error_response ? "OK" == a.data.Status ? (wx.navigateBack({
                        delta: 2
                    }), e.showTip(a.data.Message, "success")) : e.showTip(a.data.Message, "warning") : e.showTip(a.data.error_response.sub_msg);
                }
            });
        }) : e.showTip("两次密码输入不一致", "tips") : e.showTip("请输入原交易密码", "tips");
    },
    InitTradePassword: function() {
        var t = this.data;
        t.newpwd.length <= 0 || t.surepwd.length <= 0 ? e.showTip("请输入六位数密码", "tips") : t.newpwd.length == t.surepwd.length <= 0 ? a.getOpenId(function(n) {
            wx.request({
                url: a.getUrl("Balance.ashx?action=OpenBalance"),
                data: {
                    openid: n,
                    password: t.Initpwd,
                    confirmPassword: t.Initsurepwd
                },
                success: function(a) {
                    void 0 == a.data.error_response ? "OK" == a.data.Status ? wx.navigateBack({
                        delta: 2
                    }) : e.showTip("交易密码重置成功", "warning") : e.showTip(a.data.error_response.sub_msg);
                }
            });
        }) : e.showTip("两次密码输入不一致", "tips");
    },
    cancelbtn: function() {
        wx.switchTab({
            url: "../userhome/userhome"
        });
    },
    fogetpwd: function() {
        wx.navigateTo({
            url: "../userfindpaypwd/userfindpaypwd"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});