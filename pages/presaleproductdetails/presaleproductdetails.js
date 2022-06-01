function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, e = Array(t.length); a < t.length; a++) e[a] = t[a];
        return e;
    }
    return Array.from(t);
}

var a = require("../../utils/config.js"), e = getApp(), o = require("../wxParse/wxParse.js");

Page({
    data: {
        ProductImgs: [],
        autoplay: !0,
        product: "",
        ProductName: "",
        ShortDescription: "",
        SaleCounts: "",
        skuImg: "",
        SkuShow: "none",
        buyAmount: 1,
        skutype: 0,
        DetailStatus: "active",
        AttributeStatus: "",
        Description: "",
        TempMetaDescription: "",
        CartQuantity: 0,
        ruleprice: 0,
        time: [],
        selectTextArr: [],
        PreSaleEndDate: "",
        IsfreeShipping: !1,
        Freight: 0,
        timeload: "",
        couponShow: "none",
        backShow: "none",
        hidden: !1,
        promoteShow: "none",
        productCodeUrl: "/Product.ashx?action=GetProductDetailAppletCode",
        defaultImg: "",
        showPoster: !1,
        posterData: [],
        isShowHishopCopyRight: !1,
        Unit: "件",
        isOvertime: !1,
        referralId: ""
    },
    onLoad: function(t) {
        var a = this, i = t.ProSaleId;
        wx.request({
            url: e.getUrl("PreSale.ashx"),
            data: {
                action: "GetPreSaleProductDetail",
                ProSaleId: i
            },
            method: "GET",
            success: function(t) {
                if (void 0 != t.data.ErrorResponse && 1002 == t.data.ErrorResponse.ErrorCode && wx.showModal({
                    title: t.data.ErrorResponse.ErrorMsg,
                    showCancel: !1,
                    success: function(t) {
                        (t.confirm || t.cancel) && wx.navigateBack({
                            delta: 1
                        });
                    }
                }), 200 === t.statusCode) {
                    var s = [ (t = t.data.Result).ImageUrl1, t.ImageUrl2, t.ImageUrl3, t.ImageUrl4, t.ImageUrl5 ].filter(function(t) {
                        return "" != t && null != t && void 0 != t;
                    });
                    a.setData({
                        skuImg: t.ImageUrl1,
                        ProductImgs: s,
                        ProductName: t.ProductName,
                        Unit: t.Unit,
                        ShortDescription: t.ShortDescription,
                        SaleCounts: t.SaleCounts,
                        Deposit: t.PreSaleInfo.Deposit,
                        DepositPercent: t.PreSaleInfo.DepositPercent,
                        MaxSalePrice: t.MaxSalePrice,
                        TempMetaDescription: t.Description,
                        DeliveryDays: t.PreSaleInfo.DeliveryDays,
                        PaymentEndDate: t.PreSaleInfo.PaymentEndDate,
                        PreSaleEndDate: t.PreSaleInfo.PreSaleEndDate,
                        IsfreeShipping: "False" !== t.IsfreeShipping,
                        Freight: t.Freight,
                        ProSaleId: i,
                        ProductId: t.PreSaleInfo.ProductId,
                        Coupons: t.Coupons,
                        Stock: t.Stock,
                        ReferralMoney: t.ReferralMoney,
                        FullAmountReduce: t.FullAmountReduce,
                        FullAmountSentFreight: t.FullAmountSentFreight,
                        FullAmountSentGift: t.FullAmountSentGift,
                        defaultImg: t.ImageUrl1
                    });
                    var r = t.PreSaleInfo.PaymentStartDate.split(/T/g), n = t.PreSaleInfo.PaymentEndDate.split(/T/g);
                    if (t.PreSaleInfo.DeliveryDate) {
                        var u = t.PreSaleInfo.DeliveryDate.split(/T/g);
                        u = u[0].split("-"), a.setData({
                            DeliveryDate: u
                        });
                    }
                    if (a.setData({
                        PaymentStartDate: r ? r[0] : "",
                        PaymentEndDate: n ? n[0] : ""
                    }), a.data.DepositPercent > 0 && a.setData({
                        ruleprice: e.multiply(a.data.MaxSalePrice, e.divide(a.data.DepositPercent, 100)).toFixed(2)
                    }), null == a.data.Description || "" == a.data.Description) {
                        var d = a.data.TempMetaDescription;
                        null != d && void 0 != d && o.wxParse("Description", "html", d, a);
                    }
                    if (0 == t.SkuItem.length) a.setData({
                        curSkuData: t.Skus[0],
                        skuStock: a.data.activeid ? t.ActivityStock : t.Stock
                    }); else {
                        var c = {};
                        t.Skus.forEach(function(t) {
                            c[t.SkuId] = t;
                        }), t.Skus = c;
                        var l = new Array(t.SkuItem.length + 1);
                        l[0] = t.DefaultSku.ProductId, a.setData({
                            skuArr: l,
                            curSkuData: "",
                            SkuItemList: t.SkuItem,
                            Skus: t.Skus
                        });
                    }
                    e.globalData.userInfo && e.globalData.userInfo.IsReferral ? a.setData({
                        referralId: !0
                    }) : a.setData({
                        referralId: !1
                    }), void 0 != a.data.SkuItemList && 1 == a.data.SkuItemList.length && a.setDisabledSku(), 
                    a.loadData();
                }
            },
            fail: function() {},
            complete: function() {}
        }), e.updateCartQuantity(function(t) {
            a.setData({
                CartQuantity: t
            });
        }), e.getSiteSettingData(function(t) {
            a.setData(t);
        });
    },
    clickSku: function(t) {
        var a = t.currentTarget.dataset.type;
        this.setData({
            backShow: "",
            SkuShow: "",
            isbuy: !0,
            skutype: a
        });
    },
    onSkuHide: function(t) {
        this.setData({
            backShow: "none",
            SkuShow: "none"
        });
    },
    parseImgTap: function(t) {
        wx.previewImage({
            current: t.currentTarget.dataset.src,
            urls: [ t.currentTarget.dataset.src ]
        });
    },
    swithSku: function(t) {
        var a = t.currentTarget.dataset.index, e = t.currentTarget.dataset.id, o = t.target.dataset.skuvalue, i = this.data.skuArr, s = t.currentTarget.dataset.img;
        i[a + 1] = i[a + 1] == e ? 0 : e, this.data.selectTextArr[a] = i[a + 1] ? o : "";
        var r = this.data.Skus[this.data.skuArr.join("_")], n = "";
        if (null == r && null != i[i.length - 1]) for (var u in this.data.Skus) {
            for (var d = u + "_", c = !0, l = 1; l < i.length; l++) -1 == d.indexOf("_" + i[l] + "_") && (c = !1);
            if (c) {
                r = this.data.Skus[u];
                break;
            }
        }
        if (this.data.selectTextArr.forEach(function(t, a) {
            t && (a > 0 && n && (n += " / "), n += t);
        }), this.setData({
            skuArr: i,
            selectTextArr: this.data.selectTextArr,
            selectedSkuContent: n,
            curSkuData: r || null,
            skuImg: s || this.data.skuImg
        }), r) {
            var h = this.calcPrice(r.SalePrice, this.data.PhoneDiscountAmount);
            this.setData({
                skuPrice: this.data.activeid ? r.ActivityPrice : h,
                skuStock: this.data.activeid ? r.ActivityStock : r.Stock
            });
        }
        this.setDisabledSku();
    },
    setDisabledSku: function() {
        var a = this, e = this.data.SkuItemList, o = this.data.Skus, i = (e.length, this.data.skuArr);
        e.forEach(function(e, s) {
            e.AttributeValue.forEach(function(e) {
                var r = [].concat(t(i));
                r[s + 1] = e.ValueId, !o[r.join("_")] || (a.data.activeid ? o[r.join("_")].ActivityStock : o[r.join("_")].Stock) ? e.disabled = !1 : e.disabled = !0;
            });
        }), this.setData({
            SkuItemList: this.data.SkuItemList
        });
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
    reduceAmount: function(t) {
        if (this.data.curSkuData) {
            var a = this.data.buyAmount;
            (a -= 1) <= 0 || this.setData({
                buyAmount: a
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择规格",
            showCancel: !1
        });
    },
    addAmount: function(t) {
        if (this.data.curSkuData) {
            var e = this.data.buyAmount, o = this.data.skuStock;
            e += 1;
            var i = this.data.MaxCount;
            if (i && e > i) return a.showTip("每人限购" + i + "件", "warning"), void this.setData({
                buyAmount: i
            });
            e > o || this.setData({
                buyAmount: e
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择规格",
            showCancel: !1
        });
    },
    calcPrice: function(t, a) {
        var e = (1e3 * (t = parseFloat(t)) - 1e3 * (a || 0)) / 1e3;
        return e < 0 && (e = 0), e;
    },
    clickCouponList: function(t) {
        var a = this;
        void 0 != a.data.Coupons && null != a.data.Coupons && "" != a.data.Coupons && a.data.Coupons.length > 0 ? this.setData({
            backShow: "",
            couponShow: ""
        }) : wx.showToast({
            title: "暂时没有可以领取的优惠券",
            icon: "loading"
        });
    },
    onCouponHide: function(t) {
        this.setData({
            backShow: "none",
            couponShow: "none"
        });
    },
    getCoupon: function(t) {
        var o = t.currentTarget.id;
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("Coupon.ashx?action=UserGetCoupon"),
                data: {
                    openId: t,
                    couponId: o
                },
                success: function(t) {
                    "OK" == t.data.Status ? a.showTip(t.data.Message, "success") : "NOUser" == t.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : a.showTip(t.data.Message, "warning");
                }
            });
        });
    },
    changeAmount: function(t) {
        if (this.data.curSkuData) {
            var e = parseInt(t.detail.value), o = this.data.skuStock, i = this.data.MaxCount;
            return i && e > i ? (a.showTip("每人限购" + i + "件", "warning"), void this.setData({
                buyAmount: i
            })) : isNaN(e) || e > o || e <= 0 ? (a.showTip("请输入正确的数量,不能大于库存或者小于等于0", "warning"), 
            void this.setData({
                buyAmount: 1
            })) : void this.setData({
                buyAmount: e
            });
        }
        wx.showModal({
            title: "提示",
            content: "请选择规格",
            showCancel: !1
        });
    },
    commitBuy: function(t) {
        if (e.globalData.openId) if (this.data.curSkuData) if (this.data.buyAmount <= 0) wx.showModal({
            title: "提示",
            content: "请输入要购买的数量",
            showCancel: !1
        }); else {
            var a = this.data.buyAmount, o = this.data.curSkuData.SkuId, i = "presale";
            this.data.activeid && (i = "countdown"), this.data.ProductType && (i = "serviceproduct"), 
            wx.navigateTo({
                url: "../ordersubmit/ordersubmit?productsku=" + o + "&buyamount=" + a + "&storeid=" + this.data.storeid + "&countdownid=" + this.data.activeid + "&frompage=" + i + (this.data.ProductType ? "&productType=1" : "") + "&presaleId=" + this.data.ProSaleId
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择规格",
            showCancel: !1
        }); else wx.navigateTo({
            url: "../login/login"
        });
    },
    loadData: function() {
        var t = new Date(), a = new Date(this.data.PreSaleEndDate).getTime();
        this.setData({
            second: (a - t) / 1e3
        }), clearInterval(this.data.timeload);
        this.formatDuring(Math.round(this.data.second));
        this.data.second >= 0 ? this.setTimeLoad() : this.setData({
            isOvertime: !0
        });
    },
    setTimeLoad: function() {
        var t = this;
        t.data.timeload = setInterval(function() {
            if (t.data.second -= 1, t.data.second > 0) t.data.isOvertime = !1, t.data.time = t.formatDuring(t.data.second); else {
                if (0 != t.data.second) return void (t.data.isOvertime = !0);
                t.onLoad();
            }
            t.setData({
                second: t.data.second,
                time: t.data.time,
                isOvertime: t.data.isOvertime
            });
        }, 1e3);
    },
    formatDuring: function(t) {
        var a = parseInt(t / 86400), e = parseInt(t % 86400 / 3600), o = parseInt(t % 3600 / 60), i = parseInt(t % 3600 % 60);
        return e < 10 && (e = "0" + e), o < 10 && (o = "0" + o), i < 10 && (i = "0" + i), 
        [ a, e, o, i ];
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
    onImgOK: function(t) {
        this.setData({
            posterImagePath: t.detail.path,
            showPoster: !0,
            backShow: "",
            hasPoster: !0
        });
    },
    getProductCodeimg: function() {
        var t = this, a = 0;
        e.globalData.userInfo && e.globalData.userInfo.IsReferral && (a = e.globalData.userInfo.UserId), 
        wx.request({
            url: e.getUrl(this.data.productCodeUrl),
            data: {
                ProductId: this.data.ProductId,
                storeId: this.data.storeid,
                activeId: this.data.activeid,
                ReferralUserId: a
            },
            success: function(a) {
                "OK" === a.data.Status && (t.setData({
                    productCodeimg: a.data.CodeUrl
                }), wx.hideLoading());
            },
            complete: function() {
                t.posterCanvas();
            }
        });
    },
    clickPromoteList: function(t) {
        "" != this.data.FullAmountReduce || "" != this.data.FullAmountSentFreight || "" != this.data.FullAmountSentGift ? this.setData({
            backShow: "",
            promoteShow: ""
        }) : wx.showToast({
            title: "暂时没有进行中的满额优惠活动",
            icon: "loading"
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
    onPromoteHide: function(t) {
        this.setData({
            backShow: "none",
            promoteShow: "none"
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
                color: "#ff1f31",
                lineHeight: "40rpx",
                fontSize: "28rpx",
                top: "832rpx",
                left: "24rpx"
            }
        }), t.push({
            type: "text",
            text: "" + this.data.MaxSalePrice,
            css: {
                color: "#ff1f31",
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
    }
});