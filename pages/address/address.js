var t = require("../../utils/config.js"), a = getApp();

Page({
    data: {
        addressData: []
    },
    onLoad: function(t) {
        var e = this;
        this.initData(), a.getSiteSettingData(function(t) {
            e.setData(t);
        });
    },
    initData: function() {
        var e = this;
        a.getOpenId(function(i) {
            var s = {
                openId: i
            };
            wx.showNavigationBarLoading(), t.httpGet(a.getUrl("ShippingAddress.ashx?action=GetUserShippingAddress"), s, e.getUserShippingAddressData);
        });
    },
    getUserShippingAddressData: function(t) {
        var e = this;
        "NOUser" == t.Message ? wx.navigateTo({
            url: "../login/login"
        }) : "OK" == t.Status ? (e.setData({
            addressData: t.Data,
            OpenMultStore: a.globalData.siteInfo.OpenMultStore
        }), wx.hideNavigationBarLoading()) : "NO" == t.Status ? (e.setData({
            addressData: []
        }), wx.hideNavigationBarLoading()) : wx.hideNavigationBarLoading();
    },
    getAddressResultData: function(e) {
        var i = this;
        if ("NOUser" == e.Message) wx.navigateTo({
            url: "../login/login"
        }); else if ("OK" == e.Status) {
            var s = {
                openId: a.globalData.openId
            };
            wx.hideNavigationBarLoading(), t.httpGet(a.getUrl("ShippingAddress.ashx?action=GetUserShippingAddress"), s, i.getUserShippingAddressData);
        } else wx.hideNavigationBarLoading();
    },
    bindRadioAddressChange: function(e) {
        var i = this, s = e.currentTarget.dataset.shippingid, d = {
            openId: a.globalData.openId,
            shippingId: s
        };
        wx.showNavigationBarLoading(), t.httpGet(a.getUrl("ShippingAddress.ashx?action=SetDefaultShippingAddress"), d, i.getAddressResultData);
    },
    bindDeleteAddressTap: function(e) {
        var i = this, s = e.currentTarget.dataset.shippingid;
        wx.showModal({
            title: "确定删除该地址吗？",
            success: function(e) {
                if (e.confirm) {
                    var d = {
                        openId: a.globalData.openId,
                        shippingId: s
                    };
                    wx.showNavigationBarLoading(), t.httpGet(a.getUrl("ShippingAddress.ashx?action=DelShippingAddress"), d, i.getAddressResultData);
                }
            }
        });
    },
    bindEditAddressTap: function(t) {
        var a = t.currentTarget.dataset.shippingid, e = t.currentTarget.dataset.RegionId;
        wx.navigateTo({
            url: "../addressedit/addressedit?extra=&RegionId=" + e + "&shippingid=" + a + "&title=编辑收货地址"
        });
    },
    gotoAddAddress: function() {
        wx.navigateTo({
            url: "../addressedit/addressedit?title=新增收货地址"
        });
    },
    bindAddAddressTap: function(e) {
        var i = this;
        wx.showModal({
            title: "提示",
            content: "是否使用微信收货地址",
            cancelText: "否",
            confirmText: "是",
            success: function(e) {
                e.confirm ? wx.chooseAddress({
                    success: function(e) {
                        if (e) {
                            var s = {
                                openId: a.globalData.openId,
                                shipTo: e.userName,
                                address: e.detailInfo,
                                cellphone: e.telNumber,
                                city: e.cityName,
                                county: e.countyName
                            };
                            t.httpPost(a.getUrl("ShippingAddress.ashx?action=AddWXChooseAddress"), s, function() {
                                i.initData();
                            });
                        }
                    }
                }) : e.cancel && i.gotoAddAddress();
            }
        });
    }
});