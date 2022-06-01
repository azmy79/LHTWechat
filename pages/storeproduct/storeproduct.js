getApp();

Page({
    data: {},
    onLoad: function(t) {
        this.setData({
            keyword: t.keyword,
            productId: t.productId
        });
        var o = wx.getStorageSync("o2oFromLatLng");
        o ? this.setData({
            fromLatLng: o
        }) : this.getLocation(), this.storeproduct = this.selectComponent("#storeproduct");
    },
    getLocation: function() {
        var t = this;
        wx.getLocation({
            type: "wgs84",
            success: function(o) {
                wx.setStorage({
                    key: "o2oFromLatLng",
                    data: o.latitude + "," + o.longitude
                }), t.setData({
                    fromLatLng: o.latitude + "," + o.longitude
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.storeproduct.onReachBottom();
    },
    onShareAppMessage: function() {}
});