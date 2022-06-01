function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

function t(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

function a(e) {
    var t = this, a = e.target.dataset.src, i = e.target.dataset.from;
    void 0 !== i && i.length > 0 && wx.previewImage({
        current: a,
        urls: t.data[i].imageUrls
    });
}

function i(e) {
    var t = this, a = e.target.dataset.from, i = e.target.dataset.idx;
    void 0 !== a && a.length > 0 && r(e, i, t, a);
}

function r(e, a, i, r) {
    var d, s = o(r, i.data);
    if (s && 0 != s.images.length) {
        var l = s.images, g = n(e.detail.width, e.detail.height, i, r), h = l[a].index, u = "" + r, v = !0, m = !1, f = void 0;
        try {
            for (var w, c = h.split(".")[Symbol.iterator](); !(v = (w = c.next()).done); v = !0) u += ".nodes[" + w.value + "]";
        } catch (e) {
            m = !0, f = e;
        } finally {
            try {
                !v && c.return && c.return();
            } finally {
                if (m) throw f;
            }
        }
        var x = u + ".width", j = u + ".height";
        i.setData((d = {}, t(d, x, g.imageWidth), t(d, j, g.imageheight), d));
    }
}

function n(e, t, a, i) {
    var r = 0, n = 0, d = 0, s = {}, h = o(i, a.data).view.imagePadding;
    return r = l - 2 * h / 750 * l, g, e > r ? (d = (n = r) * t / e, s.imageWidth = n, 
    s.imageheight = d) : (s.imageWidth = e, s.imageheight = t), s;
}

function o(e, t) {
    t || console.error("obj is invalid:", t);
    var a = e.split(/\./), i = a.shift(), r = /^([a-zA-Z0-9_-]+)\[([0-9]+)\]$/;
    if (r.test(i)) {
        var n = i.match(r);
        i = n[1];
        var d = n[2];
        a.unshift(d);
    }
    return a.length < 1 ? t[i] : (t = t[i], o(a.join("."), t));
}

var d = e(require("./showdown.js")), s = e(require("./html2json.js")), l = 0, g = 0;

wx.getSystemInfo({
    success: function(e) {
        l = e.windowWidth, g = e.windowHeight;
    }
}), module.exports = {
    wxParse: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "wxParseData", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "html", r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '<div class="color:red;">数据不能为空</div>', n = arguments[3], o = arguments[4], l = n, g = {};
        if ("html" == t) g = s.default.html2json(r, e); else if ("md" == t || "markdown" == t) {
            var h = new d.default.Converter().makeHtml(r);
            g = s.default.html2json(h, e), console.log(JSON.stringify(g, " ", " "));
        }
        g.view = {}, g.view.imagePadding = 0, void 0 !== o && (g.view.imagePadding = o);
        var u = {};
        u[e] = g, l.setData(u), l.wxParseImgLoad = i, l.wxParseImgTap = a;
    },
    wxParseTemArray: function(e, t, a, i) {
        for (var r = [], n = i.data, o = null, d = 0; d < a; d++) {
            var s = n[t + d].nodes;
            r.push(s);
        }
        e = e || "wxParseTemArray", (o = JSON.parse('{"' + e + '":""}'))[e] = r, i.setData(o);
    },
    emojisInit: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "/wxParse/emojis/", a = arguments[2];
        s.default.emojisInit(e, t, a);
    }
};