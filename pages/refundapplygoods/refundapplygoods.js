var e = getApp(), t = {
    isSubmit: !1,
    submitBtnTextDefualt: "确定提交",
    submitBtnTextLoading: "提交中..."
};

Page({
    data: {
        OrderId: "",
        SkuId: "",
        Name: "",
        AfterSaleType: 0,
        AfterSaleTypeText: "请选择售后类型",
        RefundType: 0,
        RefundTypeText: "请选择退款方式",
        RefundReasonText: "请选择退货原因",
        Remark: "",
        BankName: "",
        BankAccountName: "",
        BankAccountNo: "",
        UserCredentials: [ "../../images/return-img_03.jpg", "../../images/return-img_03.jpg", "../../images/return-img_03.jpg" ],
        ReturnNum: 1,
        MostMoney: 0,
        ShowReason: !0,
        ShowType: !0,
        ShowAfterType: !0,
        ApplyReturnNum: 1,
        TotalMoney: 0,
        UploadGredentials: [],
        FormId: "",
        ReturnMoney: 0,
        ImageIndex: 0,
        ShowReasonList: [ "拍错/多拍/不想要", "缺货", "未按约定时间发货" ],
        ShowReasonIndex: -1,
        RefundTextList: [ "退到预付款", "退到银行卡", "原路返回", "到店退款" ],
        ShowRefundIndex: -1,
        AfterSaleTypeList: [ "退货退款", "仅退款" ],
        AfterSaleTypeId: -1,
        submitBtnText: t.submitBtnTextDefualt,
        OneReundAmount: 0,
        templateList: [],
        appletTemplate: []
    },
    onLoad: function(t) {
        var a = this, n = this, o = t.orderid, s = t.skuId, r = t.pro, i = t.num, u = t.m;
        n.setData({
            OrderId: o,
            SkuId: s,
            Name: r,
            ReturnNum: i,
            MostMoney: u,
            TotalMoney: u
        }), e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("OrderRefund.ashx?action=AfterSalePreCheck"),
                data: {
                    openId: t,
                    IsReturn: !0,
                    OrderId: o,
                    SkuId: s
                },
                success: function(e) {
                    n.GetCheckData(e);
                }
            }), wx.request({
                url: e.getUrl("Common.ashx?action=GetTemplateByAppletlist"),
                data: {
                    openId: t
                },
                success: function(e) {
                    "OK" == e.data.Status && (n.setData({
                        templateList: e.data.Data
                    }), console.log("that.data.templateList.length:" + n.data.templateList.length));
                }
            });
        }), e.getSiteSettingData(function(e) {
            a.setData(e);
        });
    },
    GetCheckData: function(e) {
        var t = e.data;
        if ("NOUser" == t.Message) wx.navigateTo({
            url: "../login/login"
        }); else if ("OK" == t.Status) {
            var a = [];
            t.CanBackReturn && a.push("原路返回"), t.CanToBalance && a.push("退到预付款"), t.CanReturnOnStore && a.push("到店退款"), 
            a.push("退到银行卡");
            var n = [ "退货退款", "仅退款" ];
            t.MaxRefundAmount <= 0 && (n = [ "退货退款" ]), this.setData({
                MostMoney: t.MaxRefundAmount,
                RefundTextList: a,
                TotalMoney: t.MaxRefundAmount,
                ReturnNum: t.MaxRefundQuantity,
                ApplyReturnNum: t.MaxRefundQuantity,
                OneReundAmount: t.oneReundAmount,
                AfterSaleTypeList: n,
                ShowReasonList: t.RefundReasons.slice(0, 6) || []
            });
        } else wx.showModal({
            title: "提示",
            content: t.Message,
            showCancel: !1,
            success: function(e) {
                e.confirm && wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    setAppletTemplate: function() {
        for (var e = this, t = [], a = 0; a < e.data.templateList.length; a++) if (console.log("MessageType:" + e.data.templateList[a].MessageType), 
        "OrderRefund" == e.data.templateList[a].MessageType) {
            t.push(e.data.templateList[a].TemplateId);
            break;
        }
        e.setData({
            appletTemplate: t
        });
    },
    GetMoney: function(e) {
        this.setData({
            ReturnMoney: e.detail.value.replace("￥", "")
        }), console.log("ReturnMoney:" + this.data.ReturnMoney);
    },
    GetBankName: function(e) {
        this.setData({
            BankName: e.detail.value
        }), console.log("BankName:" + this.data.BankName);
    },
    GetBankAccountNo: function(e) {
        this.setData({
            BankAccountNo: e.detail.value
        }), console.log("BankAccountNo:" + this.data.BankAccountNo);
    },
    GetBankAccountName: function(e) {
        this.setData({
            BankAccountName: e.detail.value
        }), console.log("BankAccountName:" + this.data.BankAccountName);
    },
    GetRemark: function(e) {
        this.setData({
            Remark: e.detail.value
        }), console.log("Remark:" + this.data.Remark);
    },
    uploadImg: function(e) {
        var t = this, a = t.data.UserCredentials, n = e.currentTarget.dataset.index;
        wx.chooseImage({
            count: 1,
            success: function(e) {
                a[n] = e.tempFilePaths[0];
                var o = parseInt(t.data.ImageIndex);
                o = o >= 2 ? 2 : o++, t.setData({
                    UserCredentials: a,
                    ImageIndex: o
                });
            }
        });
    },
    ShowAfterType: function(e) {
        var t = this;
        wx.showActionSheet({
            itemList: t.data.AfterSaleTypeList,
            success: function(e) {
                e.cancel || t.setData({
                    AfterSaleTypeId: e.tapIndex
                });
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    ShowResaon: function(e) {
        var t = this;
        wx.showActionSheet({
            itemList: t.data.ShowReasonList,
            success: function(e) {
                t.setData({
                    ShowReasonIndex: e.tapIndex
                });
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    ShowRefundType: function(e) {
        var t = this;
        wx.showActionSheet({
            itemList: t.data.RefundTextList,
            success: function(e) {
                if (!e.cancel) {
                    var a = t.data.RefundTextList[e.tapIndex], n = t.GetRefundTypeId(a);
                    t.setData({
                        ShowRefundIndex: e.tapIndex,
                        RefundTypeText: a,
                        RefundType: n
                    });
                }
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    ChooseReason: function(e) {
        var t = this, a = e.currentTarget.dataset.name;
        t.setData({
            RefundReasonText: a,
            ShowType: !0,
            ShowReason: !0,
            ShowAfterType: !0
        });
    },
    GetRefundTypeId: function(e) {
        return "退到预付款" == e ? 1 : "退到银行卡" == e ? 2 : "原路返回" == e ? 3 : 4;
    },
    GetAfterSaleTypeId: function(e) {
        return "退货退款" == e ? 1 : "仅退款" == e ? 3 : 1;
    },
    ChooseAfterType: function(e) {
        var t = e.currentTarget.dataset.id, a = this, n = a.ShowAfterTypeName[t];
        a.setData({
            AfterSaleType: t,
            AfterSaleTypeText: n,
            ShowType: !0,
            ShowReason: !0,
            ShowAfterType: !0
        });
    },
    MuseNum: function(t) {
        var a = this, n = a.data.ApplyReturnNum;
        if (n <= 1) wx.showModal({
            title: "提示",
            content: "最少退1件商品",
            showCancel: !1,
            confirmColor: a.data.PrimaryColor
        }); else {
            n -= 1;
            var o = e.multiply(n, a.data.OneReundAmount);
            a.setData({
                ApplyReturnNum: n,
                TotalMoney: o
            });
        }
    },
    AddNum: function(t) {
        var a = this, n = parseInt(a.data.ApplyReturnNum), o = parseInt(a.data.ReturnNum);
        if (n >= o) wx.showModal({
            title: "提示",
            content: "最多退" + o + "件商品",
            showCancel: !1,
            confirmColor: a.data.PrimaryColor
        }); else {
            n += 1;
            var s = e.multiply(o, a.data.OneReundAmount);
            n == o && (s = this.data.MostMoney), a.setData({
                ApplyReturnNum: n,
                TotalMoney: s
            });
        }
    },
    formSubmit: function(e) {
        if (t.isSubmit) return !1;
        var a = this, n = parseInt(a.data.ShowReasonIndex), o = a.data.AfterSaleTypeList[a.data.AfterSaleTypeId], s = a.GetAfterSaleTypeId(o), r = a.ToTrim(a.data.BankName), i = a.ToTrim(a.data.BankAccountName), u = a.ToTrim(a.data.BankAccountNo), l = parseFloat(a.data.ReturnMoney), d = a.ToTrim(a.data.Remark);
        0 == l && (l = a.data.TotalMoney);
        var c = parseInt(a.data.ApplyReturnNum);
        if (c <= 0 || c > a.data.ReturnNum) wx.showModal({
            title: "提示",
            content: "请输入正确的退货数量",
            showCancel: !1,
            confirmColor: a.data.PrimaryColor
        }); else if (l > a.data.OneReundAmount * c) wx.showModal({
            title: "提示",
            content: "请输入正确的退款金额,金额必须小于等于" + a.data.OneReundAmount * c + "元",
            showCancel: !1,
            confirmColor: a.data.PrimaryColor
        }); else {
            var f = a.data.RefundType;
            if (2 == f && (r.length <= 0 || i.length <= 0 || u.length <= 0)) wx.showModal({
                title: "提示",
                content: "银行卡信息不允许为空！",
                showCancel: !1,
                confirmColor: a.data.PrimaryColor
            }); else if (f <= 0) wx.showModal({
                title: "提示",
                content: "请选择要退款的方式",
                showCancel: !1,
                confirmColor: a.data.PrimaryColor
            }); else if (n < 0) wx.showModal({
                title: "提示",
                content: "请选择要退款的原因",
                showCancel: !1,
                confirmColor: a.data.PrimaryColor
            }); else if (s < 0) wx.showModal({
                title: "提示",
                content: "请选择售后类型",
                showCancel: !1,
                confirmColor: a.data.PrimaryColor
            }); else if (a.data.OrderId.length <= 0) wx.showModal({
                title: "提示",
                content: "请选择要退款的订单",
                showCancel: !1,
                confirmColor: a.data.PrimaryColor
            }); else {
                a.setData({
                    formId: "",
                    AfterSaleTypeId: s,
                    Remark: d,
                    BankName: r,
                    BankAccountName: i,
                    BankAccountNo: u,
                    ApplyReturnNum: c,
                    ReturnMoney: l,
                    UploadGredentials: []
                });
                var m = [];
                a.data.UserCredentials.find(function(e, t) {
                    "../../images/return-img_03.jpg" != e && m.push(e);
                }), a.UploadBatchImages(a, m);
            }
        }
    },
    UploadBatchImages: function(t, a) {
        var n = a.shift();
        void 0 != n ? e.getOpenId(function(o) {
            wx.uploadFile({
                url: e.getUrl("Common.ashx?action=UploadAppletImage"),
                filePath: n,
                name: "file",
                formData: {
                    openId: o
                },
                success: function(e) {
                    var a = JSON.parse(e.data);
                    if ("OK" == a.Status) {
                        var n = t.data.UploadGredentials;
                        n.push(a.Data[0].ImageUrl), t.setData({
                            UploadGredentials: n
                        });
                    } else "NOUser" == a.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: a.ErrorResponse.ErrorMsg,
                        showCancel: !1,
                        confirmColor: t.data.PrimaryColor,
                        success: function(e) {
                            e.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {
                    a.length > 0 ? t.UploadBatchImages(t, a) : t.AddReturnInfo();
                }
            });
        }) : t.AddReturnInfo();
    },
    AddReturnInfo: function() {
        var a = this;
        t.isSubmit = !0, a.setData({
            submitBtnText: t.submitBtnTextLoading
        }), e.getOpenId(function(n) {
            wx.request({
                url: e.getUrl("OrderRefund.ashx?action=ApplyReturn"),
                data: {
                    openId: n,
                    skuId: a.data.SkuId,
                    orderId: a.data.OrderId,
                    Quantity: a.data.ApplyReturnNum,
                    RefundAmount: a.data.ReturnMoney,
                    afterSaleType: a.data.AfterSaleTypeId,
                    RefundType: a.data.RefundType,
                    RefundReason: a.data.ShowReasonList[a.data.ShowReasonIndex],
                    Remark: a.data.Remark,
                    BankName: a.data.BankName,
                    BankAccountName: a.data.BankAccountName,
                    BankAccountNo: a.data.BankAccountNo,
                    UserCredentials: a.data.UploadGredentials.join(","),
                    formId: a.data.formId
                },
                success: function(t) {
                    "OK" == t.data.Status ? (a.setAppletTemplate(), console.log("提交：that.data.appletTemplate:" + a.data.appletTemplate + ";orderId:" + a.data.OrderId), 
                    wx.requestSubscribeMessage({
                        tmplIds: a.data.appletTemplate,
                        success: function(t) {
                            if ("requestSubscribeMessage:ok" == t.errMsg) {
                                var o = Object.keys(t).filter(function(e) {
                                    return "accept" === t[e];
                                });
                                if (o.length > 0) {
                                    var s = o[0];
                                    wx.request({
                                        url: e.getUrl("Common.ashx?action=GetAuthorizedSubscribeMessage"),
                                        data: {
                                            templateIds: s,
                                            orderId: a.data.OrderId,
                                            openId: n
                                        },
                                        success: function(e) {}
                                    });
                                }
                            }
                        },
                        fail: function(e) {
                            20004 === e.errCode && wx.showModal({
                                title: "提示",
                                content: "建议开启订阅消息，接收商城发送的消息通知",
                                cancelText: "取消",
                                confirmText: "去开启",
                                showCancel: !0,
                                success: function(e) {
                                    wx.openSetting({});
                                }
                            });
                        },
                        complete: function(e) {
                            wx.showModal({
                                title: "提示",
                                confirmColor: a.data.PrimaryColor,
                                content: t.data.Message,
                                showCancel: !1,
                                success: function(e) {
                                    wx.redirectTo({
                                        url: "../refundlist/refundlist"
                                    });
                                }
                            });
                        }
                    })) : "NOUser" == t.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        confirmColor: a.data.PrimaryColor,
                        content: t.data.Message,
                        showCancel: !1,
                        success: function(e) {
                            e.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {
                    a.setData({
                        submitBtnText: t.submitBtnTextDefualt
                    }), t.isSubmit = !1;
                }
            });
        });
    },
    ToTrim: function(e) {
        return e.replace(/(^\s*)|(\s*$)/g, "");
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});