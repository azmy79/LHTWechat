function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, e = Array(t.length); a < t.length; a++) e[a] = t[a];
        return e;
    }
    return Array.from(t);
}

var a = require("../../utils/config.js"), e = getApp(), i = require("../wxParse/wxParse.js");

Page({
    data: {
        skuImg: "",
        skuPrice: 0,
        skuStock: 0,
        selectedSkuContent: "",
        buyAmount: 1,
        selectedskuList: [],
        showSku: !1,
        buyType: 1,
        isCanJoin: !0,
        videoPath: "",
        defaultImg: "",
        showVideo: !1,
        showPoster: !1,
        posterData: [],
        productCodeUrl: "/Product.ashx?action=GetProductDetailAppletCode",
        isShowHishopCopyRight: !1,
        isJumpLink: !1,
        hidden: !1
    },
    onLoad: function(t) {
        var a = this, i = "";
        t.ReferralUserId && (i = t.ReferralUserId, e.setRefferUserId(t.ReferralUserId)), 
        e.globalData.siteInfo && this.setData({
            isShowHishopCopyRight: e.globalData.siteInfo.IsShowHishopCopyRight,
            isJumpLink: e.globalData.siteInfo.IsJumpLink
        }), this.setData({
            groupid: t.groupid || 0,
            activeid: parseInt(t.activeid),
            referralUserId: i
        }), e.getSiteSettingData(function(t) {
            a.setData(t);
        }), this.loadData();
    },
    goToCopyright: function() {
        e.goToCopyright();
    },
    onShareAppMessage: function(t) {
        var a = "/pages/fightdetail/fightdetail?activeid=" + this.data.activeid + "&groupid=" + this.data.groupid;
        return e.globalData.userInfo && e.globalData.userInfo.IsReferral && (a += "&ReferralUserId=" + e.globalData.userInfo.UserId, 
        e.setRefferUserId(e.globalData.userInfo.UserId, function(t) {})), {
            title: this.data.ProductName,
            imageUrl: this.data.ActivityImage,
            path: a
        };
    },
    loadData: function() {
        var t = this;
        wx.showLoading({
            title: "加载中..."
        }), wx.request({
            url: e.getUrl("FightGroup.ashx?action=FightGroupActivityDetail"),
            data: {
                openId: e.globalData.openId,
                fightGroupActivityId: this.data.activeid,
                fightGroupId: this.data.groupid
            },
            success: function(a) {
                if ("OK" == a.data.Status) {
                    if ((a = a.data.Result).ProductInfo.HasSku) {
                        var e = {};
                        a.ProductInfo.Skus.forEach(function(t) {
                            e[t.SkuId] = t;
                        });
                        var o = new Array(a.ProductInfo.SkuItem.length + 1);
                        o[0] = a.ProductId, t.setData({
                            skuArr: o,
                            curSkuData: "",
                            SkuItemList: a.ProductInfo.SkuItem,
                            Skus: e
                        });
                    } else t.setData({
                        curSkuData: a.ProductInfo.Skus[0],
                        skuStock: a.ProductInfo.Skus[0].ActivityStock
                    });
                    if (t.data.SkuItemList && 1 == t.data.SkuItemList.length && t.setDisabledSku(), 
                    wx.setNavigationBarTitle({
                        title: a.ProductName
                    }), t.data.metaDescription || i.wxParse("metaDescription", "html", a.ProductInfo.Description, t), 
                    t.data.groupid) {
                        a.GroupItems[0].JoinMembers.map(function(a) {
                            a.UserId === t.data.curUserId && t.setData({
                                isJoin: !0
                            });
                        }), 0 !== a.GroupItems[0].Status && t.setData({
                            isCanJoin: !1
                        });
                        var s = a.GroupItems[0].RemainTime;
                        t.setData({
                            timeOver: t.formatTime(s)
                        }), setInterval(function() {
                            (s -= 1) <= 0 && t.setData({
                                isCanJoin: !1
                            }), t.setData({
                                timeOver: t.formatTime(s)
                            });
                        }, 1e3);
                    } else a.GroupItems.map(function(t) {
                        t.RemainTime > 3600 ? t.time = parseInt(t.RemainTime / 3600) : t.time = parseInt(t.RemainTime / 60);
                    });
                    t.setData({
                        productId: a.ProductId,
                        EndTime: a.EndTime.substring(2, 10).replace(/-/g, "."),
                        StartTime: a.StartTime,
                        ProductName: a.ProductName,
                        MaxCount: a.MaxCount || 0,
                        LimitedHour: a.LimitedHour,
                        Status: a.Status,
                        SalePrice: a.SalePrice,
                        MaxJoinCount: a.MaxJoinCount,
                        ProductImgs: a.ProductInfo.ProductImages.split(","),
                        ShowPrice: a.ShowPrice,
                        FightPrice: a.FightPrice,
                        ActivityImage: a.ActivityImage,
                        SupplierName: a.SupplierName,
                        skuImg: a.ProductInfo.DefaultImage,
                        skuPrice: a.FightPrice,
                        selectTextArr: [],
                        selectedSkuContent: "",
                        ReviewCount: a.ProductInfo.ReviewCount,
                        buyAmount: 1,
                        groupItems: a.GroupItems,
                        videoPath: a.ProductInfo.VideoPath,
                        defaultImg: a.ProductInfo.DefaultImage
                    });
                } else wx.showModal({
                    title: "提示",
                    content: result.data.Message,
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
    onReady: function() {},
    onShow: function() {
        this.setData({
            curUserId: e.globalData.userInfo.UserId
        });
    },
    onHide: function() {},
    onUnload: function() {},
    handleJoin: function(t) {
        this.setData({
            groupid: t.currentTarget.dataset.groupid
        }), this.loadData();
    },
    goFightList: function() {
        wx.redirectTo({
            url: "../fightgroup/fightgroup"
        });
    },
    formatTime: function(t) {
        t < 0 && (t = 0);
        var a = parseInt(t % 86400 / 3600), e = parseInt(t % 3600 / 60), i = parseInt(t % 3600 % 60);
        return a < 10 && (a = "0" + a), e < 10 && (e = "0" + e), i < 10 && (i = "0" + i), 
        [ a, e, i ];
    },
    clickSku: function(t) {
        var a = parseInt(t.currentTarget.dataset.type);
        this.setData({
            showSku: !0,
            buyType: a,
            skuPrice: a ? this.data.curSkuData.ActivityPrice : this.data.curSkuData.SalePrice,
            skuStock: a ? this.data.curSkuData.ActivityStock : this.data.curSkuData.Stock
        });
    },
    onSkuHide: function(t) {
        this.setData({
            showSku: !1
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
            var e = this.data.buyAmount, i = this.data.skuStock;
            e += 1;
            var o = this.data.MaxCount;
            if (o && e > o && this.data.buyType) return a.showTip("每人限购" + o + "件", "warning"), 
            void this.setData({
                buyAmount: o
            });
            e > i || this.setData({
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
            var e = parseInt(t.detail.value), i = this.data.skuStock, o = this.data.MaxCount;
            return o && e > o && this.data.buyType ? (a.showTip("每人限购" + o + "件", "warning"), 
            void this.setData({
                buyAmount: o
            })) : isNaN(e) || e > i || e <= 0 ? (a.showTip("请输入正确的数量,不能大于库存或者小于等于0", "warning"), 
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
        if (e.globalData.openId) {
            if (!(this.data.ActiveType > 0)) if (this.data.curSkuData) if (this.data.buyAmount <= 0) wx.showModal({
                title: "提示",
                content: "请输入要购买的数量",
                showCancel: !1
            }); else {
                var a = this.data.buyAmount, i = this.data.curSkuData.SkuId, o = "signbuy";
                this.data.buyType && (o = "fightgroup"), wx.navigateTo({
                    url: "../ordersubmit/ordersubmit?productsku=" + i + "&buyamount=" + a + (this.data.buyType ? "&fightGroupActivityId=" + this.data.activeid : "") + "&fightGroupId=" + (this.data.isCanJoin ? this.data.groupid : 0) + "&frompage=" + o
                });
            } else wx.showModal({
                title: "提示",
                content: "请选择规格",
                showCancel: !1
            });
        } else wx.navigateTo({
            url: "../login/login"
        });
    },
    setDisabledSku: function() {
        var a = this, e = this.data.SkuItemList, i = this.data.Skus, o = (e.length, this.data.skuArr);
        e.forEach(function(e, s) {
            e.AttributeValue.forEach(function(e) {
                var r = [].concat(t(o));
                r[s + 1] = e.ValueId, !i[r.join("_")] || (a.data.buyType ? i[r.join("_")].ActivityStock : i[r.join("_")].Stock) ? e.disabled = !1 : e.disabled = !0;
            });
        }), this.setData({
            SkuItemList: this.data.SkuItemList
        });
    },
    swithSku: function(t) {
        var a = t.currentTarget.dataset.index, e = t.currentTarget.dataset.id, i = t.target.dataset.skuvalue, o = this.data.skuArr, s = t.currentTarget.dataset.img;
        o[a + 1] = o[a + 1] == e ? 0 : e, this.data.selectTextArr[a] = o[a + 1] ? i : "";
        var r = this.data.Skus[this.data.skuArr.join("_")], u = "";
        this.data.selectTextArr.forEach(function(t, a) {
            t && (a > 0 && u && (u += " / "), u += t);
        }), this.setData({
            skuArr: o,
            selectTextArr: this.data.selectTextArr,
            selectedSkuContent: u,
            curSkuData: r || null,
            skuImg: s || this.data.skuImg
        }), r && this.setData({
            skuPrice: this.data.buyType ? r.ActivityPrice : r.SalePrice,
            skuStock: this.data.buyType ? r.ActivityStock : r.Stock
        }), this.setDisabledSku();
    },
    clickback: function() {
        this.setData({
            backShow: !1,
            hidden: !1,
            showPoster: !1
        });
    },
    onImgOK: function(t) {
        this.setData({
            posterImagePath: t.detail.path,
            showPoster: !0,
            backShow: !0,
            hasPoster: !0
        });
    },
    getProductCodeimg: function() {
        var t = this, a = 0;
        e.globalData.userInfo && e.globalData.userInfo.IsReferral && (a = e.globalData.userInfo.UserId), 
        wx.request({
            url: e.getUrl(this.data.productCodeUrl),
            data: {
                productId: this.data.productId,
                fightGroupId: this.data.groupid,
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
        this.setData({
            showPoster: !0,
            posterData: {
                background: "#fff",
                width: "650rpx",
                height: "900rpx",
                views: [ {
                    type: "image",
                    url: this.data.defaultImg,
                    css: {
                        top: "0rpx",
                        left: "0rpx",
                        width: "650rpx",
                        height: "650rpx"
                    }
                }, {
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
                }, {
                    type: "text",
                    text: "￥" + this.data.SalePrice,
                    css: {
                        top: "777rpx",
                        left: "24rpx",
                        color: "#bdbdbd",
                        textDecoration: "line-through",
                        fontSize: "28rpx",
                        lineHeight: "40rpx"
                    }
                }, {
                    type: "text",
                    text: "￥",
                    css: {
                        color: this.data.PrimaryColor,
                        lineHeight: "40rpx",
                        fontSize: "28rpx",
                        top: "832rpx",
                        left: "24rpx"
                    }
                }, {
                    type: "text",
                    text: "" + this.data.ShowPrice,
                    css: {
                        color: this.data.PrimaryColor,
                        lineHeight: "40rpx",
                        fontSize: "40rpx",
                        top: "820rpx",
                        left: "54rpx"
                    }
                }, {
                    type: "image",
                    url: this.data.productCodeimg,
                    css: {
                        top: "680rpx",
                        right: "24rpx",
                        width: "200rpx",
                        height: "200rpx"
                    }
                } ]
            }
        });
    },
    showSharePoster: function() {
        this.setData({
            hidden: !0
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
    }
});