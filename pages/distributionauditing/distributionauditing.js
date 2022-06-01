require("../../utils/config.js");

var e = getApp();

Page({
    data: {
        ResultImg: [ "../../images/waring_03.png", "../../images/wait_03.png" ],
        ResultMessage: "",
        ResultStatue: "",
        ResultIcon: "",
        ReferralInfo: ""
    },
    onLoad: function(t) {
        var a = this, n = "", u = "您提交的申请正在审核中……";
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("Referral.ashx?action=GetReferralInfo"),
                data: {
                    openId: t
                },
                success: function(e) {
                    var t = e.data.referral_get_response;
                    1 == t.ReferralStatus ? n = a.data.ResultImg[1] : 3 == t.ReferralStatus && (n = a.data.ResultImg[0], 
                    u = t.RefusalReason), a.setData({
                        ResultStatueText: t.ReferralStatusText,
                        ResultMessage: u,
                        ResultIcon: n,
                        ResultStatue: t.ReferralStatus
                    });
                }
            });
        }), e.getSiteSettingData(function(e) {
            a.setData(e);
        });
    },
    ApplicationReqeust: function() {
        wx.redirectTo({
            url: "../distributionapply/distributionapply"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    ReturnUp: function() {
        wx.switchTab({
            url: "../userhome/userhome"
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});