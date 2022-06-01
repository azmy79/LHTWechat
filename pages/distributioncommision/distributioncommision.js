var t = require("../../utils/config.js"), i = getApp();

Page({
    data: {
        openId: "",
        PageIndex: 1,
        PageSize: 10,
        SplittinList: null,
        isempty: !0,
        SplittinTotal: "",
        CanDrawSplittin: "",
        NoSettlementSplttin: "",
        DrawSplittinTotal: "",
        HistorySplittin: ""
    },
    onLoad: function(t) {
        var a = this;
        wx.setNavigationBarTitle({
            title: i.globalData.ReferralSettingInfo.MyCommissionName
        }), i.getSiteSettingData(function(t) {
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
        var t = this, i = t.data.PageIndex + 1;
        t.setData({
            PageIndex: i
        }), t.loadData(t, !0);
    },
    onShareAppMessage: function() {},
    loadData: function(a, n) {
        wx.showLoading({
            title: "加载中"
        }), i.getOpenId(function(e) {
            wx.request({
                url: i.getUrl("Referral.ashx?action=SplittinList"),
                data: {
                    openId: e,
                    pageIndex: a.data.PageIndex,
                    pageSize: a.data.PageSize
                },
                success: function(i) {
                    if (void 0 == i.data.error_response) {
                        var e = i.data.splittin_get_response, o = e.SplittinList;
                        if (n) {
                            var l = a.data.SplittinList;
                            l.push.apply(l, o), a.setData({
                                SplittinList: l,
                                SplittinTotal: a.data.SplittinTotal,
                                CanDrawSplittin: a.data.CanDrawSplittin,
                                NoSettlementSplttin: a.data.NoSettlementSplttin,
                                DrawSplittinTotal: a.data.DrawSplittinTotal,
                                HistorySplittin: e.HistorySplittin
                            });
                        } else {
                            o.Total;
                            a.setData({
                                SplittinList: o,
                                isEmpty: a.data.isempty,
                                SplittinTotal: e.SplittinTotal,
                                CanDrawSplittin: e.CanDrawSplittin,
                                NoSettlementSplttin: e.NoSettlementSplttin,
                                DrawSplittinTotal: e.DrawSplittinTotal,
                                HistorySplittin: e.HistorySplittin
                            });
                        }
                    } else t.showTip(i.data.error_response.errMsg);
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        });
    },
    bindSplittinDraw: function(t) {
        wx.navigateTo({
            url: "../distributioncash/distributioncash"
        });
    }
});