var e = require("../../utils/config.js"), a = getApp();

Page({
    data: {
        TypeIndex: -1,
        TypeList: [ "手机找回密码", "邮箱找回密码" ],
        CodeType: 1,
        isHidePage1: !1,
        NeedValidate: 0,
        Phone: "",
        Email: "",
        imgCode: "",
        PhoneText: "发送验证码",
        IsSend: !1,
        disabled: !1
    },
    onLoad: function(t) {
        var s = this;
        if (a.globalData.userInfo.CellPhone) {
            var n = a.globalData.userInfo.CellPhone;
            s.setData({
                Phone: n.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"),
                disabled: !1
            });
        } else e.showTip("您暂未绑定手机号，不能通过手机找回交易密码"), this.setData({
            disabled: !0
        });
        s.setData({
            VerifyCode: a.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + a.globalData.openId
        }), a.getSiteSettingData(function(e) {
            s.setData(e);
        });
    },
    ShowType: function(t) {
        var s = this;
        wx.showActionSheet({
            itemList: s.data.TypeList,
            success: function(t) {
                if (!t.cancel) {
                    if ("邮箱找回密码" == s.data.TypeList[t.tapIndex]) if (s.data.CodeType = 2, a.globalData.userInfo.Email) {
                        var n = a.globalData.userInfo.Email;
                        s.setData({
                            Email: n.replace(/(.{2}).+(.{2}@.+)/g, "$1****$2"),
                            disabled: !1
                        });
                    } else e.showTip("您暂未绑定邮箱，不能通过邮箱找回交易密码"), this.setData({
                        disabled: !0
                    });
                    s.setData({
                        TypeIndex: t.tapIndex,
                        CodeType: s.data.CodeType
                    });
                }
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    bindReset: function(e) {
        var a = this;
        a.setData({
            currentPage: "page2"
        }), setTimeout(function() {
            a.setData({
                showPage2: !0,
                isHidePage1: !0
            });
        }, 500);
    },
    InputValue: function(e) {
        var a = e.currentTarget.dataset.key;
        this.data[a] = e.detail.value;
    },
    bindImgCode: function(e) {
        this.setData({
            VerifyCode: a.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + a.globalData.openId + "&&d=" + new Date()
        });
    },
    bindSendTelCode: function(t) {
        if (!this.data.IsSend) {
            var s = this, n = this.data;
            a.globalData.userInfo.CellPhone ? !n.ImageCode || n.ImageCode.length <= 0 ? e.showTip("输入图形验证码", "warning") : wx.request({
                url: a.getUrl("UserCenter.ashx?action=SendVerifyCode"),
                data: {
                    Phone: a.globalData.userInfo.CellPhone,
                    imgCode: n.ImageCode,
                    IsValidPhone: !0,
                    OpenId: a.globalData.openId
                },
                success: function(a) {
                    if (void 0 == a.data.error_response) if ("OK" == a.data.Status) {
                        e.showTip("验证码发送成功", "success");
                        var t = 60, n = setInterval(function() {
                            t > 0 ? (t--, s.setData({
                                PhoneText: t + "s后可重发",
                                IsSend: !0
                            })) : (s.setData({
                                PhoneText: "发送验证码",
                                IsSend: !1
                            }), clearInterval(n));
                        }, 1e3);
                    } else e.showTip(a.data.Message, "warning"); else e.showTip(a.data.error_response.sub_msg);
                }
            }) : e.showTip("请先绑定手机", "warning");
        }
    },
    bindSendEmailCode: function(t) {
        if (!this.data.IsSend) {
            var s = this;
            a.getOpenId(function(t) {
                wx.request({
                    url: a.getUrl("UserCenter.ashx?action=SendEmailVerifyCode"),
                    data: {
                        openId: t,
                        Email: a.globalData.userInfo.Email,
                        needValidate: 1
                    },
                    success: function(a) {
                        if (void 0 == a.data.error_response) {
                            if ("OK" == a.data.Status) {
                                e.showTip(a.data.Message, "success");
                                var t = 60, n = setInterval(function() {
                                    t > 0 ? (t--, s.setData({
                                        PhoneText: t + "s后可重发",
                                        IsSend: !0
                                    })) : (s.setData({
                                        PhoneText: "发送验证码",
                                        IsSend: !1
                                    }), clearInterval(n));
                                }, 1e3);
                            }
                        } else e.showTip(a.data.error_response.sub_msg);
                    },
                    complete: function() {}
                });
            });
        }
    },
    bindPhoneBtn: function(t) {
        var s = this;
        parseInt(s.data.TypeIndex) < 0 ? wx.showModal({
            title: "提示",
            content: "请选择重置密码方式",
            showCancel: !1,
            confirmColor: "#ff5722"
        }) : a.getOpenId(function(t) {
            wx.request({
                url: a.getUrl("UserCenter.ashx?action=ResetTradePassword"),
                data: {
                    openId: t,
                    CodeType: s.data.CodeType,
                    verifycode: s.data.PhoneCode,
                    password: s.data.Password,
                    repassword: s.data.RePassword
                },
                success: function(a) {
                    void 0 == a.data.error_response ? "OK" == a.data.Status && (e.showTip(a.data.Message, "success"), 
                    setTimeout(function() {
                        wx.navigateBack();
                    }, 2e3)) : e.showTip(a.data.error_response.sub_msg);
                },
                complete: function() {}
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