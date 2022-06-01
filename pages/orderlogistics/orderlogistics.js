var e = getApp();

Page({
    data: {
        ExpressCompanyName: "",
        ShipOrderNumber: "",
        ShipTo: "",
        CellPhone: "",
        Address: "",
        LogisticsData: null
    },
    onLoad: function(s) {
        var a = this, t = s.orderid, n = s.returnid, o = s.replaceid;
        t && e.getOpenId(function(s) {
            wx.request({
                url: e.getUrl("UserOrder.ashx?action=GetLogistic"),
                data: {
                    openId: s,
                    orderId: t
                },
                success: function(e) {
                    a.loadSuccess(e);
                }
            });
        }), n && e.getOpenId(function(s) {
            wx.request({
                url: e.getUrl("UserOrder.ashx?action=ReturnLogistic"),
                data: {
                    openId: s,
                    returnId: n
                },
                success: function(e) {
                    a.loadSuccess(e);
                }
            });
        }), o && e.getOpenId(function(s) {
            wx.request({
                url: e.getUrl("UserOrder.ashx?action=ReturnLogistic"),
                data: {
                    openId: s,
                    replaceId: o
                },
                success: function(e) {
                    a.loadSuccess(e);
                }
            });
        });
    },
    loadSuccess: function(e) {
        var s = this;
        if ("OK" == e.data.Status) {
            var a = e.data.Data, t = JSON.parse(a.LogisticsData);
            s.setData({
                ExpressCompanyName: a.ExpressCompanyName,
                ShipOrderNumber: a.ShipOrderNumber,
                ShipTo: a.ShipTo,
                CellPhone: a.CellPhone,
                Address: a.Address,
                LogisticsData: t.traces
            });
        } else "NOUser" == e.data.Message ? wx.navigateTo({
            url: "../login/login"
        }) : wx.showModal({
            title: "提示",
            content: e.data.Message,
            showCancel: !1,
            success: function(e) {
                e.confirm && wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});