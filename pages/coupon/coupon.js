var e = require("../../utils/config.js"), a = getApp();

Page({
    data: {
        isEmpty: !0,
        pageIndex: 0,
        couponType: 1,
        couponsList: [],
        refreshSuccess: !0,
        counpimg: a.getRequestUrl + "/Templates/xcxshop/images/counp-background.jpg",
        use_counpimg: a.getRequestUrl + "/Templates/xcxshop/images/use_counp.png",
        over_counpimg: a.getRequestUrl + "/Templates/xcxshop/images/over_counp.png",
        nullCounp: a.getRequestUrl + "/Templates/xcxshop/images/coupon_null.png"
    },
    onLoad: function(o) {
        var t = this, n = this;
        a.getOpenId(function(o) {
            var t = {
                openId: o,
                pageIndex: n.data.pageIndex + 1,
                pageSize: 10,
                couponType: n.data.couponType
            };
            wx.showNavigationBarLoading(), e.httpGet(a.getUrl("Coupon.ashx?action=LoadCoupon"), t, n.getCouponsData);
        }), a.getSiteSettingData(function(e) {
            t.setData(e);
        });
    },
    getCouponsData: function(e) {
        var a = this;
        if ("NOUser" == e.Message) wx.navigateTo({
            url: "../login/login"
        }); else if ("OK" == e.Status) {
            var o = a.data.couponsList;
            if (e.Data.length > 0) {
                for (var t = 0; t < e.Data.length; t++) {
                    var n = (g = e.Data[t]).StartTime.substring(0, 10).replace(/\-/g, "."), p = g.ClosingTime.substring(0, 10).replace(/\-/g, "."), s = "";
                    s = g.CanUseProducts && g.CanUseProducts.length > 0 ? "部分商品可用" : "全场通用";
                    var i = "";
                    i = g.OrderUseLimit > 0 ? "订单满" + g.OrderUseLimit.toFixed(2) + "元可用" : "订单金额无限制";
                    var g = {
                        couponsDate: n + "~" + p,
                        couponsPrice: g.Price,
                        couponsName: g.CouponName,
                        couponsCanUseProductse: s,
                        LimitText: i,
                        couponsId: g.CouponId
                    };
                    o.push(g);
                }
                a.setData({
                    pageIndex: a.data.pageIndex + 1,
                    couponsList: o
                }), a.setData({
                    refreshSuccess: !0
                }), wx.hideNavigationBarLoading();
            }
        } else wx.hideNavigationBarLoading(), a.data.pageIndex > 0 ? a.setData({
            isEmpty: !0
        }) : a.setData({
            isEmpty: !1
        });
    },
    bingNoUseTap: function(o) {
        var t = this;
        t.setData({
            pageIndex: 0,
            couponType: 1,
            couponsList: [],
            isEmpty: !0
        }), a.getOpenId(function(o) {
            var n = {
                openId: o,
                pageIndex: t.data.pageIndex + 1,
                pageSize: 10,
                couponType: t.data.couponType
            };
            wx.showNavigationBarLoading(), e.httpGet(a.getUrl("Coupon.ashx?action=LoadCoupon"), n, t.getCouponsData);
        });
    },
    binghasUseTap: function(o) {
        var t = this;
        t.setData({
            pageIndex: 0,
            couponType: 2,
            couponsList: [],
            isEmpty: !0
        }), a.getOpenId(function(o) {
            var n = {
                openId: o,
                pageIndex: t.data.pageIndex + 1,
                pageSize: 10,
                couponType: t.data.couponType
            };
            wx.showNavigationBarLoading(), e.httpGet(a.getUrl("Coupon.ashx?action=LoadCoupon"), n, t.getCouponsData);
        });
    },
    bingExpiredTap: function(o) {
        var t = this;
        t.setData({
            pageIndex: 0,
            couponType: 3,
            couponsList: [],
            isEmpty: !0
        }), a.getOpenId(function(o) {
            var n = {
                openId: o,
                pageIndex: t.data.pageIndex + 1,
                pageSize: 10,
                couponType: t.data.couponType
            };
            wx.showNavigationBarLoading(), e.httpGet(a.getUrl("Coupon.ashx?action=LoadCoupon"), n, t.getCouponsData);
        });
    },
    onReachBottom: function() {
        var o = this;
        if (1 == o.data.refreshSuccess) {
            var t = o.data.pageIndex + 1;
            a.getOpenId(function(n) {
                var p = {
                    openId: n,
                    pageIndex: t,
                    pageSize: 10,
                    couponType: o.data.couponType
                };
                wx.showNavigationBarLoading(), o.setData({
                    refreshSuccess: !1
                }), e.httpGet(a.getUrl("Coupon.ashx?action=LoadCoupon"), p, o.getCouponsData);
            });
        }
    }
});