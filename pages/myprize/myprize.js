function t(t) {
    if (Array.isArray(t)) {
        for (var e = 0, a = Array(t.length); e < t.length; e++) a[e] = t[e];
        return a;
    }
    return Array.from(t);
}

var e = getApp(), a = require("../../utils/config.js");

Page({
    data: {
        type: 1,
        PageIndex: 1,
        refreshSuccess: !1
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {
        var t = this;
        console.log(this.data.type), e.getSiteSettingData(function(e) {
            t.setData(e);
        }), e.getOpenId(function(r) {
            t.setData({
                PageIndex: 1,
                list: []
            });
            var n = {
                openId: r,
                PageIndex: t.data.PageIndex,
                PageSize: 10
            };
            1 == t.data.type ? a.httpGet(e.getUrl("Order.ashx?action=GetCurrUserNoAcceptPrize"), n, function(e) {
                console.log(e), "OK" == e.Status && t.setData({
                    list: e.List
                }), t.data.list.length > 0 && t.setData({
                    refreshSuccess: !0
                });
            }) : a.httpGet(e.getUrl("Order.ashx?action=GetCurrUserAcceptPrize"), n, function(e) {
                console.log(e), "OK" == e.Status && t.setData({
                    list: e.List
                }), t.data.list.length > 0 && t.setData({
                    refreshSuccess: !0
                });
            });
        });
    },
    bindGifttap: function(t) {
        var r = this;
        this.setData({
            PageIndex: 1,
            list: []
        });
        var n = t.currentTarget.dataset.type, i = this.data.PageIndex;
        e.getOpenId(function(t) {
            var s = {
                openId: t,
                PageIndex: i,
                PageSize: 10
            };
            1 == n && a.httpGet(e.getUrl("Order.ashx?action=GetCurrUserNoAcceptPrize"), s, function(t) {
                console.log(t), "OK" == t.Status && r.setData({
                    list: t.List
                });
            }), 2 == n && a.httpGet(e.getUrl("Order.ashx?action=GetCurrUserAcceptPrize"), s, function(t) {
                console.log(t), "OK" == t.Status && r.setData({
                    list: t.List
                });
            }), r.data.list.length > 0 && r.setData({
                refreshSuccess: !0
            }), r.setData({
                type: n,
                PageIndex: i
            });
        });
    },
    gotodeail: function(t) {
        var e = t.currentTarget.dataset.giftid, a = t.currentTarget.dataset.prizetype, r = t.currentTarget.dataset.recordid;
        1 == a ? wx.navigateTo({
            url: "../userintegral/userintegral"
        }) : 2 == a ? wx.navigateTo({
            url: "../coupon/coupon"
        }) : 1 == this.data.type ? wx.navigateTo({
            url: "../giftDetail/giftDetail?giftId=" + e + "&recordid=" + r
        }) : wx.navigateTo({
            url: "../giftDetail/giftDetail?giftId=" + e + "&recordid=nonebtn"
        });
    },
    onReachBottom: function() {
        var r = this;
        this.data.refreshSuccess && e.getOpenId(function(n) {
            var i = r.data.PageIndex + 1, s = {
                openId: n,
                PageIndex: i,
                PageSize: 10
            };
            r.setData({
                PageIndex: i
            }), 1 == r.data.type && a.httpGet(e.getUrl("Order.ashx?action=GetCurrUserNoAcceptPrize"), s, function(e) {
                if ("OK" == e.Status) {
                    var a = 1 == r.data.PageIndex ? e.List : [].concat(t(r.data.List), t(e.List));
                    r.setData({
                        list: a
                    });
                }
            }), 2 == r.data.type && a.httpGet(e.getUrl("Order.ashx?action=GetCurrUserAcceptPrize"), s, function(e) {
                if ("OK" == e.Status) {
                    var a = 1 == r.data.PageIndex ? e.List : [].concat(t(r.data.list), t(e.List));
                    console.log(r.data.type + e.Status), r.setData({
                        list: a
                    });
                }
            });
        });
    },
    onShareAppMessage: function() {}
});