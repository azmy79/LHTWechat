var a = require("../../utils/config.js"), e = getApp();

Page({
    data: {
        openId: "",
        PageIndex: 1,
        PageSize: 10,
        RequestId: 0,
        DrawDetailInfo: ""
    },
    onLoad: function(a) {
        var e = this, t = a.RequestId;
        e.setData({
            RequestId: t
        });
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        a.setData({
            PageIndex: 1
        }), a.loadData(a, !1);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var a = this;
        a.loadData(a, !1);
    },
    onReachBottom: function() {
        var a = this, e = a.data.PageIndex + 1;
        a.setData({
            PageIndex: e
        }), a.loadData(a, !0);
    },
    onShareAppMessage: function() {},
    loadData: function(t, n) {
        wx.showLoading({
            title: "加载中"
        }), e.getOpenId(function(n) {
            wx.request({
                url: e.getUrl("Referral.ashx?action=SplittinDrawDetail"),
                data: {
                    openId: n,
                    pageIndex: t.data.PageIndex,
                    pageSize: t.data.PageSize,
                    RequestId: t.data.RequestId
                },
                success: function(e) {
                    if (void 0 == e.data.error_response) {
                        var n = e.data.SplittinDraw_get_response;
                        t.setData({
                            DrawDetailInfo: n
                        });
                    } else a.showTip(e.data.error_response.sub_msg);
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        });
    },
    bindDrawListTap: function(a) {
        wx.navigateTo({
            url: "../distributioncash/distributioncash?TabType=2"
        });
    }
});