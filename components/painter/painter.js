function t(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}

function e() {
    String.prototype.toPx = function(t) {
        var e = void 0, n = (e = t ? /^-?[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g : /^[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g).exec(this);
        if (!this || !n) return console.error("The size: " + this + " is illegal"), 0;
        var i = n[2], r = parseFloat(this), a = 0;
        return "rpx" === i ? a = Math.round(r * o) : "px" === i && (a = r), a;
    };
}

var n = t(require("./lib/pen")), i = t(require("./lib/downloader")), r = require("./lib/util"), a = new i.default();

Component({
    canvasWidthInPx: 0,
    canvasHeightInPx: 0,
    paintCount: 0,
    properties: {
        customStyle: {
            type: String
        },
        palette: {
            type: Object,
            observer: function(t, e) {
                this.isNeedRefresh(t, e) && (this.paintCount = 0, this.startPaint());
            }
        },
        dirty: {
            type: Boolean,
            value: !1
        }
    },
    data: {
        picURL: "",
        showCanvas: !0,
        painterStyle: ""
    },
    attached: function() {
        e();
    },
    methods: {
        isEmpty: function(t) {
            for (var e in t) return !1;
            return !0;
        },
        isNeedRefresh: function(t, e) {
            return !(!t || this.isEmpty(t) || this.data.dirty && r.equal(t, e));
        },
        startPaint: function() {
            var t = this;
            if (!this.isEmpty(this.properties.palette)) {
                if (!getApp().systemInfo || !getApp().systemInfo.screenWidth) try {
                    getApp().systemInfo = wx.getSystemInfoSync();
                } catch (t) {
                    var e = "Painter get system info failed, " + JSON.stringify(t);
                    return that.triggerEvent("imgErr", {
                        error: e
                    }), void console.error(e);
                }
                o = getApp().systemInfo.screenWidth / 750, this.downloadImages().then(function(e) {
                    var i = e.width, r = e.height;
                    if (t.canvasWidthInPx = i.toPx(), t.canvasHeightInPx = r.toPx(), i && r) {
                        t.setData({
                            painterStyle: "width:" + i + ";height:" + r + ";"
                        });
                        var a = wx.createCanvasContext("k-canvas", t);
                        new n.default(a, e).paint(function() {
                            t.saveImgToLocal();
                        });
                    } else console.error("You should set width and height correctly for painter, width: " + i + ", height: " + r);
                });
            }
        },
        downloadImages: function() {
            var t = this;
            return new Promise(function(e, n) {
                var i = 0, r = 0, o = JSON.parse(JSON.stringify(t.properties.palette));
                if (o.background && (i++, a.download(o.background).then(function(t) {
                    o.background = t, i === ++r && e(o);
                }, function() {
                    i === ++r && e(o);
                })), o.views) {
                    var s = !0, c = !1, u = void 0;
                    try {
                        for (var f, h = o.views[Symbol.iterator](); !(s = (f = h.next()).done); s = !0) !function() {
                            var t = f.value;
                            t && "image" === t.type && t.url && (i++, a.download(t.url).then(function(n) {
                                t.url = n, wx.getImageInfo({
                                    src: t.url,
                                    success: function(e) {
                                        t.sWidth = e.width, t.sHeight = e.height;
                                    },
                                    fail: function(t) {
                                        console.error("getImageInfo failed, " + JSON.stringify(t));
                                    },
                                    complete: function() {
                                        i === ++r && e(o);
                                    }
                                });
                            }, function() {
                                i === ++r && e(o);
                            }));
                        }();
                    } catch (t) {
                        c = !0, u = t;
                    } finally {
                        try {
                            !s && h.return && h.return();
                        } finally {
                            if (c) throw u;
                        }
                    }
                }
                0 === i && e(o);
            });
        },
        saveImgToLocal: function() {
            var t = this, e = this;
            setTimeout(function() {
                wx.canvasToTempFilePath({
                    canvasId: "k-canvas",
                    success: function(t) {
                        e.getImageInfo(t.tempFilePath);
                    },
                    fail: function(t) {
                        console.error("canvasToTempFilePath failed, " + JSON.stringify(t)), e.triggerEvent("imgErr", {
                            error: t
                        });
                    }
                }, t);
            }, 300);
        },
        getImageInfo: function(t) {
            var e = this;
            wx.getImageInfo({
                src: t,
                success: function(n) {
                    if (e.paintCount > 5) {
                        var i = "The result is always fault, even we tried 5 times";
                        return console.error(i), void e.triggerEvent("imgErr", {
                            error: i
                        });
                    }
                    Math.abs((n.width * e.canvasHeightInPx - e.canvasWidthInPx * n.height) / (n.height * e.canvasHeightInPx)) < .01 ? e.triggerEvent("imgOK", {
                        path: t
                    }) : e.startPaint(), e.paintCount++;
                },
                fail: function(t) {
                    console.error("getImageInfo failed, " + JSON.stringify(t)), e.triggerEvent("imgErr", {
                        error: t
                    });
                }
            });
        }
    }
});

var o = .5;