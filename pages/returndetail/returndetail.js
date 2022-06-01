var t = require("../../utils/util.js"), e = getApp();

Page({
    data: {
        RefundInfo: null,
        ProgressStatue: [],
        Credentials: [],
        isExpend: !0,
        id: ""
    },
    onLoad: function(t) {
        var a = this;
        a.setData({
            id: t.id
        }), a.loadData(), e.getSiteSettingData(function(t) {
            a.setData(t);
        });
    },
    loadData: function() {
        var t = this;
        e.getOpenId(function(a) {
            wx.request({
                url: e.getUrl("OrderRefund.ashx?action=GetReturnDetail"),
                data: {
                    openId: a,
                    returnId: t.data.id
                },
                success: function(e) {
                    if ("OK" == e.data.Status) {
                        var a = e.data.Data;
                        t.setData({
                            RefundInfo: a,
                            Credentials: a.UserCredentials
                        }), wx.setNavigationBarTitle({
                            title: a.IsOnlyRefund ? "退款详情" : "退货详情"
                        }), t.ShowProgress(a);
                    } else "NOUser" == e.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: e.data.ErrorResponse.ErrorMsg,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                }
            });
        });
    },
    prevImage: function(t) {
        var e = this, a = (t.target.dataset.index, t.target.dataset.src);
        wx.previewImage({
            current: a,
            urls: e.data.Credentials
        });
    },
    ExpendProgress: function() {
        var t = !this.data.isExpend;
        this.setData({
            isExpend: t
        });
    },
    ShowProgress: function(e) {
        var a = this, i = parseInt(e.Status), s = [ {
            statue: 0,
            statuename: e.IsOnlyRefund ? "申请退款中" : "申请退货中",
            time: t.formatTime(e.ApplyForTime),
            ishidden: !1,
            isactive: !0
        }, {
            statue: e.IsOnlyRefund ? 1 : 3,
            statuename: "商家同意申请",
            time: t.formatTime(e.DealTime),
            ishidden: !1,
            isactive: !1
        }, {
            statue: 2,
            statuename: e.IsOnlyRefund ? "商家拒绝申请" : "商家拒绝退货",
            time: t.formatTime(e.DealTime),
            ishidden: !0,
            isactive: !1
        }, {
            statue: 4,
            statuename: "买家退货",
            time: t.formatTime(e.UserSendGoodsTime),
            ishidden: !1,
            isactive: !1
        }, {
            statue: 5,
            statuename: "商家确认收货",
            time: t.formatTime(e.ConfirmGoodsTime),
            ishidden: !1,
            isactive: !1
        }, {
            statue: 2,
            statuename: e.IsOnlyRefund ? "退款失败" : "退货失败",
            time: t.formatTime(e.DealTime),
            ishidden: !0,
            isactive: !1
        }, {
            statue: 1,
            statuename: e.IsOnlyRefund ? "退款完成" : "退货完成",
            time: t.formatTime(e.FinishTime),
            ishidden: !1,
            isactive: !1
        } ];
        s.forEach(function(t, a, s) {
            e.IsOnlyRefund ? (t.statue > 1 && (t.ishidden = !0), 1 == i && (t.isactive = !0)) : ((1 == i || parseInt(i) >= parseInt(t.statue)) && 1 != t.statue && 2 != t.statue && (t.isactive = !0), 
            1 == i && 1 == t.statue && (t.isactive = !0)), 2 == i && 0 != a && (2 == t.statue ? (t.ishidden = !1, 
            t.isactive = !0) : t.ishidden = !0);
        }), a.setData({
            ProgressStatue: s
        });
    },
    SendGood: function(t) {
        var e = t.currentTarget.dataset.id, a = t.currentTarget.dataset.skuid;
        wx.navigateTo({
            url: "../refundsendgoods/refundsendgoods?id=" + e + "&&skuId=" + a
        });
    },
    goLogistics: function(t) {
        var e = t.currentTarget.dataset.id, a = parseFloat(t.currentTarget.dataset.aftertype);
        1 == a && wx.navigateTo({
            url: "../orderlogistics/orderlogistics?returnid=" + e
        }), 2 == a && wx.navigateTo({
            url: "../orderlogistics/orderlogistics?replaceid=" + e
        });
    },
    goToProductDetail: function(t) {
        var a = t.currentTarget.dataset.productid, i = t.currentTarget.dataset.storeid;
        wx.request({
            url: e.getUrl("Product.ashx?action=GetProductActivity"),
            data: {
                productId: a,
                storeid: i
            },
            success: function(t) {
                t = t.data;
                var e = "../productdetail/productdetail?id=" + a + "&storeid=" + i + (1 === t.ActiveType ? "&activeid=" + t.ActiveId : "");
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