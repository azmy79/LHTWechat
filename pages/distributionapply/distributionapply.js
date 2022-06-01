var e = getApp(), t = require("../wxParse/wxParse.js"), i = require("../../utils/config.js");

Page({
    data: {
        isCheck: !1,
        isTip: !0,
        Introduction: null,
        checked: !1,
        Distributor: ""
    },
    onLoad: function(i) {
        var o = this, a = !1;
        null == e.globalData.siteInfo || e.globalData.siteInfo.HasReferralOrder || (a = !0), 
        e.getSiteSettingData(function(e) {
            o.setData(e);
        }, a);
        var n = this;
        i.source && "agreen" == i.source ? n.setData({
            isCheck: !0,
            checked: e.getRequestUrl + "/Templates/xcxshop/images/promotion_checked.png"
        }) : n.setData({
            isCheck: !1
        });
        var r = e.globalData.siteInfo.ReferralIntroduction;
        n.setData({
            conditionMeony: e.globalData.siteInfo.ApplyReferralNeedAmount,
            OpenRecruitmentAgreement: e.globalData.siteInfo.OpenRecruitmentAgreement,
            Distributor: e.globalData.ReferralSettingInfo.DistributionName
        }), t.wxParse("Introduction", "html", r, n);
    },
    onReady: function() {},
    ApplicationReqeust: function() {
        var t = this, o = e.globalData.siteInfo.ApplyReferralCondition;
        if (1 == o) {
            if (e.globalData.userInfo.Expenditure < t.data.conditionMeony && (t.setData({
                isTip: !1
            }), !t.data.isTip)) return void i.showModal("提示", "需要累计消费金额达到" + t.data.conditionMeony + "元才可申请哦");
            wx.redirectTo({
                url: "../distributioninfoset/distributioninfoset"
            });
        }
        if (2 == o) e.globalData.siteInfo.HasReferralOrder ? wx.redirectTo({
            url: "../distributioninfoset/distributioninfoset"
        }) : wx.showModal({
            title: "提示",
            content: "需要购买指定商品后才可申请哦",
            confirmText: "现在购买",
            success: function(t) {
                t.confirm && (e.globalData.siteInfo.ApplyReferralNeedBuyProducts.indexOf(",") > -1 ? wx.redirectTo({
                    url: "../productsearch/productsearch?storeid=0&productIds=" + e.globalData.siteInfo.ApplyReferralNeedBuyProducts
                }) : wx.redirectTo({
                    url: "../productdetail/productdetail?storeid=0&id=" + e.globalData.siteInfo.ApplyReferralNeedBuyProducts
                }));
            }
        }); else {
            if (3 == o) {
                if (e.globalData.userInfo.Balance < e.globalData.siteInfo.PreDepositNeedAmount) {
                    t.setData({
                        isTip: !1
                    });
                    var a = e.subtract(e.globalData.siteInfo.PreDepositNeedAmount, e.globalData.userInfo.Balance);
                    if (!t.data.isTip) {
                        var n = "需要充值到" + e.globalData.siteInfo.PreDepositNeedAmount + "元才可申请哦,还需要充值" + a + "元", r = "../assetrecharge/assetrecharge?IsOpenRechargeGift=false&needMoney=" + a + "&type=isNeedAmount";
                        return void wx.showModal({
                            title: "提示",
                            content: n,
                            showCancel: !0,
                            confirmColor: "#00cc00",
                            confirmText: "去充值",
                            success: function(e) {
                                e.confirm && wx.redirectTo({
                                    url: r
                                });
                            }
                        });
                    }
                }
                return wx.redirectTo({
                    url: "../distributioninfoset/distributioninfoset"
                }), !1;
            }
            t.data.OpenRecruitmentAgreement ? t.data.isCheck ? wx.redirectTo({
                url: "../distributioninfoset/distributioninfoset"
            }) : i.showTip("请勾选协议", "warning") : wx.redirectTo({
                url: "../distributioninfoset/distributioninfoset"
            });
        }
    },
    btnChange: function(t) {
        var i = this.data.isCheck;
        i ? this.setData({
            checked: ""
        }) : this.setData({
            checked: e.getRequestUrl + "/Templates/xcxshop/images/promotion_checked.png"
        }), this.setData({
            isCheck: !i
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});