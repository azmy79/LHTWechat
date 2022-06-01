var t, e = require("../../utils/config.js"), a = require("../../utils/qqmap-wx-jssdk.min.js"), o = null, i = (new Array(), 
0), s = 0, n = getApp();

Page({
    data: {
        fromLatLng: "",
        cityname: "",
        location: "",
        isLogin: !0,
        showDistpicker: !1,
        showSearch: !1,
        provinceName: "",
        cityName: "",
        isShowAll: !1
    },
    onLoad: function(e) {
        var o = this, i = e.cityname.split(" ")[1];
        this.setAreaData(), t = new a({
            key: n.globalData.QQMapKey
        }), o.setData({
            fromLatLng: wx.getStorageSync("o2oFromLatLng"),
            cityname: i,
            location: e.address
        });
        var s = o.data.fromLatLng ? o.data.fromLatLng.split(",") : null;
        s && t.reverseGeocoder({
            coord_type: 5,
            location: {
                latitude: s[0],
                longitude: s[1]
            },
            get_poi: 1,
            poi_options: "page_size=10",
            success: function(t) {
                o.setData({
                    aroundAddrList: t.result.pois
                });
            }
        });
    },
    onShow: function() {
        e.httpGet(n.getUrl("ShippingAddress.ashx?action=GetUserShippingAddress"), {
            openId: n.globalData.openId
        }, this.getAddressListData);
    },
    getLocation: function() {
        var e = this, a = getCurrentPages(), o = a[a.length - 2];
        wx.getLocation({
            type: "wgs84",
            success: function(a) {
                e.setData({
                    fromLatLng: a.latitude + "," + a.longitude
                }), wx.setStorage({
                    key: "o2oFromLatLng",
                    data: a.latitude + "," + a.longitude
                }), t.reverseGeocoder({
                    coord_type: 5,
                    location: {
                        latitude: a.latitude,
                        longitude: a.longitude
                    },
                    get_poi: 1,
                    poi_options: "page_size=10",
                    success: function(t) {
                        e.setData({
                            cityname: t.result.address_component.city,
                            location: t.result.formatted_addresses.recommend,
                            aroundAddrList: t.result.pois
                        });
                    },
                    fail: function(t) {
                        wx.showToast({
                            title: "获取位置失败"
                        });
                    }
                }), o.setData({
                    fromLatLng: a.latitude + "," + a.longitude,
                    showNoLocate: !1,
                    isDataEnd: !1,
                    pageIndex: 1,
                    storeList: []
                });
            },
            fail: function(t) {
                e.setData({
                    location: "未能获取地理位置"
                }), wx.removeStorageSync("o2oFromLatLng");
            }
        });
    },
    reGetLocation: function() {
        var e = this, a = getCurrentPages(), o = a[a.length - 2];
        wx.getLocation({
            type: "wgs84",
            success: function(a) {
                e.setData({
                    fromLatLng: a.latitude + "," + a.longitude
                }), wx.setStorage({
                    key: "o2oFromLatLng",
                    data: a.latitude + "," + a.longitude
                }), t.reverseGeocoder({
                    coord_type: 5,
                    location: {
                        latitude: a.latitude,
                        longitude: a.longitude
                    },
                    get_poi: 1,
                    poi_options: "page_size=10",
                    success: function(t) {
                        e.setData({
                            cityname: t.result.address_component.city,
                            location: t.result.formatted_addresses.recommend,
                            aroundAddrList: t.result.pois
                        });
                    },
                    fail: function(t) {
                        wx.showToast({
                            title: "获取位置失败"
                        });
                    }
                }), o.setData({
                    fromLatLng: a.latitude + "," + a.longitude,
                    showNoLocate: !1,
                    isDataEnd: !1,
                    pageIndex: 1,
                    storeList: []
                });
            },
            fail: function(t) {
                wx.removeStorageSync("o2oFromLatLng"), n.openSetting(function() {
                    e.getLocation();
                });
            }
        });
    },
    getAddressListData: function(t) {
        var e = this;
        "NOUser" == t.Message ? wx.navigateTo({
            url: "../login/login"
        }) : "OK" == t.Status ? (e.setData({
            deliverAddrList: t.Data
        }), wx.hideNavigationBarLoading()) : "NO" == t.Status && e.setData({
            addressData: []
        });
    },
    setShowAll: function(t) {
        t.currentTarget.dataset.isshow ? this.setData({
            isShowAll: !1
        }) : this.setData({
            isShowAll: !0
        });
    },
    bindAddressTap: function() {
        i = 0, s = 0, this.setAreaData(), this.setData({
            showDistpicker: !0
        });
    },
    setAreaData: function(t, e) {
        var a = this, t = t || 0, e = e || 0;
        void 0 == o || null == o ? wx.request({
            url: n.getUrl("ShippingAddress.ashx?action=GetRegionsOfProvinceCity"),
            async: !1,
            success: function(o) {
                "OK" == o.data.Status && a.setProvinceCityData(o.data.province, t, e);
            },
            error: function(t) {}
        }) : a.setProvinceCityData(null, t, e);
    },
    setProvinceCityData: function(t, e, a) {
        var i = this;
        null != t && (o = t);
        var s = o, n = [], r = [];
        for (var d in s) {
            var c = s[d].name, u = s[d].id;
            n.push(c), r.push(u);
        }
        i.setData({
            provinceName: n,
            provinceCode: r
        });
        var l = o[e].city, g = [], h = [];
        for (var d in l) {
            var c = l[d].name, u = l[d].id;
            1, g.push(c), h.push(u);
        }
        i.setData({
            cityName: g,
            cityCode: h
        });
    },
    changeArea: function(t) {
        var e = this;
        i = t.detail.value[0], s = t.detail.value[1], e.setAreaData(i, s);
    },
    distpickerCancel: function() {
        this.setData({
            showDistpicker: !1
        });
    },
    distpickerSure: function() {
        var t, e = this.data.cityName[s];
        this.data.cityCode.length > 0 && (t = this.data.cityCode[s]), this.setData({
            cityname: e,
            regionId: t
        }), this.distpickerCancel();
    },
    onInputKeyword: function(t) {
        var e = this, a = t.detail.value;
        "" == a && e.setData({
            showSearch: !1
        }), a != e.data.KeyWord && e.setData({
            KeyWord: a
        });
    },
    searchKeyword: function() {
        var e = this, a = e.data.KeyWord;
        "" != a ? t.getSuggestion({
            keyword: a,
            region: e.data.cityname,
            region_fix: 1,
            success: function(t) {
                e.setData({
                    showSearch: !0,
                    searchList: t.data
                });
            }
        }) : wx.showToast({
            title: "请输入关键字"
        });
    },
    setAddr: function(t) {
        var e = t.currentTarget.dataset.fromlatlng, a = getCurrentPages();
        a[a.length - 2].setData({
            fromLatLng: e,
            isDataEnd: !1,
            pageIndex: 1,
            storeList: []
        }), wx.setStorage({
            key: "o2oFromLatLng",
            data: e
        }), wx.navigateTo({
            url: "../storelist/storelist?fromLatLng=" + e
        });
    },
    clearKeyword: function() {
        this.setData({
            KeyWord: ""
        });
    }
});