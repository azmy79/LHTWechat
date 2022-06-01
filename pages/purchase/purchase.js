function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, i = Array(t.length); a < t.length; a++) i[a] = t[a];
        return i;
    }
    return Array.from(t);
}

var a = getApp(), i = require("../../utils/config.js");

Page({
    data: {
        masterProduct: [],
        buyamount: 1,
        AllSkus: [],
        CombinationProducts: [],
        SkuShow: "none",
        SelectskuId: [],
        skuImg: "",
        skuPrice: 0,
        selectskulist: [],
        selectedSkuContent: "",
        SkuShow1: "none",
        yhAmount: 0,
        Totalstock: 0,
        zuhetext: [],
        thSkuContent: [],
        masSkuContent: [],
        zhProducts: [],
        skuArr: [],
        xtext: []
    },
    onLoad: function(t) {
        var i = this;
        a.getSiteSettingData(function(t) {
            i.setData(t);
        }), this.setData({
            combinaid: t.combinaid
        }), this.getpurchase();
    },
    onShow: function() {},
    getpurchase: function() {
        var t = this;
        a.getOpenId(function(u) {
            wx.request({
                url: a.getUrl("CombinationBuy.ashx?action=GetCombinationBuyDetail"),
                data: {
                    openId: u,
                    combinaid: t.data.combinaid
                },
                success: function(u) {
                    if (u.data.Message) {
                        var o = [], r = new Array(u.data.masterProduct.skuItemList.length + 1);
                        r[0] = u.data.masterProduct.ProductId, u.data.CombinationProducts.forEach(function(t) {
                            t.select = !1, t.sku = [], t.HasSKU ? (t.sku[0] = t.ProductId, t.textsku = []) : t.sku[0] = t.ProductId + "_0", 
                            o.push(t);
                        }), u.data.masterProduct.sku = [], u.data.masterProduct.HasSKU ? (u.data.masterProduct.sku[0] = u.data.masterProduct.ProductId, 
                        t.data.SelectskuId[0] = u.data.masterProduct.sku[0]) : (t.data.SelectskuId[0] = u.data.masterProduct.ProductId + "_0", 
                        u.data.masterProduct.sku[0] = u.data.masterProduct.ProductId + "_0");
                        var e = u.data.masterProduct;
                        t.setData({
                            SelectskuId: t.data.SelectskuId,
                            yhAmount: a.subtract(e.MinSalePrice, e.MinCombinationPrice).toFixed(2),
                            skuArr: r,
                            AllSkus: u.data.AllSkus,
                            masterProduct: e,
                            CombinationProducts: o,
                            Amount: e.MinCombinationPrice.toFixed(2)
                        });
                    } else i.showTip(u.data.ErrorResponse.ErrorMsg, "none"), wx.navigateBack({
                        delta: 1
                    });
                }
            });
        });
    },
    selectList: function(t) {
        var a = this, i = t.currentTarget.dataset.productid, u = (t.currentTarget.dataset.index, 
        this.data.SelectskuId), o = this.data.CombinationProducts;
        o.forEach(function(t, o, r) {
            if (t.ProductId != i || t.select) {
                if (t.ProductId == i && t.select) {
                    t.select = !1;
                    var o = u.indexOf(t.sku.join("_"));
                    u.splice(o, 1), a.getotal(i);
                }
            } else t.HasSKU ? (t.select = !0, u.push(t.sku.join("_")), a.getotal(i)) : (t.select = !0, 
            u.push(t.sku[0]), a.getotal(i));
        }), this.setData({
            CombinationProducts: o,
            SelectskuId: u
        });
    },
    getotal: function(t) {
        var i = this, u = parseFloat(this.data.Amount), o = parseFloat(this.data.yhAmount);
        this.data.CombinationProducts.forEach(function(r, e, s) {
            r.ProductId == t && r.select ? (u = a.add(u, a.multiply(r.MinCombinationPrice, i.data.buyamount)), 
            o = a.add(o, a.multiply(a.subtract(r.MinSalePrice, r.MinCombinationPrice), i.data.buyamount))) : r.ProductId != t || r.select || (u = a.subtract(u, a.multiply(r.MinCombinationPrice, i.data.buyamount)), 
            o = a.subtract(o, a.multiply(a.subtract(r.MinSalePrice, r.MinCombinationPrice), i.data.buyamount)));
        }), this.setData({
            Amount: u.toFixed(2),
            yhAmount: o.toFixed(2)
        });
    },
    bindblurNum: function(t) {
        var i = parseInt(t.detail.value);
        (i < 1 || isNaN(i)) && (i = 1), i > 999 && (i = 999);
        var u = a.multiply(this.data.masterProduct.MinCombinationPrice, i), o = a.multiply(a.subtract(this.data.masterProduct.MinSalePrice, this.data.masterProduct.MinCombinationPrice), i);
        this.data.CombinationProducts.forEach(function(t) {
            t.select && (u = a.add(u, a.multiply(t.MinCombinationPrice, i)), o = a.add(o, a.multiply(a.subtract(t.MinSalePrice, t.MinCombinationPrice), i)));
        }), this.setData({
            buyamount: i,
            Amount: u.toFixed(2),
            yhAmount: o.toFixed(2)
        });
    },
    swithSku: function(t) {
        var i = this, u = t.currentTarget.dataset.index, o = t.currentTarget.dataset.id, r = t.target.dataset.skuvalue, e = this.data.skuArr, s = t.currentTarget.dataset.img, n = t.currentTarget.dataset.attributeid;
        wx.request({
            url: a.getUrl("CombinationBuy.ashx?action=GetCombinationSku"),
            data: {
                openId: "oGbUa0dzLRtxz9sHYHbFPOemz1ow",
                ProductId: this.data.productid,
                AttributeId: n,
                ValueId: o,
                CombinationId: this.data.combinaid
            },
            success: function(t) {
                var a = {};
                if (t.data.Data.forEach(function(t) {
                    a[t.SkuId] = t;
                }), 1 == i.data.type) {
                    i.data.masterProduct.imgbf = s, e[u + 1] = o, i.data.thSkuContent[u] = e[u + 1] ? r : "";
                    var n = i.data.newSku[i.data.skuArr.join("_")];
                    i.data.masterProduct.sku = e, n && a[n.SkuId] && (i.data.skuPrice = a[n.SkuId].CombinationPrice, 
                    i.data.masterProduct.Totalstock = a[n.SkuId].Stock), i.setData({
                        skuArr: e,
                        thSkuContent: i.data.thSkuContent,
                        bfcurSkuData: n || null,
                        skuImg: s || i.data.skuImg,
                        masterProduct: i.data.masterProduct,
                        skusdata: a,
                        skuPrice: i.data.skuPrice
                    }, function(t) {
                        i.setDisabledSku();
                    }), console.log(i.data.thSkuContent), console.log(i.data.masSkuContent);
                } else i.data.CombinationProducts.forEach(function(t) {
                    t.ProductId == i.data.productid && (i.data.skuArr[0] = t.ProductId, i.data.skuArr[u + 1] = o, 
                    t.sku[u + 1] = o, t.textsku[u] = t.sku[u + 1] ? r : "", console.log(t.textsku), 
                    t.bfcurSkuData = i.data.newSku[t.sku.join("_")], t.imgbf = s, i.data.zuhetext = t.textsku, 
                    t.bfcurSkuData && a[t.bfcurSkuData.SkuId] && (t.MinCombinationPrice = a[t.bfcurSkuData.SkuId].CombinationPrice, 
                    t.Totalstock = a[t.bfcurSkuData.SkuId].Stock, i.setData({
                        Totalstock: a[t.bfcurSkuData.SkuId].Stock,
                        skuPrice: a[t.bfcurSkuData.SkuId].CombinationPrice
                    })));
                }), i.setData({
                    zhProducts: i.data.CombinationProducts,
                    zuhetext: i.data.zuhetext,
                    skuArr: i.data.skuArr,
                    skuImg: s || i.data.skuImg,
                    skusdata: a
                }, function(t) {
                    i.setDisabledSku();
                });
            }
        });
    },
    setDisabledSku: function() {
        var a = this.data.selectskulist, i = this.data.skusdata, u = this.data.skuArr;
        a.skuItemList.forEach(function(a, o) {
            a.AttributeValue.forEach(function(a) {
                var r = [].concat(t(u));
                r[o + 1] = a.ValueId, a.disabled = !1, i[r.join("_")] && i[r.join("_")].Stock < 1 && (a.disabled = !0);
            });
        }), this.setData({
            selectskulist: a
        });
    },
    addSku: function() {
        var t = this;
        if (1 == this.data.type) {
            if (!this.data.bfcurSkuData) return void wx.showModal({
                title: "提示",
                content: "请选择商品规格",
                showCancel: !1
            });
            this.data.masterProduct.MinCombinationPrice = this.data.skuPrice, this.data.SelectskuId[0] = this.data.bfcurSkuData.SkuId, 
            this.setData({
                masterProduct: this.data.masterProduct,
                SkuShow: "none",
                masSkuContent: this.data.thSkuContent,
                mastercurSkuData: this.data.bfcurSkuData,
                SelectskuId: this.data.SelectskuId
            });
        }
        2 == this.data.type && this.data.zhProducts.forEach(function(a) {
            if (a.ProductId == t.data.productid) {
                if (!a.bfcurSkuData) return void wx.showModal({
                    title: "提示",
                    content: "请选择商品规格",
                    showCancel: !1
                });
                a.curSkuData = a.bfcurSkuData, a.MinCombinationPrice = t.data.skuPrice, t.setData({
                    SkuShow: "none",
                    CombinationProducts: t.data.zhProducts
                });
            }
        });
        var i = a.multiply(this.data.masterProduct.MinCombinationPrice, this.data.buyamount), u = a.multiply(a.subtract(this.data.masterProduct.MinSalePrice, this.data.masterProduct.MinCombinationPrice), this.data.buyamount);
        this.data.CombinationProducts.forEach(function(o, r, e) {
            o.select && (i = a.add(i, a.multiply(o.MinCombinationPrice, t.data.buyamount)), 
            u = a.add(u, a.multiply(a.subtract(o.MinSalePrice, o.MinCombinationPrice), t.data.buyamount)));
        }), this.setData({
            Amount: i.toFixed(2),
            yhAmount: u.toFixed(2)
        });
    },
    getsku: function(t) {
        var a = this, i = t.currentTarget.dataset.productid, u = t.currentTarget.dataset.img, o = t.currentTarget.dataset.pirce, r = t.currentTarget.dataset.type, e = [], s = this.data.AllSkus.filter(function(t) {
            return t.ProductId == i;
        }), n = this.data.Totalstock, d = {}, c = this.data.skuImg;
        s.forEach(function(t) {
            d[t.SkuId] = t;
        }), 1 == r ? (e = this.data.masterProduct, n = this.data.masterProduct.Totalstock, 
        this.data.thSkuContent = this.data.masSkuContent, this.data.skuArr = [], this.data.mastercurSkuData ? this.data.skuArr = this.data.mastercurSkuData.SkuId.split("_") : this.data.skuArr = this.data.masterProduct.sku, 
        c = u || this.data.masterProduct.ThumbnailUrl180) : 2 == r && (this.data.skuArr = [], 
        this.data.CombinationProducts.forEach(function(t) {
            t.ProductId == i && (t.curSkuData ? a.data.skuArr = t.curSkuData.SkuId.split("_") : a.data.skuArr = t.sku, 
            a.data.zuhetext = t.textsku, n = t.Totalstock, c = u || t.ThumbnailUrl180);
        }), e = this.data.CombinationProducts.filter(function(t) {
            return i == t.ProductId;
        })[0]), this.setData({
            SkuShow: "",
            SkuShow1: "",
            skuImg: c,
            skuPrice: o,
            selectskulist: e,
            productid: i,
            newSku: d,
            type: r,
            zuhetext: this.data.zuhetext,
            skuArr: this.data.skuArr
        });
    },
    onSkuHide: function() {
        this.setData({
            SkuShow: "none",
            SkuShow1: "none"
        });
    },
    MuseNum: function() {
        var t = this.data.buyamount;
        if (1 != this.data.SelectskuId.length) {
            (t -= 1) < 1 && (t = 1);
            var u = this.data.Amount, o = this.data.masterProduct, r = this.data.yhAmount;
            1 == t ? (u = o.MinCombinationPrice, r = a.subtract(this.data.masterProduct.MinSalePrice, this.data.masterProduct.MinCombinationPrice), 
            this.data.CombinationProducts.forEach(function(t) {
                t.select && (u = a.add(u, t.MinCombinationPrice), r = a.add(r, a.subtract(t.MinSalePrice, t.MinCombinationPrice)));
            })) : (u = a.subtract(u, o.MinCombinationPrice), r = a.subtract(r, a.subtract(this.data.masterProduct.MinSalePrice, this.data.masterProduct.MinCombinationPrice)), 
            this.data.CombinationProducts.forEach(function(t) {
                t.select && (u = a.subtract(u, t.MinCombinationPrice), r = a.subtract(r, a.subtract(t.MinSalePrice, t.MinCombinationPrice)));
            })), this.setData({
                buyamount: t,
                Amount: u.toFixed(2),
                yhAmount: r.toFixed(2)
            });
        } else i.showTip("请至少选择一件组合购商品", "none");
    },
    AddNum: function() {
        var t = this.data.buyamount;
        if (1 != this.data.SelectskuId.length) {
            t += 1;
            var u = this.data.Amount, o = this.data.yhAmount, r = this.data.masterProduct;
            t > 1 ? (u = a.multiply(r.MinCombinationPrice, t), o = a.multiply(a.subtract(this.data.masterProduct.MinSalePrice, this.data.masterProduct.MinCombinationPrice), t)) : (u = r.MinCombinationPrice, 
            o = a.subtract(this.data.masterProduct.MinSalePrice, this.data.masterProduct.MinCombinationPrice)), 
            this.data.CombinationProducts.forEach(function(i) {
                i.select && (u = a.add(u, a.multiply(i.MinCombinationPrice, t)), o = a.add(o, a.multiply(a.subtract(i.MinSalePrice, i.MinCombinationPrice), t)));
            }), this.setData({
                Amount: u.toFixed(2),
                buyamount: t,
                yhAmount: o.toFixed(2)
            });
        } else i.showTip("请至少选择一件组合购商品", "none");
    },
    gotodetail: function(t) {
        var a = t.currentTarget.dataset.productid;
        wx.navigateTo({
            url: "../productdetail/productdetail?id=" + a
        });
    },
    gosubmit: function() {
        var t = [], a = !0, u = this.data.CombinationProducts;
        if (this.data.masterProduct.HasSKU) {
            if (!this.data.mastercurSkuData) return void i.showTip("请选择主商品规格", "none");
            t[0] = this.data.mastercurSkuData.SkuId;
        } else t[0] = this.data.masterProduct.sku[0];
        var o = !0, r = !1, e = void 0;
        try {
            for (var s, n = u[Symbol.iterator](); !(o = (s = n.next()).done); o = !0) {
                var d = s.value;
                if (d.select) if (d.HasSKU) {
                    if (!d.curSkuData) {
                        i.showTip("请选择勾选的组合购规格", "none"), a = !1;
                        break;
                    }
                    t.push(d.curSkuData.SkuId);
                } else t.push(d.sku[0]);
            }
        } catch (t) {
            r = !0, e = t;
        } finally {
            try {
                !o && n.return && n.return();
            } finally {
                if (r) throw e;
            }
        }
        if (console.log(t.join()), a) {
            if (1 == t.length) return void i.showTip("请至少选择一件组合购商品", "none");
            wx.navigateTo({
                url: "../ordersubmit/ordersubmit?productsku=" + t.join() + "&from=combinationbuy&buyamount=" + this.data.buyamount + "&combinaid=" + this.data.masterProduct.CombinationId + "&frompage=combinationbuy"
            });
        }
    }
});