function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var e = getApp(), a = require("../../utils/config.js");

Page({
    data: {
        ShopCarts: null,
        isEdite: !1,
        TotalPrice: 0,
        EditeText: "编辑",
        selectSupplierStatus: !1,
        selectStoreStatus: !1,
        storeliststatus: !1,
        SelectskuId: [],
        SettlementText: "结算",
        isEmpty: !0,
        isLogin: !0,
        Suppliers: null,
        storelist: null,
        GiftInfo: null,
        storeid: "",
        giftid: "",
        selectAllStatus: !1,
        showselectall: !1,
        selgift: !0,
        canBuyTime: !0,
        editgift: !1,
        clickTag: !0
    },
    onLoad: function(t) {
        var a = this;
        e.getSiteSettingData(function(t) {
            a.setData(t), wx.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "white"
            });
        });
    },
    loadData: function(t) {
        wx.showLoading({
            title: "正在加载"
        });
        e.getOpenId(function(a) {
            wx.request({
                url: e.getUrl("Cart.ashx?action=getShoppingCartList"),
                data: {
                    openId: a
                },
                success: function(e) {
                    if ("OK" == e.data.Status) {
                        var a = e.data.Data, s = e.data.Data.Stores, r = e.data.Data.GiftInfo;
                        s && s.forEach(function(e, s, r) {
                            e.StoreId > 0 && (e.selectStoreStatus = !1), a.CartItemInfo.forEach(function(e, a, s) {
                                t.data.SelectskuId.indexOf(e.SkuID) >= 0 && (e.selected = !1);
                            });
                        });
                        var o = a.CartItemInfo.length <= 0 && r.length <= 0;
                        t.setData({
                            ShopCarts: a,
                            isEmpty: o,
                            storelist: s,
                            GiftInfo: r,
                            TotalPrice: 0,
                            selectAllStatus: !1,
                            selectSupplierStatus: !1,
                            loaded: !0
                        });
                    } else "NOUser" == e.data.Message || wx.showModal({
                        title: "提示",
                        content: e.data.Message,
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
        }, "noSkip");
    },
    getstoreCarts: function(t) {
        var e = null, a = this.data.storelist;
        return a.forEach(function(s, r, o) {
            s.StoreId == t && (e = a[r]);
        }), e;
    },
    selectList: function(e) {
        var a = this, s = e.currentTarget.dataset.skuid, r = (a.data.Suppliers, a.data.SelectskuId), o = e.currentTarget.dataset.storeid, i = a.data.storelist, l = !a.data.selectAllStatus;
        i.forEach(function(e, n, u) {
            if (0 == o) {
                var c;
                e.selectStoreStatus = !1, (S = i[n].CartItemInfo).forEach(function(t, e, i) {
                    var l = i.length;
                    if (t.IsValid && t.HasEnoughStock || l--, t.StoreId > 0) {
                        t.storeselected = !1;
                        for (var n = 0; n < r.length; n++) if (t.SkuID == r[n]) {
                            e = r.indexOf(t.SkuID);
                            r.splice(e, 1);
                        }
                    } else {
                        if (t.SkuID != s || o != t.StoreId || t.selected) {
                            if (t.SkuID == s && o == t.StoreId && t.selected) {
                                t.selected = !1;
                                var e = r.indexOf(s);
                                r.splice(e, 1);
                            }
                        } else t.selected = !t.selected, r.push(t.SkuID);
                        r.length == l ? a.setData({
                            selectSupplierStatus: !0
                        }) : a.setData({
                            selectSupplierStatus: !1
                        });
                    }
                }), a.setData((c = {
                    selectSupplierStatus: a.data.selectSupplierStatus,
                    storeliststatus: !1,
                    storelist: i,
                    storeid: 0,
                    selgift: !0,
                    selectAllStatus: l,
                    SelectskuId: r
                }, t(c, "selectAllStatus", !1), t(c, "canBuyTime", !0), t(c, "editgift", !0), c)), 
                a.GetTotal(o);
            } else {
                var d;
                a.data.selectSupplierStatus = !1;
                var S = i[n].CartItemInfo;
                e.selectStoreStatus = a.data.storeliststatus;
                var f = 0;
                S.forEach(function(t, i, n) {
                    e.SkuID = e.SkuID + "*" + e.StoreId;
                    var u = n.length;
                    if (t.IsValid && t.HasEnoughStock || u--, t.SkuID != s || t.StoreId != o || t.storeselected) if (t.SkuID == s && t.StoreId == o && t.storeselected) {
                        t.storeselected = !t.storeselected;
                        i = r.indexOf(s);
                        r.splice(i, 1);
                    } else if (t.SkuID != s && t.StoreId != o && t.storeselected) {
                        t.storeselected = !1;
                        i = r.indexOf(t.SkuID);
                        r.splice(i, 1);
                    } else if (o > 0 && t.StoreId != o && t.storeselected) {
                        t.storeselected = !t.storeselected;
                        var i = r.indexOf(s);
                        r.splice(i, 1), f--;
                    } else t.selected = !1; else t.storeselected = !t.storeselected, (l = t.storeselected) && r.push(t.SkuID);
                    t.storeselected && t.StoreId > 0 && f++, f == u && u && (e.selectStoreStatus = !0), 
                    5 != t.StoreStatus && t.storeselected ? a.setData({
                        canBuyTime: !1
                    }) : 5 == t.StoreStatus && t.storeselected && a.setData({
                        canBuyTime: !0
                    });
                }), a.setData((d = {
                    storelist: i,
                    storeid: o,
                    selgift: !1,
                    selectAllStatus: l,
                    SelectskuId: r
                }, t(d, "selectAllStatus", !1), t(d, "selectSupplierStatus", !1), d)), a.GetTotal(o);
            }
        });
    },
    GetTotal: function(t) {
        var t = t, a = parseFloat(0), s = this, r = s.data.ShopCarts, o = (s.data.Suppliers, 
        s.data.storelist);
        o.forEach(function(s, i, l) {
            (r = o[i]).CartItemInfo.forEach(function(s, r, o) {
                t == s.StoreId && t > 0 ? s.storeselected && (a = e.add(parseFloat(s.SubTotal), parseFloat(a))) : t == s.StoreId && 0 == t && s.selected && (a = e.add(parseFloat(s.SubTotal), parseFloat(a)));
            });
        }), s.setData({
            TotalPrice: a
        });
    },
    select: function(t) {
        var e = this, a = !e.data.selectStoreStatus, s = !e.data.selectSupplierStatus, r = e.data.SelectskuId, o = t.currentTarget.dataset.storeid, i = e.data.ShopCarts, l = e.data.storelist;
        l.forEach(function(t, n, u) {
            o > 0 && o == t.StoreId && !t.selectStoreStatus ? (t.selectStoreStatus = !0, e.setData({
                selectSupplierStatus: !1,
                selgift: !1
            })) : o > 0 && o == t.StoreId && t.selectStoreStatus ? (t.selectStoreStatus = !1, 
            e.setData({
                selectSupplierStatus: !1,
                selgift: !1
            })) : o > 0 && o != t.StoreId && t.selectStoreStatus ? (t.selectStoreStatus = !1, 
            e.setData({
                selectSupplierStatus: !1,
                selgift: !1
            })) : 0 == o && o == t.StoreId ? (t.selectStoreStatus = !1, e.setData({
                selectSupplierStatus: s,
                selgift: !0
            })) : 0 == o && o != t.StoreId && (t.selectStoreStatus = !1, e.setData({
                selectSupplierStatus: s
            }));
            (i = l[n]).CartItemInfo.forEach(function(s, i, l) {
                if (o > 0 && s.StoreId == o && s.IsValid && s.HasEnoughStock) t.selectStoreStatus ? s.storeselected = !0 : s.storeselected = !1, 
                a && r.push(s.SkuID); else if (o > 0 && 0 == s.StoreId && s.selected) {
                    s.selected = !1;
                    i = r.indexOf(s.SkuID);
                    r.splice(i, 1);
                } else if (o > 0 && s.StoreId != o && s.storeselected) {
                    s.storeselected = !1;
                    i = r.indexOf(s.SkuID);
                    r.splice(i, 1);
                } else if (0 == o && s.StoreId == o && s.IsValid && s.HasEnoughStock && !s.selected) s.selected = !0, 
                r.push(s.SkuID); else if (0 == o && s.StoreId == o && s.IsValid && s.HasEnoughStock && s.selected) {
                    if (!e.data.selectSupplierStatus) {
                        s.selected = !1;
                        var i = r.indexOf(s.SkuID);
                        r.splice(i, 1);
                    }
                } else 0 == o && s.StoreId != o && s.IsValid && s.HasEnoughStock && (s.storeselected = !1);
                5 != s.StoreStatus && s.storeselected ? e.setData({
                    canBuyTime: !1
                }) : 5 == s.StoreStatus && s.storeselected && e.setData({
                    canBuyTime: !0
                });
            }), e.setData({
                SelectskuId: r,
                selectSupplierStatus: e.data.selectSupplierStatus,
                storelist: l,
                storeid: o
            });
        }), 0 == o && e.setData({
            canBuyTime: !0
        }), e.GetTotal(o);
    },
    SwitchEdite: function() {
        var t = this, e = t.data.EditeText, a = t.data.storelist.length;
        "编辑" == e ? (a <= 0 ? t.setData({
            showselectall: !1
        }) : t.setData({
            showselectall: !0
        }), t.setData({
            isEdite: !0,
            EditeText: "完成",
            SettlementText: "删除",
            DelskuId: "",
            selgift: !1,
            canBuyTime: !0
        })) : (t.setData({
            isEdite: !1,
            EditeText: "编辑",
            DelskuId: "",
            SettlementText: "结算",
            selectsupplierStatus: !1,
            selectAllStatus: !1,
            showselectall: !1,
            SelectskuId: [],
            selgift: !0
        }), t.loadData(t));
    },
    MuseNum: function(t) {
        var e = this;
        if (e.data.clickTag) {
            e.setData({
                clickTag: !1
            });
            var a = t.currentTarget.dataset.index, s = (t.currentTarget.dataset.supplierid, 
            t.currentTarget.dataset.giftid), r = t.currentTarget.dataset.storeid, o = e.getstoreCarts(r), i = o.CartItemInfo[a].Quantity;
            if (setTimeout(function() {
                e.setData({
                    clickTag: !0
                });
            }, 1500), parseInt(i) <= 1) return;
            e.ChangeQuantiy(e, -1, o.CartItemInfo[a].SkuID, s, r);
        }
    },
    AddNum: function(t) {
        var e = this, a = t.currentTarget.dataset.index, s = (t.currentTarget.dataset.supplierid, 
        t.currentTarget.dataset.giftid), r = t.currentTarget.dataset.storeid, o = e.getstoreCarts(r), i = o.CartItemInfo[a].Quantity;
        o.CartItemInfo[a].Stock - i < 0 ? wx.showModal({
            title: "提示",
            content: "超出库存",
            showCancel: !1
        }) : e.ChangeQuantiy(e, 1, o.CartItemInfo[a].SkuID, s, r);
    },
    changegiftnum: function(t) {
        var a = this, s = t.currentTarget.dataset.index, r = t.currentTarget.dataset.giftid, o = t.currentTarget.dataset.action, i = parseInt(a.data.GiftInfo[s].Quantity), l = "";
        "plus" == o ? (l = "+1", i += 1) : (l = "-1", i -= 1), i <= 0 || e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("Cart.ashx?action=addToCart"),
                data: {
                    openId: t,
                    Quantity: l,
                    GiftID: r
                },
                success: function(t) {
                    "OK" == t.data.Status ? (a.data.GiftInfo[s].Quantity = i, a.setData({
                        GiftInfo: a.data.GiftInfo
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
    },
    bindblurNum: function(t) {
        var e = this, a = t.currentTarget.dataset.index, s = (t.currentTarget.dataset.supplierid, 
        t.currentTarget.dataset.giftid), r = t.currentTarget.dataset.storeid, o = e.getstoreCarts(r), i = parseInt(t.detail.value), l = o.CartItemInfo[a].Quantity, n = o.CartItemInfo[a].Stock;
        (isNaN(i) || i < 1) && (i = 1), i != l && (n - i < 0 ? wx.showModal({
            title: "提示",
            content: "超出库存",
            showCancel: !1
        }) : e.ChangeQuantiy(e, i - l, o.CartItemInfo[a].SkuID, s, r));
    },
    DelCarts: function(t) {
        var a = this, s = t.currentTarget.dataset.skuid, r = a.data.SelectskuId, o = t.currentTarget.dataset.storeid, i = t.currentTarget.dataset.giftid;
        "" != s && e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("Cart.ashx?action=delCartItem"),
                data: {
                    openId: t,
                    SkuIDs: s,
                    GiftIDs: i || "",
                    StoreId: o
                },
                success: function(t) {
                    if ("OK" == t.data.Status) {
                        e.updateCartQuantity();
                        var o = r.indexOf(s);
                        o >= 0 && r.splice(o, 1), a.setData({
                            SelectskuId: r
                        });
                    } else "NOUser" == t.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: t.data.error_response.sub_msg,
                        showCancel: !1,
                        success: function(t) {}
                    });
                },
                complete: function() {
                    e.updateCartQuantity(), a.loadData(a);
                }
            });
        });
    },
    SettlementShopCart: function(t) {
        var s = t.currentTarget.dataset.isdel, r = this, o = [], i = r.data.ShopCarts, l = r.data.ShopCarts.GiftInfo, n = (r.data.SelectskuId, 
        r.data.storeid), u = r.data.giftid, i = (r.data.selectAllStatus, r.data.ShopCarts), c = r.data.storelist;
        s && (c.forEach(function(t, e, a) {
            (i = c[e]).CartItemInfo.forEach(function(t, e, a) {
                t.SkuID = t.SkuID + "*" + t.StoreId, t.IsValid && t.HasEnoughStock && t.StoreId > 0 && t.storeselected ? o.push(t.SkuID) : t.IsValid && t.HasEnoughStock && 0 == t.StoreId && t.selected && o.push(t.SkuID);
            });
        }), r.setData({
            SelectskuId: o
        }));
        var d = r.data.SelectskuId.join(",");
        if (r.data.isEdite) {
            if (d <= 0) return void wx.showModal({
                title: "提示",
                content: "请选择要删除的商品",
                showCancel: !1
            });
            e.getOpenId(function(t) {
                wx.request({
                    url: e.getUrl("Cart.ashx?action=delCartItem"),
                    data: {
                        openId: t,
                        SkuIds: d,
                        GiftIDs: u,
                        StoreId: n
                    },
                    success: function(t) {
                        "OK" == t.data.Status ? (r.setData({
                            SelectskuId: [],
                            selectsupplierStatus: !1
                        }), e.updateCartQuantity()) : "NOUser" == t.data.Message ? wx.navigateTo({
                            url: "../login/login"
                        }) : wx.showModal({
                            title: "提示",
                            content: t.data.error_response.sub_msg,
                            showCancel: !1,
                            success: function(t) {}
                        });
                    },
                    complete: function() {
                        r.loadData(r);
                    }
                });
            });
        } else {
            if (d <= 0) return l.length > 0 ? void wx.navigateTo({
                url: "../ordersubmit/ordersubmit"
            }) : void wx.showModal({
                title: "提示",
                content: "请选择要结算的商品",
                showCancel: !1
            });
            e.getOpenId(function(t) {
                wx.request({
                    url: e.getUrl("Cart.ashx?action=CanSubmitOrder"),
                    data: {
                        openId: t,
                        skus: d,
                        StoreId: n
                    },
                    success: function(t) {
                        "OK" == t.data.Status ? wx.navigateTo({
                            url: "../ordersubmit/ordersubmit?productsku=" + d + "&storeid=" + r.data.storeid
                        }) : "NOUser" == t.data.Message ? wx.navigateTo({
                            url: "../login/login"
                        }) : (a.showTip(t.data.Message, "tips"), r.setData({
                            SelectskuId: [],
                            selectsupplierStatus: !1
                        }), r.loadData(r));
                    }
                });
            });
        }
    },
    ChangeQuantiy: function(t, a, s, r, o) {
        e.getOpenId(function(i) {
            wx.request({
                url: e.getUrl("Cart.ashx?action=addToCart"),
                data: {
                    openId: i,
                    SkuID: s,
                    Quantity: a,
                    GiftID: r,
                    StoreId: o
                },
                success: function(e) {
                    "OK" == e.data.Status ? t.loadData(t) : "NOUser" == e.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: e.data.error_response.sub_msg,
                        showCancel: !1,
                        success: function(t) {}
                    });
                },
                complete: function() {}
            });
        });
    },
    goToProductDetail: function(t) {
        var s = this, r = t.currentTarget.dataset.productid, o = t.currentTarget.dataset.storeid;
        t.currentTarget.dataset.isvalid ? s.data.isEdite || wx.request({
            url: e.getUrl("Product.ashx?action=GetProductActivity"),
            data: {
                productId: r,
                storeid: o
            },
            success: function(t) {
                t = t.data;
                var e = "../productdetail/productdetail?id=" + r + "&storeid=" + o + (1 === t.ActiveType ? "&activeid=" + t.ActiveId : "");
                6 == t.ActiveType && (e = "../fightdetail/fightdetail?activeid=" + t.ActiveId), 
                wx.navigateTo({
                    url: e
                });
            }
        }) : a.showTip("很抱歉，你来晚了，你查看的商品已经删除~", "tips");
    },
    selectAll: function() {
        var t = this, e = !t.data.selectAllStatus, a = t.data.ShopCarts, s = t.data.storelist;
        s.forEach(function(t, r, o) {
            t.selectStoreStatus = e, t.selectSupplierStatus = e, (a = s[r]).CartItemInfo.forEach(function(t, a, s) {
                t.IsValid && t.HasEnoughStock && t.StoreId > 0 ? t.storeselected = e : t.selected = e;
            });
        }), t.setData({
            selectAllStatus: e,
            storelist: s,
            selectSupplierStatus: e
        });
    },
    selectgift: function() {
        var t, e = this.data.storelist;
        e.forEach(function(a, s, r) {
            a.selectstoreStatus = !1, (t = e[s]).CartItemInfo.forEach(function(t, e, a) {
                t.storeselected = !1;
            });
        }), this.setData({
            selgift: !0,
            storelist: e
        });
    },
    onReady: function() {},
    onShow: function() {
        e.updateCartQuantity(), this.setData({
            ShopCarts: null,
            isEdite: !1,
            TotalPrice: 0,
            EditeText: "编辑",
            selectSupplierStatus: !1,
            SelectskuId: [],
            SettlementText: "结算",
            isEmpty: !1,
            selectAllStatus: !1,
            showselectall: !1,
            selectStoreStatus: !1
        }), e.globalData.openId ? (this.loadData(this), this.setData({
            isLogin: !0
        })) : this.setData({
            isLogin: !1,
            loaded: !0
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});