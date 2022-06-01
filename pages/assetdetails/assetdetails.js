var a = require("../../utils/config.js"), e = getApp();

Page({
    data: {
        pageIndex: 1,
        pageSize: 100,
        isEmpty: !0,
        openId: "",
        nullDraw: e.getRequestUrl + "/Templates/xcxshop/images/null.png"
    },
    onLoad: function(a) {},
    onReady: function() {},
    onShow: function() {
        var a = this;
        a.loadassetlistData(a, !1);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var a = this;
        a.setData({
            pageIndex: a.data.pageIndex + 1
        }), a.loadassetlistData(a, !0);
    },
    onReachBottom: function() {
        var a = this;
        a.setData({
            pageIndex: a.data.pageIndex + 1
        }), a.loadassetlistData(a, !0);
    },
    onShareAppMessage: function() {},
    loadassetlistData: function(t, s) {
        var t = this;
        wx.showLoading({
            title: "加载中"
        }), e.getOpenId(function(n) {
            wx.request({
                url: e.getUrl("Balance.ashx?action=BalanceDetails"),
                data: {
                    openId: n,
                    pageIndex: t.data.pageIndex,
                    pageSize: t.data.pageSize
                },
                success: function(e) {
                    if (void 0 == e.data.error_response) {
                        var n = e.data.MonthData;
                        if (s) {
                            var o = t.data.assetlist;
                            o.push.apply(o, n), t.setData({
                                assetlist: o
                            });
                        } else {
                            var i = n.length > 0;
                            t.setData({
                                assetlist: n,
                                isEmpty: i
                            });
                        }
                    } else a.showTip(e.data.error_response.sub_msg);
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        });
    }
});