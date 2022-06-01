var a = getApp();

require("../../utils/config.js");

Page({
    data: {
        pageIndex: 1,
        pageSize: 10,
        isEnd: !1,
        isEmpty: !1,
        AfterList: null,
        nullOrder: a.getRequestUrl + "/Templates/xcxshop/images/nullOrder.png"
    },
    onLoad: function(t) {
        var e = this;
        a.getSiteSettingData(function(a) {
            e.setData(a);
        });
    },
    loadData: function(t) {
        var e = this;
        t && e.setData({
            pageIndex: e.data.pageIndex + 1
        }), a.getOpenId(function(n) {
            wx.request({
                url: a.getUrl("OrderRefund.ashx?action=GetAllAfterSaleList"),
                data: {
                    openId: n,
                    pageIndex: t ? e.data.pageIndex : 1,
                    pageSize: t ? e.data.pageSize : e.data.pageSize * e.data.pageIndex
                },
                success: function(a) {
                    if ("OK" == a.data.Status) {
                        var n = a.data.Data;
                        if (t ? e.setData({
                            isEnd: n.length < e.data.pageSize
                        }) : e.setData({
                            isEnd: n.length < e.data.pageSize * e.data.pageIndex
                        }), t) {
                            var i = e.data.AfterList;
                            i.push.apply(i, n), e.setData({
                                AfterList: i
                            });
                        } else {
                            var d = n.length <= 0;
                            e.setData({
                                AfterList: n,
                                isEmpty: d
                            });
                        }
                    } else "NOUser" == a.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: a.data.Message,
                        showCancel: !1,
                        success: function(a) {
                            a.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                }
            });
        });
    },
    applydetail: function(a) {
        var t = a.currentTarget.dataset.type, e = a.currentTarget.dataset.id;
        0 == t ? wx.navigateTo({
            url: "../refunddetail/refunddetail?id=" + e
        }) : wx.navigateTo({
            url: "../returndetail/returndetail?id=" + e
        });
    },
    SendGood: function(a) {
        var t = a.currentTarget.dataset.id, e = a.currentTarget.dataset.skuid;
        wx.navigateTo({
            url: "../refundsendgoods/refundsendgoods?id=" + t + "&&skuId=" + e
        });
    },
    goLogistics: function(a) {
        var t = a.currentTarget.dataset.id, e = parseFloat(a.currentTarget.dataset.aftertype);
        1 == e && wx.navigateTo({
            url: "../orderlogistics/orderlogistics?returnid=" + t
        }), 2 == e && wx.navigateTo({
            url: "../orderlogistics/orderlogistics?replaceid=" + t
        });
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        a.setData({
            pageIndex: this.data.pageIndex
        }), a.loadData(!1);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var a = this;
        a.data.isEnd || a.loadData(!0);
    },
    onShareAppMessage: function() {}
});