getApp();

Page({
    data: {},
    onLoad: function(t) {
        this.setData({
            storeid: parseInt(t.id || 0)
        }), this.getLocation();
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
                }), t.storehome = t.selectComponent("#storehome");
            }
        });
    },
    handleNavTap: function(t) {
        wx.switchTab({
            url: t.currentTarget.dataset.url
        });
    },
    goProductlist: function() {
        wx.navigateTo({
            url: "../storecategory/storecategory?storeid=" + this.data.storeid
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {
        this.storehome.onReachBottom();
    },
    onShareAppMessage: function() {}
});