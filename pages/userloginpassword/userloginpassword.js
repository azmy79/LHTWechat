var t = require("../../utils/config.js"), a = getApp();

Page({
    data: {
        issetuserpassword: ""
    },
    onLoad: function(t) {
        var e = this;
        this.setData({
            issetuserpassword: t.IsSetUserPassword
        }), t.IsSetUserPassword && wx.setNavigationBarTitle({
            title: "修改登录密码"
        }), a.getSiteSettingData(function(t) {
            e.setData(t);
        });
    },
    InputValue: function(t) {
        var a = t.currentTarget.dataset.key;
        this.data[a] = t.detail.value;
    },
    SavePwdBtn: function() {
        var e = this.data;
        e.pwd.length < 6 || e.surepwd.length < 6 ? t.showTip("输入六位数密码", "tips") : e.pwd == e.surepwd ? a.getOpenId(function(s) {
            wx.request({
                url: a.getUrl("UserCenter.ashx?action=ChangePassword"),
                data: {
                    openId: s,
                    password: e.pwd,
                    oldPassword: e.oldpwd
                },
                success: function(a) {
                    void 0 == a.data.error_response ? "OK" == a.data.Status ? (t.showTip(a.data.Message, "success"), 
                    wx.navigateBack({
                        delta: 2
                    })) : t.showTip(a.data.Message, "warning") : t.showTip(a.data.error_response.sub_msg);
                }
            });
        }) : t.showTip("输入的两次密码不一致", "tips");
    },
    CancelPwdBtn: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});