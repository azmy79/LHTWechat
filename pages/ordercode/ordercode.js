var e = getApp(), o = require("../../utils/config.js");

Page({
    data: {
        CodeList: null,
        lenght: 0,
        code: 0,
        status: 0,
        qrcode: "",
        password_imgUrl: e.getRequestUrl + "/Templates/xcxshop/images/password_bg.png",
        overCode: e.getRequestUrl + "/Templates/xcxshop/images/over_code.png",
        useCode: e.getRequestUrl + "/Templates/xcxshop/images/used_code.png",
        refundCode: e.getRequestUrl + "/Templates/xcxshop/images/refund-code.png"
    },
    onLoad: function(e) {
        var o = e.orderid, s = this;
        s.setData({
            orderid: o
        }), s.loadData(s);
    },
    loadData: function(s) {
        wx.showNavigationBarLoading(), e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("UserOrder.ashx?action=GetOrderVerificationCode"),
                data: {
                    openId: t,
                    orderId: s.data.orderid
                },
                success: function(e) {
                    if (void 0 == e.data.error_response) {
                        var t = e.data.order_code_get_response;
                        s.setData({
                            CodeList: t
                        });
                    } else o.showTip(e.data.error_response.sub_msg);
                },
                complete: function() {
                    wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
                }
            });
        });
    }
});