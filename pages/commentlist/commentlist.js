require("../../utils/config.js");

var a = getApp();

Page({
    data: {
        ReviewInfo: null,
        positive: 0,
        commentList: null,
        pageIndex: 1,
        pageSize: 10,
        commentType: 0,
        ProductId: null
    },
    onLoad: function(t) {
        var e = this, s = this, n = t.id;
        s.setData({
            ProductId: n
        }), wx.request({
            url: a.getUrl("Product.ashx?action=StatisticsReview"),
            data: {
                ProductId: n
            },
            success: function(a) {
                if ("OK" == a.data.Status) {
                    var t = a.data.Data, e = 100 * (t.reviewNum1 / t.reviewNum).toFixed(4);
                    s.setData({
                        ReviewInfo: t,
                        positive: e
                    });
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
            }
        }), s.loadData(s, !1), a.getSiteSettingData(function(a) {
            e.setData(a);
        });
    },
    prevImage: function(a) {
        var t = this, e = a.target.dataset.index, s = a.target.dataset.src, n = [], i = t.data.commentList[e];
        "" != i.ImageUrl1 && n.push(i.ImageUrl1), "" != i.ImageUrl2 && n.push(i.ImageUrl2), 
        "" != i.ImageUrl3 && n.push(i.ImageUrl3), t.setData({
            ImgList: n
        }), wx.previewImage({
            current: s,
            urls: t.data.ImgList
        });
    },
    loadData: function(t, e) {
        wx.request({
            url: a.getUrl("Product.ashx?action=LoadReview"),
            data: {
                PageIndex: t.data.pageIndex,
                PageSize: t.data.pageSize,
                type: t.data.commentType,
                ProductId: t.data.ProductId
            },
            success: function(a) {
                if ("OK" == a.data.Status) {
                    var s = a.data.Data;
                    if (e) {
                        var n = t.data.commentList;
                        n.push.apply(n, s), t.setData({
                            commentList: n
                        });
                    } else t.setData({
                        commentList: s
                    });
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
            }
        });
    },
    bingComment: function(a) {
        var t = this, e = a.currentTarget.dataset.typeid;
        t.setData({
            pageIndex: 1,
            commentType: e
        }), t.loadData(t, !1);
    },
    onReachBottom: function() {
        var a = this, t = a.data.pageIndex;
        t = parseInt(t) + 1, a.setData({
            pageIndex: t
        }), a.loadData(a, !0);
    }
});