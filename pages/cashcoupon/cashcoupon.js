var e = require("../../utils/config.js"), a = getApp();

Page({
    data: {
        isEmpty: !0,
        PageIndex: 0,
        UsedType: 1,
        couponsList: [],
        refreshSuccess: !0,
        counpimg: a.getRequestUrl + "/Templates/xcxshop/images/counp-background.jpg",
        use_counpimg: a.getRequestUrl + "/Templates/xcxshop/images/use_counp.png",
        over_counpimg: a.getRequestUrl + "/Templates/xcxshop/images/over_counp.png",
        nullCounp: a.getRequestUrl + "/Templates/xcxshop/images/coupon_null.png"
    },
    onLoad: function(t) {
        var n = this, s = this;
        a.getOpenId(function(t) {
            var n = {
                openId: t,
                PageIndex: s.data.PageIndex + 1,
                PageSize: 10,
                UsedType: s.data.UsedType
            };
            wx.showNavigationBarLoading(), e.httpGet(a.getUrl("RedEnvelope.ashx?action=GetMyRedEnvelope"), n, s.getCouponsData);
        }), a.getSiteSettingData(function(e) {
            n.setData(e);
        });
    },
    getCouponsData: function(e) {
        var a = this;
        if ("NOUser" == e.Message) wx.navigateTo({
            url: "../login/login"
        }); else if ("OK" == e.Status) {
            var t = a.data.couponsList;
            if (e.Data.length > 0) {
                console.log(1111);
                for (var n = 0; n < e.Data.length; n++) {
                    var s = (g = e.Data[n]).StartTime.substring(0, 10).replace(/\-/g, "."), o = g.ClosingTime.substring(0, 10).replace(/\-/g, "."), i = "";
                    i = g.CanUseProducts && g.CanUseProducts.length > 0 ? "部分商品可用" : "全场通用";
                    var p = "";
                    p = g.OrderUseLimit > 0 ? "订单满" + g.OrderUseLimit.toFixed(2) + "元可用" : "订单金额无限制";
                    var g = {
                        couponsDate: s + "~" + o,
                        couponsPrice: g.Price,
                        couponsName: g.CouponName,
                        couponsCanUseProductse: i,
                        LimitText: p,
                        couponsId: g.CouponId
                    };
                    t.push(g);
                }
                a.setData({
                    PageIndex: a.data.PageIndex + 1,
                    couponsList: t
                }), a.setData({
                    refreshSuccess: !0
                }), wx.hideNavigationBarLoading();
            } else wx.hideNavigationBarLoading(), a.setData({
                isEmpty: !1
            });
        }
    },
    bingNoUseTap: function(t) {
        var n = this;
        n.setData({
            PageIndex: 0,
            UsedType: 1,
            couponsList: [],
            isEmpty: !0
        }), a.getOpenId(function(t) {
            var s = {
                openId: t,
                PageIndex: n.data.PageIndex + 1,
                PageSize: 10,
                UsedType: n.data.UsedType
            };
            wx.showNavigationBarLoading(), e.httpGet(a.getUrl("RedEnvelope.ashx?action=GetMyRedEnvelope"), s, n.getCouponsData);
        });
    },
    binghasUseTap: function(t) {
        var n = this;
        n.setData({
            PageIndex: 0,
            UsedType: 2,
            couponsList: [],
            isEmpty: !0
        }), a.getOpenId(function(t) {
            var s = {
                openId: t,
                PageIndex: n.data.PageIndex + 1,
                PageSize: 10,
                UsedType: n.data.UsedType
            };
            wx.showNavigationBarLoading(), e.httpGet(a.getUrl("RedEnvelope.ashx?action=GetMyRedEnvelope"), s, n.getCouponsData);
        });
    },
    bingExpiredTap: function(t) {
        var n = this;
        n.setData({
            PageIndex: 0,
            UsedType: 3,
            couponsList: [],
            isEmpty: !0
        }), a.getOpenId(function(t) {
            var s = {
                openId: t,
                PageIndex: n.data.PageIndex + 1,
                PageSize: 10,
                UsedType: n.data.UsedType
            };
            wx.showNavigationBarLoading(), e.httpGet(a.getUrl("RedEnvelope.ashx?action=GetMyRedEnvelope"), s, n.getCouponsData);
        });
    },
    onReachBottom: function() {
        var t = this;
        if (1 == t.data.refreshSuccess) {
            var n = t.data.PageIndex + 1;
            a.getOpenId(function(s) {
                var o = {
                    openId: s,
                    PageIndex: n,
                    PageSize: 10,
                    UsedType: t.data.UsedType
                };
                wx.showNavigationBarLoading(), t.setData({
                    refreshSuccess: !1
                }), e.httpGet(a.getUrl("RedEnvelope.ashx?action=GetMyRedEnvelope"), o, t.getCouponsData);
            });
        }
    }
});