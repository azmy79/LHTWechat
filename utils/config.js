function t(t) {
    var n = [];
    for (var e in t) n.push(encodeURIComponent(e) + "=" + encodeURIComponent(t[e]));
    return n.join("&");
}

function n(t) {
    return (t = t.toString())[1] ? t : "0" + t;
}

function e(t) {
    switch (t) {
      case "success":
        return "/images/icon-success.png";

      case "tips":
        return "/images/icon-tips.png";

      case "waiting":
        return "/images/waiting.png";

      case "warning":
        return "/images/icon-warning.png";

      case "loading":
        return "/images/loading.png";

      default:
        return "/images/icon-danger.png";
    }
}

function o(t) {
    var n;
    if ("object" == (void 0 === t ? "undefined" : i(t))) if (null === t) n = null; else if (t instanceof Array) {
        n = [];
        for (var e = 0, r = t.length; e < r; e++) n.push(o(t[e]));
    } else {
        n = {};
        for (var c in t) n[c] = o(t[c]);
    } else n = t;
    return n;
}

var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

module.exports = {
    json2Form: t,
    httpGet: function(t, n, e) {
        wx.request({
            url: t,
            data: n,
            method: "GET",
            success: function(t) {
                e(t.data);
            },
            fail: function(t) {
                wx.showToast({
                    title: t.errMsg,
                    icon: "fail",
                    duration: 2e3
                });
            },
            complete: function(t) {}
        });
    },
    httpPost: function(n, e, o) {
        wx.request({
            url: n,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: t(e),
            method: "POST",
            success: function(t) {
                o(t.data);
            },
            fail: function(t) {
                wx.showToast({
                    title: t.errMsg,
                    icon: "fail",
                    duration: 2e3
                });
            },
            complete: function(t) {}
        });
    },
    formatTime: function(t, e) {
        if (void 0 != t) {
            t = t.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)?\.(.*)/, "$1/$2/$3 $4");
            var o = (t = new Date(t)).getFullYear(), i = t.getMonth() + 1, r = t.getDate(), c = t.getHours(), a = t.getMinutes(), s = t.getSeconds();
            return void 0 != e && "" != e ? [ o, i, r ].map(n).join("-") : [ o, i, r ].map(n).join("-") + " " + [ c, a, s ].map(n).join(":");
        }
    },
    getNowDate: function(t) {
        var n = new Date(), e = {
            "M+": n.getMonth() + 1,
            "d+": n.getDate(),
            "h+": n.getHours(),
            "m+": n.getMinutes(),
            "s+": n.getSeconds(),
            "q+": Math.floor((n.getMonth() + 3) / 3),
            S: n.getMilliseconds()
        };
        /(y+)/.test(t) && (t = t.replace(RegExp.$1, (n.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var o in e) new RegExp("(" + o + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[o] : ("00" + e[o]).substr(("" + e[o]).length)));
        return t;
    },
    showTip: function(t, n) {
        t.length > 7 ? wx.showModal({
            title: "提示",
            content: t,
            showCancel: !1,
            success: function(t) {
                t.confirm;
            }
        }) : wx.showToast({
            title: t,
            image: e(n)
        });
    },
    hideTip: function() {
        wx.hideToast();
    },
    showLoad: function(t) {
        wx.showLoading({
            title: t
        });
    },
    hideLoad: function() {
        wx.hideLoading();
    },
    showModal: function(t, n, e) {
        wx.showModal({
            title: t,
            content: n,
            showCancel: !1,
            success: function(t) {
                t.confirm && e && e();
            }
        });
    },
    showCancelModal: function(t, n, e, o) {
        wx.showModal({
            title: t,
            content: n,
            success: function(t) {
                t.confirm ? void 0 != e && "function" == typeof e && e() : t.cancel && void 0 != o && "function" == typeof o && callcancelbackback();
            }
        });
    },
    trim: function(t) {
        return null != t && t.replace(/(^\s*)|(\s*$)/g, "");
    },
    formatMoney: function(t, n) {
        var e = parseFloat(t);
        if (isNaN(e)) return !1;
        var o = (e = Math.round(100 * t) / 100).toString(), i = o.indexOf(".");
        for (i < 0 && (i = o.length, o += "."); o.length <= i + 2; ) o += "0";
        return o;
    },
    getRequestImg: function(t) {
        void 0 != t && app.getRequestUrl;
    },
    clone: o,
    FormatDistance: function(t) {
        return parseInt(t) < 1e3 ? Math.round(t) + "M" : (Math.round(t / 100) / 10).toFixed(1) + "KM";
    },
    checkEmail: function(t) {
        return (t = t || "").length > 3 && t.indexOf("@") > -1;
    },
    checkPhone: function(t) {
        return t = t || "", /^0?(13|15|18|14|17|19|16)[0-9]{9}$/.test(t);
    }
};