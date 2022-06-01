function e(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}

function t(e) {
    return new Promise(function(t, i) {
        wx.downloadFile({
            url: e,
            success: function(r) {
                if (200 !== r.statusCode) return console.error("downloadFile " + e + " failed res.statusCode is not 200"), 
                void i();
                var a = r.tempFilePath;
                wx.getFileInfo({
                    filePath: a,
                    success: function(i) {
                        var r = i.size;
                        o(r).then(function() {
                            n(e, r, a).then(function(e) {
                                t(e);
                            });
                        }, function() {
                            t(a);
                        });
                    },
                    fail: function(e) {
                        console.error("getFileInfo " + r.tempFilePath + " failed, " + JSON.stringify(e)), 
                        t(r.tempFilePath);
                    }
                });
            },
            fail: function(e) {
                console.error("downloadFile failed, " + JSON.stringify(e) + " "), i();
            }
        });
    });
}

function n(e, t, n) {
    return new Promise(function(o, r) {
        wx.saveFile({
            tempFilePath: n,
            success: function(n) {
                var i = w[c] ? w[c] : 0;
                w[e] = {}, w[e][d] = n.savedFilePath, w[e][y] = new Date().getTime(), w[e][v] = t, 
                w.totalSize = t + i, wx.setStorage({
                    key: s,
                    data: w
                }), o(n.savedFilePath);
            },
            fail: function(t) {
                console.error("saveFile " + e + " failed, then we delete all files, " + JSON.stringify(t)), 
                o(n), i();
            }
        });
    });
}

function i() {
    wx.removeStorage({
        key: s,
        success: function() {
            wx.getSavedFileList({
                success: function(e) {
                    r(e.fileList);
                },
                fail: function(e) {
                    console.error("getSavedFileList failed, " + JSON.stringify(e));
                }
            });
        }
    });
}

function o(e) {
    return new Promise(function(t, n) {
        var i = w[c] ? w[c] : 0;
        if (e + i <= S) t(); else {
            var o = [], a = JSON.parse(JSON.stringify(w));
            delete a[c];
            var f = Object.keys(a).sort(function(e, t) {
                return a[e][y] - a[t][y];
            }), l = !0, u = !1, v = void 0;
            try {
                for (var g, h = f[Symbol.iterator](); !(l = (g = h.next()).done); l = !0) {
                    var m = g.value;
                    if (i -= w[m].size, o.push(w[m][d]), delete w[m], i + e < S) break;
                }
            } catch (e) {
                u = !0, v = e;
            } finally {
                try {
                    !l && h.return && h.return();
                } finally {
                    if (u) throw v;
                }
            }
            w.totalSize = i, wx.setStorage({
                key: s,
                data: w,
                success: function() {
                    o.length > 0 && r(o), t();
                },
                fail: function(e) {
                    console.error("doLru setStorage failed, " + JSON.stringify(e)), n();
                }
            });
        }
    });
}

function r(e) {
    var t = !0, n = !1, i = void 0;
    try {
        for (var o, r = e[Symbol.iterator](); !(t = (o = r.next()).done); t = !0) !function() {
            var e = o.value, t = e;
            "object" === (void 0 === e ? "undefined" : f(e)) && (t = e.filePath), wx.removeSavedFile({
                filePath: t,
                fail: function(t) {
                    console.error("removeSavedFile " + e + " failed, " + JSON.stringify(t));
                }
            });
        }();
    } catch (e) {
        n = !0, i = e;
    } finally {
        try {
            !t && r.return && r.return();
        } finally {
            if (n) throw i;
        }
    }
}

function a(e) {
    if (w[e]) return w[e].time = new Date().getTime(), wx.setStorage({
        key: s,
        data: w
    }), w[e];
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var f = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, l = function() {
    function e(e, t) {
        for (var n = 0; n < t.length; n++) {
            var i = t[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), 
            Object.defineProperty(e, i.key, i);
        }
    }
    return function(t, n, i) {
        return n && e(t.prototype, n), i && e(t, i), t;
    };
}(), u = require("./util"), s = "savedFiles", c = "totalSize", d = "path", y = "time", v = "size", S = 6291456, w = {}, g = function() {
    function n() {
        e(this, n), getApp().PAINTER_MAX_LRU_SPACE && (S = getApp().PAINTER_MAX_LRU_SPACE), 
        wx.getStorage({
            key: s,
            success: function(e) {
                e.data && (w = e.data);
            }
        });
    }
    return l(n, [ {
        key: "download",
        value: function(e) {
            return new Promise(function(n, i) {
                if (e && u.isValidUrl(e)) {
                    var o = a(e);
                    o ? wx.getSavedFileInfo({
                        filePath: o[d],
                        success: function(e) {
                            n(o[d]);
                        },
                        fail: function(o) {
                            console.error("the file is broken, redownload it, " + JSON.stringify(o)), t(e).then(function(e) {
                                n(e);
                            }, function() {
                                i();
                            });
                        }
                    }) : t(e).then(function(e) {
                        n(e);
                    }, function() {
                        i();
                    });
                } else n(e);
            });
        }
    } ]), n;
}();

exports.default = g;