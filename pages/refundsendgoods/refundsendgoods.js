function e(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

var t, a = getApp();

Page((t = {
    data: {
        ApplySendGood: null,
        ProductName: "",
        formId: "",
        express: "请选择物流公司",
        shipOrderNumber: "",
        IsShowExpress: !0,
        ExpressList: [],
        index: 0,
        id: "",
        skuId: "",
        hideNumber: !1
    },
    onLoad: function(e) {
        var t = this, o = this;
        o.setData({
            id: e.id,
            skuId: e.skuId
        }), o.loadData(), a.getSiteSettingData(function(e) {
            t.setData(e);
        });
    },
    onShow: function() {
        this.loadData();
    },
    loadData: function() {
        var e = this;
        a.getOpenId(function(t) {
            wx.request({
                url: a.getUrl("OrderRefund.ashx?action=GetReturnDetail"),
                data: {
                    openId: t,
                    returnId: e.data.id
                },
                success: function(t) {
                    if ("OK" == t.data.Status) {
                        var a = t.data.Data;
                        e.setData({
                            ApplySendGood: a
                        });
                    } else "NOUser" == t.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: t.data.Message,
                        showCancel: !1,
                        confirmColor: e.data.PrimaryColor,
                        success: function(e) {
                            e.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {
                    e.LoadExpress();
                }
            });
        });
    },
    bindPickerChange: function(e) {
        var t = this, a = e.detail.value, o = t.data.ExpressList;
        t.setData({
            express: o[a],
            hideNumber: "送货到店" == o[a]
        });
    },
    ShowExpress: function(e) {
        var t = this;
        t.data.ExpressList.length > 0 ? t.setData({
            IsShowExpress: !1
        }) : wx.showModal({
            title: "提示",
            content: "物流公司加载失败",
            showCancel: !1,
            confirmColor: t.data.PrimaryColor
        });
    },
    LoadExpress: function() {
        var e = this;
        wx.request({
            url: a.getUrl("OrderRefund.ashx?action=GetExpressList"),
            success: function(t) {
                if ("OK" == t.data.Status) {
                    var a = new Array();
                    e.data.ApplySendGood.StoreId > 0 && a.push("送货到店"), t.data.Data.find(function(e, t) {
                        void 0 != e.ExpressName && a.push(e.ExpressName);
                    }), e.setData({
                        ExpressList: a
                    });
                }
            }
        });
    },
    formSubmit: function(e) {
        var t = this, o = e.detail.formId;
        if ("请选择物流公司" != t.data.express) {
            var n = t.ToTrim(e.detail.value.txtshipOrderNumber);
            "送货到店" != t.data.express && (null == n || "undefined" == n || n.length <= 0) ? wx.showModal({
                title: "提示",
                content: "快递单号不允许为空",
                showCancel: !1,
                confirmColor: t.data.PrimaryColor
            }) : a.getOpenId(function(e) {
                wx.request({
                    url: a.getUrl("OrderRefund.ashx?action=ReturnSendGoods"),
                    data: {
                        openId: e,
                        skuId: t.data.ApplySendGood.SkuId,
                        orderId: t.data.ApplySendGood.OrderId,
                        ReturnsId: t.data.ApplySendGood.ReturnId,
                        express: t.data.express,
                        shipOrderNumber: n,
                        formId: o
                    },
                    success: function(e) {
                        "OK" == e.data.Status ? wx.showModal({
                            title: "提示",
                            content: e.data.Message,
                            showCancel: !1,
                            confirmColor: t.data.PrimaryColor,
                            success: function(e) {
                                e.confirm && wx.navigateBack({
                                    delta: 1
                                });
                            }
                        }) : "NOUser" == e.data.Message ? wx.navigateTo({
                            url: "../login/login"
                        }) : wx.showModal({
                            title: "提示",
                            content: e.data.ErrorResponse.ErrorMsg,
                            showCancel: !1,
                            confirmColor: t.data.PrimaryColor,
                            success: function(e) {
                                e.confirm && wx.navigateBack({
                                    delta: 1
                                });
                            }
                        });
                    },
                    complete: function() {}
                });
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择物流公司",
            showCancel: !1,
            confirmColor: t.data.PrimaryColor
        });
    },
    ToTrim: function(e) {
        return e.replace(/(^\s*)|(\s*$)/g, "");
    },
    onReady: function() {}
}, e(t, "onShow", function() {}), e(t, "onHide", function() {}), e(t, "onUnload", function() {}), 
e(t, "onPullDownRefresh", function() {}), e(t, "onReachBottom", function() {}), 
e(t, "onShareAppMessage", function() {}), t));