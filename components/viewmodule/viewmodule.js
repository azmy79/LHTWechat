var t = require("../../pages/wxParse/wxParse.js"), e = getApp();

Component({
    properties: {
        moduleData: {
            type: Array,
            observer: function() {
                this.parseHtml();
            }
        }
    },
    data: {},
    ready: function() {
        var t = this;
        this.addToCart = this.selectComponent("#addToCart"), e.getSiteSettingData(function(e) {
            t.setData(e);
        });
    },
    methods: {
        parseHtml: function() {
            var e = this;
            this.data.moduleData.length > 0 && this.data.moduleData.forEach(function(a) {
                1 === a.type && t.wxParse("editors.editor" + a.id, "html", a.content.fulltext, e);
            });
        },
        customTap: function(t) {
            var a = t.currentTarget.dataset.link, r = parseInt(t.currentTarget.dataset.showtype);
            if ("#" !== a) switch (r) {
              case 1:
              case 5:
                var o = a.split("=");
                o = o[o.length - 1], wx.request({
                    url: e.getUrl("Product.ashx?action=GetProductActivity"),
                    data: {
                        productId: o
                    },
                    success: function(t) {
                        t = t.data;
                        var e = "../productdetail/productdetail?id=" + o + (1 === t.ActiveType ? "&activeid=" + t.ActiveId : "");
                        6 == t.ActiveType && (e = "../fightdetail/fightdetail?activeid=" + t.ActiveId), 
                        wx.navigateTo({
                            url: e
                        });
                    }
                });
                break;

              case 26:
                wx.navigateToMiniProgram({
                    appId: a,
                    extarData: {},
                    envVersion: "develop",
                    success: function(t) {
                        console.log("小程序跳转成功");
                    }
                });
                break;

              case 23:
                wx.makePhoneCall({
                    phoneNumber: a
                });
                break;

              case 7:
              case 8:
              case 9:
                wx.switchTab({
                    url: a
                });
                break;

              case 10:
                var i = a;
                e.getUserOpenId();
                e.getOpenId(function(t) {
                    i = i.indexOf("?") > -1 ? i + "&AppletSessionId=" + t : i + "?AppletSessionId=" + t, 
                    console.log(t);
                }), wx.navigateTo({
                    url: "../outurl/outurl?url=" + encodeURIComponent(i)
                });
                break;

              default:
                wx.navigateTo({
                    url: a
                });
            }
        },
        gotoKeyWordPage: function() {
            wx.navigateTo({
                url: "../productsearch/productsearch"
            });
        },
        catchAddCart: function(t) {
            this.setData({
                curProductid: t.currentTarget.dataset.productid
            }), this.addToCart.catchAddCart();
        }
    }
});