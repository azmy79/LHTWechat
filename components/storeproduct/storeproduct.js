var t = require("../../utils/config.js"), e = getApp();

Component({
    properties: {
        fromLatLng: {
            type: String
        },
        keyword: {
            type: String
        },
        productId: {
            type: String
        }
    },
    ready: function() {
        var t = this;
        this.getStoreList(1), e.getSiteSettingData(function(e) {
            t.setData(e);
        });
    },
    data: {
        pageIndex: 1,
        pageSize: 4,
        currentPage: "page1",
        fromLatLng: "",
        historyList: [],
        isDataEnd: !1,
        storeList: [],
        setCss: {},
        setProCss: {},
        showNoSearch: !1,
        isHidePage1: !1
    },
    methods: {
        onConfirmSearch: function(t) {
            this.data.keyword ? this.getStoreList(1) : wx.showToast({
                title: "请输入关键词"
            });
        },
        onInputKeyword: function(t) {
            var e = t.detail.value;
            e != this.data.keyword && this.setData({
                keyword: e,
                showNoSearch: !1,
                isDataEnd: !1
            });
        },
        getStoreList: function(a) {
            var i, s = this, o = this.data.fromLatLng.split(",")[0], r = this.data.fromLatLng.split(",")[1];
            this.data.isDataEnd || (i = this.data.showNoSearch ? {
                pageIndex: a,
                pageSize: this.data.pageSize,
                Lat: o,
                lng: r
            } : {
                pageIndex: a,
                pageSize: this.data.pageSize,
                Lat: o,
                lng: r,
                key: this.data.keyword,
                productId: this.data.productId
            }, 1 == a && this.setData({
                storeList: []
            }), wx.showLoading({
                title: "加载中..."
            }), t.httpGet(e.getUrl("Store.ashx?action=SeachInStoreList"), i, function(t) {
                if (wx.hideLoading(), "OK" === (t = t.store_get_response).Status) {
                    if (0 == t.RecordCount) return void s.setData({
                        showNoSearch: !0,
                        pageIndex: 1,
                        storeList: []
                    });
                    if (!t.StoreList || t.StoreList.length < s.data.pageSize) s.setData({
                        isDataEnd: !0
                    }); else {
                        var e = s.data.pageIndex;
                        s.setData({
                            pageIndex: e + 1
                        });
                    }
                    s.setData({
                        storeList: s.data.storeList.concat(t.StoreList)
                    });
                } else wx.showToast({
                    title: "系统数据异常"
                });
            }));
        },
        showAllProduct: function(t) {
            var e = t.currentTarget.dataset.index, a = this.data.storeList[e];
            a.isOpen = !a.isOpen, this.setData({
                storeList: this.data.storeList
            });
        },
        goStore: function(t) {
            var e = t.currentTarget.dataset.storeid;
            wx.navigateTo({
                url: "../storehome/storehome?id=" + e
            });
        },
        goProductDetail: function(t) {
            var e = t.currentTarget.dataset.productid, a = t.currentTarget.dataset.storeid, i = t.currentTarget.dataset.activeid, s = t.currentTarget.dataset.activetype;
            console.log(e), wx.navigateTo({
                url: "../productdetail/productdetail?id=" + e + "&storeid=" + a + (1 == s ? "&activeid=" + i : "")
            });
        },
        onReachBottom: function() {
            this.getStoreList(this.data.pageIndex);
        }
    }
});