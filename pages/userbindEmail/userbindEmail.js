var e = require("../../utils/config.js"), a = getApp();

Page({
    data: {
        SendCode: "发送验证码",
        IsSend: !1,
        email: "",
        EmailVerification: ""
    },
    onLoad: function(e) {
        var t = this;
        this.setData({
            UserName: a.globalData.userInfo.realName,
            VcodeUrl: a.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + a.globalData.openId,
            email: e.email,
            EmailVerification: e.EmailVerification
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
    GetEmailCode: function() {
        var t = this, n = t.data;
        a.checkEmail(n.email) ? wx.request({
            url: a.getUrl("UserCenter.ashx?action=SendEmailVerifyCode"),
            data: {
                Email: n.email,
                username: "",
                needValidate: 2,
                OpenId: a.globalData.openId
            },
            success: function(a) {
                if (void 0 == a.data.error_response) if ("OK" == a.data.Status) {
                    var n = 60, i = setInterval(function() {
                        n > 0 ? (n--, t.setData({
                            SendCode: n + "s后可重发",
                            IsSend: !0
                        })) : (t.setData({
                            SendCode: "发送验证码",
                            IsSend: !1
                        }), clearInterval(i));
                    }, 1e3);
                    e.showTip("验证码发送成功", "success");
                } else e.showTip(a.data.Message, "warning"); else e.showTip(a.data.error_response.sub_msg);
            }
        }) : e.showTip("输入正确的邮箱号", "tips");
    },
    SaveEmail: function() {
        var t = this.data;
        a.getOpenId(function(n) {
            wx.request({
                url: a.getUrl("UserCenter.ashx?action=BindEmail"),
                data: {
                    OpenId: n,
                    email: t.email,
                    VerifyCode: t.EmailCode
                },
                success: function(a) {
                    void 0 == a.data.error_response ? "OK" == a.data.Status ? (wx.navigateBack({
                        delta: 2
                    }), e.showTip(a.data.Message, "success")) : e.showTip(a.data.Message, "warning") : e.showTip(a.data.error_response.sub_msg);
                }
            });
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