require("../../utils/config.js");

var t = getApp();

Page({
    data: {
        Store_PositionRouteTo: "",
        Store_PositionNoMatchTo: "",
        pageType: 0,
        fromLatLng: "",
        storeid: 0,
        isShowHishopCopyRight: !1,
        isJumpLink: !1
    },
    onLoad: function(o) {
        var e = this;
        o.ReferralUserId && t.setRefferUserId(o.ReferralUserId), t.getSiteSettingData(function(o) {
            t.globalData.siteInfo ? (e.setData({
                Store_PositionRouteTo: t.globalData.siteInfo.Store_PositionRouteTo,
                Store_PositionNoMatchTo: t.globalData.siteInfo.Store_PositionNoMatchTo,
                isShowHishopCopyRight: t.globalData.siteInfo.IsShowHishopCopyRight,
                isJumpLink: t.globalData.siteInfo.IsJumpLink
            }), e.setData(o), "Platform" !== e.data.Store_PositionRouteTo && e.getLocation()) : e.getPositionPageTurnParam();
        });
    },
    onReady: function() {},
    onShow: function() {
        t.updateCartQuantity();
    },
    goToCopyright: function() {
        t.goToCopyright();
    },
    getPositionPageTurnParam: function() {
        var o = this;
        wx.request({
            url: t.getUrl("Common.ashx?action=GetPositionPageTurnParam"),
            data: {},
            success: function(t) {
                "Platform" !== t.data.Store_PositionRouteTo && o.getLocation(), o.setData({
                    Store_PositionRouteTo: t.data.Store_PositionRouteTo,
                    Store_PositionNoMatchTo: t.data.Store_PositionNoMatchTo
                });
            }
        });
    },
    getNearestStore: function() {
        var o = this;
        wx.request({
            url: t.getUrl("Store.ashx?action=GetNearestStore"),
            data: {
                fromLatLng: this.data.fromLatLng
            },
            success: function(t) {
                "OK" === t.data.Status && t.data.StoreId ? (o.setData({
                    storeid: t.data.StoreId
                }), o.storehome = o.selectComponent("#storehome")) : o.setData({
                    Store_PositionRouteTo: o.data.Store_PositionNoMatchTo
                });
            }
        });
    },
    getLocation: function(t) {
        var o = this;
        wx.getLocation({
            type: "wgs84",
            success: function(t) {
                wx.setStorage({
                    key: "o2oFromLatLng",
                    data: t.latitude + "," + t.longitude
                }), o.setData({
                    fromLatLng: t.latitude + "," + t.longitude
                }), "StoreList" === o.data.Store_PositionRouteTo ? o.storelist = o.selectComponent("#storelist") : "NearestStore" === o.data.Store_PositionRouteTo && o.getNearestStore();
            },
            fail: function() {
                o.setData({
                    pageType: 1
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {
        "StoreList" === this.data.Store_PositionRouteTo ? this.storelist.onReachBottom() : "NearestStore" === this.data.Store_PositionRouteTo && this.storehome.onReachBottom();
    },
    onShareAppMessage: function() {
        var o = "/pages/home/home";
        return t.globalData.userInfo && t.globalData.userInfo.IsReferral && (o += "?ReferralUserId=" + t.globalData.userInfo.UserId, 
        t.setRefferUserId(t.globalData.userInfo.UserId, function(t) {})), {
            path: o,
            success: function(t) {}
        };
    },
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.newlist = this.selectComponent("#newlist"), 
        this.newlist.DownloadTopcis();
    }
});