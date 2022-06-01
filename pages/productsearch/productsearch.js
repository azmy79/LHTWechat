Page({
    data: {},
    onLoad: function(t) {
        var o = t.cid || "", d = parseInt(t.storeid || 0), s = t.keyword || "", i = t.productIds || "";
        this.setData({
            keyword: s,
            categoryid: o,
            storeid: d,
            productIds: i
        }), this.productlist = this.selectComponent("#productlist"), this.data.productIds && this.productlist.loadData(!1);
    },
    onReachBottom: function() {
        this.productlist.onReachBottom();
    }
});