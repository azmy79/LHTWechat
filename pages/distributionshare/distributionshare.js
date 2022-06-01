var e = require("../../utils/config.js"), t = getApp();

Page({
    data: {},
    onLoad: function(e) {
        var o = this, a = this;
        e.ReferralUserId && t.setRefferUserId(e.ReferralUserId), t.getOpenId(function(e) {
            wx.request({
                url: t.getUrl("Referral.ashx?action=GetReferralInfo"),
                data: {
                    openId: e
                },
                success: function(e) {
                    a.setData({
                        RefferImg: e.data.referral_get_response.ReferralPosterUrl,
                        QrCodeUrl: e.data.referral_get_response.QrCodeWidth,
                        Qwidth: e.data.referral_get_response.QrCodeWidth
                    });
                }
            });
        });
        t.getSiteSettingData(function(e) {
            o.setData(e);
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function(o) {
        var a;
        return t.globalData.userInfo && t.globalData.userInfo.IsReferral && (a = "/pages/home/home?ReferralUserId=" + t.globalData.userInfo.UserId), 
        {
            title: t.globalData.ReferralInfo.ShopName,
            imageUrl: "",
            path: a,
            success: function(t) {
                e.showTip("分享成功", "success");
            },
            fail: function(t) {
                e.showTip("分享失败", "error");
            }
        };
    },
    saveImg: function(e) {
        var t = this;
        wx.showModal({
            title: "提示",
            content: "是否保存图片",
            success: function(e) {
                e.confirm ? wx.getSetting({
                    success: function(e) {
                        wx.authorize({
                            scope: "scope.writePhotosAlbum",
                            success: function(e) {
                                var o = t.data.RefferImg;
                                wx.downloadFile({
                                    url: o,
                                    success: function(e) {
                                        wx.saveImageToPhotosAlbum({
                                            filePath: e.tempFilePath,
                                            success: function(e) {
                                                wx.showToast({
                                                    title: "成功保存到相册",
                                                    icon: "success"
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }) : e.cancel;
            }
        });
    }
});