var t = require("../../utils/config.js"), d = getApp();

Page({
    data: {
        ProductSku: "",
        BuyAmount: 0,
        FromPage: "",
        CountdownId: "",
        ShipAddressId: "",
        AddressList: null,
        AddressCount: 0,
        DelshipId: 0,
        IsCheck: 0,
        jumpUrl: "",
        isorderaddress: !1,
        recordid: 0,
        giftId: 0
    },
    onLoad: function(t) {
        var i = this;
        console.log(t);
        var a = this, e = t.productsku, s = t.buyamount, o = t.frompage, r = t.countdownid, n = t.shipaddressid, u = parseInt(t.storeId || 0), c = t.fightGroupActivityId, h = t.fightGroupId, g = t.presaleId, p = t.recordid, f = t.giftId, I = "../addressedit/addressedit?Source=addresschoice&productsku=" + e + "&buyamount=" + s + "&frompage=" + o + "&countdownid=" + r + "&fightGroupActivityId=" + c + "&fightGroupId=" + h + "&recordid=" + p + "&giftId=" + f, l = t.isorderaddress;
        a.setData({
            jumpUrl: I,
            ProductSku: e,
            BuyAmount: s,
            FromPage: o,
            CountdownId: r,
            ShipAddressId: n,
            storeId: u,
            isorderaddress: l,
            fightGroupActivityId: c,
            fightGroupId: h,
            presaleId: g,
            recordid: p,
            giftId: f
        }), d.getSiteSettingData(function(t) {
            i.setData(t);
        }), a.initData();
    },
    initData: function() {
        var t = this;
        d.getOpenId(function(i) {
            wx.request({
                url: d.getUrl("ShippingAddress.ashx?action=GetUserShippingAddress"),
                data: {
                    openId: i
                },
                success: function(i) {
                    var a = i.data.Data;
                    "NO" == a.Status && wx.redirectTo({
                        url: jumpUrl
                    }), t.setData({
                        AddressCount: "[]" == a ? 0 : a.length,
                        AddressList: a,
                        OpenMultStore: d.globalData.siteInfo.OpenMultStore
                    });
                }
            });
        });
    },
    bindDeleteAddressTap: function(i) {
        var a = this, e = i.currentTarget.dataset.shippingid;
        wx.showModal({
            title: "确定删除该地址吗？",
            success: function(i) {
                if (i.confirm) {
                    var s = {
                        openId: d.globalData.openId,
                        shippingId: e
                    };
                    a.setData({
                        DelshipId: e
                    }), wx.showNavigationBarLoading(), t.httpGet(d.getUrl("ShippingAddress.ashx?action=delShippingAddress"), s, a.getAddressResultData);
                }
            }
        });
    },
    getAddressResultData: function(t) {
        var i = this;
        if ("NOUser" == t.Message) wx.redirectTo({
            url: "../login/login"
        }); else if ("OK" == t.Status) {
            d.globalData.openId;
            wx.hideNavigationBarLoading();
            var a = i.data.AddressList.filter(function(t, d, a) {
                return t.ShippingId != i.data.DelshipId;
            });
            i.setData({
                AddressList: a
            });
        } else wx.hideNavigationBarLoading();
    },
    bindEditAddressTap: function(t) {
        var d = t.currentTarget.dataset.addressdata, i = this;
        0 == i.data.IsCheck && wx.redirectTo({
            url: "../addressedit/addressedit?extra=" + JSON.stringify(d) + "&title=编辑收货地址&Source=addresschoice&productsku=" + i.data.ProductSku + "&buyamount=" + i.data.BuyAmount + "&frompage=" + i.data.FromPage + "&countdownid=" + i.data.CountdownId + "&storeId=" + i.data.storeId + "&fightGroupActivityId=" + this.data.fightGroupActivityId + "&fightGroupId=" + this.data.fightGroupId + "&recordid=" + this.data.recordid + "&giftId=" + this.data.giftId
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onAddShippingAddress: function(i) {
        var a = this;
        wx.showModal({
            title: "提示",
            content: "是否使用微信收货地址",
            cancelText: "否",
            confirmText: "是",
            success: function(i) {
                i.confirm ? wx.chooseAddress({
                    success: function(i) {
                        if (i) {
                            var e = {
                                openId: d.globalData.openId,
                                shipTo: i.userName,
                                address: i.detailInfo,
                                cellphone: i.telNumber,
                                city: i.cityName,
                                county: i.countyName
                            };
                            t.httpPost(d.getUrl("ShippingAddress.ashx?action=AddWXChooseAddress"), e, function() {
                                a.initData();
                            });
                        }
                    }
                }) : i.cancel && a.gotoAddAddress();
            }
        });
    },
    gotoAddAddress: function() {
        wx.redirectTo({
            url: "../addressedit/addressedit?Source=addresschoice&productsku=" + this.data.ProductSku + "&buyamount=" + this.data.BuyAmount + "&frompage=" + this.data.FromPage + "&countdownid=" + this.data.CountdownId + "&title=新增收货地址&storeId=" + this.data.storeId + "&fightGroupActivityId=" + this.data.fightGroupActivityId + "&fightGroupId=" + this.data.fightGroupId + "&recordid=" + this.data.recordid + "&giftId=" + this.data.giftId
        });
    },
    onAddressCheck: function(t) {
        var d = this, i = this, a = t.detail.value;
        this.setData({
            IsCheck: 1
        }), wx.navigateBack({
            delta: 1
        }), setTimeout(function() {
            wx.redirectTo({
                url: "../ordersubmit/ordersubmit?productsku=" + i.data.ProductSku + "&buyamount=" + i.data.BuyAmount + "&frompage=" + i.data.FromPage + "&countdownid=" + i.data.CountdownId + "&shipaddressid=" + a + "&storeid=" + i.data.storeId + "&fightGroupActivityId=" + d.data.fightGroupActivityId + "&fightGroupId=" + d.data.fightGroupId + "&presaleId=" + d.data.presaleId + "&recordid=" + d.data.recordid + "&giftId=" + d.data.giftId
            });
        }, 500);
    }
});