function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, s = Array(t.length); a < t.length; a++) s[a] = t[a];
        return s;
    }
    return Array.from(t);
}

var a = getApp();

Component({
    properties: {
        productid: {
            type: Number
        },
        storeid: {
            type: Number
        }
    },
    data: {
        isShowSkus: !1
    },
    ready: function() {
        var t = this;
        a.getSiteSettingData(function(a) {
            t.setData(a);
        });
    },
    methods: {
        catchAddCart: function(t) {
            var s = this, u = this.data.productid;
            a.getOpenId(function(t) {
                wx.showLoading({
                    title: "加载中..."
                }), wx.request({
                    url: a.getUrl("Product.ashx?action=GetProductSkus"),
                    data: {
                        productid: u,
                        openid: t,
                        storeid: s.data.storeid
                    },
                    success: function(t) {
                        if (wx.hideLoading(), "OK" === (t = t.data).Status) if (t.Data.Stock <= 0) wx.showToast({
                            title: "此商品已售罄",
                            icon: "none"
                        }); else if (0 === t.Data.SkuItems.length) s.addToCart(t.Data.DefaultSku.SkuId, 1, null, "已加入购物车"); else {
                            var a, u = {};
                            t.Data.Skus.forEach(function(t) {
                                u[t.SkuId] = t, !a && t.Stock && (a = t);
                            }), t.Data.Skus = u, t.Data.DefaultSku.Stock || (t.Data.DefaultSku = a);
                            var e = new Array(t.Data.SkuItems.length + 1);
                            e[0] = t.Data.ProductId, s.setData({
                                chooseSkuHide: !1,
                                skuData: t.Data,
                                skuArr: e,
                                curSkuData: ""
                            }), 1 == s.data.skuData.SkuItems.length && s.setDisabledSku(), s.showSkuDOM();
                        } else wx.showToast({
                            title: t.Message || t.error_response.sub_msg,
                            icon: "none"
                        });
                    }
                });
            });
        },
        updateCart: function(t, a, s) {
            this.addToCart(t, a, function(t) {
                s(t);
            });
        },
        changeCount: function(t) {
            var a = this, s = t.currentTarget.dataset, u = s.sku, e = s.operator ? 1 : -1, r = this.data.curSkuData;
            r ? this.addToCart(u, e, function(t) {
                r.CartQuantity += "OK" === t.Status ? e : 0, t.error_response && (r.CartQuantity = r.Stock), 
                r.CartQuantity < 0 && (r.CartQuantity = 0), a.data.skuData.Skus[r.SkuId] = r, a.setData({
                    curSkuData: r,
                    skuData: a.data.skuData
                });
                var s = 0, u = a.data.skuData.Skus;
                for (var i in u) s += u[i].CartQuantity;
                a.triggerEvent("updateproduct", {
                    quantity: s
                });
            }) : wx.showToast({
                title: "请选择规格",
                icon: "none"
            });
        },
        addToCart: function(t, s, u, e) {
            var r = this;
            a.getOpenId(function(i) {
                wx.request({
                    url: a.getUrl("Cart.ashx?action=addToCart"),
                    data: {
                        openId: i,
                        skuId: t,
                        quantity: s,
                        storeid: r.data.storeid
                    },
                    success: function(t) {
                        "OK" === (t = t.data).Status ? (e && wx.showToast({
                            title: e
                        }), a.updateCartQuantity(function(t) {
                            r.triggerEvent("setcartcount", {
                                quantity: t
                            });
                        }), u && u(t)) : a.showErrorModal(t.error_response.sub_msg);
                    }
                });
            });
        },
        setDisabledSku: function() {
            var a = this.data.skuData.SkuItems, s = this.data.skuData.Skus, u = (a.length, this.data.skuArr);
            a.forEach(function(a, e) {
                a.AttributeValue.forEach(function(a) {
                    var r = [].concat(t(u));
                    r[e + 1] = a.ValueId, s[r.join("_")] && !s[r.join("_")].Stock ? a.disabled = !0 : a.disabled = !1;
                });
            }), this.setData({
                skuData: this.data.skuData
            });
        },
        swithSku: function(t) {
            var a = t.currentTarget.dataset.index, s = t.currentTarget.dataset.id, u = this.data.skuArr;
            u[a + 1] = u[a + 1] == s ? 0 : s, this.setData({
                skuArr: u,
                curSkuData: this.data.skuData.Skus[this.data.skuArr.join("_")] || null
            }), this.setDisabledSku();
        },
        hideSkuDOM: function() {
            this.setData({
                isShowSkus: !1
            });
        },
        showSkuDOM: function() {
            this.setData({
                isShowSkus: !0
            });
        }
    }
});