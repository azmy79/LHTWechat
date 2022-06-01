App({
    onLaunch: function(t) {
        this.setRefferUserId(t.ReferralUserId), this.getSiteSettingData();
    },
  getRequestUrl: "http://47.96.106.14/",
    getUrl: function(t) {
        return this.getRequestUrl + "WeChatApplet/" + t;
    },
    globalData: {
      appId: "wx648524b84058cb47",
        secret: "",
        userInfo: null,
        siteInfo: null,
        ReferralInfo: null,
        ReferralSettingInfo: null,
        openId: "",
        wxUserInfo: null,
        QQMapKey: "7UPBZ-XO7WU-5HBVI-BCTF7-5N2CS-5YFIB",
        cartQuantity: 0,
        PrimaryColor: "#fb1438",
        PrimaryTxtColor: "#ffffff",
        SecondaryColor: "#424242",
        SecondaryTxtColor: "#ffffff"
    },
    getSiteSettingData: function(t, e) {
        var a = this, r = function() {
            var e = {
                PrimaryColor: a.globalData.PrimaryColor,
                PrimaryTxtColor: a.globalData.PrimaryTxtColor,
                PrimaryColorlight: a.hex2rgb(a.globalData.PrimaryColor, .1),
                SecondaryColor: a.globalData.SecondaryColor,
                SecondaryTxtColor: a.globalData.SecondaryTxtColor
            };
            wx.setStorage({
                key: "pcolor",
                data: e
            }), wx.setNavigationBarColor({
                frontColor: "#ffffff",
                backgroundColor: a.globalData.PrimaryColor
            }), t && t(e);
        };
        wx.request({
            url: this.getUrl("Common.ashx?action=GetSiteSettingData"),
            data: {
                openId: this.globalData.openId
            },
            success: function(e) {
                "OK" == (e = e.data).Status && (a.globalData.siteInfo = e.Data.SiteInfo, a.globalData.PrimaryColor = e.Data.SiteInfo.PrimaryColor || "#fb1438", 
                a.globalData.PrimaryTxtColor = e.Data.SiteInfo.PrimaryTxtColor || "#ffffff", a.globalData.SecondaryColor = e.Data.SiteInfo.SecondaryColor || "#424242", 
                a.globalData.SecondaryTxtColor = e.Data.SiteInfo.SecondaryTxtColor || "#ffffff", 
                a.getOpenId(function(t) {}, "noSkip"), t && t(), r());
            }
        });
    },
    hex2rgb: function(t, e) {
        var a = [ 0, 0, 0 ];
        return /#(..)(..)(..)/g.test(t) && (a = [ parseInt(RegExp.$1, 16), parseInt(RegExp.$2, 16), parseInt(RegExp.$3, 16) ]).push(e), 
        "rgba(" + a.join(",") + ")";
    },
    updateCartQuantity: function(t) {
        var e = this, a = this.globalData.openId;
        a && wx.request({
            url: this.getUrl("Cart.ashx?action=GetCartQuantity"),
            data: {
                openId: a
            },
            success: function(a) {
                var r = (a = a.data).Data.Quantity;
                e.globalData.cartQuantity = r, t && t(r), r > 0 ? wx.setTabBarBadge({
                    index: 2,
                    text: r + ""
                }) : wx.removeTabBarBadge({
                    index: 2
                });
            }
        });
    },
    setRefferUserId: function(t) {
        wx.setStorageSync("ReferralUserId", t);
    },
    getRefferUserId: function(t) {
        return wx.getStorageSync("ReferralUserId");
    },
    getUserOpenId: function(t) {
        wx.getStorageSync("mallAppletOpenId") && this.globalData.openId ? "function" == typeof t && t(this.globalData.openId) : "function" == typeof t && t("");
    },
    getOpenId: function(t, e) {
        var a = wx.getStorageSync("mallAppletOpenId");
        a && this.globalData.openId ? "function" == typeof t && t(this.globalData.openId) : a ? this.quickLogin(t, e) : e ? "function" == typeof t && t() : wx.navigateTo({
            url: "../login/login"
        });
    },
    goToCopyright: function() {
        wx.navigateTo({
            url: "../outurl/outurl?url=" + this.getRequestUrl + "hishop/index.html"
        });
    },
    quickLogin: function(t, e) {
        var a = this;
        wx.login({
            success: function(r) {
                r.code && (a.globalData.jsCode = r.code, wx.getUserInfo({
                    success: function(e) {
                        var o = {
                            headImage: e.userInfo.avatarUrl,
                            encryptedData: e.encryptedData,
                            iv: e.iv,
                            js_code: r.code
                        }, n = a.getRefferUserId();
                        o.referralUserId = n, wx.request({
                            url: a.getUrl("Login.ashx?action=QuickLogin"),
                            data: o,
                            success: function(e) {
                                e = e.data, wx.hideLoading(), "OK" === e.Status && (e.Data.IsReferral && !e.Data.IsRepeled && wx.setStorageSync("ReferralUserId", e.Data.UserId), 
                                a.setUserInfo(e.Data), "function" == typeof t && t(e.Data.OpenId), a.updateCartQuantity());
                            }
                        });
                    },
                    fail: function(t) {
                        wx.hideLoading(), e || wx.navigateTo({
                            url: "../login/login"
                        });
                    }
                }));
            }
        });
    },
    setUserInfo: function(t) {
        wx.setStorage({
            key: "mallAppletOpenId",
            data: t.OpenId
        }), this.globalData.userInfo = t, this.globalData.openId = t.OpenId;
    },
    showErrorModal: function(t, e) {
        wx.showModal({
            title: "提示",
            content: t,
            showCancel: !1,
            confirmColor: "#ff221a",
            success: function(t) {
                e && e(t);
            }
        });
    },
    checkEmail: function(t) {
        return new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$").test(t);
    },
    orderPay: function(t, e, a, r) {
        var o = this;
        o.getOpenId(function(n) {
            wx.request({
                url: o.getUrl("Order.ashx?action=GetPayParam"),
                data: {
                    openId: n,
                    orderId: t
                },
                success: function(i) {
                    if ("OK" == i.data.Status) {
                        var l = i.data.Data;
                        wx.requestPayment({
                            timeStamp: l.timeStamp,
                            nonceStr: l.nonceStr,
                            package: "prepay_id=" + l.prepayId,
                            signType: "MD5",
                            paySign: l.sign,
                            success: function(i) {
                                wx.showModal({
                                    title: "提示",
                                    content: "支付成功！",
                                    showCancel: !1,
                                    success: function(i) {
                                        i.confirm && wx.requestSubscribeMessage({
                                            tmplIds: r,
                                            success: function(e) {
                                                if ("requestSubscribeMessage:ok" == e.errMsg) {
                                                    var a = Object.keys(e).filter(function(t) {
                                                        return "accept" === e[t];
                                                    });
                                                    if (a.length > 0) {
                                                        var r = a[0];
                                                        wx.request({
                                                            url: o.getUrl("Common.ashx?action=GetAuthorizedSubscribeMessage"),
                                                            data: {
                                                                templateIds: r,
                                                                orderId: t,
                                                                openId: n
                                                            },
                                                            success: function(t) {}
                                                        });
                                                    }
                                                }
                                            },
                                            fail: function(t) {
                                                20004 == t.errCode && wx.showModal({
                                                    title: "提示",
                                                    content: "建议开启订阅消息，接收商城发送的消息通知",
                                                    cancelText: "取消",
                                                    confirmText: "去开启",
                                                    showCancel: !0,
                                                    success: function(t) {
                                                        wx.openSetting({});
                                                    }
                                                });
                                            },
                                            complete: function(r) {
                                                "fightGroup" !== a ? wx.redirectTo({
                                                    url: "../orderlist/orderlist?status=" + e
                                                }) : wx.redirectTo({
                                                    url: "../fightshare/fightshare?orderid=" + t + "&fightGroupId=" + e
                                                });
                                            }
                                        });
                                    }
                                });
                            },
                            fail: function(t) {
                                wx.showModal({
                                    title: "提示",
                                    content: "支付失败！",
                                    showCancel: !1,
                                    success: function(t) {
                                        "orderlist" != a && t.confirm && wx.redirectTo({
                                            url: "../orderlist/orderlist?status=" + ("fightGroup" !== a ? e : "0")
                                        });
                                    }
                                });
                            }
                        });
                    } else wx.showModal({
                        title: "提示",
                        content: i.data.Message,
                        showCancel: !1,
                        success: function(t) {
                            "orderlist" != a && t.confirm && wx.redirectTo({
                                url: "../orderlist/orderlist?status=" + e
                            });
                        }
                    });
                }
            });
        });
    },
    add: function(t, e) {
        t += "", e += "";
        var a = void 0, r = void 0;
        try {
            a = t.split(".")[1].length;
        } catch (t) {
            a = 0;
        }
        try {
            r = e.split(".")[1].length;
        } catch (t) {
            r = 0;
        }
        var o = Math.pow(10, Math.max(a, r));
        return (this.multiply(t, o) + this.multiply(e, o)) / o;
    },
    subtract: function(t, e) {
        t += "", e += "";
        var a = void 0, r = void 0;
        try {
            a = t.split(".")[1].length;
        } catch (t) {
            a = 0;
        }
        try {
            r = e.split(".")[1].length;
        } catch (t) {
            r = 0;
        }
        var o = Math.pow(10, Math.max(a, r));
        return (this.multiply(t, o) - this.multiply(e, o)) / o;
    },
    multiply: function(t, e) {
        var a = 0, r = t + "", o = e + "";
        try {
            a += r.split(".")[1].length;
        } catch (t) {}
        try {
            a += o.split(".")[1].length;
        } catch (t) {}
        return Number(r.replace(".", "")) * Number(o.replace(".", "")) / Math.pow(10, a);
    },
    divide: function(t, e) {
        t += "", e += "";
        var a = 0, r = 0;
        try {
            a = t.split(".")[1].length;
        } catch (t) {}
        try {
            r = e.split(".")[1].length;
        } catch (t) {}
        var o = Number(t.replace(".", "")), n = Number(e.replace(".", ""));
        return this.multiply(o / n, Math.pow(10, r - a));
    }
}), Number.prototype.toFixed = function(t) {
    e = this + "";
    if (t || (t = 0), -1 == e.indexOf(".") && (e += "."), e += new Array(t + 1).join("0"), 
    new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (t + 1) + "})?)\\d*$").test(e)) {
        var e = "0" + RegExp.$2, a = RegExp.$1, r = RegExp.$3.length;
        return r == t + 2 && (e = (r = e.match(/\d/g)).join("").replace(new RegExp("(\\d+)(\\d{" + t + "})\\d$"), "$1.$2")), 
        e = e.substr(1), (a + e).replace(/\.$/, "");
    }
    return this + "";
};