getApp();

Page({
    data: {
        fromLatLng: ""
    },
    onLoad: function(t) {
        t.fromLatLng ? (this.setData({
            fromLatLng: t.fromLatLng
        }), this.storelist = this.selectComponent("#storelist")) : this.getLocation();
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
                }), t.storelist = t.selectComponent("#storelist");
            }
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.storelist.onReachBottom();
    },
    onShareAppMessage: function() {},
    onshow: function() {
        this.getLocation();
    }
});