var e = require("../../utils/config.js"), a = getApp();

Page({
    data: {
        openId: "",
        PageIndex: 1,
        PageSize: 10,
        RequestId: 0,
        DrawDetailInfo: ""
    },
    onLoad: function(e) {
        var a = this, t = e.RequestId;
        a.setData({
            RequestId: t
        });
    },
    onReady: function() {},
    onShow: function() {
        var e = this;
        e.setData({
            PageIndex: 1
        }), e.loadData(e, !1);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    loadData: function(t, n) {
        wx.showLoading({
            title: "加载中"
        }), a.getOpenId(function(n) {
            wx.request({
                url: a.getUrl("Balance.ashx?action=RequestBalanceDetail"),
                data: {
                    openId: n,
                    RequestId: t.data.RequestId
                },
                success: function(a) {
                    if (void 0 == a.data.error_response) {
                        var n = a.data.Data;
                        t.setData({
                            DrawDetailInfo: n
                        });
                    } else e.showTip(a.data.error_response.sub_msg);
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        });
    },
    bindDrawListTap: function(e) {
        wx.navigateTo({
            url: "../assetcash/assetcash?TabType=2"
        });
    }
});