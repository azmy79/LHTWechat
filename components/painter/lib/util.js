function t(e, n) {
    if (e === n) return !0;
    if (e && n && "object" == (void 0 === e ? "undefined" : r(e)) && "object" == (void 0 === n ? "undefined" : r(n))) {
        var o, i, f, u = Array.isArray(e), y = Array.isArray(n);
        if (u && y) {
            if ((i = e.length) != n.length) return !1;
            for (o = i; 0 != o--; ) if (!t(e[o], n[o])) return !1;
            return !0;
        }
        if (u != y) return !1;
        var a = e instanceof Date, c = n instanceof Date;
        if (a != c) return !1;
        if (a && c) return e.getTime() == n.getTime();
        var s = e instanceof RegExp, l = n instanceof RegExp;
        if (s != l) return !1;
        if (s && l) return e.toString() == n.toString();
        var p = Object.keys(e);
        if ((i = p.length) !== Object.keys(n).length) return !1;
        for (o = i; 0 != o--; ) if (!Object.prototype.hasOwnProperty.call(n, p[o])) return !1;
        for (o = i; 0 != o--; ) if (f = p[o], !t(e[f], n[f])) return !1;
        return !0;
    }
    return e !== e && n !== n;
}

var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

module.exports = {
    isValidUrl: function(t) {
        return /(ht|f)tp(s?):\/\/([^ \\/]*\.)+[^ \\/]*(:[0-9]+)?\/?/.test(t);
    },
    equal: t
};