var a = getApp();

Page({
    data: {
        OpenReferral: "",
        ReferralSettingInfo: "",
        userInfo: {},
        IsOpenRechargeGift: "",
        statusBarHeight: 20,
        showVipDetail: !1,
        isShowHishopCopyRight: !1,
        isJumpLink: !1,
        EnableBalanceRecharge: !1,
        model: "",
        xmodel: !1
    },
    onLoad: function(e) {
        var t = this;
        a.globalData.siteInfo && this.setData({
            isShowHishopCopyRight: a.globalData.siteInfo.IsShowHishopCopyRight,
            isJumpLink: a.globalData.siteInfo.IsJumpLink
        }), wx.getSystemInfo({
            success: function(a) {
                t.setData({
                    statusBarHeight: a.statusBarHeight,
                    model: a.model
                });
            }
        }), this.data.model.indexOf("iPhone X") >= 0 && this.setData({
            xmodel: !0
        }), wx.request({
            url: a.getUrl("Common.ashx?action=GetReferralSetData"),
            data: {},
            success: function(e) {
                "OK" == (e = e.data).Status && (a.globalData.ReferralSettingInfo = e.Data.ReferralSettingInfo, 
                t.setData({
                    ReferralSettingInfo: e.Data.ReferralSettingInfo
                }));
            }
        }), a.getSiteSettingData(function(e) {
            a.globalData.siteInfo && t.setData({
                EnableBalanceRecharge: a.globalData.siteInfo.EnableBalanceRecharge
            }), t.setData(e);
        });
    },
    onShow: function() {
        var e = this;
        a.globalData.openId ? a.globalData.userInfo ? (a.quickLogin(function() {
            e.setData({
                userInfo: a.globalData.userInfo,
                OpenReferral: a.globalData.siteInfo.OpenReferral,
                IsOpenRechargeGift: a.globalData.siteInfo.IsOpenRechargeGift
            }), a.globalData.siteInfo.QuickLoginIsForceBindingMobbile && !a.globalData.userInfo.CellPhone && wx.navigateTo({
                url: "../userbindphone/userbindphone"
            });
        }), wx.request({
            url: a.getUrl("Partner.ashx?action=GetPartnerInfo"),
            data: {
                openId: a.globalData.openId
            },
            success: function(a) {
                (a = a.data).success ? e.setData({
                    subMemberNumber: a.subMemberNumber,
                    subReferralNumber: a.subReferralNumber,
                    totalAmount: a.totalAmount,
                    isPartner: !0
                }) : e.setData({
                    isPartner: !1
                });
            }
        })) : a.getOpenId(function(t) {
            e.setData({
                userInfo: a.globalData.userInfo,
                OpenReferral: a.globalData.siteInfo.OpenReferral
            }), a.globalData.siteInfo && a.globalData.siteInfo.QuickLoginIsForceBindingMobbile && !a.globalData.userInfo.CellPhone && wx.navigateTo({
                url: "../userbindphone/userbindphone"
            });
        }) : this.setData({
            userInfo: {}
        });
    },
    goToCopyright: function() {
        a.goToCopyright();
    },
    bindStatue: function(e) {
        if (a.globalData.openId) {
            var t = e.currentTarget.dataset.key;
            wx.navigateTo({
                url: "../orderlist/orderlist?status=" + t
            });
        } else wx.navigateTo({
            url: "../login/login"
        });
    },
    goToTeamPage: function(e) {
        if (a.globalData.openId) {
            var t = e.currentTarget.dataset.page;
            wx.navigateTo({
                url: "../userteammanager/userteammanager?page=" + t
            });
        } else wx.navigateTo({
            url: "../login/login"
        });
    },
    bindApply: function(e) {
        a.globalData.openId ? wx.navigateTo({
            url: "../refundlist/refundlist"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    goShare: function() {
        a.globalData.openId ? wx.navigateTo({
            url: "../distributionshare/distributionshare"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    bindMyAddressTap: function(e) {
        a.globalData.openId ? wx.navigateTo({
            url: "../address/address"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    bindMyCouponsTap: function(e) {
        a.globalData.openId ? wx.navigateTo({
            url: "../coupon/coupon"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    bindMyRedCouponsTap: function(e) {
        a.globalData.openId ? wx.navigateTo({
            url: "../cashcoupon/cashcoupon"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    bindMyGiftTap: function(e) {
        a.globalData.openId ? wx.navigateTo({
            url: "../myprize/myprize"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    bindGroupTap: function() {
        a.globalData.openId ? wx.navigateTo({
            url: "../fightorderlist/fightorderlist"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    bindDeposit: function(e) {
        a.globalData.openId ? a.globalData.userInfo.IsOpenBalance && a.globalData.userInfo.IsSetTradePassword ? wx.navigateTo({
            url: "../asset/asset"
        }) : wx.navigateTo({
            url: "../usersetpaypwd/usersetpaypwd"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    bindPointTap: function(e) {
        a.globalData.openId ? wx.navigateTo({
            url: "../userintegral/userintegral"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    bindAccount: function(e) {
        a.globalData.openId ? wx.navigateTo({
            url: "../usermanager/usermanager"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    bindTelPhone: function(a) {
        var e = a.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: e
        });
    },
    bindExtension: function(e) {
        a.globalData.openId ? 0 != a.globalData.userInfo.ReferralStatus && 2 != a.globalData.userInfo.ReferralStatus ? wx.navigateTo({
            url: "../distributionauditing/distributionauditing"
        }) : wx.navigateTo({
            url: "../distributionapply/distributionapply"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    bindDistribution: function(e) {
        a.globalData.openId ? a.globalData.userInfo.IsRepeled ? a.showErrorModal("您已被商城取消分销员资格，请联系管理员") : wx.navigateTo({
            url: "../distributionstore/distributionstore"
        }) : wx.navigateTo({
            url: "../login/login"
        });
    },
    vipShowDetialHandle: function() {
        this.setData({
            showVipDetail: !this.data.showVipDetail
        });
    }
});