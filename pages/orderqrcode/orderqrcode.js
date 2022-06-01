var n = getApp();

Page({
    data: {},
    onLoad: function(o) {
        var e = this, t = n.getRequestUrl + "api/VshopProcess.ashx?action=GenerateTwoDimensionalImage&url=" + o.url;
        e.setData({
            imgurl: t,
            takecode: o.url
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});