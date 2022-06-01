function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, e = Array(t.length); a < t.length; a++) e[a] = t[a];
        return e;
    }
    return Array.from(t);
}

function a(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var e, s, i = require("../../utils/config.js"), o = getApp(), r = require("../wxParse/wxParse.js");

Page((s = {
    data: (e = {
        SkuShow: "none",
        backShow: "none",
        MetaDescription: "",
        TempMetaDescription: "",
        ProductImgs: [],
        Product: {},
        GroupBuyInfo: {},
        time: [],
        DetailStatus: "active",
        AttributeStatus: "",
        ExtendAttribute: [],
        timeshow: !0,
        SelectSpecifications: "选择规格",
        buyAmount: 1,
        curSkuData: null,
        ProductInfo: {},
        skuPrice: 0,
        productCodeUrl: "/Product.ashx?action=GetProductDetailAppletCode",
        startshow: !0,
        endshow: !1
    }, a(e, "timeshow", !1), a(e, "skuStock", 0), a(e, "selectTextArr", []), a(e, "SkuItemList", []), 
    a(e, "showteam", !0), e),
    onLoad: function(t) {
        var e = this;
        o.getSiteSettingData(function(t) {
            e.setData(t);
        }), o.getOpenId(function(s) {
            wx.request({
                url: o.getUrl("GroupBuy.ashx?action=GroupBuyActivityDetail"),
                data: {
                    openId: s,
                    GroupBuyId: t.groupbuyid || 0
                },
                success: function(t) {
                    if ("OK" == t.data.Status) {
                        var s, o = (t = t.data).ProductImgs;
                        if (0 == t.SkuItemList.length) e.data.curSkuData = t.Skus[0]; else {
                            var r = {};
                            t.Skus.forEach(function(t) {
                                r[t.SkuId] = t;
                            }), t.Skus = r;
                            var u = new Array(t.SkuItemList.length + 1);
                            u[0] = t.ProductId, e.setData({
                                skuArr: u,
                                SkuItemList: t.SkuItemList,
                                Skus: t.Skus
                            });
                        }
                        t.Count - t.SoldCount <= 0 && e.setData({
                            showteam: !1
                        }), e.setData((s = {
                            ProductImgs: o,
                            ProductName: t.ProductName,
                            skuImg: t.ThumbnailUrl180,
                            curSkuData: e.data.curSkuData,
                            skuPrice: t.Price,
                            Price: t.Price,
                            MarketPrice: t.MarketPrice,
                            TempMetaDescription: t.MetaDescription,
                            skuStock: t.Stock - t.SoldCount > 0 ? t.Stock - t.SoldCount : 0,
                            EndDate: t.EndDate,
                            StartDate: t.StartDate,
                            Content: t.Content,
                            Count: t.Count,
                            MaxCount: t.MaxCount,
                            Unit: t.Unit,
                            PhoneDiscountAmount: t.PhoneDiscountAmount,
                            GroupBuyId: t.GroupBuyId,
                            MaxSalePrice: t.MaxSalePrice,
                            ProductId: t.ProductId,
                            ShowSaleCounts: t.ShowSaleCounts
                        }, a(s, "Count", t.Count), a(s, "ReviewCount", t.ReviewCount), a(s, "SoldCount", t.SoldCount), 
                        s), e.gettime());
                    } else i.showTip(t.data.Message, "none"), wx.navigateBack({
                        delta: 1
                    });
                }
            });
        });
    },
    sendtime: function() {
        var t = new Date(this.data.StartDate) - new Date(), a = new Date(this.data.EndDate) - new Date(), e = void 0;
        t > 0 ? (this.setData({
            startshow: !0,
            endshow: !1
        }), e = t) : (this.setData({
            startshow: !1,
            endshow: !0
        }), 0 == a && this.setData({
            endshow: !1,
            timeshow: !0
        }), e = a);
        var s = Math.floor(e / 864e5), i = Math.floor(e / 36e5 % 24), o = Math.floor(e / 6e4 % 60), r = Math.floor(e / 1e3 % 60);
        this.setData({
            time: [ s, i, o, r ]
        });
    },
    gettime: function() {
        var t = this;
        setInterval(function(a) {
            t.sendtime();
        }, 1e3);
    },
    onShow: function() {},
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
            var a = this.data.buyAmount, e = this.data.skuStock;
            a += 1;
            var s = this.data.MaxCount;
            if (s && a > s) return i.showTip("每人限购" + s + "件", "warning"), void this.setData({
                buyAmount: s
            });
            a > e || this.setData({
                buyAmount: a
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择规格",
            showCancel: !1
        });
    },
    changeAmount: function(t) {
        if (this.data.curSkuData) {
            var a = parseInt(t.detail.value), e = this.data.skuStock, s = this.data.MaxCount;
            if (s && a > s) return i.showTip("每人限购" + s + "件", "warning"), void this.setData({
                buyAmount: s
            });
            !isNaN(a) && a > e ? a = e : (isNaN(a) || a <= 0) && (a = 1), this.setData({
                buyAmount: a
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择规格",
            showCancel: !1
        });
    },
    setDisabledSku: function() {
        var a = this, e = this.data.SkuItemList, s = this.data.Skus, i = (e.length, this.data.skuArr);
        e.forEach(function(e, o) {
            e.AttributeValue.forEach(function(e) {
                var r = [].concat(t(i));
                r[o + 1] = e.ValueId, !s[r.join("_")] || (a.data.activeid ? s[r.join("_")].ActivityStock : s[r.join("_")].Stock) ? e.disabled = !1 : e.disabled = !0;
            });
        }), this.setData({
            SkuItemList: this.data.SkuItemList
        });
    },
    swithSku: function(t) {
        var a = t.currentTarget.dataset.index, e = t.currentTarget.dataset.id, s = t.target.dataset.skuvalue, i = this.data.skuArr, o = t.currentTarget.dataset.img;
        i[a + 1] = i[a + 1] == e ? 0 : e, this.data.selectTextArr[a] = i[a + 1] ? s : "";
        var r = this.data.Skus[this.data.skuArr.join("_")], u = "";
        this.data.selectTextArr.forEach(function(t, a) {
            t && (a > 0 && u && (u += " / "), u += t);
        }), this.setData({
            skuArr: i,
            selectTextArr: this.data.selectTextArr,
            selectedSkuContent: u,
            curSkuData: r || null,
            skuImg: o || this.data.skuImg
        }), this.setDisabledSku();
    }
}, a(s, "setDisabledSku", function() {
    var a = this, e = this.data.SkuItemList, s = this.data.Skus, i = (e.length, this.data.skuArr);
    e.forEach(function(e, o) {
        e.AttributeValue.forEach(function(e) {
            var r = [].concat(t(i));
            r[o + 1] = e.ValueId, !s[r.join("_")] || (a.data.activeid ? s[r.join("_")].ActivityStock : s[r.join("_")].Stock) ? e.disabled = !1 : e.disabled = !0;
        });
    }), this.setData({
        SkuItemList: this.data.SkuItemList
    });
}), a(s, "calcPrice", function(t, a) {
    var e = (1e3 * (t = parseFloat(t)) - 1e3 * (a || 0)) / 1e3;
    return e < 0 && (e = 0), e;
}), a(s, "parseImgTap", function(t) {
    wx.previewImage({
        current: t.currentTarget.dataset.src,
        urls: [ t.currentTarget.dataset.src ]
    });
}), a(s, "commitBuy", function(t) {
    if (o.globalData.openId) if (this.data.curSkuData) if (this.data.buyAmount <= 0) wx.showModal({
        title: "提示",
        content: "请输入要购买的数量",
        showCancel: !1
    }); else {
        var a = this.data.buyAmount, e = this.data.curSkuData.SkuId;
        wx.navigateTo({
            url: "../ordersubmit/ordersubmit?productsku=" + e + "&buyamount=" + a + "&frompage=groupBuy&GroupBuyId=" + this.data.GroupBuyId
        });
    } else wx.showModal({
        title: "提示",
        content: "请选择规格",
        showCancel: !1
    }); else wx.navigateTo({
        url: "../login/login"
    });
}), a(s, "onTabClick", function(t) {
    0 == t.currentTarget.dataset.status ? this.setData({
        DetailStatus: "active",
        AttributeStatus: ""
    }) : this.setData({
        DetailStatus: "",
        AttributeStatus: "active"
    });
}), a(s, "onReachBottom", function() {
    var t = this;
    if (null == this.data.metaDescription || "" == this.data.metaDescription) {
        var a = this.data.TempMetaDescription;
        null != a && void 0 != a && r.wxParse("metaDescription", "html", a, t);
    }
}), a(s, "showSharePoster", function() {
    this.setData({
        hidden: !0,
        actionsheetShow: !1
    }), this.data.hasPoster ? this.setData({
        showPoster: !0,
        backShow: ""
    }) : (wx.showLoading({
        title: "生成中"
    }), this.getProductCodeimg());
}), a(s, "getProductCodeimg", function() {
    var t = this;
    wx.request({
        url: o.getUrl(this.data.productCodeUrl),
        data: {
            ProductId: this.data.ProductId,
            storeId: this.data.storeid,
            activeId: this.data.activeid,
            ReferralUserId: this.data.referralUserId
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
}), a(s, "clickback", function(t) {
    this.setData({
        backShow: "none",
        SkuShow: "none",
        showPoster: !1,
        hidden: !1
    });
}), a(s, "posterCanvas", function() {
    var t = [];
    t.push({
        type: "image",
        url: this.data.ProductImgs[0],
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
    }), parseFloat(this.data.MaxSalePrice) > 0 && t.push({
        type: "text",
        text: "￥" + this.data.MaxSalePrice,
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
        text: "" + this.data.Price,
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
}), a(s, "savePoster", function() {
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
}), a(s, "onImgOK", function(t) {
    this.setData({
        posterImagePath: t.detail.path,
        showPoster: !0,
        backShow: "",
        hasPoster: !0
    });
}), a(s, "onShareAppMessage", function() {}), s));