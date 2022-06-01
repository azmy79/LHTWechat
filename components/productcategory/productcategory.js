require("../../utils/config.js");

var t = getApp();

Component({
    pageLifetimes: {
        show: function() {
            this.setData({
                PageIndex: 1
            }), this.loadData(this, !1);
        }
    },
    properties: {
        storeid: {
            type: Number
        }
    },
    ready: function() {
        var a = this;
        this.loadCategory(this), this.addToCart = this.selectComponent("#addToCart"), this.loadData(this, !1), 
        t.getSiteSettingData(function(t) {
            a.setData(t), wx.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "white"
            });
        });
    },
    data: {
        CategoryList: [],
        CurrentCategory: null,
        ProductList: null,
        CurrentProduct: null,
        CurrentSku: null,
        Cid: 0,
        SortBy: "DisplaySequence",
        SortOrder: "desc",
        KeyWord: "",
        PageIndex: 1,
        PageSize: 10,
        Num: 0,
        SortClass: "",
        isShow: !0,
        isShowSkuSelectBox: !1,
        selectedskuList: [],
        buyAmount: 1,
        selectedSku: "",
        SkuItemList: null,
        IsPagePost: !1,
        CartTotalNum: 0
    },
    methods: {
        loadCategory: function(a) {
            wx.request({
                url: t.getUrl("Product.ashx?action=GetAllCategories"),
                data: {
                    storeid: a.data.storeid
                },
                success: function(t) {
                    if ("OK" == t.data.Status) {
                        var e = t.data.Data;
                        if (a.data.Cid > 0) {
                            for (var r = 0; r < e.length; r++) if (a.data.Cid == e[r].cid) {
                                a.setData({
                                    CategoryList: e,
                                    CurrentCategory: e[r],
                                    Cid: e[r].cid
                                });
                                break;
                            }
                        } else a.setData({
                            CategoryList: e,
                            CurrentCategory: e[0],
                            Cid: e[0].cid
                        });
                        a.loadData(a, !1);
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
                complete: function() {}
            });
        },
        catchAddCart: function(t) {
            this.setData({
                curProductid: t.currentTarget.dataset.productid,
                curIndex: t.currentTarget.dataset.index
            }), this.addToCart.catchAddCart();
        },
        updateCart: function(t) {
            var a = this, e = t.currentTarget.dataset, r = e.sku, d = e.operator ? 1 : -1, o = e.index;
            this.addToCart.updateCart(r, d, function(t) {
                var e = a.data.ProductList[o];
                e.CartQuantity += "OK" === t.Status ? d : 0, t.error_response && (e.CartQuantity = e.Stock), 
                !e.CartQuantity && e.CartQuantity <= 0 && (e.CartQuantity = 0), a.setData({
                    ProductList: a.data.ProductList
                });
            });
        },
        updateproduct: function(t) {
            this.data.ProductList[this.data.curIndex].CartQuantity = t.detail.quantity, this.setData({
                ProductList: this.data.ProductList
            });
        },
        gotoKeyWordPage: function(t) {
            wx.navigateTo({
                url: "../productsearch/productsearch?storeid=" + this.data.storeid
            });
        },
        loadData: function(a, e) {
            wx.showNavigationBarLoading(), wx.request({
                url: t.getUrl("Product.ashx?action=GetProducts"),
                data: {
                    keyword: a.data.KeyWord,
                    pageIndex: a.data.PageIndex,
                    pageSize: a.data.PageSize,
                    sortBy: a.data.SortBy,
                    sortOrder: a.data.SortOrder,
                    cId: a.data.Cid,
                    openId: t.globalData.openId,
                    storeid: a.data.storeid
                },
                success: function(t) {
                    if ("OK" == t.data.Status) {
                        var r = t.data.Data;
                        if (e) {
                            var d = a.data.ProductList;
                            d.push.apply(d, r), a.setData({
                                ProductList: d
                            });
                        } else a.setData({
                            ProductList: r
                        });
                    } else wx.showModal({
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
        ChooseCategory: function(t) {
            var a = this, e = t.currentTarget.dataset.cid, r = t.currentTarget.dataset.grade;
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
            }), "1" == r ? a.data.CategoryList.find(function(t, r) {
                t.cid != e || a.setData({
                    CurrentCategory: t,
                    Cid: e,
                    PageIndex: 1
                });
            }) : a.setData({
                Cid: e,
                PageIndex: 1
            }), a.loadData(a, !1);
        },
        SortClick: function(t) {
            var a = t.currentTarget.dataset.sortby, e = t.currentTarget.dataset.index, r = "asc", d = "shengxu";
            this.data.SortOrder == r && (r = "desc", d = "jiangxu"), this.setData({
                PageIndex: 1,
                SortBy: a,
                currentIndex: e,
                SortOrder: r,
                SortClass: d
            }), this.loadData(this, !1);
        },
        ChooseProduct: function(t) {
            var a = t.currentTarget.dataset.productid, e = t.currentTarget.dataset.activeid, r = t.currentTarget.dataset.activetype, d = "../productdetail/productdetail?id=" + a + (1 == r ? "&activeid=" + e : "") + "&storeid=" + this.data.storeid;
            console.log(this.data.storeid), 3 == r && 0 == this.data.storeid && (d = "../presaleproductdetails/presaleproductdetails?ProSaleId=" + e), 
            2 == r && (d = "../groupbuyproductdetails/groupbuyproductdetails?groupbuyid=" + e), 
            6 == r && (d = "../fightdetail/fightdetail?activeid=" + e), wx.navigateTo({
                url: d
            });
        },
        onReachBottom: function() {
            this.setData({
                PageIndex: this.data.PageIndex + 1
            }), this.loadData(this, !0);
        }
    }
});