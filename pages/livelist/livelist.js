function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, o = Array(t.length); a < t.length; a++) o[a] = t[a];
        return o;
    }
    return Array.from(t);
}

var a = getApp(), o = require("../../utils/config.js"), e = requirePlugin("live-player-plugin");

Page({
    data: {
        pageNo: 0,
        pageSize: 10,
        firstScene: {},
        list: [],
        loading: !1,
        isEnd: !1
    },
    onLoad: function(t) {
        this.loadFirstScene(), this.loadData(), wx.showLoading({
            title: "加载中"
        });
    },
    loadFirstScene: function() {
        var t = this;
        o.httpGet(a.getUrl("AppletLive.ashx?action=GetFirstLivingScene"), {
            openId: a.globalData.openId
        }, function(a) {
            if ("OK" === a.Status) {
                var o = JSON.parse(wx.getStorageSync("localRoom") || "{}"), i = "room_" + a.data.RoomId;
                o[i] && (a.LiveRoomInfo.Status = o[i]), e.getLiveStatus({
                    room_id: a.LiveRoomInfo.RoomId
                }).then(function(e) {
                    a.LiveRoomInfo.Status = e.liveStatus, o[i] = e.liveStatus, t.setData({
                        firstScene: a.data
                    });
                }), wx.setStorageSync("localRoom", JSON.stringify(o)), t.setData({
                    firstScene: a.LiveRoomInfo
                });
            } else t.setData({
                firstScene: {}
            });
        });
    },
    loadData: function() {
        var i = this;
        this.data.loading || this.data.isEnd || (this.setData({
            loading: !0,
            pageNo: this.data.pageNo + 1
        }), o.httpGet(a.getUrl("AppletLive.ashx?action=GetLiveRooms"), {
            openId: a.globalData.openId,
            PageIndex: this.data.pageNo,
            PageSize: 10
        }, function(a) {
            if (wx.stopPullDownRefresh(), "OK" === a.Status) {
                a.LiveRooms.length < 10 && i.setData({
                    isEnd: !0
                });
                var o = JSON.parse(wx.getStorageSync("localRoom") || "{}");
                a.LiveRooms.forEach(function(t) {
                    var a = "room_" + t.RoomId;
                    o[a] && (t.Status = o[a]), e.getLiveStatus({
                        room_id: t.RoomId
                    }).then(function(e) {
                        t.Status = e.liveStatus, o[a] = e.liveStatus;
                    });
                }), wx.setStorageSync("localRoom", JSON.stringify(o)), setTimeout(function() {
                    i.setData({
                        list: 1 === i.data.pageNo ? a.LiveRooms : [].concat(t(i.data.list), t(a.LiveRooms)),
                        loading: !1
                    }), wx.hideLoading();
                }, 1e3);
            }
        }));
    },
    handleOpen: function(t) {
        var a = t.currentTarget.dataset.id, o = "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=" + a;
        101 !== t.currentTarget.dataset.status && (o = "../livedetail/livedetail?roomId=" + a), 
        wx.navigateTo({
            url: o
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.setData({
            pageNo: 0,
            isEnd: !1
        }), this.loadFirstScene(), this.loadData();
    },
    onReachBottom: function() {
        this.loadData();
    }
});