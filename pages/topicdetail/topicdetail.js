var t = getApp();

Page({
    data: {},
    onLoad: function(a) {
        var e = this;
        wx.showLoading({
            title: "加载中"
        }), wx.request({
            url: t.getRequestUrl + "/Templates/topic/applettopic/applettopic_" + a.id + ".json",
            dataType: "json",
            success: function(t) {
                wx.setNavigationBarTitle({
                    title: t.data.page.title
                }), e.setData({
                    moduleData: t.data.LModules,
                    pageLoaded: !0
                }), wx.hideLoading();
            }
        });
    },
    onShareAppMessage: function() {}
});