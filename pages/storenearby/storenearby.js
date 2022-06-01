function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, e = Array(t.length); a < t.length; a++) e[a] = t[a];
        return e;
    }
    return Array.from(t);
}

var a = getApp();

Page({
    data: {
        tagname: "",
        pageIndex: 1,
        storeList: [],
        activity: {},
        showActionsheet: !1
    },
    onLoad: function(t) {
        var e = this;
        this.setData({
            tagid: t.tagid,
            tagname: t.tagname
        }), wx.setNavigationBarTitle({
            title: t.tagname
        });
        var o = wx.getStorageSync("o2oFromLatLng");
        o ? (this.setData({
            lat: o.split(",")[0],
            lng: o.split(",")[1]
        }), this.loadStoreList()) : this.getLocation(function() {
            e.loadStoreList();
        }), a.getSiteSettingData(function(t) {
            e.setData(t);
        });
    },
    loadStoreList: function() {
        var e = this;
        this.data.isEnd || (wx.showLoading({
            title: "加载中..."
        }), wx.request({
            url: a.getUrl("Home.ashx?action=GetStoreListHome"),
            data: {
                pageIndex: this.data.pageIndex,
                pageSize: 10,
                latitude: this.data.lat,
                longitude: this.data.lng,
                tagid: this.data.tagid
            },
            success: function(a) {
                wx.hideLoading();
                var o = !1;
                (!(a = a.data.homestorelist_get_response).StoreInfo || a.StoreInfo.length < 10) && (o = !0), 
                e.setData({
                    storeList: [].concat(t(e.data.storeList), t(a.StoreInfo)),
                    pageIndex: e.data.pageIndex + 1,
                    isEnd: o
                });
            }
        }));
    },
    showActivity: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            showActionsheet: !0,
            activity: this.data.storeList[a].Activity
        });
    },
    hideActivity: function() {
        this.setData({
            showActionsheet: !1
        });
    },
    getLocation: function(t) {
        var a = this;
        wx.getLocation({
            type: "wgs84",
            success: function(e) {
                wx.setStorage({
                    key: "o2oFromLatLng",
                    data: e.latitude + "," + e.longitude
                }), a.setData({
                    lat: e.latitude,
                    lng: e.longitude
                }), t();
            }
        });
    },
    onConfirmSearch: function(t) {
        this.data.keyword ? wx.navigateTo({
            url: "../storeproduct/storeproduct?keyword=" + this.data.keyword
        }) : wx.showToast({
            title: "请输入关键词"
        });
    },
    onInputKeyword: function(t) {
        var a = t.detail.value;
        a != this.data.keyword && this.setData({
            keyword: a
        });
    },
    goStoreHome: function(t) {
        wx.navigateTo({
            url: "../storehome/storehome?id=" + t.currentTarget.dataset.id
        });
    },
    goProduct: function(t) {
        var a = t.currentTarget.dataset.id, e = t.currentTarget.dataset.storeid;
        wx.navigateTo({
            url: "../productdetail/productdetail?id=" + a + "&storeid=" + e
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.loadStoreList();
    },
    onShareAppMessage: function() {}
});