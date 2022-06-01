var n = getApp(), e = require("../wxParse/wxParse.js");

require("../../utils/config.js");

Page({
    data: {
        Agreement: ""
    },
    onLoad: function(o) {
        var t = this, a = n.globalData.siteInfo.RecruitmentAgreement;
        e.wxParse("Agreement", "html", a, t);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});