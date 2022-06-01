var e = getApp();

Page({
    data: {
        EnvelopeAmount: 0,
        RedEnvelopeGetRecords: [],
        code: 10
    },
    onLoad: function(e) {
        this.setData({
            SendCode: e.SendCode,
            OrderId: e.OrderId
        });
    },
    bindTaphome: function() {
        wx.switchTab({
            url: "../home/home"
        });
    },
    onReady: function() {},
    onShow: function() {
        var o = this;
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("RedEnvelope.ashx?action=GetRedEnvelopeCoupon"),
                data: {
                    openId: t,
                    SendCode: o.data.SendCode,
                    OrderId: o.data.OrderId
                },
                success: function(e) {
                    var t = e.data, n = [];
                    "OK" == t.Status ? wx.showToast({
                        title: t.Message,
                        icon: "success",
                        duration: 2e3
                    }) : (o.setData({
                        code: t.Code
                    }), wx.showToast({
                        title: t.Message,
                        icon: "none",
                        duration: 2e3
                    })), "OK" != t.Status && "2" != t.Code && "3" != t.Code || (t.Data.RedEnvelopeGetRecords.forEach(function(e) {
                        e.GetTime = e.GetTime.split("T")[0] + " " + e.GetTime.split("T")[1].split(".")[0], 
                        n.push(e);
                    }), o.setData({
                        EnvelopeAmount: t.Data.EnvelopeAmount,
                        RedEnvelopeGetRecords: n
                    }));
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