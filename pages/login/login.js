var e = getApp();

Page({
    data: {
        disabled: !0,
        userName: "",
        password: "",
        ReferralUserId: "",
        regChecked: !0
    },
    onLoad: function(a) {
        var t = this;
        e.getSiteSettingData(function(e) {
            t.setData(e);
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    bindUserNameInput: function(e) {
        this.setData({
            userName: e.detail.value
        });
    },
    bindPwdInput: function(e) {
        this.setData({
            password: e.detail.value
        }), this.data.userName.length > 0 && this.data.password.length > 0 ? this.setData({
            disabled: !1
        }) : this.setData({
            disabled: !0
        });
    },
    loginbyUser: function(a) {
        if ("getUserInfo:ok" === a.detail.errMsg) {
            var t = this.data.userName, n = this.data.password;
            n.length < 6 ? wx.showModal({
                title: "提示",
                content: "密码长度不能少于6位",
                showCancel: !1
            }) : (wx.showLoading({
                title: "正在登录"
            }), wx.login({
                success: function(a) {
                    a.code && (e.globalData.jsCode = a.code, wx.getUserInfo({
                        success: function(o) {
                            var s = {
                                userName: t,
                                password: n,
                                nickName: o.nikeName,
                                unionId: o.unionId,
                                encryptedData: o.encryptedData,
                                session_key: o.session_key,
                                iv: o.iv,
                                headImage: o.userInfo.avatarUrl,
                                js_code: a.code
                            }, i = e.getRefferUserId();
                            s.referralUserId = i, wx.request({
                                url: e.getUrl("Login.ashx?action=LoginByUserName"),
                                data: s,
                                success: function(a) {
                                    "OK" == (a = a.data).Status ? (a.Data.IsReferral && !a.Data.IsRepeled && wx.setStorageSync("ReferralUserId", a.Data.UserId), 
                                    wx.hideLoading(), e.setUserInfo(a.Data), a.Data.SendGiftCouponNum && wx.showToast({
                                        title: "恭喜您注册成功，1张优惠券已经放入您的账户",
                                        icon: "none"
                                    }), e.globalData.siteInfo.QuickLoginIsForceBindingMobbile && !e.globalData.userInfo.CellPhone ? wx.redirectTo({
                                        url: "../userbindphone/userbindphone"
                                    }) : wx.navigateBack()) : (wx.hideLoading(), wx.showModal({
                                        title: "提示",
                                        content: a.Message,
                                        showCancel: !1,
                                        confirmColor: "#ff5722",
                                        success: function(e) {}
                                    }));
                                }
                            });
                        },
                        fail: function(e) {
                            wx.hideLoading();
                        }
                    }));
                }
            }));
        }
    },
    quickLogin: function(a) {
        "getUserInfo:ok" === a.detail.errMsg && (this.data.regChecked ? (wx.showLoading({
            title: "登录中...",
            mask: !0
        }), e.quickLogin(function() {
            e.globalData.userInfo.SendGiftCouponNum && wx.showToast({
                title: "恭喜您注册成功，1张优惠券已经放入您的账户",
                icon: "none"
            }), e.globalData.siteInfo.QuickLoginIsForceBindingMobbile && !e.globalData.userInfo.CellPhone ? wx.redirectTo({
                url: "../userbindphone/userbindphone"
            }) : wx.navigateBack();
        })) : wx.showToast({
            title: "请先同意注册协议",
            icon: "none"
        }));
    },
    checkboxChange: function(e) {
        this.setData({
            regChecked: e.detail.value[0] || !1
        });
    },
    goProtocol: function() {
        wx.navigateTo({
            url: "../outurl/outurl?url=" + e.getRequestUrl + "WapShop/RegisterAgreement"
        });
    }
});