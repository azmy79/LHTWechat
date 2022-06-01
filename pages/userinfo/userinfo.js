function e(e, a, t) {
    return a in e ? Object.defineProperty(e, a, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[a] = t, e;
}

var a, t = require("../../utils/config.js"), i = require("../../utils/qqmap-wx-jssdk.min.js"), s = null, r = new Array(), n = new Array(), d = new Array(), o = new Array(), u = 0, c = 0, l = 0, h = 0, g = getApp(), f = [], m = [], p = [];

Page({
    data: {
        currentPage: "page1",
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
        showDistpicker: !1,
        FullRegionName: "请填写所在地区",
        isCss: !0,
        isHidePage1: !1,
        FromPage: "",
        CheckedCityName: "",
        userInfo: {},
        userInfos: {},
        picture: "",
        realName: "",
        UserName: "",
        SexIndex: -1,
        SexList: [ "男", "女" ],
        gender: 2,
        showTimepicker: !1,
        years: [],
        months: [],
        days: [],
        year: 2e3,
        month: 1,
        day: 1,
        Birthday: "",
        NickName: "",
        Address: "",
        RegionAreaName: "",
        picimg: ""
    },
    onLoad: function(e) {
        var t = this;
        this.setAreaData(), a = new i({
            key: g.globalData.QQMapKey
        });
        var s = this;
        s.setData({
            userInfo: g.globalData.userInfo,
            picture: g.globalData.userInfo.picture,
            Birthday: g.globalData.userInfo.BirthDate,
            gender: g.globalData.userInfo.Gender,
            realName: "null" != g.globalData.userInfo.realName ? g.globalData.userInfo.realName : "",
            Address: g.globalData.userInfo.Address,
            NickName: g.globalData.userInfo.NickName,
            RegionAreaName: g.globalData.userInfo.RegionAreaName
        }), "1" == s.data.gender ? s.setData({
            sex: "男"
        }) : s.setData({
            sex: "女"
        });
        g.getSiteSettingData(function(e) {
            t.setData(e);
        });
    },
    uploadimg: function() {
        var e = this;
        wx.chooseImage({
            success: function(a) {
                var t = a.tempFilePaths[0];
                e.UploadImage(t);
            }
        });
    },
    UploadImage: function(e) {
        var a = this;
        g.getOpenId(function(t) {
            wx.uploadFile({
                url: g.getUrl("Common.ashx?action=UploadAppletImage"),
                filePath: e,
                name: "file",
                formData: {
                    openId: t,
                    Files: e
                },
                success: function(e) {
                    var t = JSON.parse(e.data);
                    if ("OK" == t.Status) {
                        var i = t.Data[0].ImageUrl;
                        a.setData({
                            picture: g.getRequestUrl + i,
                            picimg: i
                        });
                    } else "NOUser" == t.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        confirmColor: "#ff5722",
                        content: t.ErrorResponse.ErrorMsg,
                        showCancel: !1,
                        success: function(e) {
                            e.confirm && wx.navigateBack({
                                delta: 2
                            });
                        }
                    });
                }
            });
        });
    },
    InputValue: function(e) {
        var a = e.currentTarget.dataset.key;
        this.data[a] = e.detail.value;
    },
    ShowSex: function(e) {
        var a = this;
        wx.showActionSheet({
            itemList: a.data.SexList,
            success: function(e) {
                if (!e.cancel) {
                    var t = a.data.SexList[e.tapIndex];
                    a.data.gender = "女" == t ? 2 : 1, a.setData({
                        SexIndex: e.tapIndex,
                        gender: a.data.gender,
                        sex: t
                    });
                }
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    setTimeData: function() {
        for (var e = 1950; e <= new Date().getFullYear(); e++) this.data.years.push(e);
        for (var a = 1; a <= 12; a++) this.data.months.push(a);
        for (var t = 1; t <= 31; t++) this.data.days.push(t);
    },
    bindDateChange: function(e) {
        this.setData({
            Birthday: e.detail.value
        });
    },
    disttimepickerSure: function(e) {
        this.setData({
            Birthday: this.data.year + "-" + this.data.month + "-" + this.data.day
        }), this.disttimepickerCancel();
    },
    showTimepicker: function() {
        this.setData({
            showTimepicker: !0
        });
    },
    disttimepickerCancel: function() {
        this.setData({
            showTimepicker: !1
        });
    },
    bindFullAddressTap: function(e) {
        u = 0, c = 0, l = 0, this.setAreaData(), this.setData({
            showDistpicker: !0
        });
    },
    bindSaveTapTap: function(e) {
        var a = this;
        a.data.userInfo.picture = a.data.picture, a.data.userInfo.gender = a.data.gender, 
        a.data.userInfo.realName = a.data.realName, a.data.userInfo.birthday = a.data.Birthday, 
        a.data.userInfo.NickName = a.data.NickName, a.data.userInfo.regionId = a.data.regionId, 
        a.data.userInfo.Address = a.data.Address, a.data.userInfo.RegionAreaName = a.data.RegionAreaName, 
        g.getOpenId(function(e) {
            wx.request({
                url: g.getUrl("UserCenter.ashx?action=UpdateMemberInformation"),
                data: {
                    openId: e,
                    gender: a.data.gender,
                    realName: a.data.realName,
                    birthday: a.data.Birthday,
                    QQ: "",
                    nickName: a.data.NickName,
                    picture: a.data.picimg,
                    regionId: a.data.regionId,
                    address: a.data.Address
                },
                success: function(e) {
                    void 0 == e.data.error_response ? "OK" == e.data.Status && (g.setUserInfo(a.data.userInfo), 
                    t.showTip(e.data.Message, "success"), wx.navigateBack({
                        delta: 2
                    })) : t.showTip(e.data.error_response.sub_msg);
                },
                complete: function() {}
            });
        });
    },
    changeArea: function(e) {
        var a = this;
        u = e.detail.value[0], c = e.detail.value[1], l = e.detail.value.length > 2 ? e.detail.value[2] : 0, 
        h = e.detail.value.length > 3 ? e.detail.value[3] : 0, console.log("省:" + u + "市:" + c + "区:" + l), 
        a.setAreaData(u, c, l, h);
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
        var a, t, i = this.data.provinceName[u] + " " + this.data.cityName[c] + " " + this.data.districtName[l], s = this.data.cityName[c];
        this.data.streetCode.length > 0 && 0 != this.data.streetCode[h] ? (a = this.data.streetCode[h], 
        t = this.data.districtName[l]) : this.data.districtCode.length > 0 ? (a = this.data.districtCode[l], 
        t = this.data.districtName[l]) : this.data.cityCode.length > 0 ? (a = this.data.cityCode[c], 
        t = this.data.cityName[c]) : t = this.data.provinceName[u];
        var r = this.data.isCss;
        "请填写所在地区" == this.data.FullRegionName && (r = !1), console.log(s), this.setData(e({
            fullAddress: i,
            FullRegionName: i,
            RegionAreaName: i,
            regionId: a,
            selCityName: t,
            isCss: r,
            detailAddress: "",
            building: "",
            CheckedCityName: s
        }, "RegionAreaName", i)), this.distpickerCancel();
    },
    ArrayContains: function(e, a) {
        for (var t = e.length; t--; ) if (e[t] === a) return !0;
        return !1;
    },
    getRegions: function(e, a, t, i) {
        var s = this, n = !0;
        3 == a ? s.ArrayContains(r, e) || (n = !1) : 4 == n && (s.ArrayContains(d, e) || (n = !1)), 
        wx.request({
            url: g.getUrl("ShippingAddress.ashx?action=GetRegions"),
            async: !1,
            data: {
                parentId: e
            },
            success: function(a) {
                console.log(a), "OK" == a.data.Status && (3 == a.data.Depth ? s.setAreaDataShow(a.data.Regions, e, t, i) : 4 == a.Depth && s.setStreetData(a.data.Regions, e, t, i));
            }
        });
    },
    setProvinceCityData: function(e, a, t, i, r) {
        var n = this;
        null != e && (s = e);
        var d = s, o = [], u = [];
        for (var c in d) {
            var h = d[c].name, g = d[c].id;
            o.push(h), u.push(g), p.length > 0 && g == p[0] && (a = c);
        }
        n.setData({
            provinceName: o,
            provinceCode: u
        });
        var f = s[a].city, m = [], v = [];
        for (var c in f) {
            var h = f[c].name, g = f[c].id;
            m.push(h), v.push(g), p.length > 1 && g == p[1] && (t = c);
        }
        n.setData({
            cityName: m,
            cityCode: v
        });
        var D = f.length > t ? f[t].area : f[0].area, N = [], I = [];
        if (null != D && D.length > 0) {
            for (var c in D) {
                var h = D[c].name, g = D[c].id;
                N.push(h), I.push(g), p.length > 2 && g == p[2] && (l = c);
            }
            n.setData({
                districtName: N,
                districtCode: I
            });
            var y = D.length > l ? D[l].country : D[0].country, C = [], A = [];
            if (null != y && y.length > 0) {
                C.push("其它"), A.push(0);
                for (var c in y) {
                    var h = y[c].name, g = y[c].id;
                    C.push(h), A.push(g), p.length > 3 && g == p[3] && (r = c);
                }
                n.setData({
                    streetName: C,
                    streetCode: A
                });
            } else n.setData({
                streetName: [],
                streetCode: []
            });
        } else n.setData({
            districtName: [],
            districtCode: [],
            streetName: [],
            streetCode: []
        });
        var w = [];
        w.push(a), w.push(t), w.push(l), w.push(r), n.setData({
            value: w
        }), p = [];
    },
    getItemIndex: function(e, a) {
        for (var t = e.length; t--; ) if (e[t] === a) return t;
        return -1;
    },
    setAreaDataShow: function(e, a, t, i) {
        var s = this;
        if (null != e) f = e, r.push(a), n.push(e); else {
            var o = s.getItemIndex(r, a);
            f = o >= 0 ? n[o] : [];
        }
        var u = [], l = [];
        if (f && f.length > 0) {
            for (var h in f) {
                var g = h.id, m = h.name;
                u.push(g), l.push(m);
            }
            s.setData({
                districtName: u,
                districtCode: l
            });
        } else s.setData({
            districtName: [],
            districtCode: []
        });
        this.ArrayContains(d, t) ? s.setStreetData(null, c, t, i) : s.getRegions(c, 4, t, i);
    },
    setStreetData: function(e, a, t, i) {
        var s = this;
        if (null != e) d.push(regionId), o.push(e), m = e; else {
            var r = s.getItemIndex(d, a);
            m = r >= 0 ? o[r] : [];
        }
    },
    setAreaData: function(e, a, t, i) {
        var r = this, e = e || 0, a = a || 0, i = (t = t || 0) || 0;
        void 0 == s || null == s ? wx.request({
            url: g.getUrl("ShippingAddress.ashx?action=GetRegionsOfProvinceCity"),
            async: !1,
            success: function(s) {
                "OK" == s.data.Status && r.setProvinceCityData(s.data.province, e, a, t, i);
            },
            error: function(e) {}
        }) : r.setProvinceCityData(null, e, a, t, i);
    },
    bindDetailAddressTap: function() {
        var e = this;
        e.setData({
            currentPage: "page2"
        }), setTimeout(function() {
            e.setData({
                showPage2: !0,
                isHidePage1: !0
            });
        }, 500);
    },
    bindHidePage2: function() {
        var e = this;
        setTimeout(function() {
            e.data.isDelete || e.setData({
                currentPage: "page1",
                isDelete: !1,
                isHidePage1: !1
            });
        }, 100);
    },
    searchKeyword: function(e) {
        var t = this, i = e.detail.value;
        t.setData({
            detailAddress: i,
            isDelete: !1
        }), "" != i && setTimeout(function() {
            a.getSuggestion({
                keyword: i,
                region: t.data.CheckedCityName,
                region_fix: 1,
                success: function(e) {
                    t.setData({
                        searchList: e.data
                    });
                }
            }, 500);
        });
    },
    setAddr: function(e) {
        var a = e.currentTarget.dataset.fromlatlng, i = e.currentTarget.dataset.name, s = this;
        s.setData({
            lat: e.currentTarget.dataset.lat,
            lng: e.currentTarget.dataset.lng
        }), g.getOpenId(function(e) {
            var r = {
                openId: e,
                fromLatLng: a
            };
            t.httpGet(g.getUrl("ShippingAddress.ashx?action=GetRegionByLatLng"), r, function(e) {
                e = e, s.setData({
                    isDelete: !1,
                    Address: i
                }), e.FullRegionName.length > 0 && s.setData({
                    RegionAreaName: e.FullRegionName,
                    regionId: e.RegionId
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