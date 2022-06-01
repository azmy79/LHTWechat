var t = getApp(), a = require("../wxParse/wxParse.js");

Page({
    data: {
        info: null
    },
    onLoad: function(a) {
        var e = this;
        this.setData({
            fightGroupId: a.id
        }), wx.showLoading({
            title: "加载中..."
        }), t.getSiteSettingData(function(t) {
            e.setData(t);
        }), this.loadData();
    },
    loadData: function() {
        var e = this;
        wx.request({
            url: t.getUrl("FightGroup.ashx?action=FightGroupDetail"),
            data: {
                openId: t.globalData.openId,
                fightGroupId: this.data.fightGroupId
            },
            success: function(t) {
                if (wx.hideLoading(), "OK" == t.data.Status) {
                    var i = t.data.Result.RemainTime;
                    e.setData({
                        timeOver: e.formatTime(i)
                    }), a.wxParse("metaDescription", "html", t.data.Result.ProductInfo.Description, e), 
                    setInterval(function() {
                        i -= 1, e.setData({
                            timeOver: e.formatTime(i)
                        });
                    }, 1e3), e.setData({
                        info: t.data.Result
                    });
                } else wx.showModal({
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
    goToCopyright: function() {
        t.goToCopyright();
    },
    formatTime: function(t) {
        t < 0 && (t = 0);
        var a = parseInt(t / 86400), e = parseInt(t % 86400 / 3600), i = parseInt(t % 3600 / 60), o = parseInt(t % 3600 % 60);
        return e < 10 && (e = "0" + e), i < 10 && (i = "0" + i), o < 10 && (o = "0" + o), 
        a + "天" + e + "时" + i + "分" + o + "秒";
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onShareAppMessage: function(a) {
        var e = "/pages/fightdetail/fightdetail?groupid=" + this.data.fightGroupId + "&activeid=" + this.data.info.ActivityId;
        return t.globalData.userInfo && t.globalData.userInfo.IsReferral && (e += "&ReferralUserId=" + t.globalData.userInfo.UserId, 
        t.setRefferUserId(t.globalData.userInfo.UserId, function(t) {})), {
            title: this.data.info.ProductName,
            imageUrl: this.data.info.ProductImage,
            path: e
        };
    }
});