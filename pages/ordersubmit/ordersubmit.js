var e = require("../../utils/config.js"), t = getApp(), a = null, i = new Array(), o = new Array(), n = new Array(), s = new Array(), r = 0, d = 0, c = 0, u = 0, p = [], l = [];

Page({
    data: {
        OrderInfo: null,
        ProductSku: "",
        currentPage: "page1",
        BuyAmount: 0,
        FromPage: "",
        CountdownId: "",
        ShipAddressId: "",
        ShippingAddressInfo: null,
        ProductInfo: null,
        ProductAmount: 0,
        OrderFreight: 0,
        DefaultCouponCode: "",
        DefaultCouponPrice: 0,
        CouponList: null,
        PickerArray: [],
        FullDiscount: 0,
        FullFreeFreight: !1,
        SelectedCouponIndex: 0,
        MaxUsePoint: 0,
        MaxPointDiscount: 0,
        MyPoints: 0,
        ShoppingDeduction: 0,
        CanPointUseWithCoupon: !1,
        PointDeductionRate: 0,
        DeductionPoints: 0,
        PointsDiscount: 0,
        UseBalance: !1,
        confirmPwd: !1,
        pwd: "",
        againPwd: "",
        passwordHide: !0,
        Remark: "",
        couponShow: "none",
        backShow: "none",
        pointDiscountShow: !1,
        OrderTotalPrice: 0,
        getRequestUrl: t.getRequestUrl,
        icon_right: t.getRequestUrl + "/Templates/xcxshop/images/arrow_right.png",
        Suppliers: null,
        InvoiceCheck: t.getRequestUrl + "/Templates/xcxshop/images/checkbox.png",
        InvoiceChecked: t.getRequestUrl + "/Templates/xcxshop/images/checked.png",
        taxBg: t.getRequestUrl + "/Templates/xcxshop/images/tax-bg.png",
        ShippType: 0,
        NeedInvoice: "",
        InvoiceId: 0,
        InvoiceType: 0,
        IsOpenInvoice: !1,
        TaxRate: 0,
        InvoiceEnty: null,
        isEnable: !1,
        SupplierId: 0,
        FullRegionName: "请填写所在地区",
        provinceName: [],
        provinceCode: [],
        provinceSelIndex: "",
        cityName: [],
        cityCode: [],
        citySelIndex: "",
        districtName: [],
        districtCode: [],
        districtSelIndex: "",
        streetName: [],
        streetCode: [],
        streetSelIndex: "",
        showMessage: !1,
        messageContent: "",
        showDistpicker: !1,
        isCss: !0,
        giftlist: [],
        sendgift: [],
        paymentType: 0,
        showStore: !1,
        storeSelect: null,
        selfStoreid: 0,
        selstorename: "",
        selstoreopentime: "",
        Deliverytime: "任意时间",
        Deliverytimetype: 0,
        supportstore: !0,
        isSupplier: !1,
        presaleId: 0,
        templateList: [],
        appletTemplate: [],
        RecordId: 0,
        giftId: 0,
        roomId: 0
    },
    onLoad: function(a) {
        var i = this;
        a.recordid && this.setData({
            RecordId: a.recordid,
            FromPage: "prize"
        });
        var o = a.roomId || 0;
        this.setData({
            roomId: o
        }), this.setAreaData();
        var n = this, s = a.productsku || "", r = a.buyamount || "", d = a.frompage || "", c = parseInt(a.countdownid || 0), u = a.shipaddressid || 0, p = parseInt(a.storeid || 0), l = parseInt(a.productType || 0), h = parseInt(a.fightGroupActivityId || 0), I = parseInt(a.fightGroupId || 0), g = parseInt(a.presaleId || ""), f = parseInt(a.giftId || 0), v = parseInt(a.combinaid || 0), m = parseInt(a.GroupBuyId || 0);
        a.GroupBuyId && this.setData({
            GroupBuyId: m,
            FromPage: "groupbuy"
        }), n.data.RecordId ? (t.getOpenId(function(e) {
            wx.request({
                url: t.getUrl("ShippingAddress.ashx?action=GetShippingAddressById"),
                data: {
                    openId: e,
                    shipaddressid: u
                },
                success: function(e) {
                    n.setData({
                        ShippingAddressInfo: e.data.Data.ShippingAddressInfo
                    });
                }
            });
        }), t.getOpenId(function(a) {
            wx.request({
                url: t.getUrl("PointMall.ashx?action=GetGiftInfo"),
                data: {
                    openId: a,
                    giftId: f
                },
                success: function(a) {
                    if (void 0 == a.data.error_response) {
                        var i = a.data;
                        void 0 == a.data.error_response ? "OK" == a.data.Status && n.setData({
                            giftimg: t.getRequestUrl + i.ImageUrl,
                            giftname: i.Name,
                            MarketPrice: i.MarketPrice,
                            NeedPoint: i.NeedPoint,
                            canusepoint: t.globalData.userInfo.points,
                            BuyAmount: 1,
                            giftId: f
                        }) : hishop.showTip(a.data.error_response.sub_msg);
                    } else e.showTip(a.data.error_response.sub_msg);
                }
            });
        })) : t.getOpenId(function(e) {
            wx.request({
                url: t.getUrl("Order.ashx?action=GetShoppingCart"),
                data: {
                    openid: e,
                    productsku: s,
                    frompage: d,
                    countdownid: c,
                    buyamount: r,
                    shipaddressid: u,
                    storeId: p,
                    fightGroupActivityId: h,
                    fightGroupId: I,
                    presaleId: g,
                    combinaid: v,
                    GroupBuyId: m
                },
                success: function(e) {
                    if ("OK" == e.data.Status) {
                        var i = e.data.Data, o = [];
                        if (i.CouponList) for (w = 0; w < i.CouponList.length; w++) o[w] = i.CouponList[w].CouponName + " " + i.CouponList[w].Price;
                        if (i.Suppliers) for (var u = 0; u < i.Suppliers.length; u++) i.Suppliers[u].SupplierId && n.setData({
                            isSupplier: !0
                        });
                        var g = null;
                        null == (g = i.EnableTax ? n.FindInvoiceByType(0, i.InvoiceList) : i.EnableE_Invoice ? n.FindInvoiceByType(2, i.InvoiceList) : n.FindInvoiceByType(4, i.InvoiceList)) && (g = {
                            BankAccount: "",
                            Id: 0,
                            InvoiceTaxpayerNumber: "",
                            InvoiceTitle: "个人",
                            InvoiceType: 0,
                            OpenBank: ""
                        });
                        var f = i.TaxRate;
                        4 == g.InvoiceType && (f = i.VATTaxRate);
                        var m = n.GetInvoiceTypeName(g.InvoiceType);
                        n.LoadInvoice(i.InvoiceList);
                        var y = !1, T = 0;
                        i.IsAboveSelf && (T = -2), i.IsOpenPickeupInStore && !t.globalData.siteInfo.OpenMultStore && (T = -2), 
                        i.IsSupportExpress && (T = 0), i.IsStoreDelive && i.IsInDeliverScope && (T = -1, 
                        y = !0);
                        var P = !0;
                        3 == T && i.IsStoreDelive && !i.IsInDeliverScope && (P = !1);
                        var S = 0;
                        !i.IsCashOnDelivery || c || l || (S = 1), !i.IsOfflinePay || c || l || -2 != n.data.ShippType || (S = -3), 
                        i.IsOnlinePay && (S = 0), i.IsOnlinePay || !l && !c || (i.IsOnlinePay = !0, S = 0), 
                        n.data.giftlist = [];
                        for (var w = 0; w < i.GiftInfo.length; w++) 0 == i.GiftInfo[w].PromoType ? n.data.giftlist.push(i.GiftInfo[w]) : n.data.sendgift.push(i.GiftInfo[w]);
                        n.setData({
                            OpenMultStore: t.globalData.siteInfo.OpenMultStore,
                            IsCashOnDelivery: i.IsCashOnDelivery,
                            IsOnlinePay: i.IsOnlinePay,
                            IsOfflinePay: i.IsOfflinePay,
                            paymentType: S,
                            fightGroupActivityId: h,
                            fightGroupId: I,
                            IsStoreDelive: y,
                            ShippType: T,
                            HideTip: P,
                            OrderInfo: i,
                            ProductSku: s,
                            BuyAmount: r,
                            FromPage: d,
                            combinaid: v,
                            CountdownId: c,
                            ShipAddressId: i.DefaultShippingAddress ? i.DefaultShippingAddress.ShippingId : 0,
                            storeId: p,
                            productType: l,
                            ShippingAddressInfo: i.DefaultShippingAddress,
                            ProductInfo: i.ProductItems || "",
                            ProductAmount: i.ProductAmount || i.Amount || 0,
                            OrderFreight: i.OrderFreight,
                            DefaultCouponCode: i.DefaultCouponCode,
                            DefaultCouponPrice: parseFloat(i.DefaultCouponPrice),
                            CouponList: i.CouponList,
                            FullDiscount: i.FullDiscount,
                            FullFreeFreight: i.FullFreeFreight,
                            MaxUsePoint: i.MaxUsePoint,
                            MaxPointDiscount: i.MaxPointDiscount,
                            ShoppingDeduction: i.ShoppingDeduction,
                            CanPointUseWithCoupon: i.CanPointUseWithCoupon,
                            PointDeductionRate: i.PointDeductionRate,
                            MyPoints: i.MyPoints,
                            PickerArray: o,
                            Suppliers: i.Suppliers || "",
                            Stores: i.Stores || "",
                            InvoiceId: g.Id,
                            InvoiceEnty: g,
                            InvoiceType: g.InvoiceType,
                            InvoiceTypeName: m,
                            InvoiceTitleName: g.InvoiceTitle,
                            InvoiceRate: f,
                            FullRegionPath: g.ReceiveRegionName || "",
                            giftlist: n.data.giftlist,
                            sendgift: n.data.sendgift,
                            VirtualProductItems: i.InputItems,
                            PreSaleMoney: i.PreSaleMoney,
                            Retainage: i.Retainage,
                            presaleId: a.presaleId
                        }), n.CalcMaxUsePoints(), n.CalcOrderTotalPrice();
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
            }), wx.request({
                url: t.getUrl("Common.ashx?action=GetTemplateByAppletlist"),
                data: {
                    openId: e
                },
                success: function(e) {
                    "OK" == e.data.Status && (n.setData({
                        templateList: e.data.Data
                    }), console.log("that.data.templateList.length:" + n.data.templateList.length));
                }
            });
        }), this.getBalanceInfo(), t.getSiteSettingData(function(e) {
            i.setData(e);
        });
    },
    setAppletTemplate: function() {
        for (var e = this, t = [], a = 0; a < e.data.templateList.length; a++) {
            if (console.log("ShippType:" + e.data.ShippType + ";MessageType:" + e.data.templateList[a].MessageType), 
            0 == e.data.ShippType && "OrderShipping" == e.data.templateList[a].MessageType) {
                t.push(e.data.templateList[a].TemplateId);
                break;
            }
            if (-2 == e.data.ShippType && "OrderConfirmTake" == e.data.templateList[a].MessageType) {
                t.push(e.data.templateList[a].TemplateId);
                break;
            }
            if (-1 == e.data.ShippType && "ShopOrderShipping" == e.data.templateList[a].MessageType) {
                t.push(e.data.templateList[a].TemplateId);
                break;
            }
        }
        e.setData({
            appletTemplate: t
        });
    },
    getBalanceInfo: function() {
        var e = this;
        t.getOpenId(function(a) {
            wx.request({
                url: t.getUrl("Balance.ashx?action=BalanceInfo"),
                data: {
                    openid: a
                },
                success: function(a) {
                    e.setData({
                        Balance: t.subtract(a.data.Balance, a.data.RequestBalance),
                        IsSetTradePassword: a.data.IsSetTradePassword
                    });
                }
            });
        });
    },
    changePayment: function(e) {
        this.setData({
            paymentType: parseInt(e.currentTarget.dataset.type)
        });
    },
    changeDeliverytime: function(e) {
        0 == e.currentTarget.dataset.type && this.setData({
            Deliverytime: "任意时间"
        }), 1 == e.currentTarget.dataset.type && this.setData({
            Deliverytime: "工作日"
        }), 2 == e.currentTarget.dataset.type && this.setData({
            Deliverytime: "节假日"
        }), this.setData({
            Deliverytimetype: parseInt(e.currentTarget.dataset.type)
        });
    },
    getStore: function() {
        var e = this, t = wx.getStorageSync("o2oFromLatLng");
        t ? (this.setData({
            fromLatLng: t
        }), this.loadStore()) : this.getLocation(function() {
            e.loadStore();
        });
    },
    loadStore: function() {
        var e = this;
        wx.request({
            url: t.getUrl("Order.ashx?action=GetCanTakeStores"),
            data: {
                openid: t.globalData.openId,
                productSku: this.data.ProductSku,
                shipAddressId: this.data.ShipAddressId,
                latLng: this.data.fromLatLng
            },
            success: function(t) {
                var a = 0;
                t.data.StoreList.forEach(function(e) {
                    var t = e.Distance;
                    e.Distance = t < 1e3 ? t.toFixed(2) + "M" : (t / 1e3).toFixed(2) + "KM", 1 == e.NoSupportProductCount && a++;
                }), a == t.data.StoreList.length && e.setData({
                    supportstore: !1
                }), e.setData({
                    storeList: t.data.StoreList
                });
            }
        });
    },
    getLocation: function(e) {
        var t = this;
        wx.getLocation({
            type: "wgs84",
            success: function(a) {
                wx.setStorage({
                    key: "o2oFromLatLng",
                    data: a.latitude + "," + a.longitude
                }), t.setData({
                    fromLatLng: a.latitude + "," + a.longitude
                }), e();
            }
        });
    },
    handleShowStore: function() {
        this.data.OpenMultStore && this.setData({
            showStore: !0
        });
    },
    handleHideStore: function() {
        this.setData({
            showStore: !1
        });
    },
    selectStore: function(e) {
        var t = this.data.storeList[e.currentTarget.dataset.index], a = t.StoreName.split(" "), i = a[0], o = a[1].replace("[", "");
        o = o.replace("]", ""), this.setData({
            storeSelect: t,
            selfStoreid: t.StoreId,
            showStore: !1,
            selstorename: i,
            selstoreopentime: o
        });
    },
    SelectShipp: function(t) {
        var a = parseInt(t.currentTarget.dataset.shipptype);
        -1 == a && this.data.storeId && this.data.ShippingAddressInfo && !this.data.ShippingAddressInfo.LatLng && e.showTip("请升级收货地址"), 
        -2 != a || this.data.storeList || this.getStore(), -1 != a && this.setData({
            HideTip: !0
        }), this.setData({
            ShippType: a,
            paymentType: 0
        }), this.CalcOrderTotalPrice();
    },
    changeInfo: function(e) {
        var t = e.currentTarget.dataset.index, a = this.data.VirtualProductItems;
        a[t].value = e.detail.value, this.setData({
            VirtualProductItems: a
        }), console.log(1);
    },
    uploadImg: function(e) {
        var a = this, i = e.currentTarget.dataset.index, o = this.data.VirtualProductItems, n = o[i], s = e.currentTarget.dataset.imgindex;
        wx.chooseImage({
            count: 1,
            success: function(e) {
                var i = e.tempFilePaths;
                wx.uploadFile({
                    url: t.getUrl("Common.ashx?action=UploadAppletImage"),
                    filePath: i[0],
                    name: "file",
                    formData: {
                        openId: t.globalData.openId
                    },
                    success: function(e) {
                        if ("OK" === (e = JSON.parse(e.data)).Status) {
                            var t = e.Data[0].ImageUrl;
                            void 0 != s ? n.imgs[parseInt(s)] = t : (n.imgs || (n.imgs = []), n.imgs.push(t)), 
                            n.value = n.imgs.join(","), a.setData({
                                VirtualProductItems: o
                            });
                        }
                    }
                });
            }
        });
    },
    delImg: function(e) {
        var t = e.currentTarget.dataset.index, a = this.data.VirtualProductItems, i = a[t], o = e.currentTarget.dataset.imgindex;
        i.imgs.splice(o, 1), i.value = i.imgs.join(","), this.setData({
            VirtualProductItems: a
        });
    },
    FindInvoiceByType: function(e, t) {
        for (var a = null, i = 0; i < t.length; i++) t[i].InvoiceType == e && null == a && (a = t[i]);
        return a;
    },
    GetInvoiceTypeName: function(e) {
        return 0 == e || 1 == e ? "普通发票" : 2 == e || 3 == e ? "电子发票" : "增值税发票";
    },
    LoadInvoice: function(e) {
        for (var t = "", a = "", i = 0; i < e.length; i++) 1 != e[i].InvoiceType && 3 != e[i].InvoiceType && 4 != e[i].InvoiceType || t.length <= 0 && (t = e[i].InvoiceTitle, 
        a = e[i].InvoiceTaxpayerNumber);
        this.setData({
            InvoiceTitle: t,
            InvoiceTaxpayerNumber: a
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    gotoAddress: function() {
        wx.navigateTo({
            url: "../addresschoice/addresschoice?productsku=" + this.data.ProductSku + "&buyamount=" + this.data.BuyAmount + "&frompage=" + this.data.FromPage + "&countdownid=" + this.data.CountdownId + "&shipaddressid=" + this.data.ShipAddressId + "&storeId=" + this.data.storeId + "&isorderaddress=" + !0 + "&fightGroupActivityId=" + this.data.fightGroupActivityId + "&fightGroupId=" + this.data.fightGroupId + "&presaleId=" + this.data.presaleId + "&recordid=" + this.data.RecordId + "&giftId=" + this.data.giftId
        });
    },
    addAddresstap: function() {
        var a = this;
        wx.showModal({
            title: "提示",
            content: "是否使用微信收货地址",
            cancelText: "否",
            confirmText: "是",
            success: function(i) {
                i.confirm ? wx.chooseAddress({
                    success: function(i) {
                        i && t.getOpenId(function(o) {
                            var n = {
                                openId: o,
                                shipTo: i.userName,
                                address: i.detailInfo,
                                cellphone: i.telNumber,
                                city: i.cityName,
                                county: i.countyName
                            };
                            e.httpPost(t.getUrl("ShippingAddress.ashx?action=AddWXChooseAddress"), n, function(i) {
                                "OK" == i.Status ? e.httpPost(t.getUrl("ShippingAddress.ashx?action=GetShippingAddressById"), {
                                    openId: o,
                                    shippingId: i.Message
                                }, function(e) {
                                    a.setData({
                                        ShippingAddressInfo: e.Data.ShippingAddressInfo
                                    });
                                }) : wx.showToast({
                                    title: i.Message,
                                    icon: "success"
                                });
                            });
                        });
                    }
                }) : i.cancel && a.gotoAddress();
            }
        });
    },
    goProduct: function(e) {
        var a = this, i = e.currentTarget.dataset.id;
        wx.request({
            url: t.getUrl("Product.ashx?action=GetProductActivity"),
            data: {
                productId: i,
                storeId: this.data.storeId
            },
            success: function(e) {
                e = e.data;
                var t = "../productdetail/productdetail?id=" + i + "&storeid=" + a.data.storeId + (1 === e.ActiveType ? "&activeid=" + e.ActiveId : "");
                6 == e.ActiveType && (t = "../fightdetail/fightdetail?activeid=" + e.ActiveId), 
                wx.navigateTo({
                    url: t
                });
            }
        });
    },
    clickCouponList: function(e) {
        var t = this;
        void 0 != t.data.CouponList && null != t.data.CouponList && t.data.CouponList.length > 0 ? this.setData({
            couponShow: "",
            backShow: ""
        }) : wx.showToast({
            title: "暂时没有可以领取的优惠券",
            icon: "loading"
        });
    },
    getCouponBaseId: function(e) {
        for (var t = this, a = 0; a < t.data.CouponList.length; a++) if (this.data.CouponList[a].CouponId == e) return a;
        return -1;
    },
    ChangeValue: function(e) {
        var t = e.currentTarget.dataset.key, a = e.detail.value, i = this.data.InvoiceEnty;
        i[t] = a, this.setData({
            InvoiceEnty: i
        });
    },
    SaveInvoice: function(e) {
        var a = this, i = a.data.OrderInfo, o = this.data.InvoiceType, n = this.data.InvoiceEnty;
        4 == o && (n.ReceiveRegionName = a.data.FullRegionPath, n.ReceiveRegionId = a.data.regionId);
        var s = JSON.stringify(n);
        a.CheckSaveInvoice(o, n) && t.getOpenId(function(e) {
            wx.request({
                url: t.getUrl("Order.ashx?action=UpdateUserInvoice"),
                data: {
                    openId: e,
                    Data: s
                },
                success: function(e) {
                    if ("OK" == e.data.Status) {
                        var t = e.data.List;
                        i.InvoiceList = t;
                        var n = i.TaxRate;
                        4 == o && (n = i.VATTaxRate);
                        var s = a.GetInvoiceTypeName(o);
                        a.setData({
                            InvoiceTypeName: s,
                            InvoiceTitleName: t[0].InvoiceTitle,
                            InvoiceRate: n,
                            InvoiceId: t[0].Id,
                            InvoiceEnty: t[0],
                            InvoiceType: t[0].InvoiceType,
                            OrderInfo: i,
                            currentPage: "page1"
                        });
                    } else "NOUser" == e.data.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: e.data.error_response.sub_msg,
                        showCancel: !1,
                        success: function(e) {}
                    });
                },
                complete: function() {
                    a.CalcOrderTotalPrice();
                }
            });
        });
    },
    CheckSaveInvoice: function(t, a) {
        if (1 == t || 3 == t || 4 == t) {
            if (!e.trim(a.InvoiceTitle)) return e.showTip("请输入单位名称"), !1;
            if (!a.InvoiceTaxpayerNumber || !e.trim(a.InvoiceTaxpayerNumber)) return e.showTip("请输入单位税号"), 
            !1;
        }
        if (2 == t || 3 == t) {
            if (!e.trim(a.ReceivePhone)) return e.showTip("请输入收票人手机"), !1;
            if (!e.checkPhone(a.ReceivePhone)) return e.showTip("请输入正确的收票人手机格式"), !1;
            if (!e.trim(a.ReceiveEmail)) return e.showTip("请输入收票人邮箱"), !1;
            if (!e.checkEmail(a.ReceiveEmail)) return e.showTip("请输入正确的收票人邮箱格式"), !1;
        }
        if (4 == t) {
            if (!e.trim(a.RegisterAddress)) return e.showTip("请输入单位注册地址"), !1;
            if (!e.trim(a.RegisterTel)) return e.showTip("请输入单位注册电话"), !1;
            if (!e.trim(a.OpenBank)) return e.showTip("请输入开户银行"), !1;
            if (!e.trim(a.BankAccount)) return e.showTip("请输入银行账户"), !1;
            if (!e.trim(a.ReceiveName)) return e.showTip("请输入收票人姓名"), !1;
            if (!e.trim(a.ReceivePhone)) return e.showTip("请输入收票人手机"), !1;
            if (!e.trim(a.ReceiveRegionName)) return e.showTip("请输入收票人地区"), !1;
            if (!e.trim(a.ReceiveAddress)) return e.showTip("请输入详细地址"), !1;
        }
        return !0;
    },
    setCoupon: function(e) {
        var t = this, a = (e.currentTarget.id, e.currentTarget.dataset.num);
        if (a >= 0) {
            var i = t.data.CouponList[a];
            t.setData({
                DefaultCouponCode: i.ClaimCode,
                DefaultCouponPrice: parseFloat(i.Price),
                SelectedCouponIndex: a,
                couponShow: "none",
                backShow: "none"
            });
        }
        t.data.CanPointUseWithCoupon || t.setData({
            DeductionPoints: 0,
            PointsDiscount: 0,
            pointDiscountShow: !1,
            checboxswitch: !1
        }), t.CalcMaxUsePoints(), t.CalcOrderTotalPrice();
    },
    onCouponHide: function(e) {
        this.setData({
            backShow: "none",
            couponShow: "none"
        });
    },
    cancelCoupon: function(e) {
        var t = this;
        t.setData({
            DefaultCouponCode: "",
            DefaultCouponPrice: 0,
            SelectedCouponIndex: -1,
            couponShow: "none",
            backShow: "none"
        }), t.CalcMaxUsePoints(), t.CalcOrderTotalPrice();
    },
    ChangeInvoiceType: function(e) {
        var t = this.data.InvoiceType, a = e.currentTarget.dataset.name;
        this.ChangeInvoiceInfo(t, a);
    },
    ChangeInvoiceInfo: function(e, t) {
        var a = 1 == e || 3 == e || 4 == e, i = 0;
        "普通发票" == t ? (i = 0, a && (i = 1)) : "电子发票" == t ? (i = 2, a && (i = 3)) : i = "增值税发票" == t ? 4 : "个人" == t ? 1 == e ? 0 : 3 == e ? 2 : e : 0 == e ? 1 : 2 == e ? 3 : e;
        var o = this.FindInVoiceById(i);
        this.setData({
            InvoiceType: i,
            InvoiceEnty: o,
            InvoiceTitle: o.InvoiceTitle,
            FullRegionPath: o.ReceiveRegionName,
            InvoiceTaxpayerNumber: o.InvoiceTaxpayerNumber
        });
    },
    bindPickerChange: function(e) {
        var t = this, a = e.detail.value, i = t.data.CouponList[a];
        t.setData({
            DefaultCouponCode: i.ClaimCode,
            DefaultCouponPrice: parseFloat(i.Price),
            SelectedCouponIndex: a
        });
    },
    bindRemarkInput: function(e) {
        this.setData({
            Remark: e.detail.value
        });
    },
    ChkUsePoint: function(e) {
        var t = this;
        e.detail.value ? (t.data.OrderInfo.CanPointUseWithCoupon || t.setData({
            DefaultCouponCode: "",
            DefaultCouponPrice: 0,
            SelectedCouponIndex: -1,
            couponShow: "none",
            backShow: "none",
            MaxUsePoint: t.data.OrderInfo.MaxUsePoint,
            MaxPointDiscount: t.data.OrderInfo.MaxPointDiscount.toFixed(2)
        }), t.setData({
            DeductionPoints: t.data.MaxUsePoint,
            PointsDiscount: parseFloat(t.data.MaxPointDiscount),
            pointDiscountShow: !0
        })) : t.setData({
            DeductionPoints: 0,
            PointsDiscount: 0,
            pointDiscountShow: !1
        }), t.CalcMaxUsePoints(), t.CalcOrderTotalPrice();
    },
    changeUseBalance: function(e) {
        this.setData({
            UseBalance: !this.data.UseBalance
        }), this.data.UseBalance && !this.data.confirmPwd && this.setData({
            passwordHide: !1,
            pwd: "",
            againPwd: ""
        }), this.CalcOrderTotalPrice();
    },
    hidePassword: function() {
        this.setData({
            UseBalance: !1,
            passwordHide: !0
        }), this.CalcOrderTotalPrice();
    },
    onInputPwd: function(e) {
        this.setData({
            pwd: e.detail.value
        });
    },
    confirmPwd: function() {
        var e = this, a = this.data.pwd, i = this.data.againPwd;
        if (this.data.IsSetTradePassword) {
            if (a.length < 6) return void t.showErrorModal("请输入正确的密码");
            wx.request({
                url: t.getUrl("Balance.ashx?action=AdvancePayPassVerify"),
                data: {
                    openid: t.globalData.openId,
                    AdvancePayPass: a,
                    PayAmount: this.data.OrderTotalPrice > this.data.Balance ? this.data.Balance : this.data.OrderTotalPrice
                },
                success: function(a) {
                    "OK" === a.data.Status ? e.setData({
                        passwordHide: !0,
                        IsSetTradePassword: !0,
                        UseBalance: !0,
                        confirmPwd: !0
                    }) : (e.setData({
                        UseBalance: !1
                    }), t.showErrorModal(a.data.Message));
                }
            });
        } else {
            if (a.length < 6) return void t.showErrorModal("支付密码不能少于6位");
            if ("" == i) return void t.showErrorModal("请确认密码");
            if (a != i) return void t.showErrorModal("两次密码输入不一致");
            wx.request({
                url: t.getUrl("Balance.ashx?action=OpenBalance"),
                data: {
                    openid: t.globalData.openId,
                    password: a,
                    confirmPassword: i
                },
                success: function(a) {
                    "OK" === a.data.Status ? e.setData({
                        passwordHide: !0,
                        IsSetTradePassword: !0,
                        UseBalance: !0,
                        confirmedPwd: !0
                    }) : (e.setData({
                        UseBalance: !1
                    }), t.showErrorModal(a.data.Message));
                }
            });
        }
    },
    onInputAgainPwd: function(e) {
        this.setData({
            againPwd: e.detail.value
        });
    },
    OpenUseInvoice: function(e) {
        this.setData({
            IsOpenInvoice: !this.data.IsOpenInvoice
        }), this.CalcOrderTotalPrice();
    },
    ChooseInvoice: function(e) {
        var t = this, a = 0;
        "普通发票" == t.data.InvoiceTypeName ? a = "个人" == t.data.InvoiceTitleName ? 0 : 1 : "电子发票" == t.data.InvoiceTypeName ? a = "个人" == t.data.InvoiceTitleName ? 2 : 3 : "增值税发票" == t.data.InvoiceTypeName && (a = 4), 
        this.ChangeInvoiceInfo(a, t.data.InvoiceTypeName), this.setData({
            currentPage: "page2"
        });
    },
    CancelInvoice: function() {
        this.setData({
            currentPage: "page1"
        });
    },
    FindInVoiceById: function(e, t) {
        for (var a = null, i = this, o = 0; o < i.data.OrderInfo.InvoiceList.length; o++) if (i.data.OrderInfo.InvoiceList[o].Id == t || i.data.OrderInfo.InvoiceList[o].InvoiceType == e) {
            a = i.data.OrderInfo.InvoiceList[o];
            break;
        }
        return null == a && (a = {
            Id: 0,
            InvoiceType: e,
            InvoiceTitle: 0 == e || 2 == e ? "个人" : "",
            InvoiceTaxpayerNumber: "",
            OpenBank: "",
            BankAccount: "",
            ReceiveAddress: "",
            ReceiveEmail: "",
            ReceiveName: "",
            ReceivePhone: "",
            ReceiveRegionId: 0,
            ReceiveRegionName: "",
            RegisterAddress: "",
            RegisterTel: ""
        }), a;
    },
    UsePointNumber: function(t) {
        var a = this, i = parseInt(t.detail.value);
        isNaN(i) && (e.showTip("积分请输入整数", "tips"), this.setData({
            DeductionPoints: 0
        }), i = 0), i > a.data.MaxUsePoint && (i = a.data.MaxUsePoint);
        var o = i;
        o > a.data.MaxUsePoint && (o = a.data.MaxUsePoint), o > a.data.MyPoints && (o = a.data.MyPoints);
        var n = (o / a.data.ShoppingDeduction).toFixed(2);
        n = parseFloat(n), a.setData({
            DeductionPoints: o,
            PointsDiscount: n
        }), a.CalcMaxUsePoints(), a.CalcOrderTotalPrice();
    },
    bindFullAddressTap: function(e) {
        r = 0, d = 0, c = 0, this.setAreaData(), this.setData({
            showDistpicker: !0
        });
    },
    CalcMaxUsePoints: function() {
        var e = this, a = e.data.ProductAmount - e.data.FullDiscount;
        "False" == e.data.OrderInfo.IsFreightFree && parseFloat(e.data.OrderInfo.OrderFreight), 
        (a = t.subtract(a, e.data.DefaultCouponPrice)) < 0 && (a = 0), e.data.presaleId > 0 && (a = t.subtract(a, e.data.PreSaleMoney));
        var i = parseInt(e.data.PointDeductionRate * (1e3 * a) * e.data.ShoppingDeduction / 100 / 1e3);
        i > e.data.MyPoints && (i = e.data.MyPoints);
        var o = i / e.data.ShoppingDeduction, n = e.data.DeductionPoints;
        n > i && (n = i);
        var s = e.data.PointsDiscount;
        s > o && (s = o), e.setData({
            MaxPointDiscount: o.toFixed(2),
            MaxUsePoint: i,
            PointsDiscount: s,
            DeductionPoints: n
        });
    },
    CalcOrderTotalPrice: function() {
        var e = t.subtract(this.data.ProductAmount, this.data.FullDiscount);
        e = t.subtract(e, this.data.DefaultCouponPrice), (e = t.subtract(e, this.data.PointsDiscount)) < 0 && (e = 0);
        var a = 0;
        0 == this.data.ShippType ? "False" == this.data.OrderInfo.IsFreightFree && (a = parseFloat(this.data.OrderInfo.OrderFreight)) : -1 != this.data.ShippType || this.data.productType || "False" == this.data.OrderInfo.IsFreightFree && (a = this.data.OrderInfo.StoreFreight);
        var i = 0;
        this.data.IsOpenInvoice && (i = this.data.InvoiceRate);
        var o = t.divide(Math.floor(t.multiply(e, i)), 100);
        e = t.add(t.add(e, a), o);
        var n = 0;
        this.data.UseBalance && (e > this.data.Balance ? (n = this.data.Balance, e = t.subtract(e, this.data.Balance)) : this.data.presaleId > 0 ? n = this.data.PreSaleMoney : (n = e, 
        e = 0));
        var s = 0;
        this.data.presaleId > 0 && (s = t.subtract(e, this.data.PreSaleMoney)) < 0 && (s = 0), 
        this.setData({
            OrderTotalPrice: e,
            TaxRate: o,
            OrderFreight: a,
            balanceAmout: n,
            Retainage: s
        });
    },
    bindChangePassword: function(e) {
        wx.navigateTo({
            url: "../userfindpaypwd/userfindpaypwd"
        });
    },
    setProvinceCityData: function(e, t, i, o, n) {
        var s = this;
        null != e && (a = e);
        var r = a, d = [], c = [];
        for (var u in r) {
            var p = r[u].name, l = r[u].id;
            d.push(p), c.push(l);
        }
        s.setData({
            provinceName: d,
            provinceCode: c
        });
        var h = a[t].city, I = [], g = [];
        for (var u in h) {
            var p = h[u].name, l = h[u].id;
            1, I.push(p), g.push(l);
        }
        s.setData({
            cityName: I,
            cityCode: g
        });
        var f = h[i].area, v = [], m = [];
        if (null != f && f.length > 0) {
            for (var u in f) {
                var p = f[u].name, l = f[u].id;
                v.push(p), m.push(l);
            }
            s.setData({
                districtName: v,
                districtCode: m
            });
        } else s.setData({
            districtName: [],
            districtCode: []
        });
    },
    getItemIndex: function(e, t) {
        for (var a = e.length; a--; ) if (e[a] === t) return a;
        return -1;
    },
    setAreaDataShow: function(e, t, a, s) {
        var r = this;
        if (null != e) p = e, i.push(t), o.push(e); else {
            var c = r.getItemIndex(i, t);
            p = c >= 0 ? o[c] : [];
        }
        var u = [], l = [];
        if (p && p.length > 0) {
            for (var h in p) {
                var I = h.id, g = h.name;
                u.push(I), l.push(g);
            }
            r.setData({
                districtName: u,
                districtCode: l
            });
        } else r.setData({
            districtName: [],
            districtCode: []
        });
        this.ArrayContains(n, a) ? r.setStreetData(null, d, a, s) : r.getRegions(d, 4, a, s);
    },
    setStreetData: function(e, t, a, i) {
        var o = this;
        if (null != e) n.push(regionId), s.push(e), l = e; else {
            var r = o.getItemIndex(n, t);
            l = r >= 0 ? s[r] : [];
        }
    },
    setAreaData: function(e, i, o, n) {
        var s = this, e = e || 0, i = i || 0, n = (o = o || 0) || 0;
        void 0 == a || null == a ? wx.request({
            url: t.getUrl("ShippingAddress.ashx?action=GetRegionsOfProvinceCity"),
            async: !1,
            success: function(t) {
                "OK" == t.data.Status && s.setProvinceCityData(t.data.province, e, i, o, n);
            },
            error: function(e) {}
        }) : s.setProvinceCityData(null, e, i, o, n);
    },
    changeArea: function(e) {
        var t = this;
        r = e.detail.value[0], d = e.detail.value[1], c = e.detail.value.length > 2 ? e.detail.value[2] : 0, 
        u = 0, console.log("省:" + r + "市:" + d + "区:" + c), t.setAreaData(r, d, c, u);
    },
    showDistpicker: function() {
        this.setData({
            showDistpicker: !0
        });
    },
    distpickerCancel: function() {
        var e = this, t = e.data.InvoiceEnty.ReceiveRegionName;
        this.setData({
            showDistpicker: !1,
            fullAddress: t,
            FullRegionName: t,
            FullRegionPath: t,
            regionId: e.data.InvoiceEnty.ReceiveRegionId
        });
    },
    distpickerSure: function() {
        var e, t = this.data.provinceName[r] + " " + this.data.cityName[d] + " " + this.data.districtName[c];
        this.data.streetCode.length > 0 ? e = this.data.streetCode[u] : this.data.districtCode.length > 0 ? e = this.data.districtCode[c] : this.data.cityCode.length > 0 && (e = this.data.cityCode[d]);
        var a = this.data.isCss;
        "请填写所在地区" == this.data.FullRegionName && (a = !1), this.setData({
            fullAddress: t,
            FullRegionName: t,
            FullRegionPath: t,
            regionId: e,
            selCityName: this.data.cityName[d] ? this.data.cityName[d] : "",
            isCss: a,
            detailAddress: "",
            building: "",
            showDistpicker: !1
        });
    },
    submitOrder: function(a) {
        if (!t.globalData.siteInfo.QuickLoginIsForceBindingMobbile || t.globalData.userInfo.CellPhone) {
            var i = this;
            if (void 0 == i.data.FromPage && (i.data.FromPage = ""), i.data.recordid || (i.data.FromPage && i.data.BuyAmount <= 0 || void 0 == i.data.ProductSku) && wx.showModal({
                title: "提示",
                content: "参数错误",
                showCancel: !1,
                success: function(e) {
                    e.confirm && wx.switchTab({
                        url: "../home/home"
                    });
                }
            }), i.data.storeId && !i.data.productType) {
                if (i.data.OrderInfo.Stores[0].StoreTotal < i.data.OrderInfo.MinOrderPrice && -1 == i.data.ShippType) return void e.showTip("未达到起送价格");
                if (-1 == i.data.ShippType && i.data.ShippingAddressInfo && !i.data.ShippingAddressInfo.LatLng) return void e.showTip("请升级收货地址");
                if (-1 == i.data.ShippType && !i.data.OrderInfo.IsInDeliverScope || !i.data.OrderInfo.IsSupportExpress && !i.data.OrderInfo.IsAboveSelf && !i.data.OrderInfo.IsInDeliverScope) return void i.setData({
                    HideTip: !1
                });
            }
            if (i.data.ShippingAddressInfo || i.data.productType || -2 == i.data.ShippType) if (i.data.RecordId || !i.data.OrderInfo.CanGetGoodsOnStore || !i.data.OpenMultStore || i.data.storeSelect || -2 != i.data.ShippType || i.data.productType) {
                var o = [], n = !0;
                if (this.data.productType && this.data.VirtualProductItems.forEach(function(e) {
                    3 == e.InputFieldType && e.value && 18 != e.value.length && (wx.showToast({
                        title: "请输入正确的身份证号",
                        icon: "none"
                    }), n = !1), 4 == e.InputFieldType && e.value && 11 != e.value.length && (wx.showToast({
                        title: "请输入正确的手机号",
                        icon: "none"
                    }), n = !1), e.IsRequired && !e.value && (n && wx.showToast({
                        title: "请填写" + e.InputFieldTitle,
                        icon: "none"
                    }), n = !1), "[object Undefined]" === Object.prototype.toString.call(e.value) && (e.value = ""), 
                    o.push({
                        InputFieldTitle: e.InputFieldTitle,
                        InputFieldValue: e.value,
                        InputFieldType: e.InputFieldType
                    });
                }), n) {
                    i.data.InvoiceEnty && i.data.InvoiceEnty.Id, i.data.IsOpenInvoice && "增值税发票" == i.data.InvoiceTypeName && i.data.InvoiceId <= 0 ? wx.showModal({
                        title: "提示",
                        content: "请完善发票信息",
                        showCancel: !1
                    }) : (this.setData({
                        isEnable: !0
                    }), t.getOpenId(function(e) {
                        wx.request({
                            url: t.getUrl("Order.ashx?action=SubmitOrder"),
                            data: {
                                openId: e,
                                fromPage: i.data.FromPage,
                                RecordId: i.data.RecordId,
                                combinaid: i.data.combinaid,
                                shippingId: i.data.ShippingAddressInfo ? i.data.ShippingAddressInfo.ShippingId : 0,
                                couponCode: i.data.DefaultCouponCode,
                                countDownId: i.data.CountdownId,
                                buyAmount: i.data.BuyAmount,
                                productSku: i.data.ProductSku,
                                storeId: i.data.storeId,
                                chooseStoreId: i.data.selfStoreid,
                                remark: i.data.Remark,
                                deductionPoints: i.data.DeductionPoints,
                                formId: "",
                                needInvoice: i.data.IsOpenInvoice,
                                invoiceId: i.data.InvoiceId,
                                shippingType: i.data.ShippType,
                                shiptoDate: i.data.Deliverytime,
                                useBalance: i.data.balanceAmout,
                                advancePayPass: i.data.pwd,
                                inputItems: JSON.stringify([ o ]),
                                paymentType: i.data.paymentType,
                                fightGroupActivityId: i.data.fightGroupActivityId,
                                fightGroupId: i.data.fightGroupId,
                                presaleId: i.data.presaleId,
                                GroupBuyId: i.data.GroupBuyId,
                                roomId: i.data.roomId
                            },
                            header: {
                                "content-type": "application/x-www-form-urlencoded"
                            },
                            method: "post",
                            success: function(a) {
                                if ("OK" == a.data.Status) {
                                    var o = a.data.OrderId;
                                    i.setAppletTemplate(), console.log("提交：that.data.appletTemplate:" + i.data.appletTemplate + ";orderId:" + o), 
                                    i.data.fightGroupActivityId ? a.data.IsNeedPay && a.data.OrderTotal > 0 ? t.orderPay(o, i.data.fightGroupId, "fightGroup", i.data.appletTemplate) : wx.requestSubscribeMessage({
                                        tmplIds: i.data.appletTemplate,
                                        success: function(a) {
                                            if ("requestSubscribeMessage:ok" == a.errMsg) {
                                                var i = Object.keys(a).filter(function(e) {
                                                    return "accept" === a[e];
                                                });
                                                if (i.length > 0) {
                                                    var n = i[0];
                                                    wx.request({
                                                        url: t.getUrl("Common.ashx?action=GetAuthorizedSubscribeMessage"),
                                                        data: {
                                                            templateIds: n,
                                                            orderId: o,
                                                            openId: e
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
                                            wx.redirectTo({
                                                url: "../fightshare/fightshare?orderid=" + o + "&fightGroupId=" + i.data.fightGroupId
                                            });
                                        }
                                    }) : a.data.IsNeedPay ? a.data.OrderTotal > 0 ? t.orderPay(o, 0, "ordersubmit", i.data.appletTemplate) : wx.requestSubscribeMessage({
                                        tmplIds: i.data.appletTemplate,
                                        success: function(a) {
                                            if ("requestSubscribeMessage:ok" == a.errMsg) {
                                                var i = Object.keys(a).filter(function(e) {
                                                    return "accept" === a[e];
                                                });
                                                if (i.length > 0) {
                                                    var n = i[0];
                                                    wx.request({
                                                        url: t.getUrl("Common.ashx?action=GetAuthorizedSubscribeMessage"),
                                                        data: {
                                                            templateIds: n,
                                                            orderId: o,
                                                            openId: e
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
                                            wx.redirectTo({
                                                url: "../orderlist/orderlist?status=2"
                                            });
                                        }
                                    }) : wx.requestSubscribeMessage({
                                        tmplIds: i.data.appletTemplate,
                                        success: function(a) {
                                            if ("requestSubscribeMessage:ok" == a.errMsg) {
                                                var i = Object.keys(a).filter(function(e) {
                                                    return "accept" === a[e];
                                                });
                                                if (i.length > 0) {
                                                    var n = i[0];
                                                    wx.request({
                                                        url: t.getUrl("Common.ashx?action=GetAuthorizedSubscribeMessage"),
                                                        data: {
                                                            templateIds: n,
                                                            orderId: o,
                                                            openId: e
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
                                            wx.redirectTo({
                                                url: "../orderdetail/orderdetail?orderid=" + o
                                            });
                                        }
                                    });
                                } else console.log(a.data), i.setData({
                                    isEnable: !1
                                }), wx.showModal({
                                    title: "提示",
                                    content: a.data.Message,
                                    showCancel: !1
                                });
                            }
                        });
                    }));
                }
            } else i.data.supportstore ? wx.showModal({
                title: "提示",
                content: "请选择上门自提门店",
                showCancel: !1
            }) : wx.showModal({
                title: "提示",
                content: "您选择了上门自提，但本市无可自提的门店，请选择其他配送方式",
                showCancel: !1
            }); else wx.showModal({
                title: "提示",
                content: "请选择收货地址",
                showCancel: !1
            });
        } else wx.navigateTo({
            url: "../userbindphone/userbindphone"
        });
    }
});