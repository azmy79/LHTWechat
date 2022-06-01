var a = getApp();

Page({
    data: {
        userInfo: {}
    },
    onLoad: function(e) {
        var t = this;
        a.getSiteSettingData(function(a) {
            t.setData(a);
        });
    },
    onShow: function() {
        var a = this;
        a.loadData(a);
    },
    onPullDownRefresh: function() {
        var a = this;
        a.loadData(a);
    },
    loadData: function(e) {
        var e = this;
        a.globalData.userInfo && e.setData({
            userInfo: a.globalData.userInfo
        });
    },
    bindPhone: function(a) {
        var e = a.currentTarget.dataset.tel;
        null == e && (e = ""), wx.navigateTo({
            url: "../userbindphone/userbindphone?phone=" + e
        });
    },
    bindEmail: function(a) {
        var e = a.currentTarget.dataset.email, t = a.currentTarget.dataset.emailverification;
        wx.navigateTo({
            url: "../userbindEmail/userbindEmail?email=" + e + "&EmailVerification=" + t
        });
    },
    bindSetPassword: function(a) {
        var e = a.currentTarget.dataset.issetuserpassword;
        wx.navigateTo({
            url: "../userloginpassword/userloginpassword?IsSetUserPassword=" + e
        });
    },
    bindSetTradePwd: function(a) {
        var e = a.currentTarget.dataset.openbalance, t = a.currentTarget.dataset.settradepwd;
        t ? wx.navigateTo({
            url: "../userresetpaypwd/userresetpaypwd?openbalance=" + e + "&settradepwd=" + t
        }) : wx.navigateTo({
            url: "../usersetpaypwd/usersetpaypwd?openbalance=" + e + "&settradepwd=" + t
        });
    },
    bindUserProfile: function(a) {
        wx.navigateTo({
            url: "../userinfo/userinfo"
        });
    },
    ExitLoginout: function() {
        a.getOpenId(function(e) {
            wx.request({
                url: a.getUrl("Login.ashx?action=logout"),
                data: {
                    openId: e
                },
                success: function(e) {
                    wx.removeStorageSync("mallAppletOpenId"), a.globalData.openId = "", a.globalData.userInfo = null, 
                    wx.redirectTo({
                        url: "../login/login"
                    });
                }
            });
        });
    }
});