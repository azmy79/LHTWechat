var t = require("../../utils/config.js"), e = getApp();

Page({
    data: {
        openId: "",
        PageIndex: 1,
        PageSize: 10,
        pointList: null,
        isempty: !0,
        Points: 0
    },
    onLoad: function(t) {
        var a = this;
        e.getSiteSettingData(function(t) {
            a.setData(t);
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = this;
        t.setData({
            PageIndex: 1
        }), t.loadData(t, !1);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var t = this;
        t.loadData(t, !1);
    },
    onReachBottom: function() {
        var t = this, e = t.data.PageIndex + 1;
        t.setData({
            PageIndex: e
        }), t.loadData(t, !0);
    },
    onShareAppMessage: function() {},
    loadData: function(a, n) {
        wx.showLoading({
            title: "加载中"
        }), e.getOpenId(function(o) {
            wx.request({
                url: e.getUrl("UserCenter.ashx?action=GetUserPoints"),
                data: {
                    openId: o,
                    pageIndex: a.data.PageIndex,
                    pageSize: a.data.PageSize
                },
                success: function(e) {
                    if (void 0 == e.data.error_response) {
                        var o = e.data.userpoint_get_response.List, i = e.data.userpoint_get_response;
                        if (n) {
                            var s = a.data.pointList;
                            s.push.apply(s, o), a.setData({
                                pointList: s,
                                Points: i.Points
                            }), console.log(pointList);
                        } else {
                            o.Total;
                            a.setData({
                                pointList: o,
                                isEmpty: a.data.isempty,
                                Points: i.Points
                            });
                        }
                    } else t.showTip(e.data.error_response.errMsg);
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        });
    },
    pointorderlist: function(t) {
        wx.navigateTo({
            url: "../integralmall/integralmall",
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    }
});