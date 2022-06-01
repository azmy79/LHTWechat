Page({
    data: {},
    onLoad: function(o) {
        this.setData({
            storeid: o.storeid
        }), this.productcategory = this.selectComponent("#productcategory");
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.productcategory.onReachBottom();
    },
    onShareAppMessage: function() {}
});