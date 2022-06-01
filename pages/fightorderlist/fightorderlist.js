function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, e = Array(t.length); a < t.length; a++) e[a] = t[a];
        return e;
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
        var e = this;
        wx.showLoading({
            title: "加载中..."
        }), a.getSiteSettingData(function(t) {
            e.setData(t);
        });
    },
    loadData: function() {
        var e = this;
        this.data.isEnd || wx.request({
            url: a.getUrl("FightGroup.ashx?action=MyFightGroupList"),
            data: {
                openId: a.globalData.openId,
                pageIndex: this.data.pageIndex,
                pageSize: 10
            },
            success: function(a) {
                wx.hideLoading(), "OK" == a.data.Status ? (a.data.List.map(function(t) {
                    t.RemainTime > 3600 ? t.timeOver = parseInt(t.RemainTime / 3600) + "小时" : t.timeOver = parseInt(t.RemainTime / 60) + "分钟";
                }), e.setData({
                    list: 1 === e.data.pageIndex ? a.data.List : [].concat(t(e.data.list), t(a.data.List)),
                    isEnd: a.data.List.length < 10,
                    pageIndex: e.data.pageIndex + 1
                })) : wx.showModal({
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
    goOrderDetail: function(t) {
        var a = t.currentTarget.dataset.orderid;
        wx.navigateTo({
            url: "../orderdetail/orderdetail?orderid=" + a
        });
    },
    goGroupList: function() {
        wx.navigateTo({
            url: "../fightgroup/fightgroup"
        });
    },
    goFightDetail: function(t) {
        var a = t.currentTarget.dataset.id, e = t.currentTarget.dataset.status, i = t.currentTarget.dataset.activeid;
        0 == e ? wx.navigateTo({
            url: "../fightorderdetail/fightorderdetail?id=" + a
        }) : wx.navigateTo({
            url: "../fightdetail/fightdetail?activeid=" + i + "&groupid=" + a
        });
    },
    onReady: function() {},
    onShow: function() {
        this.setData({
            pageIndex: 1,
            isEnd: !1
        }), this.loadData();
    },
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {
        this.loadData();
    },
    onShareAppMessage: function(t) {}
});