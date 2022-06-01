var t = getApp(), e = require("../../utils/config.js");

Page({
    data: {
        IsRefuse: !0,
        pageIndex: 1,
        pageSize: 10,
        Keyword: "",
        StoreInfo: t.globalData.storeInfo,
        StoreList: null,
        isEnd: !1
    },
    onLoad: function(t) {
        var e = this, a = !0, o = "", n = "";
        wx.getSetting({
            success: function(t) {
                a = t.authSetting["scope.userLocation"];
            },
            complete: function() {
                a && (o = t.latitude, n = t.longitude), e.setData({
                    IsRefuse: a,
                    Latitude: o,
                    Longitude: n
                }), e.LoadData(!1);
            }
        });
    },
    LoadData: function(a) {
        var o = this;
        wx.request({
            url: t.getUrl("Store.ashx?action=GetStoreList"),
            data: {
                openId: t.globalData.openId,
                pageIndex: o.data.pageIndex,
                pageSize: o.data.pageSize,
                Keyword: o.data.Keyword,
                Latitude: o.data.Latitude,
                Longitude: o.data.Longitude
            },
            success: function(n) {
                if (void 0 == n.data.error_response) {
                    var i = o.data.isEnd, s = n.data.store_get_response.StoreInfo;
                    if (s.forEach(function(t, a, o) {
                        t.Distance = e.FormatDistance(t.Distance);
                    }), s.length < 10 && (i = !0), a) {
                        var r = o.data.StoreList;
                        r.push.apply(r, s), o.setData({
                            StoreList: r,
                            isEnd: i,
                            StoreInfo: t.globalData.storeInfo
                        });
                    } else o.setData({
                        StoreList: s,
                        isEnd: i,
                        StoreInfo: t.globalData.storeInfo
                    });
                } else e.showTip(n.data.error_response.sub_msg);
            }
        });
    },
    bindKeyWordInput: function(t) {
        t.detail.value.length <= 0 ? this.setData({
            foucsState: !1
        }) : this.setData({
            foucsState: !0
        });
    },
    bindblureInput: function(t) {
        this.setData({
            foucsState: !1
        });
    },
    onConfirmSearch: function(t) {
        var e = this, a = t.detail.value;
        e.setData({
            Keyword: a,
            PageIndex: 1
        }), e.LoadData(!1);
    },
    ChooseStore: function(t) {
        t.currentTarget.dataset.index;
        var e = t.currentTarget.dataset.storeid;
        wx.redirectTo({
            url: "../storehome/storehome?id=" + e
        });
    },
    onReady: function() {},
    ChooseLocation: function() {
        var t = this;
        wx.getSetting({
            success: function(e) {
                e.authSetting["scope.userLocation"] ? t.reloadLocation() : wx.openSetting({
                    success: function(e) {
                        e.authSetting["scope.userLocation"] && t.reloadLocation();
                    }
                });
            }
        });
    },
    reloadLocation: function() {
        var t = this;
        t.setData({
            StoreList: []
        }), wx.showLoading({
            title: "重新定位中...",
            mask: !0
        }), wx.getLocation({
            type: "gcj02",
            success: function(e) {
                var a = e.latitude, o = e.longitude;
                t.setData({
                    Latitude: a,
                    Longitude: o,
                    pageIndex: 1,
                    pageSize: 10,
                    IsRefuse: !0,
                    Keyword: "",
                    isEnd: !1
                }), wx.hideLoading(), t.LoadData(!1);
            }
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this;
        if (!t.data.isEnd) {
            var e = parseInt(t.data.pageIndex) + 1;
            t.setData({
                pageIndex: e
            }), t.LoadData(!0);
        }
    },
    onShareAppMessage: function() {}
});