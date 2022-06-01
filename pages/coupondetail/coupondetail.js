var e = require("../../utils/config.js"), o = getApp();

Page({
    data: {
        CouponName: "",
        Price: 0,
        LimitText: "",
        CanUseProducts: "",
        CouponsDate: "",
        CouponId: "",
        coupimg: o.getRequestUrl + "/Templates/xcxshop/images/coupdetail-back.jpg",
        coupimgLine: o.getRequestUrl + "/Templates/xcxshop/images/coup-line.jpg"
    },
    onLoad: function(e) {
        var o = this, t = e.CouponId;
        o.setData({
            CouponId: t
        });
    },
    onShow: function() {
        var t = this;
        o.getOpenId(function(n) {
            var a = {
                openId: n,
                couponId: t.data.CouponId
            };
            e.httpGet(o.getUrl("Coupon.ashx?action=GetCouponDetail"), a, t.getCouponsData);
        });
    },
    getCouponsData: function(e) {
        var o = this;
        if ("NOUser" == e.Message) wx.navigateTo({
            url: "../login/login"
        }); else if ("OK" == e.Status) {
            var t = e.Data, n = t.StartTime.substring(0, 10).replace("-", "."), a = t.ClosingTime.substring(0, 10).replace("-", "."), s = "";
            s = t.CanUseProducts && t.CanUseProducts > 0 ? "部分商品可用" : "全场通用";
            var i = "";
            i = t.OrderUseLimit > 0 ? "订单满" + t.OrderUseLimit.toFixed(2) + "元可用" : "订单金额无限制", 
            o.setData({
                CouponName: t.CouponName,
                Price: t.Price,
                LimitText: i,
                CanUseProducts: s,
                CouponsDate: n + "~" + a,
                CouponId: t.CouponId
            });
        } else wx.showModal({
            title: "提示",
            content: result.data.Message,
            showCancel: !1,
            success: function(e) {
                e.confirm && wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    GetCoupon: function() {
        var e = this.data.CouponId;
        "" == e || parseInt(e) <= 0 ? wx.showModal({
            title: "提示",
            content: "领取的优惠券不存在",
            showCancel: !1,
            success: function(e) {
                e.confirm && wx.navigateBack({
                    delta: 1
                });
            }
        }) : o.getOpenId(function(t) {
            wx.request({
                url: o.getUrl("Coupon.ashx?action=UserGetCoupon"),
                data: {
                    openId: t,
                    couponId: e
                },
                success: function(e) {
                    "OK" == e.data.Status ? wx.showModal({
                        title: "提示",
                        content: e.data.Message,
                        showCancel: !1
                    }) : "NO" == e.data.Status && ("NOUser" == e.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showToast({
                        title: e.data.Message,
                        image: "../../images/icon-warning.png"
                    }));
                }
            });
        });
    },
    onReady: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});