function t(t) {
    if (Array.isArray(t)) {
        for (var e = 0, a = Array(t.length); e < t.length; e++) a[e] = t[e];
        return a;
    }
    return Array.from(t);
}

require("../../utils/config.js");

var e, a = getApp(), i = require("../../utils/qqmap-wx-jssdk.min.js");

Component({
    properties: {
        fromLatLng: {
            type: String
        }
    },
    ready: function() {
        var t = this;
        this.setData({
            Latitude: this.data.fromLatLng.split(",")[0],
            Longitude: this.data.fromLatLng.split(",")[1]
        }), wx.request({
            url: a.getUrl("Home.ashx?action=GetStoreListHomeData"),
            data: {},
            success: function(e) {
                "OK" == e.data.Status && t.setData({
                    Banners: e.data.Data.Banners,
                    Tags: e.data.Data.Tags
                });
            }
        }), a.getSiteSettingData(function(e) {
            t.setData(e);
        }), this.getAddress(), this.loadStoreList();
    },
    data: {
        Banners: [],
        PageIndex: 1,
        storeList: [],
        Latitude: "",
        Longitude: "",
        Address: "",
        cityname: "",
        activity: {},
        showActionsheet: !1
    },
    methods: {
        loadStoreList: function() {
            var e = this;
            this.data.isEnd || (wx.showLoading({
                title: "加载中..."
            }), wx.request({
                url: a.getUrl("Home.ashx?action=GetStoreListHome"),
                data: {
                    PageIndex: this.data.PageIndex,
                    PageSize: 10,
                    Latitude: this.data.Latitude,
                    Longitude: this.data.Longitude
                },
                success: function(a) {
                    if ("NO" == a.data.Status) return wx.hideLoading(), void wx.showModal({
                        title: "操作提示",
                        content: a.data.Message || "未授权门店",
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                    var i = !1;
                    (!(a = a.data.homestorelist_get_response).StoreInfo || a.StoreInfo.length < 10) && (i = !0), 
                    e.setData({
                        storeList: [].concat(t(e.data.storeList), t(a.StoreInfo)),
                        PageIndex: e.data.PageIndex + 1,
                        isEnd: i,
                        loaded: !0
                    }), wx.hideLoading();
                }
            }));
        },
        getAddress: function() {
            var t = this;
            e = new i({
                key: a.globalData.QQMapKey
            });
            var s = this.data.Latitude + "," + this.data.Longitude;
            wx.setStorageSync("o2oFromLatLng", s), e.reverseGeocoder({
                coord_type: 5,
                location: {
                    latitude: this.data.Latitude,
                    longitude: this.data.Longitude
                },
                success: function(e) {
                    var e = e.result;
                    t.setData({
                        Address: e.formatted_addresses.recommend,
                        cityname: e.address_component.province + " " + e.address_component.city + " " + e.address_component.district
                    });
                },
                fail: function(t) {
                    wx.showToast({
                        title: "获取位置失败"
                    });
                }
            });
        },
        goSearchStore: function() {
            wx.navigateTo({
                url: "../storeproduct/storeproduct"
            });
        },
        changePosition: function() {
            wx.navigateTo({
                url: "../storeposition/storeposition?cityname=" + this.data.cityname + "&address=" + this.data.Address
            });
        },
        showActivity: function(t) {
            var e = t.currentTarget.dataset.index;
            this.setData({
                showActionsheet: !0,
                activity: this.data.storeList[e].Activity
            });
        },
        hideActivity: function() {
            this.setData({
                showActionsheet: !1
            });
        },
        goStoreHome: function(t) {
            wx.navigateTo({
                url: "../storehome/storehome?id=" + t.currentTarget.dataset.id
            });
        },
        goProduct: function(t) {
            var e = t.currentTarget.dataset.id, a = t.currentTarget.dataset.storeid, i = t.currentTarget.dataset.activeid, s = t.currentTarget.dataset.activetype;
            wx.navigateTo({
                url: "../productdetail/productdetail?id=" + e + "&storeid=" + a + (1 == s ? "&activeid=" + i : "")
            });
        },
        goTags: function(t) {
            wx.navigateTo({
                url: "../storenearby/storenearby?tagid=" + t.currentTarget.dataset.id + "&tagname=" + t.currentTarget.dataset.name
            });
        },
        customTap: function(t) {
            wx.navigateTo({
                url: t.currentTarget.dataset.link
            });
        },
        onReachBottom: function() {
            this.loadStoreList();
        },
        onshow: function() {
            this.loadStoreList();
        }
    }
});