require("../../utils/config.js");

var e = getApp();

Page({
    data: {
        openId: "",
        pageIndex: 1,
        pageSize: 10,
        listData: null,
        referralLevel: 1,
        isEmpty: !1,
        isEnd: !1
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: e.globalData.ReferralSettingInfo.MyLowerLevelName
        }), e.getSiteSettingData(function(e) {
            t.setData(e);
        }), this.setData({
            firstMemberName: e.globalData.ReferralSettingInfo.FirstMemberName,
            secondMemberName: e.globalData.ReferralSettingInfo.SecondMemberName,
            thirdMemberName: e.globalData.ReferralSettingInfo.ThirdMemberName
        });
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        a.setData({
            pageIndex: 1
        }), a.loadData(a, !1), e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("Referral.ashx?action=GetSubMemberTotal"),
                data: {
                    openId: t
                },
                success: function(e) {
                    (e = e.data).Success ? a.setData({
                        isOpenSecondLevelCommission: e.IsOpenSecondLevelCommission,
                        isOpenThirdLevelCommission: e.IsOpenThirdLevelCommission,
                        subMemberTotal: e.SubMemberTotal
                    }) : wx.showToast({
                        icon: "none",
                        title: e.message
                    });
                }
            });
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var e = this;
        e.loadData(e, !1);
    },
    onReachBottom: function() {
        var e = this;
        if (!e.data.isEnd) {
            var a = e.data.pageIndex + 1;
            e.setData({
                pageIndex: a
            }), e.loadData(e, !0);
        }
    },
    switchTab: function(e) {
        var a = e.target.dataset.level;
        this.setData({
            referralLevel: a,
            isEmpty: !1,
            isEnd: !1,
            pageIndex: 1
        }), this.loadData(this, !1);
    },
    loadData: function(a, t) {
        wx.showLoading({
            title: "加载中"
        }), e.getOpenId(function(n) {
            wx.request({
                url: e.getUrl("Referral.ashx?action=GetSubMembers"),
                data: {
                    openId: n,
                    pageIndex: a.data.pageIndex,
                    pageSize: a.data.pageSize,
                    referralLevel: a.data.referralLevel
                },
                success: function(e) {
                    if ((e = e.data).Success) {
                        var n = e.List;
                        if (0 != n.length && void 0 != n.length || 1 != a.data.pageIndex || a.setData({
                            isEmpty: !0
                        }), n.length < a.data.pageSize && a.setData({
                            isEnd: !0
                        }), t) {
                            var i = a.data.listData;
                            i.push.apply(i, n), a.setData({
                                listData: i
                            });
                        } else a.setData({
                            listData: n
                        });
                    } else wx.showToast({
                        title: e.message
                    });
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        });
    }
});