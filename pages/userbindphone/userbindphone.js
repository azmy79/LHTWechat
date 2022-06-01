var e = require("../../utils/config.js"), t = getApp();

Page({
    data: {
        PhoneText: "发送验证码",
        IsSend: !1,
        PhoneCell: ""
    },
    onLoad: function(e) {
        var a = this;
        this.setData({
            UserName: t.globalData.userInfo.realName,
            VcodeUrl: t.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + t.globalData.openId,
            PhoneCell: e.phone
        }), t.getSiteSettingData(function(e) {
            a.setData(e);
        });
    },
    ChangeCode: function() {
        this.setData({
            VcodeUrl: t.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + t.globalData.openId + "&&d=" + new Date()
        });
    },
    InputValue: function(e) {
        var t = e.currentTarget.dataset.key;
        this.data[t] = e.detail.value;
    },
    GetPhoneCode: function() {
        var a = this, o = this.data;
        o.PhoneCell && e.checkPhone(o.PhoneCell) ? !o.ImageCode || o.ImageCode.length <= 0 ? e.showTip("输入图形验证码", "tips") : wx.request({
            url: t.getUrl("UserCenter.ashx?action=SendVerifyCode"),
            data: {
                Phone: o.PhoneCell,
                imgCode: o.ImageCode,
                IsValidPhone: !0,
                OpenId: t.globalData.openId
            },
            success: function(t) {
                if (void 0 == t.data.error_response) if ("OK" == t.data.Status) {
                    e.showTip("验证码发送成功", "success");
                    var o = 60, n = setInterval(function() {
                        o > 0 ? (o--, a.setData({
                            PhoneText: o + "s后可重发",
                            IsSend: !0
                        })) : (a.setData({
                            PhoneText: "发送验证码",
                            IsSend: !1
                        }), clearInterval(n));
                    }, 1e3);
                } else e.showTip(t.data.Message, "warning"); else e.showTip(t.data.error_response.sub_msg);
            }
        }) : e.showTip("手机号格式不对", "tips");
    },
    getPhoneNumber: function(a) {
        var o = this;
        "getPhoneNumber:ok" === a.detail.errMsg && e.httpGet(t.getUrl("UserCenter.ashx?action=GetBindWXPhone"), {
            openId: t.globalData.openId,
            encryptedData: a.detail.encryptedData,
            iv: a.detail.iv,
            js_code: t.globalData.jsCode
        }, function(e) {
            "OK" === e.Status ? (wx.showToast({
                title: e.Data.Message
            }), t.globalData.userInfo.CellPhone = e.Data.CellPhone, "changePwd" == o.data.formPage ? o.setInitState() : setTimeout(function() {
                wx.navigateBack({
                    delta: 1
                });
            }, 1500)) : wx.showToast({
                title: e.error_response.sub_msg,
                icon: "none"
            });
        });
    },
    Savephone: function() {
        var a = this.data;
        e.checkPhone(a.PhoneCell) ? a.PhoneCode.length <= 0 ? e.showTip("输入手机验证码", "tips") : t.getOpenId(function(o) {
            wx.request({
                url: t.getUrl("UserCenter.ashx?action=BindPhone"),
                data: {
                    OpenId: o,
                    phone: a.PhoneCell,
                    VerifyCode: a.PhoneCode
                },
                success: function(t) {
                    void 0 == t.data.error_response ? "OK" == t.data.Status ? (e.showTip(t.data.Message, "success"), 
                    wx.switchTab({
                        url: "../userhome/userhome"
                    })) : e.showTip(t.data.Message, "warning") : e.showTip(t.data.error_response.sub_msg);
                }
            });
        }) : e.showTip("手机号格式不对", "tips");
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});