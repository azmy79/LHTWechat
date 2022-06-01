var e = getApp();

Page({
    data: {
        OrderInfo: null,
        LogisticsData: null,
        SendGifts: [],
        OrderId: 0,
        Suppliers: null,
        orderStatus: 1,
        giftlist: [],
        bgshow: !1,
        templateList: [],
        appletTemplate: [],
        redshow: !1,
        HasShare: !1
    },
    onLoad: function(t) {
        var a = this;
        this.setData({
            OrderId: t.orderid
        }), e.getSiteSettingData(function(e) {
            a.setData(e);
        });
        var s = this;
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("Common.ashx?action=GetTemplateByAppletlist"),
                data: {
                    openId: t
                },
                success: function(e) {
                    "OK" == e.data.Status && s.setData({
                        templateList: e.data.Data
                    });
                }
            });
        });
    },
    onShow: function() {
        this.loadData();
    },
    loadData: function() {
        var t = this, a = t.data.OrderId;
        e.getOpenId(function(s) {
            wx.request({
                url: e.getUrl("UserOrder.ashx?action=GetOrderDetail"),
                data: {
                    openId: s,
                    orderId: a
                },
                success: function(e) {
                    if ("OK" == e.data.Status) {
                        t.data.giftlist = [], t.data.SendGifts = [];
                        var a = e.data.Data;
                        switch (a.PresaleStatus) {
                          case "1":
                            a.PresaleStatusTxt1 = "等待支付定金", a.PresaleStatusTxt2 = "未开始";
                            break;

                          case "2":
                            a.PresaleStatusTxt1 = "已付款", a.PresaleStatusTxt2 = "未开始";
                            break;

                          case "3":
                            a.PresaleStatusTxt1 = "已付款", a.PresaleStatusTxt2 = "等待支付尾款";
                            break;

                          case "4":
                            a.PresaleStatusTxt1 = "已付款", a.PresaleStatusTxt2 = "已付款";
                            break;

                          case "5":
                            a.PresaleStatusTxt1 = "已付款", a.PresaleStatusTxt2 = "未付款";
                            break;

                          case "6":
                            a.PresaleStatusTxt1 = "未付款", a.PresaleStatusTxt2 = "未付款";
                            break;

                          default:
                            a.PresaleStatusTxt1 = "", a.PresaleStatusTxt2 = "";
                        }
                        for (var s = "", r = 0; r < a.Gifts.length; r++) 0 == a.Gifts[r].PromoteType ? t.data.giftlist.push(a.Gifts[r]) : t.data.SendGifts.push(a.Gifts[r]);
                        "" != a.LogisticsData && "暂时没有此快递单号的信息" != a.LogisticsData && (s = JSON.parse(a.LogisticsData)), 
                        a.OrderTotal = parseFloat(a.OrderTotal), a.IsSendRedEnvelope && t.redenvelopes(), 
                        a.InputItems[0] && a.InputItems[0].forEach(function(e) {
                            6 === e.vtype && (e.value = e.value.split(","));
                        }), t.setData({
                            OrderInfo: a,
                            SendGifts: t.data.SendGifts,
                            LogisticsData: s,
                            Suppliers: a.Suppliers,
                            giftlist: t.data.giftlist,
                            orderStatus: a.Status,
                            loaded: !0
                        });
                    } else "NOUser" == e.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: e.data.Message,
                        showCancel: !1,
                        success: function(e) {
                            e.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                }
            });
        });
    },
    redenvelopes: function() {
        var t = this;
        e.getOpenId(function(a) {
            wx.request({
                url: e.getUrl("RedEnvelope.ashx?action=GetRedEnvelopeShareInfo"),
                data: {
                    openId: a,
                    OrderId: t.data.OrderId
                },
                success: function(e) {
                    "SUCCESS" == (e = e.data.Result).Status ? t.setData({
                        Title: e.Title,
                        ImageUrl: e.ImageUrl,
                        SendCode: e.SendCode,
                        HasShare: e.HasShare,
                        RedEnvelopeId: e.RedEnvelopeId,
                        bgshow: !e.HasShare,
                        redshow: !0
                    }) : t.setData({
                        bgshow: !1
                    });
                }
            });
        });
    },
    bghide: function() {
        this.setData({
            bgshow: !1
        });
    },
    goToProductDetail: function(t) {
        var a = t.currentTarget.dataset.productid, s = t.currentTarget.dataset.storeid;
        wx.request({
            url: e.getUrl("Product.ashx?action=GetProductActivity"),
            data: {
                productId: a,
                storeid: s
            },
            success: function(e) {
                e = e.data;
                var t = "../productdetail/productdetail?id=" + a + "&storeid=" + s + (1 === e.ActiveType ? "&activeid=" + e.ActiveId : "");
                6 == e.ActiveType && (t = "../fightdetail/fightdetail?activeid=" + e.ActiveId), 
                2 == e.ActiveType && (t = "../groupbuyproductdetails/groupbuyproductdetails?groupbuyid=" + e.ActiveId), 
                wx.navigateTo({
                    url: t
                });
            }
        });
    },
    orderPay: function(t) {
        var a = t.currentTarget.dataset.orderid, s = this.data.OrderInfo.FightGroupId;
        this.setAppletTemplate(this.data.OrderInfo.ModeName), s ? e.orderPay(a, s, "fightGroup", this.data.appletTemplate) : e.orderPay(a, 0, "orderdetail", this.data.appletTemplate);
    },
    orderFinish: function(t) {
        var a = t.currentTarget.dataset.orderid;
        wx.showModal({
            title: "提示",
            content: "您确定已经收到货物了吗？",
            showCancel: !0,
            success: function(t) {
                t.confirm && e.getOpenId(function(t) {
                    wx.request({
                        url: e.getUrl("UserOrder.ashx?action=FinishOrder"),
                        data: {
                            openId: t,
                            orderId: a
                        },
                        success: function(e) {
                            "OK" == e.data.Status ? wx.showModal({
                                title: "提示",
                                content: "确认收货成功！",
                                showCancel: !1,
                                success: function(e) {
                                    e.confirm && wx.navigateTo({
                                        url: "../orderlist/orderlist?status=0"
                                    });
                                }
                            }) : "NOUser" == e.data.Message ? wx.navigateTo({
                                url: "../login/login"
                            }) : wx.showModal({
                                title: "提示",
                                content: e.data.Message,
                                showCancel: !1,
                                success: function(e) {
                                    e.confirm && wx.navigateTo({
                                        url: "../orderlist/orderlist?status=0"
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    },
    refundgoods: function(e) {
        var t = e.currentTarget.dataset.id, a = e.currentTarget.dataset.skuid;
        21 == e.currentTarget.dataset.stauts && wx.navigateTo({
            url: "../refundsendgoods/refundsendgoods?id=" + t + "&&skuId=" + a
        });
    },
    previewImg: function(e) {
        wx.previewImage({
            urls: e.currentTarget.dataset.imgs,
            current: e.currentTarget.dataset.index
        });
    },
    showred: function() {
        this.setData({
            bgshow: !0
        });
    },
    gouserhome: function() {
        wx.switchTab({
            url: "../userhome/userhome"
        });
    },
    onShareAppMessage: function() {
        var t = this;
        return this.data.HasShare || e.getOpenId(function(a) {
            wx.request({
                url: e.getUrl("RedEnvelope.ashx?action=AddRedEnvelopeSendRecord"),
                data: {
                    openId: a,
                    SendCode: t.data.SendCode,
                    redEnvelopeId: t.data.RedEnvelopeId,
                    OrderId: t.data.OrderId
                },
                success: function(e) {}
            });
        }), {
            title: this.data.Title,
            imageUrl: this.data.ImageUrl,
            path: "/pages/redenvelopes/redenvelopes?OrderId=" + this.data.OrderId + "&SendCode=" + this.data.SendCode
        };
    },
    setAppletTemplate: function(e) {
        for (var t = this, a = [], s = 0; s < t.data.templateList.length; s++) {
            if (console.log("modeName:" + e + ";MessageType:" + t.data.templateList[s].MessageType), 
            "快递配送" == e && "OrderShipping" == t.data.templateList[s].MessageType) {
                a.push(t.data.templateList[s].TemplateId);
                break;
            }
            if ("上门自提" == e && "OrderConfirmTake" == t.data.templateList[s].MessageType) {
                a.push(t.data.templateList[s].TemplateId);
                break;
            }
            if ("门店配送" == e && "ShopOrderShipping" == t.data.templateList[s].MessageType) {
                a.push(t.data.templateList[s].TemplateId);
                break;
            }
        }
        t.setData({
            appletTemplate: a
        });
    }
});