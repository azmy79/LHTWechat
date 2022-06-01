var t = require("../../utils/config.js"), e = getApp();

Component({
    properties: {
        fromLatLng: {
            type: String
        },
        storeid: {
            type: Number
        }
    },
    ready: function() {
        var t = this;
        this.loadStoreInfo(), this.addToCart = this.selectComponent("#addToCart"), e.getSiteSettingData(function(e) {
            t.setData(e);
        });
    },
    data: {
        pageIndex: 1,
        pageSize: 2,
        floorList: [],
        isEnd: !1,
        position: [],
        counpbgimg: e.getRequestUrl + "/Templates/xcxshop/images/index-coup.png",
        opers: "down",
        SwiperList: []
    },
    methods: {
        loadStoreInfo: function() {
            var a = this, o = this.data.storeid, r = new Date().getTime();
            wx.request({
                url: e.getUrl("Home.ashx?action=GetO2OIndexData"),
                data: {
                    openId: e.globalData.openId,
                    storeid: o,
                    fromLatLng: this.data.fromLatLng
                },
                success: function(o) {
                    if (void 0 == o.error_response) if (o.data.length <= 0) t.showTip("暂无数据"); else {
                        var i = o.data.index_get_response, s = i.Store.ImgList;
                        delete i.Store.ImgList, e.globalData.storeInfo = i.Store;
                        var n = i.Store.Address, d = t.FormatDistance(e.globalData.storeInfo.Distance);
                        e.globalData.storeInfo.Distance = d;
                        e.globalData.storeInfo.Address;
                        var u = Date.parse(i.Store.OpenEndDate.replace(/-/g, "/"));
                        Date.parse(i.Store.OpenStartDate.replace(/-/g, "/")) <= r && r <= u || o.data.index_get_response.Store.IsOrderInClosingTime || t.showTip("很抱歉，现在是非营业时间，门店暂不提供服务！"), 
                        i.Store.Address.length > 10 && (n = i.Store.Address.substr(9)), i.Coupons.forEach(function(t, e, a) {
                            var o = parseInt(t.Price), r = parseInt(t.OrderUseLimit);
                            t.Price = o, t.OrderUseLimit = r;
                        });
                        var l = [];
                        if (i.ActivityList.ActivityCount > 0) {
                            for (c = 0; c < i.ActivityList.FullAmountReduceList.length; c++) i.ActivityList.FullAmountReduceList[c].icon = "badge_jian_", 
                            l.push(i.ActivityList.FullAmountReduceList[c]);
                            for (c = 0; c < i.ActivityList.FullAmountSentGiftList.length; c++) i.ActivityList.FullAmountSentGiftList[c].icon = "badge_song_", 
                            l.push(i.ActivityList.FullAmountSentGiftList[c]);
                            for (var c = 0; c < i.ActivityList.FullAmountSentFreightList.length; c++) i.ActivityList.FullAmountSentFreightList[c].icon = "badge_mian_", 
                            l.push(i.ActivityList.FullAmountSentFreightList[c]);
                        }
                        a.setData({
                            Store: e.globalData.storeInfo,
                            SwiperList: s,
                            Coupons: i.Coupons,
                            storeAdress: n,
                            ActivityList: l,
                            IsOrderInClosingTime: o.data.index_get_response.Store.IsOrderInClosingTime
                        });
                    } else t.showTip(o.data.error_response.sub_msg);
                },
                complete: function() {
                    a.getProductList(!1);
                }
            }), wx.request({
                url: e.getUrl("Home.ashx?action=GetStoreMarketing"),
                data: {},
                success: function(t) {
                    "OK" == t.data.storemarketing_get_response.Status && a.setData({
                        marketingIcon: t.data.storemarketing_get_response.StoreMarktingInfo
                    });
                }
            });
        },
        customTap: function(t) {
            wx.navigateTo({
                url: t.currentTarget.dataset.link + "?storeid=" + this.data.storeid
            });
        },
        OpenActive: function() {
            var t = this.data.opers;
            t = "up" == t ? "down" : "up", this.setData({
                opers: t
            });
        },
        getProductList: function(t) {
            var a = this;
            this.data.isEnd || wx.request({
                url: e.getUrl("Home.ashx?action=GetStoreFloors"),
                data: {
                    openId: e.globalData.openId,
                    storeid: this.data.storeid,
                    pageIndex: this.data.pageIndex,
                    pageSize: this.data.pageSize
                },
                success: function(e) {
                    var o = e.data.storefloor_get_response.StoreFloorInfo;
                    if (e.data.storefloor_get_response.RecordCount <= a.data.pageIndex * a.data.pageSize && (a.data.isEnd = !0), 
                    t) {
                        var r = a.data.floorList;
                        r.push.apply(r, o), a.setData({
                            floorList: r,
                            isEnd: a.data.isEnd
                        });
                    } else a.setData({
                        floorList: o,
                        isEnd: a.data.isEnd
                    });
                }
            });
        },
        SelectStore: function(t) {
            var a = this.data.fromLatLng.split(",")[0], o = this.data.fromLatLng.split(",")[1];
            e.globalData.storeInfo.Address;
            wx.navigateTo({
                url: "../storechoose/storechoose?latitude=" + a + "&longitude=" + o
            });
        },
        ChooseAddress: function(t) {
            wx.openLocation({
                latitude: e.globalData.storeInfo.Lat,
                longitude: e.globalData.storeInfo.Lng,
                scale: 28,
                name: e.globalData.storeInfo.StoreName,
                address: e.globalData.storeInfo.Address
            });
        },
        CallTel: function(t) {
            var e = t.currentTarget.dataset.tel;
            wx.makePhoneCall({
                phoneNumber: e
            });
        },
        onReachBottom: function() {
            this.setData({
                pageIndex: this.data.pageIndex + 1
            }), this.getProductList(!0);
        },
        goToProductDetail: function(t) {
            var e = t.currentTarget.dataset.productid, a = t.currentTarget.dataset.activeid, o = t.currentTarget.dataset.activetype;
            t.currentTarget.dataset.producttype;
            wx.navigateTo({
                url: "../productdetail/productdetail?id=" + e + "&storeid=" + this.data.storeid + (1 == o ? "&activeid=" + a : "")
            });
        },
        goToStoreMarketing: function(t) {
            var e = t.currentTarget.dataset.imageid;
            wx.navigateTo({
                url: "../storemarketing/storemarketing?imageid=" + e + "&storeid=" + this.data.storeid
            });
        },
        catchAddCart: function(t) {
            this.setData({
                curProductid: t.currentTarget.dataset.productid,
                curIndex: t.currentTarget.dataset.index,
                floorindex: t.currentTarget.dataset.floorindex
            }), this.addToCart.catchAddCart();
        },
        updateCart: function(t) {
            var e = this, a = t.currentTarget.dataset, o = a.sku, r = a.operator ? 1 : -1, i = a.index, s = a.floorindex;
            this.addToCart.updateCart(o, r, function(t) {
                var a = e.data.floorList[s].Products[i];
                a.CartQuantity += "OK" === t.Status ? r : 0, t.error_response && (a.CartQuantity = a.Stock), 
                a.CartQuantity < 0 && (a.CartQuantity = 0), e.setData({
                    floorList: e.data.floorList
                });
            });
        },
        updateproduct: function(t) {
            this.data.floorList[this.data.floorindex].Products[this.data.curIndex].CartQuantity = t.detail.quantity, 
            this.setData({
                floorList: this.data.floorList
            });
        }
    }
});