var e = require("../../utils/config.js"), a = getApp();

Page({
    data: {
        BannerUrl: "",
        ShopName: "",
        Email: "",
        Phone: "",
        ImageCode: "",
        PhoneCode: "",
        dateStr: new Date()
    },
    onLoad: function(e) {
        var n = this;
        wx.setNavigationBarTitle({
            title: a.globalData.ReferralSettingInfo.ShopSettingName
        }), a.getSiteSettingData(function(e) {
            n.setData(e);
        }), a.globalData.ReferralInfo.ReferralCellPhone && !a.globalData.ReferralInfo.ReferralExtInfo.CellPhone && (a.globalData.ReferralInfo.ReferralExtInfo.CellPhone = a.globalData.ReferralInfo.ReferralCellPhone), 
        a.globalData.ReferralInfo.ReferralEmail && !a.globalData.ReferralInfo.ReferralExtInfo.Email && (a.globalData.ReferralInfo.ReferralExtInfo.Email = a.globalData.ReferralInfo.ReferralEmail), 
        a.globalData.ReferralInfo.BannerUrl || (a.globalData.ReferralInfo.BannerUrl = a.globalData.userInfo.picture), 
        this.setData({
            VcodeUrl: a.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + a.globalData.openId,
            UserCredentials: a.globalData.ReferralInfo.BannerUrl,
            BannerUrl: a.globalData.ReferralInfo.BannerUrl,
            ShopName: a.globalData.ReferralInfo.ShopName,
            Email: a.globalData.ReferralInfo.ReferralExtInfo.Email,
            Phone: a.globalData.ReferralInfo.ReferralExtInfo.CellPhone
        });
    },
    DeleteImg: function() {
        var a = this;
        e.showCancelModal("删除", "确定要删除Logo图片吗", function() {
            a.setData({
                UserCredentials: "../../images/return-img_03.jpg",
                BannerUrl: ""
            });
        });
    },
    ChooseImg: function(e) {
        var n = this;
        a.getRequestUrl;
        n.data.BannerUrl ? wx.previewImage({
            current: n.data.BannerUrl,
            urls: [ n.data.BannerUrl ]
        }) : wx.chooseImage({
            count: 1,
            success: function(e) {
                var a = e.tempFilePaths[0];
                n.setData({
                    UserCredentials: a
                }), n.UploadImage(a);
            }
        });
    },
    UploadImage: function(e) {
        var n = "", o = this;
        a.getOpenId(function(t) {
            wx.uploadFile({
                url: a.getUrl("Common.ashx?action=UploadAppletImage"),
                filePath: e,
                name: "file",
                formData: {
                    openId: t
                },
                success: function(e) {
                    var a = JSON.parse(e.data);
                    "OK" == a.Status ? n = a.Data[0].ImageUrl : "NOUser" == a.Message ? wx.navigateTo({
                        url: "../login/login"
                    }) : wx.showModal({
                        title: "提示",
                        confirmColor: "#ff5722",
                        content: a.ErrorResponse.ErrorMsg,
                        showCancel: !1,
                        success: function(e) {
                            e.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {
                    n && o.setData({
                        BannerUrl: n
                    });
                }
            });
        });
    },
    ChangeCode: function() {
        this.setData({
            VcodeUrl: a.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + a.globalData.openId + "&&d=" + new Date()
        });
    },
    SaveStore: function() {
        var n = this;
        n.data.ShopName ? n.data.Email ? n.data.Phone ? a.getOpenId(function(o) {
            wx.request({
                url: a.getUrl("Referral.ashx?action=SetReferralShopInfo"),
                data: {
                    openId: o,
                    Email: n.data.Email,
                    Phone: n.data.Phone,
                    ShopName: n.data.ShopName,
                    BannerUrl: n.data.BannerUrl
                },
                success: function(a) {
                    a.data.error_response ? e.showTip(a.data.error_response.sub_msg) : wx.showModal({
                        title: "店铺信息",
                        content: "修改店铺信息成功",
                        success: function(e) {
                            e.confirm && wx.switchTab({
                                url: "../userhome/userhome"
                            });
                        }
                    });
                },
                complete: function() {}
            });
        }) : e.showTip("输入手机号码", "tips") : e.showTip("输入邮箱账号", "tips") : e.showTip("输入店铺名称", "tips");
    },
    InputValue: function(e) {
        var a = e.currentTarget.dataset.key;
        this.data[a] = e.detail.value;
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});