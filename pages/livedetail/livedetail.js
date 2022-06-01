function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, o = Array(t.length); a < t.length; a++) o[a] = t[a];
        return o;
    }
    return Array.from(t);
}

var a = requirePlugin("live-player-plugin"), o = getApp(), e = require("../../utils/config.js");

Page({
    data: {
        roomId: 0,
        pageInit: !0,
        room: {},
        productList: [],
        pageNo: 0,
        loading: !1,
        isEnd: !1,
        timer: null,
        countdown: [ "00", "00", "00" ],
        isTimeOut: !1,
        liveTimer: null
    },
    onLoad: function(t) {
        var a = this;
        t.ReferralUserId && o.setRefferUserId(t.ReferralUserId), this.setData({
            roomId: t.roomId
        }), o.getSiteSettingData(function(t) {
            a.setData(t);
        }), this.loadData();
    },
    loadData: function() {
        var i = this;
        this.data.loading || this.data.isEnd || (this.setData({
            loading: !0,
            pageNo: this.data.pageNo + 1
        }), e.httpGet(o.getUrl("AppletLive.ashx?action=GetLiveRoomInfo"), {
            openId: o.globalData.openId,
            RoomId: this.data.roomId,
            PageIndex: this.data.pageNo,
            PageSize: 10
        }, function(o) {
            if (wx.stopPullDownRefresh(), "OK" === o.Status) {
                var e = JSON.parse(wx.getStorageSync("localRoom") || "{}"), r = "room_" + o.LiveRoomInfo.RoomId;
                e[r] && (o.LiveRoomInfo.Status = e[r]), a.getLiveStatus({
                    room_id: o.LiveRoomInfo.RoomId
                }).then(function(t) {
                    o.LiveRoomInfo.Status = t.liveStatus, e[r] = t.liveStatus, i.setData({
                        room: o.LiveRoomInfo
                    });
                }), wx.setStorageSync("localRoom", JSON.stringify(e)), i.setData({
                    room: o.LiveRoomInfo,
                    loading: !1,
                    isEnd: o.LiveProducts.length < 10,
                    productList: 1 === i.data.pageNo ? o.LiveProducts : [].concat(t(i.data.productList), t(o.LiveProducts))
                }), wx.setNavigationBarTitle({
                    title: o.LiveRoomInfo.Name
                }), 102 === o.LiveRoomInfo.Status && (i.setCountdown(), i.getLiveStatus());
            }
        }));
    },
    getLiveStatus: function() {
        var t = this;
        this.liveTimer = setInterval(function() {
            a.getLiveStatus({
                room_id: t.data.roomId
            }).then(function(a) {
                101 === a.liveStatus && (t.data.room.Status = 101, t.setData({
                    room: t.data.room
                }), clearInterval(t.liveTimer), clearInterval(t.timer));
            });
        }, 6e4);
    },
    setCountdown: function() {
        var t = this, a = +new Date(), o = +new Date(this.data.room.StartTime.replace("T", " ").replace(/-/g, "/"));
        if (o < a) return this.setData({
            isTimeOut: !0
        });
        var e = (o - a) / 1e3;
        this.timer = setInterval(function() {
            (e -= 1) < 0 && (e = 0, t.setData({
                isTimeOut: !0
            })), t.setData({
                countdown: t.formatDuring(e)
            }), e < 0 && clearInterval(t.timer);
        }, 1e3);
    },
    formatDuring: function(t) {
        var a, o, e;
        return a = parseInt(t / 3600), o = parseInt(t % 3600 / 60), e = parseInt(t % 60), 
        a < 10 && (a = "0" + a), o < 10 && (o = "0" + o), e < 10 && (e = "0" + e), [ a, o, e ];
    },
    openReplay: function() {
        wx.navigateTo({
            url: "../livereplay/livereplay?roomId=" + this.data.roomId
        });
    },
    openProduct: function(t) {
        wx.navigateTo({
            url: "/pages/productdetail/productdetail?id=" + t.currentTarget.dataset.id + "&room_id=" + this.data.roomId
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
        }), this.loadData();
    },
    onReachBottom: function() {
        this.loadData();
    },
    onShareAppMessage: function() {
        var t = "pages/livedetail/livedetail?roomId=" + this.data.roomId;
        return o.globalData.userInfo && o.globalData.userInfo.IsReferral && (t += "&ReferralUserId=" + o.globalData.userInfo.UserId), 
        console.log(t), {
            title: this.data.room.Name + "——" + this.data.room.AnchorName,
            imageUrl: this.data.room.CoverImg,
            path: t
        };
    }
});