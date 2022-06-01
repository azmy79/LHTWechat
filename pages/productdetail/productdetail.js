function t(t) {
    if (Array.isArray(t)) {
        for (var e = 0, a = Array(t.length); e < t.length; e++) a[e] = t[e];
        return a;
    }
    return Array.from(t);
}

function e(t) {
    var e = parseInt(t / 86400), a = parseInt(t % 86400 / 3600), o = parseInt(t % 3600 / 60), i = parseInt(t % 3600 % 60);
    return e > 0 && e + "天", a < 10 && (a = "0" + a), o < 10 && (o = "0" + o), i < 10 && (i = "0" + i), 
    [ e, a, o, i ];
}

function a(t, o) {
    t.setData({
        StartClock: e(o)
    }), o <= 0 ? t.setData({
        StartClock: "",
        CountDownStatus: "Normal"
    }) : setTimeout(function() {
        a(t, o -= 1);
    }, 1e3);
}

function o(t, a) {
    t.setData({
        EndClock: e(a)
    }), a <= 0 ? t.setData({
        EndClock: "",
        CountDownStatus: "ActivityEnd"
    }) : setTimeout(function() {
        o(t, a -= 1);
    }, 1e3);
}

var i = require("../../utils/config.js"), s = getApp(), r = require("../wxParse/wxParse.js"), n = {
    activiyTypeText: {
        4: "抢购"
    }
};

Page({
    data: {
        ProductId: 0,
        ProductName: "",
        MetaDescription: "",
        TempMetaDescription: "",
        ShortDescription: "",
        ShowSaleCounts: "",
        Weight: "",
        MarketPrice: "",
        IsfreeShipping: "",
        MaxSalePrice: "",
        MinSalePrice: "",
        OldSalePrice: "",
        ProductImgs: "",
        SkuItemList: "",
        Skus: "",
        Freight: "",
        Coupons: "",
        Promotes: null,
        ShowPromotesText: "",
        SentFreightList: "",
        SentGiftList: "",
        IsUnSale: "",
        IsOnSale: !0,
        ActiveType: "",
        ActiveText: "",
        ShowPrice: "",
        backShow: "none",
        SkuShow: "none",
        couponShow: "none",
        promoteShow: "none",
        skuImg: "",
        skuPrice: 0,
        skuStock: 0,
        selectedSkuContent: "",
        buyAmount: 1,
        selectedskuList: [],
        isbuy: !0,
        ReviewCount: 0,
        imgurl: s.getRequestUrl + "/templates/master/default/UploadImage/advertimg/20160623171012_4817.jpg",
        sharebtn: s.getRequestUrl + "/Templates/xcxshop/images/share.png",
        productCodeUrl: "/Product.ashx?action=GetProductDetailAppletCode",
        SelectSpecifications: "",
        SupplierId: 0,
        SupplierName: "平台",
        DetailStatus: "active",
        AttributeStatus: "",
        ExtendAttribute: [],
        ExtensionId: 0,
        ReferralMoney: 0,
        referralId: "",
        CartQuantity: 0,
        ProductPromotion: null,
        canBuyTime: !0,
        OpenMultStore: !0,
        IsRecommandStore: !0,
        gradeName: "",
        videoPath: "",
        defaultImg: "",
        showVideo: !1,
        showPoster: !1,
        posterData: [],
        shopName: "",
        isShowHishopCopyRight: !1,
        isJumpLink: !1,
        hidden: !1,
        activityTypeText: "",
        Unit: "件",
        roomId: 0
    },
    onLoad: function(t) {
        var e = this;
        console.log(t);
        var a = "";
        s.getSiteSettingData(function(t) {
            e.setData(t);
        }), t.ReferralUserId && (a = t.ReferralUserId, s.setRefferUserId(t.ReferralUserId)), 
        s.globalData.siteInfo && this.setData({
            isShowHishopCopyRight: s.globalData.siteInfo.IsShowHishopCopyRight,
            isJumpLink: s.globalData.siteInfo.IsJumpLink
        });
        var o = t.id;
        s.globalData.userInfo && s.globalData.userInfo.IsReferral ? this.data.referralId = !0 : this.data.referralId = !1;
        var i = "";
        if (s.globalData.userInfo && (i = s.globalData.userInfo.gradeName), this.setData({
            gradeName: i,
            ProductId: o,
            referralUserId: a,
            referralId: this.data.referralId,
            activeid: parseInt(t.activeid || 0),
            storeid: parseInt(t.storeid || 0),
            roomId: t.room_id || 0
        }), this.data.storeid) {
            var r = wx.getStorageSync("o2oFromLatLng");
            r ? (this.setData({
                lat: r.split(",")[0],
                lng: r.split(",")[1]
            }), this.loadData()) : this.getLocation(function() {
                e.loadData();
            });
        } else this.loadData();
        s.updateCartQuantity(function(t) {
            e.setData({
                CartQuantity: t
            });
        });
    },
    OpenWap: function() {
        wx.openLocation({
            latitude: parseInt(this.data.lat),
            longitude: parseInt(this.data.lng),
            scale: 28,
            name: this.data.StoreInfo.StoreName,
            address: this.data.StoreInfo.Address
        });
    },
    goToCopyright: function() {
        s.goToCopyright();
    },
    onShareAppMessage: function(t) {
        var e = this, a = "/pages/productdetail/productdetail?id=" + e.data.ProductId + "&storeid=" + e.data.storeid + "&activeid=" + e.data.activeid;
        return s.globalData.userInfo && s.globalData.userInfo.IsReferral && (a += "&ReferralUserId=" + s.globalData.userInfo.UserId, 
        s.setRefferUserId(s.globalData.userInfo.UserId, function(t) {})), {
            title: e.data.ProductName,
            path: a,
            success: function(t) {
                i.showTip("分享成功", "success");
            },
            fail: function(t) {
                i.showTip("分享失败", "error");
            }
        };
    },
    onReachBottom: function() {
        var t = this;
        if (null == this.data.metaDescription || "" == this.data.metaDescription) {
            var e = this.data.TempMetaDescription;
            null != e && void 0 != e && r.wxParse("metaDescription", "html", e, t);
        }
    },
    onTabClick: function(t) {
        0 == t.currentTarget.dataset.status ? this.setData({
            DetailStatus: "active",
            AttributeStatus: ""
        }) : this.setData({
            DetailStatus: "",
            AttributeStatus: "active"
        });
    },
    getLocation: function(t) {
        var e = this;
        wx.getLocation({
            type: "wgs84",
            success: function(a) {
                wx.setStorage({
                    key: "o2oFromLatLng",
                    data: a.latitude + "," + a.longitude
                }), e.setData({
                    lat: a.latitude,
                    lng: a.longitude
                }), t();
            }
        });
    },
    loadData: function() {
        var t = this, e = this, i = new Date().getTime();
        wx.showLoading({
            title: "加载中..."
        });
        var r = "GetProductDetail";
        e.data.activeid && (r = "GetCountDownProductDetail"), wx.request({
            url: s.getUrl("Product.ashx?action=" + r),
            data: {
                openId: s.globalData.openId,
                productId: e.data.ProductId,
                countdownid: e.data.activeid,
                storeid: e.data.storeid,
                lat: e.data.lat,
                lng: e.data.lng
            },
            success: function(r) {
                if ("OK" == r.data.Status) {
                    3 == r.data.Data.ActiveType && wx.redirectTo({
                        url: "../presaleproductdetails/presaleproductdetails?ProSaleId=" + r.data.Data.ActiveId
                    }), s.globalData.siteInfo && e.setData({
                        IsOrderInClosingTime: s.globalData.siteInfo.IsOrderInClosingTime,
                        IsRecommandStore: s.globalData.siteInfo.IsRecommandStore,
                        OpenMultStore: s.globalData.siteInfo.OpenMultStore
                    });
                    var u = r.data.Data;
                    if (u.StoreInfo) {
                        var c = Date.parse(u.StoreInfo.OpenEndTime.replace(/-/g, "/"));
                        (Date.parse(u.StoreInfo.OpenStartTime.replace(/-/g, "/")) <= i && i <= c || e.data.IsOrderInClosingTime) && u.StoreInfo.IsOpen ? e.setData({
                            canBuyTime: !0
                        }) : e.setData({
                            canBuyTime: !1
                        }), e.getStore();
                    }
                    var d = "", l = "", h = "";
                    if (u.Promotes && u.Promotes.ActivityCount && u.Promotes.ActivityCount > 0) for (var p in u.Promotes) if ("FullAmountReduceList" == p) {
                        if ((g = u.Promotes[p]) instanceof Array) for (var S in g) (m = g[S]) && m.ActivityName && m.ActivityName.length > 0 && (d.length > 0 && (d += ","), 
                        d += m.ActivityName);
                    } else if ("FullAmountSentFreightList" == p) {
                        if ((g = u.Promotes[p]) instanceof Array) for (var S in g) (m = g[S]) && m.ActivityName && m.ActivityName.length > 0 && (l.length > 0 && (l += ","), 
                        l += m.ActivityName);
                    } else if ("FullAmountSentGiftList" == p) {
                        var g = u.Promotes[p];
                        if (g instanceof Array) for (var S in g) {
                            var m = g[S];
                            m && m.ActivityName && m.ActivityName.length > 0 && (h.length > 0 && (h += ","), 
                            h += m.ActivityName);
                        }
                    }
                    if (u.ProductPromotion) var f = u.ProductPromotion.Name;
                    if (e.data.activeid) {
                        if (u.NowTime < u.StartDate) {
                            var w = new Date(u.NowTime), I = (v = new Date(u.StartDate)).getTime() - w.getTime();
                            a(e, D = I / 1e3);
                        }
                        if (u.NowTime > u.StartDate && u.NowTime < u.EndDate) {
                            var w = new Date(u.NowTime), v = new Date(u.EndDate), D = (I = v.getTime() - w.getTime()) / 1e3;
                            o(e, D);
                        }
                    }
                    if (u.MaxSalePrice = e.calcPrice(u.MaxSalePrice, u.PhoneDiscountAmount), u.MinSalePrice = e.calcPrice(u.MinSalePrice, u.PhoneDiscountAmount), 
                    0 == u.SkuItemList.length) t.setData({
                        curSkuData: u.Skus[0],
                        skuStock: t.data.activeid ? u.ActivityStock : u.Stock
                    }); else {
                        var P = {};
                        u.Skus.forEach(function(t) {
                            P[t.SkuId] = t;
                        }), u.Skus = P;
                        var x = new Array(u.SkuItemList.length + 1);
                        x[0] = u.ProductId, t.setData({
                            skuArr: x,
                            curSkuData: "",
                            SkuItemList: u.SkuItemList,
                            Skus: u.Skus
                        });
                    }
                    1 == t.data.SkuItemList.length && t.setDisabledSku(), wx.setNavigationBarTitle({
                        title: u.ProductName
                    }), e.setData({
                        ProductId: u.ProductId,
                        ProductName: u.ProductName,
                        ShortDescription: u.ShortDescription,
                        MaxCount: u.MaxCount || 0,
                        ShowSaleCounts: u.ShowSaleCounts,
                        MarketPrice: u.MarketPrice,
                        IsfreeShipping: u.IsfreeShipping,
                        PhoneDiscountAmount: u.PhoneDiscountAmount,
                        CombinaId: u.CombinaId,
                        MaxSalePrice: u.MaxSalePrice,
                        MinSalePrice: u.MinSalePrice,
                        OldSalePrice: u.OldSalePrice,
                        ProductImgs: u.ProductImgs,
                        Freight: u.Freight,
                        Coupons: u.Coupons,
                        Promotes: u.Promotes,
                        ShowPromotesText: d,
                        SentFreightList: l,
                        SentGiftList: h,
                        CombinationProductList: u.CombinationProductList,
                        IsUnSale: u.IsUnSale,
                        IsOnSale: u.IsOnSale,
                        ActiveType: u.ActiveType,
                        activityTypeText: n.activiyTypeText[u.ActiveType] ? n.activiyTypeText[u.ActiveType] : "",
                        activityTypeUrl: "../productdetail/productdetail?id=" + e.data.ProductId + "&activeid=" + u.ActiveId + "&storeid=" + e.data.storeid,
                        ActiveText: "立即购买",
                        ShowPrice: u.MaxSalePrice == u.MinSalePrice ? u.MinSalePrice : u.MinSalePrice + "～" + u.MaxSalePrice,
                        skuImg: u.ThumbnailUrl60,
                        skuPrice: u.MinSalePrice,
                        skuStock: u.Stock,
                        selectTextArr: [],
                        allStock: u.Stock,
                        selectedSkuContent: "",
                        ReviewCount: u.ReviewCount,
                        buyAmount: 1,
                        TempMetaDescription: u.MetaDescription,
                        SelectSpecifications: "选择规格",
                        SupplierId: u.SupplierId,
                        SupplierName: u.SupplierName,
                        ExtendAttribute: u.ExtendAttribute,
                        ReferralMoney: u.ReferralMoney,
                        StoreInfo: u.StoreInfo,
                        IsValid: u.IsValid,
                        ValidStartDate: u.ValidStartDate,
                        ValidEndDate: u.ValidEndDate,
                        IsRefund: u.IsRefund,
                        IsOverRefund: u.IsOverRefund,
                        ProductType: u.ProductType,
                        CountDownStatus: u.CountDownStatus || "",
                        StartDate: u.StartDate || "",
                        EndDate: u.EndDate || "",
                        NowTime: u.NowTime || "",
                        ProductPromotion: f || "",
                        videoPath: u.VideoPath,
                        defaultImg: u.ProductImgs ? u.ProductImgs[0] : u.ThumbnailUrl60,
                        Unit: u.Unit,
                        FullAmountReduce: u.FullAmountReduce,
                        FullAmountSentFreight: u.FullAmountSentFreight,
                        FullAmountSentGift: u.FullAmountSentGift
                    });
                } else "NOUser" == r.data.Message ? wx.navigateTo({
                    url: "../login/login"
                }) : wx.showModal({
                    title: "提示",
                    content: r.data.Message,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    calcPrice: function(t, e) {
        var a = (1e3 * (t = parseFloat(t)) - 1e3 * (e || 0)) / 1e3;
        return a < 0 && (a = 0), a;
    },
    gopurchase: function() {
        wx.navigateTo({
            url: "../purchase/purchase?combinaid=" + this.data.CombinaId
        });
    },
    getpurchase: function() {
        wx.request({
            url: s.getUrl("CombinationBuy.ashx?action=GetCombinationBuyDetail"),
            data: {
                openId: "oGbUa0dzLRtxz9sHYHbFPOemz1ow",
                combinaid: this.data.CombinaId
            },
            success: function(t) {
                console.log(t);
            }
        });
    },
    getStore: function() {
        var t = this;
        wx.request({
            url: s.getUrl("Store.ashx?action=GetRecomStoreByProductId"),
            data: {
                pageIndex: 1,
                pageSize: 10,
                productId: this.data.ProductId,
                storeid: this.data.storeid,
                lat: this.data.lat,
                lng: this.data.lng
            },
            success: function(e) {
                t.setData({
                    storeList: e.data.store_get_response.StoreList
                });
            }
        });
    },
    changeStore: function(t) {
        wx.redirectTo({
            url: "../productdetail/productdetail?id=" + this.data.ProductId + "&storeid=" + t.currentTarget.dataset.id + "&activeid=" + this.data.activeid
        });
    },
    goStore: function() {
        wx.navigateTo({
            url: "../storehome/storehome?id=" + this.data.storeid
        });
    },
    goNearbyStore: function() {
        wx.navigateTo({
            url: "../storeproduct/storeproduct?productId=" + this.data.ProductId
        });
    },
    onReady: function() {},
    showVideo: function() {
        this.setData({
            showVideo: !0
        });
    },
    closeVideo: function() {
        this.setData({
            showVideo: !1
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    getCoupon: function(t) {
        var e = t.currentTarget.id;
        s.getOpenId(function(t) {
            wx.request({
                url: s.getUrl("Coupon.ashx?action=UserGetCoupon"),
                data: {
                    openId: t,
                    couponId: e
                },
                success: function(t) {
                    "OK" == t.data.Status ? i.showTip(t.data.Message, "success") : "NOUser" == t.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : i.showTip(t.data.Message, "warning");
                }
            });
        });
    },
    clickCouponList: function(t) {
        var e = this;
        void 0 != e.data.Coupons && null != e.data.Coupons && "" != e.data.Coupons && e.data.Coupons.length > 0 ? this.setData({
            backShow: "",
            couponShow: ""
        }) : wx.showToast({
            title: "暂时没有可以领取的优惠券",
            icon: "loading"
        });
    },
    clickPromoteList: function(t) {
        var e = this, a = e.data.Promotes, o = e.data.ProductPromotion;
        a && a.ActivityCount && a.ActivityCount > 0 || null != o && "" != o ? this.setData({
            backShow: "",
            promoteShow: ""
        }) : wx.showToast({
            title: "暂时没有进行中的满额优惠活动",
            icon: "loading"
        });
    },
    clickSku: function(t) {
        var e = t.currentTarget.dataset.type;
        this.setData({
            backShow: "",
            SkuShow: "",
            isbuy: !0,
            skutype: e
        });
    },
    addShopCart: function(t) {
        this.setData({
            backShow: "",
            SkuShow: "",
            isbuy: !1
        });
    },
    clickback: function(t) {
        this.setData({
            backShow: "none",
            SkuShow: "none",
            couponShow: "none",
            promoteShow: "none",
            showPoster: !1,
            hidden: !1
        });
    },
    onCouponHide: function(t) {
        this.setData({
            backShow: "none",
            couponShow: "none"
        });
    },
    onPromoteHide: function(t) {
        this.setData({
            backShow: "none",
            promoteShow: "none"
        });
    },
    onSkuHide: function(t) {
        this.setData({
            backShow: "none",
            SkuShow: "none"
        });
    },
    reduceAmount: function(t) {
        if (this.data.curSkuData) {
            var e = this.data.buyAmount;
            (e -= 1) <= 0 || this.setData({
                buyAmount: e
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择规格",
            showCancel: !1
        });
    },
    addAmount: function(t) {
        if (this.data.curSkuData) {
            var e = this.data.buyAmount, a = this.data.skuStock;
            e += 1;
            var o = this.data.MaxCount;
            if (o && e > o) return i.showTip("每人限购" + o + "件", "warning"), void this.setData({
                buyAmount: o
            });
            e > a || this.setData({
                buyAmount: e
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择规格",
            showCancel: !1
        });
    },
    changeAmount: function(t) {
        if (this.data.curSkuData) {
            var e = parseInt(t.detail.value), a = this.data.skuStock, o = this.data.MaxCount;
            if (o && e > o) return i.showTip("每人限购" + o + "件", "warning"), void this.setData({
                buyAmount: o
            });
            !isNaN(e) && e > a ? e = a : (isNaN(e) || e <= 0) && (e = 1), this.setData({
                buyAmount: e
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择规格",
            showCancel: !1
        });
    },
    commitBuy: function(t) {
        if (s.globalData.openId) if (this.data.curSkuData) if (this.data.buyAmount <= 0) wx.showModal({
            title: "提示",
            content: "请输入要购买的数量",
            showCancel: !1
        }); else {
            var e = this.data.buyAmount, a = this.data.curSkuData.SkuId, o = "signbuy";
            this.data.activeid && (o = "countdown"), this.data.ProductType && (o = "serviceproduct"), 
            wx.navigateTo({
                url: "../ordersubmit/ordersubmit?productsku=" + a + "&roomId=" + this.data.roomId + "&buyamount=" + e + "&storeid=" + this.data.storeid + "&countdownid=" + this.data.activeid + "&frompage=" + o + (this.data.ProductType ? "&productType=1" : "")
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择规格",
            showCancel: !1
        }); else wx.navigateTo({
            url: "../login/login"
        });
    },
    addSku: function(t) {
        var e = this;
        if (this.data.curSkuData) if (this.data.buyAmount <= 0) wx.showModal({
            title: "提示",
            content: "请输入要购买的数量",
            showCancel: !1
        }); else {
            var a = this.data.buyAmount, o = this.data.curSkuData.SkuId;
            s.getOpenId(function(t) {
                wx.request({
                    url: s.getUrl("Cart.ashx?action=addToCart"),
                    data: {
                        openId: t,
                        SkuID: o,
                        Quantity: a,
                        roomId: e.data.roomId,
                        StoreId: e.data.storeid
                    },
                    success: function(t) {
                        "OK" == t.data.Status ? (s.updateCartQuantity(function(t) {
                            e.setData({
                                CartQuantity: t
                            });
                        }), wx.showModal({
                            title: "提示",
                            content: "加入购物车成功",
                            showCancel: !1,
                            success: function(t) {
                                t.confirm && e.setData({
                                    backShow: "none",
                                    SkuShow: "none"
                                });
                            }
                        })) : "NOUser" == t.data.Message ? wx.navigateTo({
                            url: "../login/login"
                        }) : wx.showModal({
                            title: "提示",
                            content: t.data.error_response.sub_msg,
                            showCancel: !1,
                            success: function(t) {}
                        });
                    },
                    complete: function() {}
                });
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择规格",
            showCancel: !1
        });
    },
    setDisabledSku: function() {
        var e = this, a = this.data.SkuItemList, o = this.data.Skus, i = (a.length, this.data.skuArr);
        a.forEach(function(a, s) {
            a.AttributeValue.forEach(function(a) {
                var r = [].concat(t(i));
                r[s + 1] = a.ValueId, !o[r.join("_")] || (e.data.activeid ? o[r.join("_")].ActivityStock : o[r.join("_")].Stock) ? a.disabled = !1 : a.disabled = !0;
            });
        }), this.setData({
            SkuItemList: this.data.SkuItemList
        });
    },
    swithSku: function(t) {
        var e = t.currentTarget.dataset.index, a = t.currentTarget.dataset.id, o = t.target.dataset.skuvalue, i = this.data.skuArr, s = t.currentTarget.dataset.img;
        i[e + 1] = i[e + 1] == a ? 0 : a, this.data.selectTextArr[e] = i[e + 1] ? o : "", 
        console.log(i);
        var r = this.data.Skus[this.data.skuArr.join("_")], n = "";
        if (console.log(r), this.data.selectTextArr.forEach(function(t, e) {
            t && (e > 0 && n && (n += " / "), n += t);
        }), this.setData({
            skuArr: i,
            selectTextArr: this.data.selectTextArr,
            selectedSkuContent: n,
            curSkuData: r || null,
            skuImg: s || this.data.skuImg
        }), r) {
            var u = this.calcPrice(r.SalePrice, this.data.PhoneDiscountAmount);
            this.setData({
                skuPrice: this.data.activeid ? r.ActivityPrice : u,
                skuStock: this.data.activeid ? r.ActivityStock : r.Stock
            });
        }
        this.setDisabledSku();
    },
    onImgOK: function(t) {
        this.setData({
            posterImagePath: t.detail.path,
            showPoster: !0,
            backShow: "",
            hasPoster: !0
        });
    },
    getProductCodeimg: function() {
        var t = this;
        wx.request({
            url: s.getUrl(this.data.productCodeUrl),
            data: {
                ProductId: this.data.ProductId,
                storeId: this.data.storeid,
                activeId: this.data.activeid,
                ReferralUserId: this.data.referralUserId
            },
            success: function(e) {
                "OK" === e.data.Status && (t.setData({
                    productCodeimg: e.data.CodeUrl
                }), wx.hideLoading());
            },
            complete: function() {
                t.posterCanvas();
            }
        });
    },
    savePoster: function() {
        var t = this;
        wx.saveImageToPhotosAlbum({
            filePath: t.data.posterImagePath,
            success: function() {
                wx.showToast({
                    title: "保存成功"
                }), t.setData({
                    backShow: "none",
                    showPoster: !1
                });
            },
            fail: function() {
                wx.openSetting();
            }
        });
    },
    posterCanvas: function() {
        var t = [];
        t.push({
            type: "image",
            url: this.data.defaultImg,
            css: {
                top: "0rpx",
                left: "0rpx",
                width: "650rpx",
                height: "650rpx"
            }
        }), t.push({
            type: "text",
            text: this.data.ProductName,
            css: {
                top: "681rpx",
                width: "350rpx",
                fontSize: "28rpx",
                lineHeight: "36rpx",
                color: "#424242",
                maxLines: "2",
                left: "24rpx"
            }
        }), parseFloat(this.data.MarketPrice) > 0 && t.push({
            type: "text",
            text: "￥" + this.data.MarketPrice,
            css: {
                top: "777rpx",
                left: "24rpx",
                color: "#bdbdbd",
                textDecoration: "line-through",
                fontSize: "28rpx",
                lineHeight: "40rpx"
            }
        }), t.push({
            type: "text",
            text: "￥",
            css: {
                color: this.data.PrimaryColor,
                lineHeight: "40rpx",
                fontSize: "28rpx",
                top: "832rpx",
                left: "24rpx"
            }
        }), t.push({
            type: "text",
            text: "" + (this.data.OldSalePrice > 0 ? this.data.OldSalePrice : this.data.MinSalePrice),
            css: {
                color: this.data.PrimaryColor,
                lineHeight: "40rpx",
                fontSize: "40rpx",
                top: "820rpx",
                left: "54rpx"
            }
        }), t.push({
            type: "image",
            url: this.data.productCodeimg,
            css: {
                top: "680rpx",
                right: "24rpx",
                width: "200rpx",
                height: "200rpx"
            }
        }), this.setData({
            showPoster: !0,
            posterData: {
                background: "#fff",
                width: "650rpx",
                height: "900rpx",
                views: t
            }
        });
    },
    parseImgTap: function(t) {
        wx.previewImage({
            current: t.currentTarget.dataset.src,
            urls: [ t.currentTarget.dataset.src ]
        });
    },
    showSharePoster: function() {
        this.setData({
            hidden: !0,
            actionsheetShow: !1
        }), this.data.hasPoster ? this.setData({
            showPoster: !0,
            backShow: ""
        }) : (wx.showLoading({
            title: "生成中"
        }), this.getProductCodeimg());
    },
    closeShowSharePoster: function() {
        this.setData({
            showPoster: !1
        });
    },
    activityOpen: function(t) {
        var e = t.currentTarget.dataset.url;
        e && wx.navigateTo({
            url: e
        });
    }
});