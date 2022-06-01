var t = getApp();

Page({
    data: {
        imageid: "",
        storeid: "",
        pageIndex: 1,
        pageSize: 10,
        proList: null,
        isEnd: !1,
        isEmpty: !0,
        MarketingImageUrl: null,
        nullOrder: t.getRequestUrl + "/Templates/xcxshop/images/nullOrder.png"
    },
    onLoad: function(a) {
        var e = this;
        e.setData({
            imageid: a.imageid,
            storeid: a.storeid
        }), t.getSiteSettingData(function(t) {
            e.setData(t);
        }), e.loadproduct(!1), this.addToCart = this.selectComponent("#addToCart");
    },
    loadproduct: function(a) {
        var e = this;
        wx.request({
            url: t.getUrl("Store.ashx?action=GetMarketingDetail"),
            data: {
                imageId: this.data.imageid,
                storeId: this.data.storeid,
                pageIndex: this.data.pageIndex,
                pageSize: this.data.pageSize,
                openId: t.globalData.openId
            },
            success: function(t) {
                var r = e.data.isEnd, i = t.data.Data;
                if (i.length < 10 && (r = !0), a) {
                    var d = e.data.proList;
                    d.push.apply(d, i), e.setData({
                        proList: d,
                        isEnd: r,
                        MarketingImageUrl: t.data.MarketingImageUrl
                    });
                } else {
                    var n = i.length > 0;
                    e.setData({
                        proList: i,
                        isEnd: r,
                        isEmpty: n,
                        MarketingImageUrl: t.data.MarketingImageUrl
                    });
                }
            }
        });
    },
    goToProductDetail: function(t) {
        var a = t.currentTarget.dataset.productid, e = t.currentTarget.dataset.activeid, r = t.currentTarget.dataset.activetype;
        t.currentTarget.dataset.producttype;
        wx.navigateTo({
            url: "../productdetail/productdetail?id=" + a + "&storeid=" + this.data.storeid + (1 == r ? "&activeid=" + e : "")
        });
    },
    catchAddCart: function(t) {
        this.setData({
            curProductid: t.currentTarget.dataset.productid,
            curIndex: t.currentTarget.dataset.index
        }), this.addToCart.catchAddCart();
    },
    updateCart: function(t) {
        var a = this, e = t.currentTarget.dataset, r = e.sku, i = e.operator ? 1 : -1, d = e.index;
        e.floorindex;
        this.addToCart.updateCart(r, i, function(t) {
            var e = a.data.proList[d];
            e.CartQuantity += "OK" === t.Status ? i : 0, t.error_response && (e.CartQuantity = e.Stock), 
            e.CartQuantity < 0 && (e.CartQuantity = 0), a.setData({
                proList: a.data.proList
            });
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});