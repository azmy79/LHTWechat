var t = getApp(), e = require("../../utils/config.js"), a = require("../wxParse/wxParse.js");

Page({
    data: {
        giftimg: "",
        giftname: "",
        giftId: "",
        MarketPrice: "",
        NeedPoint: "",
        descript: "",
        canusepoint: "",
        recordid: 0,
        nonebtn: !0
    },
    onLoad: function(e) {
        var a = this, i = this;
        e.recordid && ("nonebtn" == e.recordid && this.setData({
            nonebtn: !1
        }), this.setData({
            recordid: e.recordid
        }), wx.setNavigationBarTitle({
            title: "奖品详情"
        })), i.setData({
            giftId: e.giftId
        }), t.getSiteSettingData(function(t) {
            a.setData(t);
        });
    },
    onReady: function() {},
    onShow: function() {
        var i = this;
        wx.request({
            url: t.getUrl("PointMall.ashx?action=GetGiftInfo"),
            data: {
                openId: t.globalData.openId,
                giftId: i.data.giftId
            },
            success: function(o) {
                if (void 0 == o.data.error_response) {
                    var n = o.data;
                    if ("OK" == o.data.Status) {
                        var r = n.LongDescription;
                        null != r && void 0 != r && a.wxParse("descript", "html", r, i), i.setData({
                            giftimg: t.getRequestUrl + n.ImageUrl,
                            giftname: n.Name,
                            MarketPrice: n.MarketPrice,
                            NeedPoint: n.NeedPoint,
                            canusepoint: t.globalData.userInfo.points
                        });
                    }
                } else e.showTip(o.data.error_response.sub_msg);
            },
            complete: function() {}
        });
    },
    gotodetail: function() {
        wx.navigateTo({
            url: "../ordersubmit/ordersubmit?recordid=" + this.data.recordid + "&giftId=" + this.data.giftId
        });
    },
    change: function(a) {
        var i = this;
        t.getOpenId(function(a) {
            var o = this;
            wx.request({
                url: t.getUrl("PointMall.ashx?action=ExChangeGifts"),
                data: {
                    openId: a,
                    giftId: i.data.giftId
                },
                success: function(t) {
                    void 0 == t.data.error_response ? "OK" == t.data.Status ? (e.showTip(t.data.Message, "success"), 
                    wx.switchTab({
                        url: "../cart/cart" + (o.data.recordid ? recordid : "0")
                    })) : e.showTip(t.data.Message, "tips") : e.showTip(t.data.error_response.sub_msg);
                }
            });
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});