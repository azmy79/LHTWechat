function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, n = Array(t.length); a < t.length; a++) n[a] = t[a];
        return n;
    }
    return Array.from(t);
}

var a = getApp();

Page({
    data: {
        pageIndex: 1,
        list: null,
        isEnd: !1
    },
    onLoad: function(t) {
        var n = this;
        wx.showLoading({
            title: ""
        }), this.loadData(), a.getSiteSettingData(function(t) {
            n.setData(t);
        });
    },
    loadData: function() {
        var n = this;
        this.data.isEnd || wx.request({
            url: a.getUrl("FightGroup.ashx?action=FightGroupActivityList"),
            data: {
                pageIndex: this.data.pageIndex,
                pageSize: 10
            },
            success: function(a) {
                wx.hideLoading(), "OK" == a.data.Status ? n.setData({
                    list: 1 === n.data.pageIndex ? a.data.List : [].concat(t(n.data.list), t(a.data.List)),
                    isEnd: a.data.List.length < 10,
                    pageIndex: n.data.pageIndex + 1
                }) : wx.showModal({
                    title: "提示",
                    content: r.data.Message,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                });
            }
        });
    },
    goFightDetail: function(t) {
        var a = t.currentTarget.dataset.activeid, n = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../fightdetail/fightdetail?id=" + n + "&activeid=" + a
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {
        this.loadData();
    },
    onShareAppMessage: function(t) {}
});