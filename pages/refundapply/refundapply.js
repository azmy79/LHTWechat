var e = getApp(), t = {
    isSubmit: !1,
    submitBtnTextDefualt: "确定提交",
    submitBtnTextLoading: "提交中..."
};

Page({
    data: {
        OrderId: "",
        SkuId: "",
        RefundType: 0,
        RefundTypeText: "请选择退款方式",
        RefundMoney: 0,
        RefundReason: 0,
        RefundReasonText: "请选择退款原因",
        Remark: "",
        BankName: "",
        BankAccountName: "",
        BankAccountNo: "",
        ShowReason: !0,
        ShowType: !0,
        ShowReasonList: [ "拍错/多拍/不想要", "缺货", "未按约定时间发货" ],
        ShowReasonIndex: -1,
        RefundTextList: [ "退到预付款", "退到银行卡", "原路返回", "到店退款" ],
        submitBtnText: t.submitBtnTextDefualt,
        ShowRefundIndex: -1,
        templateList: [],
        appletTemplate: []
    },
    onLoad: function(t) {
        var a = this, n = t.orderid;
        t.m;
        a.setData({
            OrderId: n
        }), e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("OrderRefund.ashx?action=AfterSalePreCheck"),
                data: {
                    openId: t,
                    IsReturn: !1,
                    OrderId: n,
                    SkuId: ""
                },
                success: function(e) {
                    a.GetCheckData(e);
                }
            }), wx.request({
                url: e.getUrl("Common.ashx?action=GetTemplateByAppletlist"),
                data: {
                    openId: t
                },
                success: function(e) {
                    "OK" == e.data.Status && (a.setData({
                        templateList: e.data.Data
                    }), console.log("that.data.templateList.length:" + a.data.templateList.length));
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
            var n = [];
            t.VerificationPasswords && t.VerificationPasswords.forEach(function(e) {
                n.push({
                    value: e,
                    checked: !0
                });
            }), t.VerificationPasswords = n;
            var o = t.VerificationPasswords.length, s = o ? 1e3 * t.oneReundAmount * o / 1e3 : t.MaxRefundAmount;
            this.setData({
                RefundMoney: s,
                RefundTextList: a,
                VerificationPasswords: t.VerificationPasswords,
                TotalMoney: s,
                ReturnNum: o,
                ApplyReturnNum: o,
                ShowReasonList: t.RefundReasons.slice(0, 6) || [],
                oneReundAmount: t.oneReundAmount
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
    changeSelect: function(e) {
        var t = e.currentTarget.dataset.index, a = this.data.VerificationPasswords, n = a[t], o = 0;
        n.checked = !n.checked, a.forEach(function(e) {
            e.checked && (o += 1);
        });
        var s = 1e3 * this.data.oneReundAmount * o / 1e3;
        o >= this.data.ReturnNum && (s = this.data.TotalMoney), this.setData({
            VerificationPasswords: a,
            RefundMoney: s,
            ApplyReturnNum: o
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
    InputText: function(e) {
        var t = this, a = e.currentTarget.dataset.names, n = e.detail.value;
        switch (a) {
          case "BankName":
            t.setData({
                BankName: n
            });
            break;

          case "BankAccountName":
            t.setData({
                BankAccountName: n
            });
            break;

          case "BankAccountNo":
            t.setData({
                BankAccountNo: n
            });
            break;

          default:
            t.setData({
                Remark: n
            });
        }
    },
    ShowReason: function(e) {
        var t = this;
        wx.showActionSheet({
            itemList: t.data.ShowReasonList,
            success: function(e) {
                t.setData({
                    ShowReasonIndex: e.tapIndex
                });
            },
            fail: function(e) {}
        });
    },
    ShowType: function(e) {
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
            fail: function(e) {}
        });
    },
    ChooseReason: function(e) {
        var t = this, a = e.currentTarget.dataset.name;
        t.setData({
            RefundReasonText: a,
            ShowType: !0,
            ShowReason: !0
        });
    },
    ChooseType: function(e) {
        var t = this, a = t.RefundTextList[e.currentTarget.dataset.id], n = GetRefundTypeId(a);
        t.setData({
            RefundType: n,
            RefundTypeText: a,
            ShowType: !0,
            ShowReason: !0
        });
    },
    GetRefundTypeId: function(e) {
        return "退到预付款" == e ? 1 : "退到银行卡" == e ? 2 : "原路返回" == e ? 3 : 4;
    },
    formSubmit: function(a) {
        if (t.isSubmit) return !1;
        var n = [];
        this.data.VerificationPasswords.length && (this.data.ApplyReturnNum ? this.data.VerificationPasswords.forEach(function(e) {
            e.checked && n.push(e.value);
        }) : wx.showToast({
            title: "请至少选择一个密码",
            icon: "none"
        }));
        var o = this, s = parseInt(o.data.ShowReasonIndex), i = o.ToTrim(o.data.BankName), c = o.ToTrim(o.data.BankAccountName), u = o.ToTrim(o.data.BankAccountNo), r = o.data.RefundType;
        2 == r && (i.length <= 0 || c.length <= 0 || u.length <= 0) ? wx.showModal({
            title: "提示",
            content: "银行卡信息不允许为空！",
            showCancel: !1,
            confirmColor: o.data.PrimaryColor
        }) : r ? s < 0 ? wx.showModal({
            title: "提示",
            content: "请选择要退款的原因",
            showCancel: !1,
            confirmColor: o.data.PrimaryColor
        }) : o.data.OrderId.length <= 0 ? wx.showModal({
            title: "提示",
            content: "请选择要退款的订单",
            showCancel: !1,
            confirmColor: o.data.PrimaryColor
        }) : (t.isSubmit = !0, o.setData({
            submitBtnText: t.submitBtnTextLoading
        }), e.getOpenId(function(a) {
            wx.request({
                url: e.getUrl("OrderRefund.ashx?action=ApplyRefund"),
                data: {
                    openId: a,
                    skuId: o.data.SkuId,
                    orderId: o.data.OrderId,
                    RefundType: r,
                    RefundReason: o.data.ShowReasonList[s],
                    Remark: o.data.Remark,
                    BankName: i,
                    BankAccountName: c,
                    BankAccountNo: u,
                    FormId: "",
                    VailidCodes: n.join(",")
                },
                success: function(t) {
                    "OK" == t.data.Status ? (o.setAppletTemplate(), console.log("提交：that.data.appletTemplate:" + o.data.appletTemplate + ";orderId:" + o.data.OrderId), 
                    wx.requestSubscribeMessage({
                        tmplIds: o.data.appletTemplate,
                        success: function(t) {
                            if ("requestSubscribeMessage:ok" == t.errMsg) {
                                var n = Object.keys(t).filter(function(e) {
                                    return "accept" === t[e];
                                });
                                if (n.length > 0) {
                                    var s = n[0];
                                    wx.request({
                                        url: e.getUrl("Common.ashx?action=GetAuthorizedSubscribeMessage"),
                                        data: {
                                            templateIds: s,
                                            orderId: o.data.OrderId,
                                            openId: a
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
                                content: t.data.Message,
                                showCancel: !1,
                                confirmColor: o.data.PrimaryColor,
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
                        content: t.data.Message,
                        showCancel: !1,
                        confirmColor: o.data.PrimaryColor,
                        success: function(e) {
                            e.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {
                    o.setData({
                        submitBtnText: t.submitBtnTextDefualt
                    }), t.isSubmit = !1;
                }
            });
        })) : wx.showModal({
            title: "提示",
            content: "请选择要退款的方式",
            showCancel: !1,
            confirmColor: o.data.PrimaryColor
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