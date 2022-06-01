require("../../utils/config.js");

var e = getApp();

Component({
    properties: {
        ReferralUserId: {
            type: String
        }
    },
    ready: function() {
        var a = this;
        e.globalData.userInfo && e.globalData.userInfo.IsReferral ? e.globalData.ReferralInfo ? wx.setNavigationBarTitle({
            title: e.globalData.ReferralInfo.ShopName
        }) : this.getReferralInfo(e.globalData.userInfo.UserId) : this.data.ReferralUserId ? this.getReferralInfo(this.data.ReferralUserId) : wx.setNavigationBarTitle({
            title: "移动云商城"
        }), e.getSiteSettingData(function(e) {
            a.setData(e);
        }), this.DownloadTopcis(), wx.stopPullDownRefresh();
    },
    data: {
        keyword: "",
        TopicUrl: "Templates/xcxshop/data/default.json",
        TopicData: null
    },
    methods: {
        DownloadTopcis: function() {
            var a = this;
            wx.request({
                url: e.getRequestUrl + this.data.TopicUrl,
                dataType: "json",
                success: function(e) {
                    a.setData({
                        TopicData: e.data.LModules
                    });
                }
            }), wx.stopPullDownRefresh(), wx.hideNavigationBarLoading();
        },
        gotoKeyWordPage: function(e) {
            wx.navigateTo({
                url: "../productsearch/productsearch"
            });
        },
        getReferralInfo: function(a) {
            e.getOpenId(function(t) {
                wx.request({
                    url: e.getUrl("Referral.ashx?action=GetReferralInfo"),
                    data: {
                        openId: t,
                        ReferralUserId: a
                    },
                    success: function(t) {
                        e.setRefferUserId(a, function(e) {}), wx.setStorageSync("ReferralInfo", t.data.referral_get_response), 
                        e.globalData.ReferralInfo = t.data.referral_get_response, wx.setNavigationBarTitle({
                            title: t.data.referral_get_response.ShopName
                        });
                    }
                });
            }, "noSkip");
        }
    }
});