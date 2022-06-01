require("../../utils/config.js");

var t = getApp();

Component({
    properties: {
        keyword: {
            type: String
        },
        categoryid: {
            type: String
        },
        storeid: {
            type: Number
        },
        productIds: {
            type: String
        }
    },
    ready: function() {
        var a = this, e = wx.getStorageSync("keyWordList");
        e && (e.reverse(), this.setData({
            KeyWordList: e
        })), this.setData({
            TotalNum: t.globalData.cartQuantity
        }), this.data.storeid && this.loadData(!1), t.getSiteSettingData(function(t) {
            a.setData(t);
        }), this.addToCart = this.selectComponent("#addToCart");
    },
    data: {
        productList: null,
        SortBy: "DisplaySequence",
        SortOrder: "desc",
        keyword: "",
        KeyWordList: null,
        categoryid: "",
        productIds: "",
        PageIndex: 1,
        PageSize: 10,
        Num: 0,
        SortClass: "",
        TotalNum: 0,
        ShowCartIcon: !0
    },
    methods: {
        setcartcount: function(t) {
            this.setData({
                TotalNum: t.detail.quantity
            });
        },
        onSearch: function(t) {
            this.setData({
                PageIndex: 1
            }), this.loadData(!1);
        },
        onReachBottom: function() {
            this.setData({
                PageIndex: this.data.PageIndex + 1
            }), this.loadData(!0);
        },
        bindKeyWordInput: function(t) {
            this.setData({
                keyword: t.detail.value
            });
        },
        onConfirmSearch: function(t) {
            var a = t.detail.value;
            if (this.setData({
                keyword: a,
                PageIndex: 1
            }), a.length > 0) {
                var e = [], r = wx.getStorageSync("keyWordList");
                r && (e = r), -1 == e.join(",").indexOf(a) && e.push(a), wx.setStorageSync("keyWordList", e);
            }
            this.loadData(!1);
        },
        bindBlurInput: function(t) {
            wx.hideKeyboard();
        },
        onSortClick: function(t) {
            var a = t.target.dataset.sortby, e = t.currentTarget.dataset.num, r = "asc", d = "shengxu";
            this.data.SortOrder == r && (r = "desc", d = "jiangxu"), this.setData({
                PageIndex: 1,
                SortBy: a,
                SortOrder: r,
                Num: e,
                SortClass: d,
                classname: d
            }), this.loadData(!1);
        },
        onHistoryKeyWordClick: function(t) {
            var a = t.currentTarget.dataset.keyword;
            this.setData({
                keyword: a,
                PageIndex: 1
            }), this.loadData(!1);
        },
        removeKeyWord: function(t) {
            var a = t.currentTarget.dataset.keyword, e = wx.getStorageSync("keyWordList");
            e && (e.reverse(), this.removeByValue(e, a), wx.setStorageSync("keyWordList", e), 
            this.setData({
                KeyWordList: e
            }));
        },
        ClearKeyWord: function(t) {
            var a = this;
            wx.showModal({
                title: "提示",
                content: "确认要清空所有历史记录吗！",
                success: function(t) {
                    t.confirm && (wx.removeStorageSync("keyWordList"), a.setData({
                        KeyWordList: null
                    }));
                }
            });
        },
        removeByValue: function(t, a) {
            for (var e = 0; e < t.length; e++) if (t[e] == a) {
                t.splice(e, 1);
                break;
            }
        },
        goToProductDetail: function(t) {
            var a = t.currentTarget.dataset.productid, e = t.currentTarget.dataset.activeid, r = t.currentTarget.dataset.activetype, d = "../productdetail/productdetail?id=" + a + (1 == r ? "&activeid=" + e : "") + "&storeid=" + this.data.storeid;
            3 == r && (d = "../presaleproductdetails/presaleproductdetails?ProSaleId=" + e), 
            2 == r && (d = "../groupbuyproductdetails/groupbuyproductdetails?groupbuyid=" + e), 
            6 == r && (d = "../fightdetail/fightdetail?activeid=" + e), wx.navigateTo({
                url: d
            });
        },
        loadData: function(a) {
            var e = this;
            wx.showNavigationBarLoading(), wx.request({
                url: t.getUrl("Product.ashx?action=GetProducts"),
                data: {
                    openId: t.globalData.openId,
                    keyword: this.data.keyword,
                    cId: this.data.categoryid,
                    pageIndex: this.data.PageIndex,
                    pageSize: this.data.PageSize,
                    sortBy: this.data.SortBy,
                    productIds: this.data.productIds,
                    sortOrder: this.data.SortOrder,
                    storeid: this.data.storeid
                },
                success: function(t) {
                    if ("OK" == t.data.Status) {
                        var r = t.data.Data;
                        if (a) {
                            var d = e.data.productList;
                            d.push.apply(d, r), e.setData({
                                productList: d
                            });
                        } else e.setData({
                            productList: r
                        });
                    } else "NOUser" == t.data.Message || wx.showModal({
                        title: "提示",
                        content: t.data.Message,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {
                    wx.hideNavigationBarLoading();
                }
            });
        },
        catchAddCart: function(t) {
            this.setData({
                curProductid: t.currentTarget.dataset.productid,
                curIndex: t.currentTarget.dataset.index
            }), this.addToCart.catchAddCart();
        },
        updateCart: function(t) {
            var a = this, e = t.currentTarget.dataset, r = e.sku, d = e.operator ? 1 : -1, i = e.index;
            this.addToCart.updateCart(r, d, function(t) {
                var e = a.data.productList[i];
                e.CartQuantity += "OK" === t.Status ? d : 0, t.error_response && (e.CartQuantity = e.Stock), 
                e.CartQuantity < 0 && (e.CartQuantity = 0), a.setData({
                    productList: a.data.productList
                });
            });
        },
        updateproduct: function(t) {
            this.data.productList[this.data.curIndex].CartQuantity = t.detail.quantity, this.setData({
                productList: this.data.productList
            });
        }
    }
});