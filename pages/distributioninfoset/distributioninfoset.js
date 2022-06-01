var e = require("../../utils/config.js"), a = getApp(), t = null, n = new Array(), s = new Array(), r = new Array(), o = new Array(), i = 0, d = 0, l = 0, h = 0, u = [], c = [], g = [];

Page({
    data: {
        BannerUrl: "",
        ShopName: "",
        RealName: "",
        Email: "",
        Phone: "",
        ImageCode: "",
        PhoneCode: "",
        FullRegionPath: "",
        Address: ""
    },
    onLoad: function(e) {
        var t = this;
        this.setAreaData(), a.getOpenId(function(e) {
            wx.request({
                url: a.getUrl("Referral.ashx?action=GetReferralInfo"),
                data: {
                    openId: e
                },
                success: function(e) {
                    if (e.data.referral_get_response) {
                        var a = e.data.referral_get_response;
                        if (a.ReferralExtInfo) {
                            var n = a.ReferralExtInfo, s = "";
                            n.FullRegion && (s = n.FullRegion.map(function(e) {
                                return e.Name;
                            }).join(" ")), t.setData({
                                RealName: n.RealName,
                                BannerUrl: a.BannerUrl,
                                ShopName: a.ShopName,
                                Phone: a.ReferralCellPhone,
                                Email: n.Email || "",
                                regionId: n.RegionId,
                                Address: n.Address,
                                FullRegionPath: s
                            });
                        }
                    }
                }
            });
        }), this.setData({
            VcodeUrl: a.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + a.globalData.openId,
            UserCredentials: a.globalData.userInfo.picture,
            BannerUrl: a.globalData.userInfo.picture,
            IsOpenPhoneValid: a.globalData.siteInfo.IsPromoterValidatePhone && a.globalData.siteInfo.PromoterNeedInfo.indexOf("2") >= 0,
            IsNeedPhone: a.globalData.siteInfo.PromoterNeedInfo.indexOf("2") >= 0,
            IsNeedEmail: a.globalData.siteInfo.PromoterNeedInfo.indexOf("3") >= 0,
            IsNeedRealName: a.globalData.siteInfo.PromoterNeedInfo.indexOf("1") >= 0,
            IsNeedAddress: a.globalData.siteInfo.PromoterNeedInfo.indexOf("4") >= 0
        }), a.getSiteSettingData(function(e) {
            t.setData(e);
        });
    },
    DeleteImg: function() {
        var a = this;
        e.showCancelModal("删除", "确定要删除Logo图片吗", function() {
            a.setData({
                UserCredentials: "../../images/return-img_03.jpg",
                BannerUrl: ""
            });
        });
    },
    ChooseImg: function(e) {
        var t = this, n = a.getRequestUrl;
        t.data.BannerUrl ? wx.previewImage({
            current: n + t.data.BannerUrl,
            urls: [ n + t.data.BannerUrl ]
        }) : wx.chooseImage({
            count: 1,
            success: function(e) {
                var a = e.tempFilePaths[0];
                t.setData({
                    UserCredentials: a
                }), t.UploadImage(a);
            }
        });
    },
    UploadImage: function(e) {
        var t = "", n = this;
        a.getOpenId(function(s) {
            wx.uploadFile({
                url: a.getUrl("Common.ashx?action=UploadAppletImage"),
                filePath: e,
                name: "file",
                formData: {
                    openId: s
                },
                success: function(e) {
                    var a = JSON.parse(e.data);
                    "OK" == a.Status ? t = a.Data[0].ImageUrl : "NOUser" == a.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        confirmColor: "#ff5722",
                        content: a.ErrorResponse.ErrorMsg,
                        showCancel: !1,
                        success: function(e) {
                            e.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {
                    t && n.setData({
                        BannerUrl: t
                    });
                }
            });
        });
    },
    ChangeCode: function() {
        this.setData({
            VcodeUrl: a.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + a.globalData.openId + "&&d=" + new Date()
        });
    },
    bindFullAddressTap: function(e) {
        i = 0, d = 0, l = 0, this.setAreaData(), this.setData({
            showDistpicker: !0
        });
    },
    SavePromoters: function() {
        var t = this;
        !t.data.ShopName || t.data.ShopName.length <= 0 ? e.showTip("请输入店铺名称", "warning") : t.data.IsNeedPhone && (!t.data.Phone || t.data.Phone.length <= 0) ? e.showTip("请输入手机号码", "warning") : t.data.IsOpenPhoneValid && (!t.data.PhoneCode || t.data.PhoneCode.length <= 0) ? e.showTip("请输入手机验证码", "warning") : t.data.IsNeedEmail && (!t.data.Email || t.data.Email.length <= 0) ? e.showTip("请输入邮箱账号", "warning") : t.data.IsNeedRealName && (!t.data.RealName || t.data.RealName.length <= 0) ? e.showTip("请输入真实姓名", "warning") : t.data.IsNeedAddress && (!t.data.FullRegionPath || t.data.FullRegionPath.length <= 0) ? e.showTip("请选择省市区", "warning") : t.data.IsNeedAddress && (!t.data.Address || t.data.Address.length <= 0) ? e.showTip("请输入详细地址", "warning") : wx.request({
            url: a.getUrl("Referral.ashx?action=ReferralRegister"),
            data: {
                OpenId: a.globalData.openId,
                RealName: t.data.RealName,
                Address: t.data.Address,
                RegionId: t.data.regionId,
                Email: t.data.Email,
                Phone: t.data.Phone,
                PhoneCode: t.data.PhoneCode,
                NumberCode: t.data.ImageCode,
                ShopName: t.data.ShopName,
                BannerUrl: t.data.BannerUrl
            },
            success: function(a) {
                void 0 == a.data.error_response ? "OK" == a.data.Status ? wx.showModal({
                    title: "提示",
                    content: a.data.Message,
                    showCancel: !1,
                    success: function() {
                        wx.switchTab({
                            url: "../userhome/userhome"
                        });
                    }
                }) : e.showTip(a.data.Message, "warning") : e.showTip(a.data.error_response.sub_msg);
            }
        });
    },
    GetPhoneCode: function() {
        var t = this.data;
        t.Phone && e.checkPhone(t.Phone) ? !t.ImageCode || t.ImageCode.length <= 0 ? e.showTip("输入图形验证码", "warning") : wx.request({
            url: a.getUrl("UserCenter.ashx?action=SendVerifyCode"),
            data: {
                Phone: t.Phone,
                imgCode: t.ImageCode,
                IsValidPhone: !0,
                OpenId: a.globalData.openId
            },
            success: function(a) {
                void 0 == a.data.error_response ? "OK" == a.data.Status ? e.showTip("验证码发送成功", "success") : e.showTip(a.data.Message, "warning") : e.showTip(a.data.error_response.sub_msg);
            }
        }) : e.showTip("手机号格式不对", "warning");
    },
    InputValue: function(e) {
        var a = e.currentTarget.dataset.key;
        this.data[a] = e.detail.value;
    },
    changeArea: function(e) {
        var a = this;
        i = e.detail.value[0], d = e.detail.value[1], l = e.detail.value.length > 2 ? e.detail.value[2] : 0, 
        h = e.detail.value.length > 3 ? e.detail.value[3] : 0, console.log("省:" + i + "市:" + d + "区:" + l), 
        a.setAreaData(i, d, l, h);
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
        var e, a, t = this.data.provinceName[i] + " " + this.data.cityName[d] + " " + (this.data.districtName[l] || "");
        this.data.streetCode.length > 0 && 0 != this.data.streetCode[h] ? (e = this.data.streetCode[h], 
        a = this.data.districtName[l]) : this.data.districtCode.length > 0 ? (e = this.data.districtCode[l], 
        a = this.data.districtName[l]) : this.data.cityCode.length > 0 ? (e = this.data.cityCode[d], 
        a = this.data.cityName[d]) : a = this.data.provinceName[i];
        var n = this.data.isCss;
        "请填写所在地区" == this.data.FullRegionName && (n = !1), this.setData({
            fullAddress: t,
            FullRegionName: t,
            FullRegionPath: t,
            regionId: e,
            selCityName: a,
            isCss: n,
            detailAddress: "",
            building: ""
        }), this.distpickerCancel();
    },
    ArrayContains: function(e, a) {
        for (var t = e.length; t--; ) if (e[t] === a) return !0;
        return !1;
    },
    getRegions: function(e, t, s, o) {
        var i = this, d = !0;
        3 == t ? i.ArrayContains(n, e) || (d = !1) : 4 == d && (i.ArrayContains(r, e) || (d = !1)), 
        wx.request({
            url: a.getUrl("ShippingAddress.ashx?action=GetRegions"),
            async: !1,
            data: {
                parentId: e
            },
            success: function(a) {
                console.log(a), "OK" == a.data.Status && (3 == a.data.Depth ? i.setAreaDataShow(a.data.Regions, e, s, o) : 4 == a.Depth && i.setStreetData(a.data.Regions, e, s, o));
            }
        });
    },
    setProvinceCityData: function(e, a, n, s, r) {
        var o = this;
        null != e && (t = e);
        var i = t, d = [], h = [];
        for (var u in i) {
            var c = i[u].name, f = i[u].id;
            d.push(c), h.push(f), g.length > 0 && f == g[0] && (a = u);
        }
        o.setData({
            provinceName: d,
            provinceCode: h
        });
        var p = t[a].city, m = [], I = [];
        for (var u in p) {
            var c = p[u].name, f = p[u].id;
            m.push(c), I.push(f), g.length > 1 && f == g[1] && (n = u);
        }
        o.setData({
            cityName: m,
            cityCode: I
        });
        var v = p.length > n ? p[n].area : p[0].area, w = [], C = [];
        if (null != v && v.length > 0) {
            for (var u in v) {
                var c = v[u].name, f = v[u].id;
                w.push(c), C.push(f), g.length > 2 && f == g[2] && (l = u);
            }
            o.setData({
                districtName: w,
                districtCode: C
            });
            var D = v.length > l ? v[l].country : v[0].country, N = [], P = [];
            if (null != D && D.length > 0) {
                N.push("其它"), P.push(0);
                for (var u in D) {
                    var c = D[u].name, f = D[u].id;
                    N.push(c), P.push(f), g.length > 3 && f == g[3] && (r = u);
                }
                o.setData({
                    streetName: N,
                    streetCode: P
                });
            } else o.setData({
                streetName: [],
                streetCode: []
            });
        } else o.setData({
            districtName: [],
            districtCode: [],
            streetName: [],
            streetCode: []
        });
        var R = [];
        R.push(a), R.push(n), R.push(l), R.push(r), o.setData({
            value: R
        }), g = [];
    },
    getItemIndex: function(e, a) {
        for (var t = e.length; t--; ) if (e[t] === a) return t;
        return -1;
    },
    setAreaDataShow: function(e, a, t, o) {
        var i = this;
        if (null != e) u = e, n.push(a), s.push(e); else {
            var l = i.getItemIndex(n, a);
            u = l >= 0 ? s[l] : [];
        }
        var h = [], c = [];
        if (u && u.length > 0) {
            for (var g in u) {
                var f = g.id, p = g.name;
                h.push(f), c.push(p);
            }
            i.setData({
                districtName: h,
                districtCode: c
            });
        } else i.setData({
            districtName: [],
            districtCode: []
        });
        this.ArrayContains(r, t) ? i.setStreetData(null, d, t, o) : i.getRegions(d, 4, t, o);
    },
    setStreetData: function(e, a, t, n) {
        var s = this;
        if (null != e) r.push(regionId), o.push(e), c = e; else {
            var i = s.getItemIndex(r, a);
            c = i >= 0 ? o[i] : [];
        }
    },
    setAreaData: function(e, n, s, r) {
        var o = this, e = e || 0, n = n || 0, r = (s = s || 0) || 0;
        void 0 == t || null == t ? wx.request({
            url: a.getUrl("ShippingAddress.ashx?action=GetRegionsOfProvinceCity"),
            async: !1,
            success: function(a) {
                "OK" == a.data.Status && o.setProvinceCityData(a.data.province, e, n, s, r);
            },
            error: function(e) {}
        }) : o.setProvinceCityData(null, e, n, s, r);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});