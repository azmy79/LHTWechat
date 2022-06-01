var e = getApp(), t = require("../../utils/config.js");

Page({
    data: {
        ReChargeBalance: "",
        RechargeGiftInfo: null,
        IsOpenRechargeGift: "",
        listactive: !1,
        needMoney: 0,
        type: "",
        money: ""
    },
    onLoad: function(t) {
        var a = this, n = this;
        n.setData({
            IsOpenRechargeGift: t.IsOpenRechargeGift,
            type: t.type,
            needMoney: t.needMoney
        }), e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("Balance.ashx?action=BalanceInfo"),
                data: {
                    openId: t
                },
                success: function(e) {
                    n.setData({
                        RechargeGiftInfo: e.data.RechargeGiftInfo
                    });
                }
            });
        }), e.getSiteSettingData(function(e) {
            a.setData(e);
        });
    },
    InputValue: function(e) {
        var t = e.currentTarget.dataset.key;
        this.data[t] = e.detail.value;
    },
    onReady: function() {},
    onShow: function() {},
    Recharge: function(a) {
        var n = this, o = this.data;
        !o.money || o.money <= 0 ? t.showTip("充值金额需大于0", "tips") : (n.setData({
            money: o.money
        }), e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("Balance.ashx?action=AddInpourBlance"),
                data: {
                    openId: t,
                    ReChargeBalance: n.data.money
                },
                success: function(e) {
                    if ("OK" == e.data.Status) {
                        var t = e.data.Data;
                        wx.requestPayment({
                            timeStamp: t.timeStamp,
                            nonceStr: t.nonceStr,
                            package: "prepay_id=" + t.prepayId,
                            signType: "MD5",
                            paySign: t.sign,
                            success: function(e) {
                                wx.showModal({
                                    title: "提示",
                                    content: "支付成功！",
                                    showCancel: !1,
                                    success: function(e) {
                                        if (e.confirm) {
                                            if ("isNeedAmount" == n.data.type && parseFloat(n.data.money) >= parseFloat(n.data.needMoney)) return void wx.redirectTo({
                                                url: "../distributioninfoset/distributioninfoset"
                                            });
                                            wx.navigateBack({
                                                delta: 1
                                            });
                                        }
                                    }
                                });
                            },
                            fail: function(e) {
                                wx.showModal({
                                    title: "提示",
                                    content: "支付失败！",
                                    showCancel: !1,
                                    success: function(e) {
                                        e.confirm && wx.navigateBack({
                                            delta: 1
                                        });
                                    }
                                });
                            }
                        });
                    } else wx.showModal({
                        title: "提示",
                        content: e.data.Message
                    });
                }
            });
        }));
    },
    selectinfo: function(e) {
        var t = this, a = e.currentTarget.dataset.name;
        t.setData({
            listactive: !t.data.listactive,
            money: a
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});