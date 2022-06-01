var t = getApp();

Page({
    data: {},
    onLoad: function(e) {
        var a = this;
        wx.request({
            url: t.getUrl("FightGroup.ashx?action=FightGroupShare"),
            data: {
                openId: t.globalData.openId,
                orderid: e.orderid
            },
            success: function(t) {
                "OK" == t.data.Status && (t = t.data.Result, a.setData({
                    fightGroupId: t.GroupId,
                    joinGroupId: parseInt(e.fightGroupId),
                    needJoinNumber: t.NeedJoinNumber,
                    shareImage: t.ShareImage,
                    shareTitle: t.ShareTitle,
                    sharePath: "/pages/fightdetail/fightdetail?groupid=" + t.GroupId + "&activeid=" + t.ActivityId
                }));
            }
        }), t.getSiteSettingData(function(t) {
            a.setData(t);
        });
    },
    goGroupOrder: function() {
        wx.redirectTo({
            url: "../fightorderdetail/fightorderdetail?id=" + this.data.fightGroupId
        });
    },
    goGroupList: function() {
        wx.redirectTo({
            url: "../fightgroup/fightgroup"
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.shareTitle,
            imageUrl: this.data.shareImage,
            path: this.data.sharePath
        };
    }
});