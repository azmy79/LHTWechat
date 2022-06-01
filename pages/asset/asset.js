var a = getApp();

Page({
    data: {
        pageIndex: 1,
        pageSize: 100,
        recordCount: 0,
        isEnd: !1,
        balance: "",
        Allbalance: "",
        CanDrawRequest: "",
        IsOpenRechargeGift: "",
        RechargeGiftInfo: null,
        EnableBalanceRecharge: !1
    },
    onLoad: function(a) {},
    onReady: function() {},
    onShow: function() {
        var e = this, t = this;
        a.getOpenId(function(e) {
            wx.request({
                url: a.getUrl("Balance.ashx?action=BalanceInfo"),
                data: {
                    openId: e
                },
                success: function(a) {
                    t.setData({
                        balance: (a.data.Balance - a.data.RequestBalance).toFixed(2),
                        Allbalance: a.data.Balance,
                        RequestBalance: a.data.RequestBalance,
                        CanDrawRequest: a.data.CanDrawRequest,
                        RechargeGiftInfo: a.data.RechargeGiftInfo,
                        IsOpenRechargeGift: a.data.IsOpenRechargeGift
                    });
                }
            });
        }), a.globalData.siteInfo && this.setData({
            EnableBalanceRecharge: a.globalData.siteInfo.EnableBalanceRecharge
        }), a.getSiteSettingData(function(t) {
            a.globalData.siteInfo && e.setData({
                EnableBalanceRecharge: a.globalData.siteInfo.EnableBalanceRecharge
            }), e.setData(t);
        }), t.loadDrawListData(!1);
    },
    bindDraw: function(a) {
        var e = a.currentTarget.dataset.balance;
        wx.navigateTo({
            url: "../assetcash/assetcash?balance=" + e
        });
    },
    Recharge: function(a) {
        var e = this;
        wx.navigateTo({
            url: "../assetrecharge/assetrecharge?IsOpenRechargeGift=" + e.data.IsOpenRechargeGift
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.data.isEnd || (this.setData({
            pageIndex: this.data.pageIndex + 1
        }), this.loadDrawListData(!0));
    },
    loadDrawListData: function(e) {
        var t = this;
        wx.showLoading({
            title: "加载中"
        }), a.getOpenId(function(n) {
            wx.request({
                url: a.getUrl("Balance.ashx?action=BalanceDetails"),
                data: {
                    openId: n,
                    pageIndex: t.data.pageIndex,
                    pageSize: t.data.pageSize
                },
                success: function(a) {
                    if (void 0 == a.data.error_response) {
                        for (var n = a.data.MonthData, s = 0, o = 0; o < n.length; o++) {
                            s += n[o].Details.length;
                            for (r = 0; r < n[o].Details.length; r++) n[o].Details[r].TradeDateStr = n[o].Details[r].TradeDateStr.slice(5);
                        }
                        if (s < t.data.pageSize && t.setData({
                            isEnd: !0
                        }), e) {
                            for (var i = t.data.monthData, o = 0; o < n.length; o++) for (var r = 0; r < i.length; r++) n[o].YearMonthStr == i[r].YearMonthStr ? i[r].Details.push.apply(i[r].Details, n[o].Details) : i.push.apply(i, n);
                            t.setData({
                                monthData: i
                            });
                        } else {
                            var l = a.data.RecordCount;
                            t.setData({
                                monthData: n,
                                recordCount: l
                            });
                        }
                    } else hishop.showTip(a.data.error_response.sub_msg);
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        });
    }
});