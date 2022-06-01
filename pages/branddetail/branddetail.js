var a = getApp(), t = require("../wxParse/wxParse.js");

Page({
    data: {
        pageSize: 10,
        pageIndex: 1,
        tab: 1,
        metaDescription: "",
        list: [],
        brandId: 0
    },
    onLoad: function(e) {
        var i = this;
        this.setData({
            brandId: e.id
        }), wx.request({
            url: a.getUrl("Topic.ashx?action=GetBrandInfo"),
            data: {
                brandId: e.id
            },
            success: function(a) {
                if (i.setData({
                    info: a.data
                }), a.data.Description) {
                    var e = a.data.Description, n = i;
                    t.wxParse("metaDescription", "html", e, n);
                }
            }
        }), a.getSiteSettingData(function(a) {
            i.setData(a), console.log(a);
        }), this.loadData(!1);
    },
    loadData: function(t) {
        var e = this;
        wx.showNavigationBarLoading(), wx.request({
            url: a.getUrl("Product.ashx?action=GetProducts"),
            data: {
                pageIndex: this.data.pageIndex,
                pageSize: this.data.pageSize,
                brandId: this.data.brandId
            },
            success: function(a) {
                if ("OK" == a.data.Status) {
                    var i = a.data.Data;
                    if (t) {
                        var n = e.data.list;
                        n.push.apply(n, i), e.setData({
                            list: n
                        });
                    } else e.setData({
                        list: i
                    });
                } else wx.showModal({
                    title: "提示",
                    content: a.data.Message,
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.navigateBack({
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
    switchTab: function(a) {
        var t = a.currentTarget.dataset.tab;
        this.setData({
            tab: t
        });
    },
    showProduct: function(a) {
        var t = a.currentTarget.dataset.productid, e = a.currentTarget.dataset.activeid, i = a.currentTarget.dataset.activetype, n = "../productdetail/productdetail?id=" + t + (1 == i ? "&activeid=" + e : "");
        6 == i && (n = "../fightdetail/fightdetail?activeid=" + e), wx.navigateTo({
            url: n
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {
        var a = this.data.pageIndex;
        this.setData({
            pageIndex: a + 1
        }), this.loadData(!0);
    },
    onShareAppMessage: function(a) {}
});