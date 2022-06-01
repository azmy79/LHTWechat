var a = getApp(), e = require("../../utils/config.js");

Page({
    data: {
        OrderId: "",
        ProductList: [],
        UserCredentials: [ "../../images/return-img_12.jpg" ],
        UploadGredentials: [],
        ScoreGrade: [],
        Remark: [],
        TxtareaName: [],
        TotalImg: 0,
        UploadNum: 0,
        isSubmit: !1
    },
    onLoad: function(t) {
        var r = this, o = this, n = t.id;
        a.getOpenId(function(t) {
            var r = {
                openId: t,
                orderId: n
            };
            e.httpGet(a.getUrl("UserOrder.ashx?action=GetOrderProduct"), r, o.getProductData);
        }), o.setData({
            OrderId: n
        }), a.getSiteSettingData(function(a) {
            r.setData(a);
        });
    },
    getProductData: function(a) {
        var e = this;
        if ("NOUser" == a.Message) wx.navigateTo({
            url: "../login/login"
        }); else if ("OK" == a.Status) {
            var t = [], r = [], o = [];
            a.Data.forEach(function(a, e, n) {
                var s = {
                    skuId: a.SkuId,
                    skucontent: a.SkuContent,
                    grade: parseInt(5),
                    remark: ""
                }, i = {
                    img1: "../../images/return-img_03.jpg",
                    img2: "../../images/return-img_03.jpg",
                    img3: "../../images/return-img_03.jpg",
                    ImgSize: 0,
                    skuId: a.SkuId
                };
                t.push(s), r.push(i), o.push("txt_" + a.SkuId);
            }), e.setData({
                ProductList: a.Data,
                ScoreGrade: t,
                UserCredentials: r,
                TxtareaName: o
            });
        } else wx.showModal({
            title: "提示",
            content: result.data.Message,
            showCancel: !1,
            confirmColor: "#ff5722",
            success: function(a) {
                a.confirm && wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    ScoreGrade: function(a) {
        var e = a.currentTarget.dataset.grade, t = a.currentTarget.dataset.index, r = this.data.ScoreGrade;
        r[t].grade = parseInt(e), this.setData({
            ScoreGrade: r
        });
    },
    ChooseImg: function(a) {
        var e = this, t = a.currentTarget.dataset.index, r = parseInt(a.currentTarget.dataset.coloum);
        a.currentTarget.dataset.skuid;
        wx.chooseImage({
            count: 1,
            success: function(a) {
                var o = a.tempFilePaths[0];
                console.log(a), e.UploadImage(o, t, r);
            }
        });
    },
    formSubmit: function(a) {
        var e = this, t = (a.detail.formId, e.data.ScoreGrade), r = e.data.TxtareaName;
        if (r.length <= 0) return wx.showModal({
            title: "提示",
            content: "文本框不存在",
            confirmColor: "#ff5722",
            showCancel: !1
        }), !1;
        var o = !1;
        if (r.forEach(function(r, n, s) {
            e.ToTrim(a.detail.value[r]).length <= 0 ? o = !0 : t[n].remark = e.ToTrim(a.detail.value[r]);
        }), o) return wx.showModal({
            title: "提示",
            content: "请输入评价内容",
            confirmColor: "#ff5722",
            showCancel: !1
        }), !1;
        e.setData({
            ScoreGrade: t,
            UploadGredentials: []
        });
        var n = e.data.UploadGredentials;
        if (e.data.UserCredentials.forEach(function(a, e, t) {
            var r = n[a.skuId];
            (void 0 == r || "" == r || r.length <= 0) && (r = []), "../../images/return-img_03.jpg" != a.img1 && r.push(a.uploadimg1), 
            "../../images/return-img_03.jpg" != a.img2 && r.push(a.uploadimg2), "../../images/return-img_03.jpg" != a.img3 && r.push(a.uploadimg3), 
            n[a.skuId] = r;
        }), e.setData({
            UploadGredentials: n
        }), e.data.isSubmit) return !1;
        e.setData({
            isSubmit: !0
        }), e.AddComments();
    },
    UploadImage: function(e, t, r) {
        var o = this;
        console.log(e), a.getOpenId(function(n) {
            wx.uploadFile({
                url: a.getUrl("Common.ashx?action=UploadAppletImage"),
                filePath: e,
                name: "file",
                formData: {
                    openId: n
                },
                success: function(a) {
                    var n = JSON.parse(a.data);
                    if ("OK" == n.Status) {
                        var s = n.Data[0].ImageUrl, i = o.data.UserCredentials;
                        1 == r ? (i[t].img1 = e, i[t].uploadimg1 = s) : 2 == r ? (i[t].img2 = e, i[t].uploadimg2 = s) : (i[t].img3 = e, 
                        i[t].uploadimg3 = s);
                        var d = parseInt(i[t].ImgSize);
                        d = d >= 2 ? 2 : parseInt(d + 1), i[t].ImgSize = d, o.setData({
                            UserCredentials: i
                        });
                    } else "NOUser" == n.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        confirmColor: "#ff5722",
                        content: n.ErrorResponse.ErrorMsg,
                        showCancel: !1,
                        success: function(a) {
                            a.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                }
            });
        });
    },
    UploadImages: function(e, t, r) {
        var o = t.shift();
        void 0 != o ? a.getOpenId(function(n) {
            wx.uploadFile({
                url: a.getUrl("Common.ashx?action=UploadAppletImage"),
                filePath: o,
                name: "file",
                formData: {
                    openId: n
                },
                success: function(a) {
                    var t = JSON.parse(a.data);
                    if ("OK" == t.Status) {
                        var o = e.data.UploadGredentials, n = o[r];
                        (void 0 == n || "" == n || n.length <= 0) && (n = []), n.push(t.Data[0].ImageUrl), 
                        o[r] = n;
                        var s = parseInt(e.data.UploadNum) + 1;
                        e.setData({
                            UploadGredentials: o,
                            UploadNum: s
                        });
                    } else "NOUser" == t.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        confirmColor: "#ff5722",
                        content: t.ErrorResponse.ErrorMsg,
                        showCancel: !1,
                        success: function(a) {
                            a.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {
                    t.length > 0 ? e.UploadImages(e, t, r) : e.data.UploadNum == e.data.TotalImg && e.AddComments();
                }
            });
        }) : e.data.UploadNum == e.data.TotalImg && e.AddComments();
    },
    ToTrim: function(a) {
        return a.replace(/(^\s*)|(\s*$)/g, "");
    },
    AddComments: function() {
        var e = this, t = e.data.ScoreGrade, r = [], o = e.data.UploadGredentials;
        t.forEach(function(a, t, n) {
            var s = {
                ProductId: a.skuId.substr(0, a.skuId.indexOf("_")),
                OrderId: e.data.OrderId,
                SkuId: a.skuId,
                ReviewText: a.remark,
                SkuContent: a.skucontent,
                Score: a.grade,
                ImageUrl1: ""
            }, i = a.skuId;
            void 0 != o[i] && (s.ImageUrl1 = o[i].join(",")), r.push(s);
        }), a.getOpenId(function(t) {
            wx.request({
                url: a.getUrl("UserOrder.ashx?action=AddProductReview"),
                data: {
                    openId: t,
                    DataJson: r,
                    formId: e.data.formId
                },
                success: function(a) {
                    e.setData({
                        isSubmit: !1
                    }), "OK" == a.data.Status ? wx.showModal({
                        title: "提示",
                        confirmColor: "#ff5722",
                        content: a.data.Message,
                        showCancel: !1,
                        success: function(a) {
                            a.confirm && wx.redirectTo({
                                url: "../orderlist/orderlist"
                            });
                        }
                    }) : "NOUser" == a.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        confirmColor: "#ff5722",
                        content: a.data.Message,
                        showCancel: !1,
                        success: function(a) {
                            a.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {}
            });
        });
    }
});