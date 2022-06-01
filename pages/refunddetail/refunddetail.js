var t = require("../../utils/util.js"), e = getApp();

Page({
    data: {
        RefundInfo: null,
        Credentials: [],
        ProgressStatue: [],
        isExpend: !0
    },
    ExpendProgress: function() {
        var t = !this.data.isExpend;
        this.setData({
            isExpend: t
        });
    },
    onLoad: function(t) {
        var a = this, n = t.id;
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("OrderRefund.ashx?action=GetRefundDetail"),
                data: {
                    openId: t,
                    RefundId: n
                },
                success: function(t) {
                    if ("OK" == t.data.Status) {
                        var n = t.data.Data, i = [];
                        "".length > 0 && (i = "".split(",")), a.setData({
                            RefundInfo: n,
                            Credentials: i
                        }), a.ShowProgress(n);
                    } else "NOUser" == t.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: t.data.ErrorResponse.ErrorMsg,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                    e.getSiteSettingData(function(t) {
                        a.setData(t);
                    });
                },
                complete: function() {}
            });
        });
    },
    ShowProgress: function(e) {
        var a = this, n = {
            status: parseInt(e.Status),
            time: t.formatTime(e.ApplyForTime),
            finishedTime: t.formatTime(e.DealTime)
        };
        a.setData({
            ProgressStatue: n
        });
    },
    goToProductDetail: function(t) {
        var a = t.currentTarget.dataset.productid, n = t.currentTarget.dataset.storeid;
        wx.request({
            url: e.getUrl("Product.ashx?action=GetProductActivity"),
            data: {
                productId: a,
                storeid: n
            },
            success: function(t) {
                t = t.data;
                var e = "../productdetail/productdetail?id=" + a + "&storeid=" + n + (1 === t.ActiveType ? "&activeid=" + t.ActiveId : "");
                6 == t.ActiveType && (e = "../fightdetail/fightdetail?activeid=" + t.ActiveId), 
                wx.navigateTo({
                    url: e
                });
            }
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