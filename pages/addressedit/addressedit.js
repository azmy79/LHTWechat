var t, e = require("../../utils/config.js"), a = require("../../utils/qqmap-wx-jssdk.min.js"), i = null, s = (new Array(), 
new Array(), new Array(), new Array(), 0), d = 0, n = 0, r = 0, o = getApp(), l = [];

Page({
    data: {
        currentPage: "page1",
        navigateTitle: "",
        addressData: {},
        shipTo: "",
        cellPhone: "",
        fullAddress: "",
        address: "",
        regionId: "",
        provinceName: [],
        provinceCode: [],
        provinceSelIndex: "",
        cityName: [],
        cityCode: [],
        citySelIndex: "",
        districtName: [],
        districtCode: [],
        districtSelIndex: "",
        streetName: [],
        streetCode: [],
        streetSelIndex: "",
        showMessage: !1,
        messageContent: "",
        showDistpicker: !1,
        Source: "",
        ShipAddressId: "",
        FullRegionPath: "请填写所在地区",
        isCss: !0,
        isHidePage1: !1,
        ProductSku: "",
        BuyAmount: 1,
        FromPage: "",
        CountdownId: 0,
        CheckedCityName: ""
    },
    onLoad: function(i) {
        var s = this;
        o.getSiteSettingData(function(t) {
            s.setData(t);
        }), this.setAreaData(), t = new a({
            key: o.globalData.QQMapKey
        });
        var d = i.title;
        this.setData({
            navigateTitle: d
        }), wx.setNavigationBarTitle({
            title: this.data.navigateTitle
        });
        var n = 0;
        if ("编辑收货地址" == d) {
            var r = this;
            if (void 0 == (n = i.shippingid)) {
                var l = JSON.parse(i.extra);
                n = l.ShippingId;
            }
            o.getOpenId(function(t) {
                var a = {
                    openId: t,
                    shippingId: n
                };
                r.setData({
                    Source: i.Source,
                    ProductSku: i.productsku,
                    FromPage: i.frompage,
                    storeId: i.storeId || 0,
                    fightGroupActivityId: i.fightGroupActivityId,
                    fightGroupId: i.fightGroupId
                }), wx.showNavigationBarLoading(), e.httpGet(o.getUrl("ShippingAddress.ashx?action=GetShippingAddressById"), a, r.GetShippingAddressByIdData);
            });
        } else this.setData({
            Source: i.Source,
            cellphone: i.CellPhone,
            shipTo: i.ShipTo,
            isDefault: !1,
            BuildingNumber: i.BuildingNumber,
            ProductSku: i.productsku,
            BuyAmount: i.buyamount,
            FromPage: i.frompage,
            CountdownId: i.countdownid,
            storeId: i.storeId || 0,
            fightGroupActivityId: i.fightGroupActivityId,
            fightGroupId: i.fightGroupId
        });
    },
    GetShippingAddressByIdData: function(t) {
        var e = this;
        if (t.error_response) wx.showToast({
            title: t.error_response.sub_msg
        }); else {
            var a = t.Data.ShippingAddressInfo, i = "", s = "";
            if (a.LatLng && (i = a.LatLng.split(",")[0], s = a.LatLng.split(",")[1]), t.Status) {
                var d = "", n = a.FullAddress.split(" ");
                n.length >= 2 && (d = n[1]);
                var r = "", o = "", l = "", u = (a.FullRegionPath, a.FullRegionPath);
                if (u && u.length > 0) {
                    var h = u.split(" ");
                    o = h[0], h.length > 1 && (r = h[1]), h.length > 2 && (l = h[2]);
                }
                e.setData({
                    ShipTo: a.ShipTo,
                    CellPhone: a.CellPhone,
                    FullAddress: a.FullAddress,
                    FullRegionPath: a.FullRegionPath,
                    Address: a.Address,
                    BuildingNumber: a.BuildingNumber,
                    lat: i,
                    lng: s,
                    regionId: a.RegionId,
                    ShippingId: a.ShippingId,
                    isDefault: a.IsDefault,
                    CheckedCityName: d,
                    selProviceName: o,
                    selCityName: r,
                    selAreaName: l
                }), wx.hideNavigationBarLoading();
            } else wx.hideNavigationBarLoading();
        }
    },
    bindShipToTap: function(t) {
        var e = t.detail.value;
        this.data.ShipTo = e;
    },
    bindCellPhoneTap: function(t) {
        var e = t.detail.value;
        this.data.CellPhone = e;
    },
    bindFullAddressTap: function(t) {
        s = 0, d = 0, n = 0, this.setAreaData(), this.setData({
            showDistpicker: !0
        });
    },
    bindAddressTap: function(t) {
        var e = t.detail.value;
        this.data.Address = e;
    },
    bindNumberTap: function(t) {
        var e = t.detail.value;
        this.data.BuildingNumber = e;
    },
    bindSaveTapTap: function(t) {
        var a = this;
        a.data.ShipTo ? a.data.CellPhone ? a.data.FullRegionPath ? a.data.Address ? o.getOpenId(function(t) {
            if (wx.showNavigationBarLoading(), "新增收货地址" == a.data.navigateTitle) {
                i = {
                    openId: t,
                    isDefault: a.data.isDefault,
                    shipTo: a.data.ShipTo,
                    address: a.data.Address,
                    cellphone: a.data.CellPhone,
                    regionId: a.data.regionId,
                    BuildingNumber: a.data.BuildingNumber ? a.data.BuildingNumber : "",
                    latlng: a.data.lat + "," + a.data.lng
                };
                e.httpPost(o.getUrl("ShippingAddress.ashx?action=AddShippingAddress"), i, a.getEditAddressData);
            } else {
                var i = {
                    openId: t,
                    shippingId: a.data.ShippingId,
                    isDefault: a.data.isDefault,
                    shipTo: a.data.ShipTo,
                    address: a.data.Address,
                    cellphone: a.data.CellPhone,
                    regionId: a.data.regionId,
                    BuildingNumber: a.data.BuildingNumber ? a.data.BuildingNumber : "",
                    latlng: a.data.lat + "," + a.data.lng
                };
                e.httpPost(o.getUrl("ShippingAddress.ashx?action=UpdateShippingAddress"), i, a.getEditAddressData);
            }
        }) : wx.showToast({
            title: "请输入详细地址",
            icon: "fail",
            duration: 2e3
        }) : wx.showToast({
            title: "请输入所在地区",
            icon: "fail",
            duration: 2e3
        }) : wx.showToast({
            title: "请输入联系电话",
            icon: "fail",
            duration: 2e3
        }) : wx.showToast({
            title: "请输入收货人",
            icon: "fail",
            duration: 2e3
        });
    },
    getEditAddressData: function(t) {
        var e = this;
        if (wx.hideNavigationBarLoading(), "NOUser" == t.Message) wx.navigateTo({
            url: "../login/login"
        }); else if ("OK" == t.Status) {
            var a = getCurrentPages(), i = a[a.length - 2], s = this.data.Source, d = "";
            void 0 == s || "" == s ? (d = "../address/address", i.initData(), wx.navigateBack()) : "chooseaddr" == s ? (i.refreshData(), 
            wx.navigateBack()) : (s = "addresschoice") ? d = "../addresschoice/addresschoice?productsku=" + e.data.ProductSku + "&buyamount=" + e.data.BuyAmount + "&frompage=" + e.data.FromPage + "&countdownid=" + e.data.CountdownId + "&storeId=" + e.data.storeId + "&fightGroupActivityId=" + this.data.fightGroupActivityId + "&fightGroupId=" + this.data.fightGroupId : (s = "submmitorder") && (d = "../ordersubmit/ordersubmit?productsku=" + e.data.ProductSku + "&buyamount=" + e.data.BuyAmount + "&frompage=" + e.data.FromPage + "&countdownid=" + e.data.CountdownId + "&shipaddressid=" + t.Messag + "&storeId=" + e.data.storeId + "&fightGroupActivityId=" + this.data.fightGroupActivityId + "&fightGroupId=" + this.data.fightGroupId), 
            void 0 != d && "" != d && wx.redirectTo({
                url: d
            });
        } else wx.showToast({
            title: "",
            icon: "loading",
            duration: 1e4
        }), setTimeout(function() {
            wx.hideToast();
        }, 2e3);
    },
    changeArea: function(t) {
        var e = this;
        s = t.detail.value[0], d = t.detail.value[1], n = t.detail.value.length > 2 ? t.detail.value[2] : 0, 
        r = t.detail.value.length > 3 ? t.detail.value[3] : 0, e.setAreaData(s, d, n, r);
    },
    showDistpicker: function() {
        this.setData({
            showDistpicker: !0
        });
    },
    distpickerCancel: function() {
        this.setData({
            showDistpicker: !1
        });
    },
    distpickerSure: function() {
        if (!(this.data.provinceName.length <= 0)) {
            var t, e, a = this.data.provinceName[s] + " " + this.data.cityName[d] + " " + (this.data.districtName[n] || "") + " " + (this.data.streetName[r] || "").replace("其它", ""), i = "", o = "";
            this.data.streetCode.length > 0 && 0 != this.data.streetCode[r] ? (t = this.data.streetCode[r], 
            e = this.data.cityName[d], i = this.data.provinceName[s], o = this.data.districtName[n]) : this.data.districtCode.length > 0 ? (t = this.data.districtCode[n], 
            e = this.data.cityName[d], i = this.data.provinceName[s], o = this.data.districtName[n]) : this.data.cityCode.length > 0 ? (t = this.data.cityCode[d], 
            e = this.data.cityName[d], i = this.data.provinceName[s]) : (t = this.data.provinceCode[d], 
            i = this.data.provinceName[s]);
            var l = this.data.isCss;
            "请填写所在地区" == this.data.FullRegionPath && (l = !1), this.setData({
                fullAddress: a,
                FullRegionPath: a,
                regionId: t,
                selCityName: e,
                selProviceName: i,
                selAreaName: o,
                isCss: l,
                detailAddress: ""
            }), this.distpickerCancel();
        }
    },
    ArrayContains: function(t, e) {
        for (var a = t.length; a--; ) if (t[a] === e) return !0;
        return !1;
    },
    setProvinceCityData: function(t) {
        var e = this;
        null != t && (i = t);
        var a = i, n = [], r = [];
        for (var o in a) {
            var u = a[o].name, h = a[o].id;
            n.push(u), r.push(h), l.length > 0 && h == l[0] && (s = o);
        }
        e.setData({
            provinceName: n,
            provinceCode: r
        });
        var g = i.length > s ? i[s].city : i[0].city, c = [], p = [];
        for (var o in g) {
            var u = g[o].name, h = g[o].id;
            c.push(u), p.push(h), l.length > 1 && h == l[1] && (d = o);
        }
        e.setData({
            cityName: c,
            cityCode: p
        }), e.getSubRegion(g[d].id, g, d);
    },
    getSubRegion: function(t, a, i) {
        var d = this;
        e.httpGet(o.getUrl("ShippingAddress.ashx?action=GetRegions"), {
            parentId: t
        }, function(t) {
            if ("OK" == t.Status) {
                var e = t.Regions, a = [], o = [];
                if (null != e && e.length > 0) {
                    for (var u in e) {
                        var h = e[u].name, g = e[u].id;
                        a.push(h), o.push(g), l.length > 2 && g == l[2] && (n = u);
                    }
                    d.setData({
                        districtName: a,
                        districtCode: o
                    }), d.getSubStreet(e[n].id);
                } else d.setData({
                    districtName: [],
                    districtCode: [],
                    streetName: [],
                    streetCode: []
                });
                var c = [];
                c.push(s), c.push(i), c.push(n), c.push(r), d.setData({
                    value: c
                }), l = [];
            }
        }, !0);
    },
    getSubStreet: function(t, a, i) {
        var s = this;
        e.httpGet(o.getUrl("ShippingAddress.ashx?action=GetRegions"), {
            parentId: t
        }, function(t) {
            if ("OK" == t.Status) {
                var e = t.Regions, a = [], i = [];
                if (null != e && e.length > 0) {
                    a.push("其它"), i.push(0);
                    for (var d in e) {
                        var n = e[d].name, o = e[d].id;
                        a.push(n), i.push(o), l.length > 3 && o == l[3] && (r = d);
                    }
                    s.setData({
                        streetName: a,
                        streetCode: i
                    });
                } else s.setData({
                    streetName: [],
                    streetCode: []
                });
            }
        }, !0);
    },
    getItemIndex: function(t, e) {
        for (var a = t.length; a--; ) if (t[a] === e) return a;
        return -1;
    },
    setAreaData: function(t, e, a, s) {
        var d = this;
        void 0 == i || null == i ? wx.request({
            url: o.getUrl("ShippingAddress.ashx?action=GetRegionsOfProvinceCity"),
            async: !0,
            success: function(t) {
                "OK" == t.data.Status && d.setProvinceCityData(t.data.province);
            }
        }) : d.setProvinceCityData(null);
    },
    bindDetailAddressTap: function() {
        var t = this;
        t.setData({
            currentPage: "page2"
        }), setTimeout(function() {
            t.setData({
                showPage2: !0,
                isHidePage1: !0
            });
        }, 500);
    },
    bindHidePage2: function() {
        var t = this;
        setTimeout(function() {
            t.data.isDelete || t.setData({
                currentPage: "page1",
                isDelete: !1,
                isHidePage1: !1
            });
        }, 100);
    },
    comfrimDetail: function() {
        this.bindHidePage2(), this.setData({
            Address: this.data.detailAddress
        });
    },
    searchKeyword: function(e) {
        var a = this, i = e.detail.value;
        if (a.setData({
            detailAddress: i,
            isDelete: !1
        }), "" != i) {
            var s = a.data.selProviceName, d = a.data.selCityName, n = a.data.selAreaName, r = "";
            null != s && s.length > 0 && ("省" != s.substring(s.length - 1, s.length) && -1 == s.indexOf("自治区") || (r = s)), 
            null != d && "请选择" !== d && "其他" !== d && (r += d), null != n && "请选择" !== n && "其他" !== n && (r += n), 
            setTimeout(function() {
                t.getSuggestion({
                    keyword: i,
                    region: r,
                    region_fix: 1,
                    success: function(t) {
                        a.setData({
                            searchList: t.data
                        });
                    }
                }, 500);
            });
        }
    },
    setAddr: function(t) {
        var a = t.currentTarget.dataset.fromlatlng, i = t.currentTarget.dataset.name, s = this;
        s.setData({
            lat: t.currentTarget.dataset.lat,
            lng: t.currentTarget.dataset.lng
        }), o.getOpenId(function(t) {
            var d = {
                openId: t,
                fromLatLng: a
            };
            e.httpGet(o.getUrl("ShippingAddress.ashx?action=GetRegionByLatLng"), d, function(t) {
                t = t, s.setData({
                    isDelete: !1,
                    Address: i
                }), t.FullRegionName.length > 0 && s.setData({
                    FullRegionPath: t.FullRegionName,
                    regionId: t.RegionId
                }), s.bindHidePage2();
            });
        });
    },
    delDetailAddr: function() {
        this.setData({
            Address: "",
            isDelete: !0
        });
    }
});