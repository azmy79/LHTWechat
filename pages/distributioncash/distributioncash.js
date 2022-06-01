var a = require("../../utils/config.js"), t = getApp();

Page({
    data: {
        pageIndex: 1,
        pageSize: 10,
        DrawType: 0,
        DrawTypeList: [],
        CanDrawSplittin: "",
        DeductMinDraw: "",
        DrawIndex: -1,
        DrawMoney: "",
        password: "",
        TabType: 1,
        IsSetTradePassword: !0,
        DrawList: null,
        isEmpty: !0,
        isEnd: !1,
        openId: "",
        nullDraw: t.getRequestUrl + "/Templates/xcxshop/images/null.png",
        LastDrawTime: "",
        txtBankName: "",
        BankAccountName: "",
        BankAccountNo: "",
        AlipayRealName: "",
        RealName: "",
        Remark: "",
        OpenDraws: ""
    },
    onLoad: function(a) {
        var e = this, s = this;
        s.GetReferralInfo(), s.setData({
            TabType: a.TabType || 1
        }), 2 == s.data.TabType && s.loadDrawListData(s, !1), t.getSiteSettingData(function(a) {
            e.setData(a);
        });
    },
    InputValue: function(a) {
        var t = a.currentTarget.dataset.key;
        this.data[t] = a.detail.value;
    },
    ShowType: function(t) {
        var e = this;
        wx.showActionSheet({
            itemList: e.data.DrawTypeList,
            success: function(a) {
                if (!a.cancel) {
                    var t = e.data.DrawTypeList[a.tapIndex], s = e.GetDrawTypeId(t);
                    e.setData({
                        DrawIndex: a.tapIndex,
                        Drawtype: s
                    });
                }
            },
            fail: function(t) {
                a.showTip("未开启提现方式", "warning");
            }
        });
    },
    GetDrawTypeId: function(a) {
        return "提现到银行卡" == a ? 1 : "提现到微信" == a ? 2 : "提现到支付宝" == a ? 3 : 4;
    },
    GetReferralInfo: function(a) {
        var e = this;
        t.getOpenId(function(a) {
            wx.request({
                url: t.getUrl("Referral.ashx?action=GetReferralInfo"),
                data: {
                    openId: a
                },
                success: function(a) {
                    if (void 0 == a.data.error_response) {
                        var t = a.data.referral_get_response;
                        e.setData({
                            CanDrawSplittin: t.CanDrawSplittin,
                            DeductMinDraw: t.DeductMinDraw,
                            LastDrawTime: t.LastDrawTime
                        }), e.GetCheckData(t);
                    } else wx.showTip(a.data.error_response.sub_msg);
                }
            });
        });
    },
    GetCheckData: function(a) {
        var t = a, e = [];
        t.SplittinDraws_CashToBankCard && e.push("提现到银行卡"), t.SplittinDraws_CashToWeiXin && e.push("提现到微信"), 
        t.SplittinDraws_CashToALiPay && e.push("提现到支付宝"), t.SplittinDraws_CashToDeposit && e.push("提现到预付款账户"), 
        this.setData({
            DrawTypeList: e
        });
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        t.quickLogin(function() {
            a.setData({
                IsSetTradePassword: t.globalData.userInfo.IsSetTradePassword
            });
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {
        var a = this;
        a.data.isEnd || (a.setData({
            pageIndex: a.data.pageIndex + 1
        }), a.loadDrawListData(a, !0));
    },
    onShareAppMessage: function() {},
    bingApplyDraw: function(a) {
        this.setData({
            TabType: 1,
            isEmpty: !1
        });
    },
    bingDrawList: function(a) {
        var t = this;
        t.setData({
            pageIndex: 1,
            TabType: 2
        }), t.loadDrawListData(t, !1);
    },
    formSubmit: function(e) {
        var s = this, n = this.data;
        !n.DrawMoney || n.DrawMoney <= 0 ? a.showTip("请输入提现金额", "tips") : !n.password || n.password.length < 6 ? a.showTip("请输入交易密码", "tips") : t.getOpenId(function(e) {
            wx.request({
                url: t.getUrl("Referral.ashx?action=SplittinDraw"),
                data: {
                    openId: e,
                    drawtype: s.data.Drawtype,
                    Amount: n.DrawMoney,
                    TradePassword: n.password,
                    BankName: n.txtBankName,
                    AccountName: n.BankAccountName,
                    MerchantCode: n.BankAccountNo,
                    Code: n.AlipayRealName,
                    RealName: n.RealName,
                    Remark: n.Remark
                },
                success: function(t) {
                    void 0 == t.data.error_response ? "OK" == t.data.Status ? (wx.navigateTo({
                        url: "../distributioncash/distributioncash?TabType=2"
                    }), a.showTip(t.data.Message, "success")) : a.showTip(t.data.Message, "tips") : a.showTip(t.data.error_response.sub_msg, "tips");
                },
                complete: function() {}
            });
        });
    },
    loadDrawListData: function(e, s) {
        var e = this;
        wx.showLoading({
            title: "加载中"
        }), t.getOpenId(function(n) {
            wx.request({
                url: t.getUrl("Referral.ashx?action=SplittinDrawList"),
                data: {
                    openId: n,
                    pageIndex: e.data.pageIndex,
                    pageSize: e.data.pageSize
                },
                success: function(t) {
                    if (void 0 == t.data.error_response) {
                        var n = t.data.SplittinDraw_get_response.SplittinDraws;
                        if (e.setData({
                            isEnd: n.length < e.data.pageSize
                        }), s) {
                            var i = e.data.DrawList;
                            i.push.apply(i, n), e.setData({
                                DrawList: i
                            });
                        } else {
                            var r = n.length > 0;
                            e.setData({
                                DrawList: n,
                                isEmpty: r
                            });
                        }
                    } else a.showTip(t.data.error_response.sub_msg);
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
        var t = "../usersetpaypwd/usersetpaypwd";
        this.data.IsSetTradePassword && (t = "../userresetpaypwd/userresetpaypwd"), wx.navigateTo({
            url: t
        });
    },
    goDrawDetail: function(a) {
        var t = a.currentTarget.dataset.requestid;
        wx.navigateTo({
            url: "../distributioncashdetail/distributioncashdetail?RequestId=" + t
        });
    }
});