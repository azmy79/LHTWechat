var a = require("../../utils/config.js"), e = getApp();

Page({
    data: {
        pageIndex: 1,
        pageSize: 10,
        DrawType: 0,
        DrawTypeList: [ "提现到银行卡", "提现到微信", "提现到支付宝" ],
        balance: "",
        DeductMinDraw: "",
        DrawIndex: -1,
        DrawMoney: "",
        password: "",
        TabType: 1,
        IsSetTradePassword: !1,
        DrawList: null,
        isEmpty: !0,
        openId: "",
        nullDraw: e.getRequestUrl + "/Templates/xcxshop/images/null.png",
        LastDrawTime: "",
        txtBankName: "",
        BankAccountName: "",
        BankAccountNo: "",
        AlipayRealName: "",
        RealName: "",
        Remark: "",
        OpenDraws: "",
        EnableBulkPaymentAdvance: !1
    },
    onLoad: function(a) {
        var t = this, n = this, s = [ "提现到银行卡" ];
        e.globalData.siteInfo.EnableBulkPaymentAliPay && s.push("提现到支付宝"), e.globalData.siteInfo.EnableBulkPaymentAliPay && s.push("提现到微信"), 
        n.setData({
            OpenDraws: e.globalData.siteInfo.SplittinDraws_CashToDeposit,
            TabType: a.TabType,
            DrawTypeList: s
        }), 2 == n.data.TabType && n.loadDrawListData(n, !1), e.getSiteSettingData(function(a) {
            t.setData(a);
        });
    },
    InputValue: function(a) {
        var e = a.currentTarget.dataset.key;
        this.data[e] = a.detail.value;
    },
    ShowType: function(e) {
        var t = this;
        wx.showActionSheet({
            itemList: t.data.DrawTypeList,
            success: function(a) {
                if (!a.cancel) {
                    var e = t.data.DrawTypeList[a.tapIndex], n = t.GetDrawTypeId(e);
                    t.setData({
                        DrawIndex: a.tapIndex,
                        Drawtype: n
                    }), console.log(t.data.DrawType);
                }
            },
            fail: function(e) {
                a.showTip("未开启提现方式", "warning");
            }
        });
    },
    GetDrawTypeId: function(a) {
        return "提现到银行卡" == a ? 1 : "提现到微信" == a ? 2 : "提现到支付宝" == a ? 3 : void 0;
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("Balance.ashx?action=BalanceInfo"),
                data: {
                    openId: t
                },
                success: function(e) {
                    a.setData({
                        balance: e.data.Balance - e.data.RequestBalance
                    });
                }
            });
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var a = this;
        a.setData({
            pageIndex: a.data.pageIndex + 1,
            TabType: 2
        }), a.loadDrawListData(a, !0);
    },
    onReachBottom: function() {
        var a = this;
        a.setData({
            pageIndex: a.data.pageIndex + 1,
            TabType: 2
        }), a.loadDrawListData(a, !0);
    },
    onShareAppMessage: function() {},
    bingApplyDraw: function(a) {
        this.setData({
            TabType: 1,
            isEmpty: !1
        });
    },
    bingDrawList: function(a) {
        var e = this;
        e.setData({
            pageIndex: 1,
            TabType: 2
        }), e.loadDrawListData(e, !1);
    },
    formSubmit: function(t) {
        var n = this, s = this.data;
        !s.DrawMoney || s.DrawMoney <= 0 ? a.showTip("请输入提现金额", "tips") : !s.password || s.password.length < 6 ? a.showTip("请输入交易密码", "tips") : e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("Balance.ashx?action=RequestBalanceDraw"),
                data: {
                    openId: t,
                    drawtype: n.data.Drawtype,
                    Amount: s.DrawMoney,
                    TradePassword: s.password,
                    BankName: s.txtBankName,
                    AccountName: s.BankAccountName,
                    MerchantCode: s.BankAccountNo,
                    Code: s.AlipayRealName,
                    RealName: s.RealName,
                    Remark: s.Remark
                },
                success: function(e) {
                    void 0 == e.data.error_response ? "OK" == e.data.Status ? (a.showTip(e.data.Message, "success"), 
                    wx.navigateTo({
                        url: "../assetcash/assetcash?TabType=2"
                    })) : a.showTip(e.data.Message, "tips") : a.showTip(e.data.error_response.sub_msg, "tips");
                },
                complete: function() {}
            });
        });
    },
    loadDrawListData: function(t, n) {
        var t = this;
        wx.showLoading({
            title: "加载中"
        }), e.getOpenId(function(s) {
            wx.request({
                url: e.getUrl("Balance.ashx?action=RequestBalanceList"),
                data: {
                    openId: s,
                    pageIndex: t.data.pageIndex,
                    pageSize: t.data.pageSize
                },
                success: function(e) {
                    if (void 0 == e.data.error_response) {
                        if ("OK" == e.data.Status) {
                            var s = e.data.Data;
                            if (n) {
                                var i = t.data.DrawList;
                                i.push.apply(i, s), t.setData({
                                    DrawList: i
                                });
                            } else {
                                var o = s.length > 0;
                                t.setData({
                                    DrawList: s,
                                    isEmpty: o
                                });
                            }
                        }
                    } else a.showTip(e.data.error_response.sub_msg);
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        });
    },
    forgetTap: function(a) {
        wx.redirectTo({
            url: "../userfindpaypwd/userfindpaypwd"
        });
    },
    SetTradeTap: function(a) {
        wx.navigateTo({
            url: "../usersetpaypwd/usersetpaypwd"
        });
    },
    goDrawDetail: function(a) {
        var e = a.currentTarget.dataset.requestid;
        wx.navigateTo({
            url: "../assetcashdetail/assetcashdetail?RequestId=" + e
        });
    }
});