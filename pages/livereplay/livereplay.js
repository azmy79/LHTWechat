function t(t) {
    if (Array.isArray(t)) {
        for (var o = 0, a = Array(t.length); o < t.length; o++) a[o] = t[o];
        return a;
    }
    return Array.from(t);
}

var o = getApp(), a = require("../../utils/config.js");

Page({
    data: {
        statusBarHeight: 20,
        roomId: 0,
        room: {},
        productList: [],
        pageNo: 0,
        loading: !1,
        isEnd: !1,
        videoUrl: "",
        videoIndex: 0,
        isPlay: !1,
        showProduct: !1
    },
    onLoad: function(t) {
        var e = this;
        t.ReferralUserId && o.setRefferUserId(t.ReferralUserId), wx.showLoading({
            title: "加载中..."
        }), this.setData({
            roomId: t.roomId
        }), wx.getSystemInfo({
            success: function(t) {
                e.setData({
                    statusBarHeight: t.statusBarHeight
                });
            }
        }), a.httpGet(o.getUrl("AppletLive.ashx?action=GetLiveRoomReplays"), {
            openId: o.globalData.openId,
            RoomId: this.data.roomId
        }, function(t) {
            if ("OK" === t.Status) {
                var o = t.LiveReplays.map(function(t) {
                    return t.MediaUrl;
                });
                e.setData({
                    room: t.LiveRoomInfo,
                    videoUrl: o[0]
                }), t.LiveReplays.length <= 0 && (wx.hideLoading(), wx.showModal({
                    content: "回放生成中，稍后再试",
                    showCancel: !1
                })), e.loadProduct();
            }
        });
    },
    loadProduct: function() {
        var e = this;
        this.data.loading || this.data.isEnd || (this.setData({
            loading: !0,
            pageNo: this.data.pageNo + 1
        }), a.httpGet(o.getUrl("AppletLive.ashx?action=GetLiveRoomInfo"), {
            openId: o.globalData.openId,
            RoomId: this.data.roomId,
            PageIndex: this.data.pageNo,
            pageSize: 10
        }, function(o) {
            "OK" === o.Status && e.setData({
                productList: [].concat(t(e.data.productList), t(o.LiveProducts)),
                isEnd: o.LiveProducts.length < 10,
                loading: !1
            });
        }));
    },
    scrolltolower: function() {
        this.loadProduct();
    },
    back: function() {
        getCurrentPages().length > 1 ? wx.navigateBack() : wx.redirectTo({
            url: "../livelist/livelist"
        });
    },
    videoPlay: function() {
        this.setData({
            isPlay: !0
        }), wx.hideLoading();
    },
    videoEnd: function() {
        this.data.videoIndex < this.data.recordingUrlList.length - 1 && this.setData({
            videoIndex: this.data.videoIndex + 1,
            videoUrl: this.data.recordingUrlList[this.data.videoIndex + 1]
        });
    },
    toggleProduct: function() {
        this.setData({
            showProduct: !this.data.showProduct
        });
    },
    toggleList: function() {
        this.setData({
            showList: !this.data.showList
        });
    },
    switchVideo: function(t) {
        wx.showLoading({
            title: "切换中..."
        }), this.setData({
            isPlay: !1,
            videoUrl: t.currentTarget.dataset.url,
            showList: !1,
            videoIndex: t.currentTarget.dataset.index
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
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