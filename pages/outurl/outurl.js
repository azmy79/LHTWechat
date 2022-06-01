getApp();

Page({
    data: {
        outurl: ""
    },
    onLoad: function(o) {
        var t = decodeURIComponent(o.url);
        t.toLowerCase().indexOf("http://") > -1 && (t = t.replace("http://", "https://")), 
        t.indexOf("?") > -1 ? t += "&from=shopapplet" : t += "?from=shopapplet", console.log(t), 
        this.setData({
            outurl: t
        });
    },
    onShareAppMessage: function(o) {
        var t = this, n = o.webViewUrl;
        return {
            path: "/pages/outurl/outurl?url=" + encodeURIComponent(n),
            success: function(o) {
                t.setData({
                    outurl: n
                }), wx.showToast({
                    title: "转发成功",
                    icon: "success",
                    duration: 2e3
                });
            },
            fail: function(o) {}
        };
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});