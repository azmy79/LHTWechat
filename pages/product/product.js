require("../../utils/config.js");

var t = getApp();

Page({
    data: {
        Store_PositionRouteTo: "",
        Store_PositionNoMatchTo: "",
        pageType: 0,
        fromLatLng: "",
        storeid: 0
    },
    onLoad: function(o) {
        t.globalData.siteInfo ? (this.setData({
            Store_PositionRouteTo: t.globalData.siteInfo.Store_PositionRouteTo,
            Store_PositionNoMatchTo: t.globalData.siteInfo.Store_PositionNoMatchTo
        }), "Platform" !== this.data.Store_PositionRouteTo && this.getLocation(), this.productcategory = this.selectComponent("#productcategory")) : this.getPositionPageTurnParam();
    },
    onReady: function() {},
    onShow: function() {},
    getPositionPageTurnParam: function() {
        var o = this;
        wx.request({
            url: t.getUrl("Common.ashx?action=GetPositionPageTurnParam"),
            data: {},
            success: function(t) {
                "Platform" !== t.data.Store_PositionRouteTo && o.getLocation(), o.setData({
                    Store_PositionRouteTo: t.data.Store_PositionRouteTo,
                    Store_PositionNoMatchTo: t.data.Store_PositionNoMatchTo
                }), o.productcategory = o.selectComponent("#productcategory");
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
                "OK" === t.data.Status && (o.setData({
                    storeid: t.data.StoreId
                }), o.productcategory = o.selectComponent("#productcategory"));
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
                }), "StoreList" === o.data.Store_PositionRouteTo ? o.storeproduct = o.selectComponent("#storeproduct") : "NearestStore" === o.data.Store_PositionRouteTo && o.getNearestStore();
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
        "StoreList" === this.data.Store_PositionRouteTo ? this.storeproduct.onReachBottom() : this.productcategory.onReachBottom();
    },
    onShareAppMessage: function() {}
});