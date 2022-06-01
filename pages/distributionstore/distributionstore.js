var t = getApp();

Page({
    data: {
        openId: "",
        headerbg: t.getRequestUrl + "/Templates/xcxshop/images/feixiao_header.png",
        DistributionInfo: "",
        ReferralSettingInfo: ""
    },
    onLoad: function(i) {
        var e = this, a = this;
        a.setData({
            ReferralSettingInfo: t.globalData.ReferralSettingInfo
        }), wx.setNavigationBarTitle({
            title: t.globalData.ReferralSettingInfo.DistributionName
        }), t.getOpenId(function(i) {
            wx.request({
                url: t.getUrl("Referral.ashx?action=GetReferralInfo"),
                data: {
                    openId: i
                },
                success: function(i) {
                    t.globalData.ReferralInfo = i.data.referral_get_response, a.GetCheckData();
                }
            });
        }), t.getSiteSettingData(function(t) {
            e.setData(t);
        });
    },
    RefferStore: function() {
        wx.navigateTo({
            url: "../distributionshare/distributionshare"
        });
    },
    bindstoreinfo: function() {
        wx.navigateTo({
            url: "../distributionset/distributionset"
        });
    },
    GetCheckData: function() {
        this.setData({
            DistributionInfo: t.globalData.ReferralInfo
        });
    },
    bindyongjin: function(t) {
        wx.navigateTo({
            url: "../distributioncommision/distributioncommision"
        });
    },
    bindxiaji: function(t) {
        wx.navigateTo({
            url: "../distributionsub/distributionsub"
        });
    }
});