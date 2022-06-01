var a = getApp();

Page({
    data: {
        PageIndex: 1,
        PageSize: 20,
        BrandName: "",
        isEnd: !1,
        ProductTypeId: "",
        BrandList: null,
        isEmpty: !0,
        nullOrder: a.getRequestUrl + "/Templates/xcxshop/images/nullOrder.png"
    },
    onLoad: function(t) {
        var e = this, n = this;
        this.loadBrand(n, !1), a.getSiteSettingData(function(a) {
            e.setData(a);
        });
    },
    loadBrand: function(t, e) {
        wx.showLoading({
            title: "加载中"
        }), wx.request({
            url: a.getUrl("Topic.ashx?action=GetBrandList"),
            data: {
                openId: a.globalData.openId,
                pageIndex: t.data.PageIndex,
                pageSize: t.data.PageSize,
                ProductTypeId: t.data.ProductTypeId,
                BrandName: t.data.BrandName
            },
            success: function(a) {
                if ("OK" == a.data.Status) {
                    var n = a.data.Data;
                    if (n.length < t.data.PageSize && t.setData({
                        isEnd: !0
                    }), e) {
                        var d = t.data.BrandList;
                        d.push.apply(d, n), t.setData({
                            BrandList: d
                        });
                    } else {
                        var i = n.length > 0;
                        t.setData({
                            BrandList: n,
                            isEmpty: i
                        });
                    }
                } else "NOUser" == a.data.Message ? wx.navigateTo({
                    url: "../login/login"
                }) : wx.showModal({
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
                wx.hideLoading();
            }
        });
    },
    brandDetail: function(a) {
        var t = a.currentTarget.dataset.brandid;
        wx.navigateTo({
            url: "../branddetail/branddetail?id=" + t
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var a = this;
        a.data.isEnd || (a.setData({
            PageIndex: a.data.PageIndex + 1
        }), a.loadBrand(a, !0));
    },
    onShareAppMessage: function() {}
});