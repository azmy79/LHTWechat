var a = getApp(), t = require("../../utils/config.js");

Page({
    data: {
        pic: "",
        points: "",
        account: "",
        PageSize: 10,
        PageIndex: 1,
        allPages: "",
        isEmpty: !0,
        isEnd: !1,
        noCounp: !0,
        userInfo: {},
        tabType: 1,
        giftList: null,
        counplist: null,
        hideHeader: !0,
        hideBottom: !0
    },
    onLoad: function(t) {
        var e = this;
        a.getSiteSettingData(function(a) {
            e.setData(a);
        });
    },
    onReady: function() {},
    onShow: function() {
        this.setData({
            PageIndex: 1
        }), this.loadData(this, !1);
    },
    loadData: function(e, n) {
        var e = this;
        a.globalData.userInfo && a.quickLogin(function() {
            e.setData({
                userInfo: a.globalData.userInfo,
                pic: a.globalData.userInfo.picture,
                account: a.globalData.userInfo.UserName,
                points: a.globalData.userInfo.points
            });
        }), wx.showLoading({
            title: "加载中"
        }), wx.request({
            url: a.getUrl("PointMall.ashx?action=LoadGift"),
            data: {
                openId: a.globalData.openId,
                PageSize: e.data.PageSize,
                PageIndex: e.data.PageIndex
            },
            success: function(a) {
                if (void 0 == a.data.error_response) {
                    var s = a.data.Data, o = a.data.Data.length < e.data.PageSize;
                    if (n) {
                        var i = e.data.giftList;
                        i.push.apply(i, s), e.setData({
                            giftList: i,
                            isEnd: o
                        });
                    } else {
                        var d = s.length > 0;
                        e.setData({
                            giftList: s,
                            isEmpty: d,
                            isEnd: o
                        });
                    }
                } else t.showTip(a.data.error_response.sub_msg);
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    getpoints: function() {
        var t = this;
        a.getOpenId(function(e) {
            wx.request({
                url: a.getUrl("UserCenter.ashx?action=GetUserPoints"),
                data: {
                    openId: e,
                    pageIndex: t.data.PageIndex,
                    pageSize: t.data.PageSize
                },
                success: function(a) {
                    var e = a.data.userpoint_get_response;
                    t.setData({
                        points: e.Points
                    });
                }
            });
        });
    },
    bindcounp: function(a) {
        var t = this;
        t.setData({
            tabType: 2,
            PageIndex: 1
        }), t.loadcounp(t, !1);
    },
    bindgift: function(a) {
        var t = this;
        t.setData({
            tabType: 1,
            PageIndex: 1
        }), t.loadData(t, !1);
    },
    bindgiftDetail: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../giftDetail/giftDetail?giftId=" + t
        });
    },
    ExChangeGifts: function(e) {
        var n = e.currentTarget.dataset.id;
        a.getOpenId(function(e) {
            wx.request({
                url: a.getUrl("PointMall.ashx?action=ExChangeGifts"),
                data: {
                    openId: e,
                    giftId: n
                },
                success: function(a) {
                    void 0 == a.data.error_response ? "OK" == a.data.Status ? (t.showTip(a.data.Message, "success"), 
                    wx.switchTab({
                        url: "../cart/cart"
                    })) : t.showTip(a.data.Message, "tips") : t.showTip(a.data.error_response.sub_msg);
                }
            });
        });
    },
    loadcounp: function(e, n) {
        var e = this;
        wx.request({
            url: a.getUrl("Coupon.ashx?action=LoadSiteCoupon"),
            data: {
                openId: a.globalData.openId,
                PageIndex: n ? e.data.PageIndex : 1,
                PageSize: e.data.PageSize,
                obtainWay: 2
            },
            success: function(a) {
                if (void 0 == a.data.error_response) if ("OK" == a.data.Status) {
                    var s = a.data.Data, o = a.data.Data.length < e.data.PageSize;
                    if (s.forEach(function(a) {
                        a.Price = parseFloat(a.Price);
                    }), n) {
                        var i = e.data.counplist;
                        i.push.apply(i, s), e.setData({
                            counplist: i,
                            isEnd: o
                        });
                    } else {
                        var d = s.length > 0;
                        e.setData({
                            counplist: s,
                            noCounp: d,
                            isEnd: o
                        });
                    }
                } else t.showTip(a.data.Message, "tips"); else t.showTip(a.data.error_response.sub_msg);
            }
        });
    },
    ExChangecounp: function(e) {
        var n = this, s = e.currentTarget.dataset.counpid, o = e.currentTarget.dataset.points;
        a.getOpenId(function(e) {
            wx.request({
                url: a.getUrl("PointMall.ashx?action=PointChangeCoupon"),
                data: {
                    openId: e,
                    couponId: s,
                    needPoints: o
                },
                success: function(a) {
                    void 0 == a.data.error_response ? "OK" == a.data.Status ? (n.getpoints(), t.showTip(a.data.Message, "success"), 
                    n.loadcounp(n, !1)) : t.showTip(a.data.Message, "tips") : t.showTip(a.data.error_response.sub_msg);
                }
            });
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var a = this;
        a.data.isEnd || (a.setData({
            PageIndex: a.data.PageIndex + 1
        }), 1 == a.data.tabType && a.loadData(a, !0), 2 == a.data.tabType && a.loadcounp(a, !0));
    },
    onShareAppMessage: function() {}
});