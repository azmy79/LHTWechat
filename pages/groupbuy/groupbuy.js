function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, e = Array(t.length); a < t.length; a++) e[a] = t[a];
        return e;
    }
    return Array.from(t);
}

var a = getApp(), e = require("../../utils/config.js");

Page({
    data: {
        PageIndex: 1,
        PageSize: 10,
        list: []
    },
    onLoad: function(t) {
        var e = this;
        a.getSiteSettingData(function(t) {
            e.setData(t);
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = this;
        a.getOpenId(function(i) {
            wx.request({
                url: a.getUrl("GroupBuy.ashx?action=GroupBuyActivityList"),
                data: {
                    openId: "oGbUa0dzLRtxz9sHYHbFPOemz1ow",
                    PageIndex: t.data.PageIndex,
                    PageSize: t.data.PageSize
                },
                success: function(a) {
                    "OK" == a.data.Status ? (a.data.List.forEach(function(t) {
                        t.Price = t.Price.toFixed(2), t.SalePrice = t.SalePrice.toFixed(2);
                    }), t.setData({
                        list: a.data.List
                    })) : (e.showTip(a.data.Status, "none"), wx.navigateBack({
                        delta: 1
                    }));
                }
            });
        });
    },
    gotogroupbuy: function(t) {
        t.currentTarget.dataset.groupbuyid;
        wx.navigateTo({
            url: "../groupbuyproductdetails/groupbuyproductdetails?groupbuyid=" + t.currentTarget.dataset.groupbuyid
        });
    },
    onHide: function() {},
    onReachBottom: function() {
        var e = this;
        a.getOpenId(function(i) {
            var n = e.data.PageIndex + 1;
            wx.request({
                url: a.getUrl("GroupBuy.ashx?action=GroupBuyActivityList"),
                data: {
                    openId: i,
                    PageIndex: n,
                    PageSize: e.data.PageSize
                },
                success: function(a) {
                    if ("OK" == a.data.Status) {
                        a.data.List.forEach(function(t) {
                            t.Price = t.Price.toFixed(2), t.SalePrice = t.SalePrice.toFixed(2);
                        });
                        var i = 1 == n ? a.data.List : [].concat(t(e.data.list), t(a.data.List));
                        e.setData({
                            list: i
                        });
                    }
                }
            });
        });
    },
    onShareAppMessage: function() {}
});