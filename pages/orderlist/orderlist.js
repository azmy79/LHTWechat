var e = getApp();

Page({
    data: {
        isEmpty: !0,
        isEnd: !1,
        Status: 0,
        OrderList: null,
        AllActive: "active",
        WaitPayActive: "",
        WaitSendActive: "",
        WaitReceiveActive: "",
        WaitReviewActive: "",
        PageIndex: 1,
        PageSize: 10,
        orderid: "",
        HasShare: !0,
        bgshow: !1,
        nullOrder: e.getRequestUrl + "/Templates/xcxshop/images/nullOrder.png",
        templateList: [],
        appletTemplate: []
    },
    onLoad: function(t) {
        var a = this, r = t.status;
        "" != t.status && void 0 != t.status || (r = 0);
        var d = this;
        d.setData({
            Status: r
        }), e.getSiteSettingData(function(e) {
            a.setData(e);
        }), e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("Common.ashx?action=GetTemplateByAppletlist"),
                data: {
                    openId: t
                },
                success: function(e) {
                    "OK" == e.data.Status && (d.setData({
                        templateList: e.data.Data
                    }), console.log("that.data.templateList.length:" + d.data.templateList.length));
                }
            });
        });
    },
    onReady: function() {},
    onShow: function() {
        var e = this;
        e.setData({
            PageIndex: 1,
            OrderList: []
        }), e.loadData(e.data.Status, e, !1);
    },
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {
        if (!this.data.isEnd) {
            var e = this, t = e.data.PageIndex + 1;
            e.setData({
                PageIndex: t
            }), e.loadData(e.data.Status, e, !0);
        }
    },
    closeOrder: function(t) {
        var a = this, r = t.target.dataset.orderid;
        wx.showModal({
            title: "提示",
            content: "确定要取消订单吗？",
            success: function(t) {
                t.confirm && e.getOpenId(function(t) {
                    wx.request({
                        url: e.getUrl("UserOrder.ashx?action=CloseOrder"),
                        data: {
                            openId: t,
                            orderId: r
                        },
                        success: function(e) {
                            "OK" == e.data.Status ? wx.showModal({
                                title: "提示",
                                content: e.data.Message,
                                showCancel: !1,
                                success: function(e) {
                                    e.confirm && wx.navigateTo({
                                        url: "../orderlist/orderlist?status=" + a.data.Status
                                    });
                                }
                            }) : "NOUser" == e.data.Message ? wx.navigateTo({
                                url: "../login/login"
                            }) : wx.showModal({
                                title: "提示",
                                content: e.data.Message,
                                showCancel: !1
                            });
                        }
                    });
                });
            }
        });
    },
    orderPay: function(t) {
        var a = this, r = t.currentTarget.dataset.orderid, d = parseInt(t.currentTarget.dataset.groupid || 0);
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("UserOrder.ashx?action=GetOrderDetail"),
                data: {
                    openId: t,
                    orderId: r
                },
                success: function(t) {
                    if ("OK" == t.data.Status) {
                        var s = t.data.Data;
                        a.setAppletTemplate(s.ModeName), d ? e.orderPay(r, d, "fightGroup", a.data.appletTemplate) : e.orderPay(r, a.data.Status, "orderlist", a.data.appletTemplate);
                    }
                }
            });
        });
    },
    orderFinish: function(t) {
        var a = this, r = t.currentTarget.dataset.orderid;
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
                            orderId: r
                        },
                        success: function(e) {
                            "OK" == e.data.Status ? wx.showModal({
                                title: "提示",
                                content: "确认收货成功！",
                                showCancel: !1,
                                success: function(e) {
                                    e.confirm && wx.navigateTo({
                                        url: "../orderlist/orderlist?status=" + a.data.Status
                                    });
                                }
                            }) : "NOUser" == e.data.Message ? wx.navigateTo({
                                url: "../login/login"
                            }) : wx.showModal({
                                title: "提示",
                                content: e.data.Message,
                                showCancel: !1
                            });
                        }
                    });
                });
            }
        });
    },
    viewCode: function(t) {
        var a = t.currentTarget.dataset.orderid;
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("UserOrder.ashx?action=GetOrderVerificationCode"),
                data: {
                    openId: t,
                    orderId: a
                },
                success: function(e) {
                    void 0 == e.error_response ? wx.navigateTo({
                        url: "../ordercode/ordercode?orderid=" + a
                    }) : hishop.showModal("提示", "请登录", function() {
                        wx.navigateTo({
                            url: "../login/login"
                        });
                    });
                }
            });
        });
    },
    gotored: function(t) {
        var a = this, r = t.currentTarget.dataset.orderid;
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("RedEnvelope.ashx?action=GetRedEnvelopeShareInfo"),
                data: {
                    openid: t,
                    OrderId: r
                },
                success: function(e) {
                    "SUCCESS" == (e = e.data.Result).Status ? a.setData({
                        Title: e.Title,
                        ImageUrl: e.ImageUrl,
                        SendCode: e.SendCode,
                        RedEnvelopeId: e.RedEnvelopeId,
                        bgshow: !0,
                        redshow: !0,
                        HasShare: e.HasShare,
                        orderid: r
                    }) : a.setData({
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
    showred: function() {
        this.setData({
            bgshow: !0
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
                    OrderId: t.data.orderid
                },
                success: function(e) {}
            });
        }), {
            title: this.data.Title,
            imageUrl: this.data.ImageUrl,
            path: "/pages/redenvelopes/redenvelopes?OrderId=" + this.data.orderid + "&SendCode=" + this.data.SendCode
        };
    },
    viewTakeCode: function(e) {
        wx.navigateTo({
            url: "../orderqrcode/orderqrcode?url=" + e.target.dataset.takecode
        });
    },
    toproduct: function(e) {
        wx.switchTab({
            url: "../productcategory/productcategory"
        });
    },
    onTabClick: function(e) {
        var t = this, a = e.currentTarget.dataset.status;
        t.setData({
            Status: a,
            PageIndex: 1,
            isEnd: !1
        }), t.loadData(a, t, !1);
    },
    showLogistics: function(t) {
        var a = t.currentTarget.dataset.orderid;
        t.currentTarget.dataset.isshowdadalogistics ? wx.navigateTo({
            url: "../outurl/outurl?url=" + encodeURIComponent(e.getRequestUrl + "/AppDepot/OrderLogistics?orderid=" + a)
        }) : wx.navigateTo({
            url: "../orderlogistics/orderlogistics?orderid=" + a
        });
    },
    showReview: function(e) {
        var t = e.currentTarget.dataset.orderid;
        wx.navigateTo({
            url: "../comment/comment?id=" + t
        });
    },
    goToOrderDetail: function(e) {
        var t = e.currentTarget.dataset.orderid;
        wx.navigateTo({
            url: "../orderdetail/orderdetail?orderid=" + t
        });
    },
    RefundOrder: function(e) {
        var t = e.currentTarget.dataset.orderid, a = e.currentTarget.dataset.money;
        wx.navigateTo({
            url: "../refundapply/refundapply?orderid=" + t + "&&m=" + a
        });
    },
    ReturnsOrder: function(e) {
        var t = e.currentTarget.dataset.orderid, a = e.currentTarget.dataset.skuId, r = e.currentTarget.dataset.skuname, d = e.currentTarget.dataset.num, s = e.currentTarget.dataset.money;
        wx.navigateTo({
            url: "../refundapplygoods/refundapplygoods?orderid=" + t + "&&skuId=" + a + "&&pro=" + r + "&&num=" + d + "&&m=" + s
        });
    },
    loadData: function(t, a, r) {
        wx.showLoading({
            title: "加载中"
        }), e.getOpenId(function(d) {
            wx.request({
                url: e.getUrl("UserOrder.ashx?action=OrderList"),
                data: {
                    openId: d,
                    status: t,
                    pageIndex: a.data.PageIndex,
                    pageSize: a.data.PageSize
                },
                success: function(e) {
                    if ("OK" == e.data.Status) {
                        var t = e.data.Data;
                        if (t.length < 10 && a.setData({
                            isEnd: !0
                        }), r) {
                            var d = a.data.OrderList;
                            d.push.apply(d, t), a.setData({
                                OrderList: d
                            });
                        } else {
                            var s = t.length > 0;
                            a.setData({
                                OrderList: t,
                                isEmpty: s
                            });
                        }
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
                    var o = [];
                    a.data.OrderList.forEach(function(e) {
                        e.Gifts && o.push(e.Gifts);
                    });
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        });
    },
    setAppletTemplate: function(e) {
        for (var t = this, a = [], r = 0; r < t.data.templateList.length; r++) {
            if (console.log("modeName:" + e + ";MessageType:" + t.data.templateList[r].MessageType), 
            "快递配送" == e && "OrderShipping" == t.data.templateList[r].MessageType) {
                a.push(t.data.templateList[r].TemplateId);
                break;
            }
            if ("上门自提" == e && "OrderConfirmTake" == t.data.templateList[r].MessageType) {
                a.push(t.data.templateList[r].TemplateId);
                break;
            }
            if ("门店配送" == e && "ShopOrderShipping" == t.data.templateList[r].MessageType) {
                a.push(t.data.templateList[r].TemplateId);
                break;
            }
        }
        t.setData({
            appletTemplate: a
        });
    }
});