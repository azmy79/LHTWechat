var a = require("../../utils/config.js"), e = getApp();

Page({
    data: {
        pageIndex: 0,
        couponsList: [],
        refreshSuccess: !0,
        counpimg: e.getRequestUrl + "/Templates/xcxshop/images/counp-background.jpg"
    },
    onLoad: function(a) {
        this.initData(1);
    },
    initData: function(t) {
        var n = this;
        t < 1 && (t = 1), n.setData({
            pageIndex: t
        }), e.getOpenId(function(t) {
            var s = {
                openId: t,
                pageIndex: n.data.pageIndex,
                pageSize: 10
            };
            wx.showNavigationBarLoading(), a.httpGet(e.getUrl("Coupon.ashx?action=LoadSiteCoupon"), s, n.getCouponsData);
        });
    },
    getCouponsData: function(a) {
        var e = this;
        if ("NOUser" == a.Message) wx.navigateTo({
            url: "../login/login"
        }); else if ("OK" == a.Status) {
            var t = e.data.couponsList;
            if (a.Data.length > 0) {
                for (var n = 0; n < a.Data.length; n++) {
                    var s = (u = a.Data[n]).StartTime.substring(0, 10).replace(/\-/g, "."), o = u.ClosingTime.substring(0, 10).replace(/\-/g, "."), i = "";
                    i = u.CanUseProducts && u.CanUseProducts.length > 0 ? "部分商品可用" : "全场通用";
                    var r = "";
                    r = u.OrderUseLimit > 0 ? "订单满" + u.OrderUseLimit + "元可用" : "订单金额无限制";
                    var u = {
                        couponsDate: s + "~" + o,
                        couponsPrice: parseFloat(u.Price),
                        couponsName: u.CouponName,
                        couponsCanUseProductse: i,
                        LimitText: r,
                        couponsId: u.CouponId,
                        canReceive: !0
                    };
                    t.push(u);
                }
                e.setData({
                    pageIndex: e.data.pageIndex + 1,
                    couponsList: t
                });
            }
            e.setData({
                refreshSuccess: !0
            }), wx.hideNavigationBarLoading();
        } else wx.hideNavigationBarLoading();
    },
    setCanReceive: function(a, e) {
        var t = this.data.couponsList, n = t.find(function(e) {
            return e.couponsId == a;
        });
        n && (n.canReceive = e, this.setData({
            couponsList: t
        }));
    },
    getCoupon: function(t) {
        var n = this, s = t.currentTarget.id;
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("Coupon.ashx?action=UserGetCoupon"),
                data: {
                    openId: t,
                    couponId: s
                },
                success: function(e) {
                    "OK" == e.data.Status ? a.showTip(e.data.Message, "success") : "NOUser" == e.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : (n.setCanReceive(s, !1), a.showTip(e.data.Message, "warning"));
                }
            });
        });
    },
    onReachBottom: function() {
        var a = this;
        if (1 == a.data.refreshSuccess) {
            var e = a.data.pageIndex + 1;
            a.initData(e);
        }
    }
});