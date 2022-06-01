var t = getApp();

Page({
    data: {
        pageSize: 10,
        pageIndex: 1,
        CountDownList: null
    },
    onLoad: function(a) {
        var e = this;
        this.setData({
            storeid: a.storeid || 0
        }), a.ReferralUserId && t.setRefferUserId(a.ReferralUserId), this.loadData(this, !1), 
        t.getSiteSettingData(function(t) {
            e.setData(t);
        });
    },
    loadData: function(a, e) {
        wx.showNavigationBarLoading(), wx.request({
            url: t.getUrl("Product.ashx?action=GetCountDownList"),
            data: {
                pageIndex: a.data.pageIndex,
                pageSize: a.data.pageSize,
                storeid: a.data.storeid
            },
            success: function(t) {
                if ("OK" == t.data.Status) {
                    var o = t.data.Data;
                    if (e) {
                        var n = a.data.CountDownList;
                        n.push.apply(n, o), a.setData({
                            CountDownList: n
                        });
                    } else a.setData({
                        CountDownList: o
                    });
                } else wx.showModal({
                    title: "提示",
                    content: t.data.Message,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            },
            complete: function() {
                wx.hideNavigationBarLoading();
            }
        });
    },
    BuyCountDown: function(t) {
        var a = t.currentTarget.dataset.activeid, e = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../productdetail/productdetail?id=" + e + "&activeid=" + a + "&storeid=" + this.data.storeid
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {
        var t = this, a = t.data.pageIndex;
        console.log(a), t.setData({
            pageIndex: a + 1
        }), t.loadData(this, !0);
    },
    onShareAppMessage: function(a) {
        var e = "/pages/countdown/countdown";
        return t.globalData.userInfo && t.globalData.userInfo.IsReferral && (e += "?ReferralUserId=" + t.globalData.userInfo.UserId), 
        {
            title: "限时抢购",
            path: e,
            success: function(t) {
                hishop.showTip("分享成功", "success");
            },
            fail: function(t) {
                hishop.showTip("分享失败", "error");
            }
        };
    }
});