require("../../utils/config.js");

for (var a = getApp(), t = new Date(), e = [], n = [], s = 2010; s <= t.getFullYear(); s++) e.push(s);

for (var r = 1; r <= 12; r++) n.push(r);

Page({
    data: {
        page: 0,
        ReferralSettingInfo: null,
        hideTimePicker: !0,
        years: e,
        months: n,
        startPayDate: t.getFullYear() + "/" + parseInt(t.getMonth() + 1),
        endPayDate: t.getFullYear() + "/" + parseInt(t.getMonth() + 1),
        pageIndex: 1,
        pageSize: 20,
        isEnd: !1,
        isEmpty: !1
    },
    onLoad: function(e) {
        var n = this;
        this.setData({
            page: e.page,
            value: [ 999, t.getMonth(), 999, t.getMonth() ]
        }), wx.request({
            url: a.getUrl("Common.ashx?action=GetReferralSetData"),
            data: {},
            success: function(t) {
                "OK" == (t = t.data).Status && (a.globalData.ReferralSettingInfo = t.Data.ReferralSettingInfo, 
                n.setData({
                    ReferralSettingInfo: t.Data.ReferralSettingInfo
                }));
            }
        }), 0 == e.page && this.loadData(!1);
    },
    loadData: function(t) {
        var e = this;
        wx.showLoading(), this.updatePartnerInfo();
        var n = this, s = "";
        1 == n.data.page && (s = "Partner.ashx?action=GetSubMembers"), 0 == n.data.page && (s = "Partner.ashx?action=GetOrders"), 
        2 == n.data.page && (s = "Partner.ashx?action=GetSubReferrals"), wx.request({
            url: a.getUrl(s),
            data: {
                openId: a.globalData.openId,
                pageIndex: n.data.pageIndex,
                pageSize: n.data.pageSize,
                startPayDate: n.data.startPayDate,
                endPayDate: n.data.endPayDate
            },
            success: function(a) {
                if ((a = a.data).success) {
                    var s = a.data.list;
                    if (0 == s.length && e.setData({
                        isEmpty: !0
                    }), s.length < e.data.pageSize && e.setData({
                        isEnd: !0
                    }), 0 == n.data.page && e.setData({
                        currentOrderTotal: a.data.currentOrderTotal
                    }), t) {
                        var r = n.data.listData;
                        r.push.apply(r, s), n.setData({
                            listData: r
                        });
                    } else n.setData({
                        listData: s
                    });
                }
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    toggleTimePicker: function() {
        this.setData({
            hideTimePicker: !this.data.hideTimePicker
        });
    },
    bindChange: function(a) {
        var t = a.detail.value;
        this.setData({
            startYearData: this.data.years[t[0]],
            startMonthData: this.data.months[t[1]],
            endYearData: this.data.years[t[2]],
            endMonthData: this.data.months[t[3]]
        });
    },
    changeTimeSubmit: function() {
        this.data.startYearData ? this.data.startYearData > this.data.endYearData ? wx.showToast({
            icon: "none",
            title: "结束日期要大于开始日期"
        }) : this.data.startYearData == this.data.endYearData && this.data.startMonthData > this.data.endMonthData ? wx.showToast({
            icon: "none",
            title: "结束日期要大于开始日期"
        }) : this.data.startMonthData > parseInt(t.getMonth() + 1) || this.data.endMonthData > parseInt(t.getMonth() + 1) ? wx.showToast({
            icon: "none",
            title: "请正确选择日期"
        }) : (this.setData({
            startYear: this.data.startYearData,
            startMonth: this.data.startMonthData,
            endYear: this.data.endYearData,
            endMonth: this.data.endMonthData,
            startPayDate: this.data.startYearData + "/" + this.data.startMonthData,
            endPayDate: this.data.endYearData + "/" + this.data.endMonthData,
            hideTimePicker: !0
        }), this.loadData(!1)) : this.setData({
            hideTimePicker: !0
        });
    },
    onReady: function() {},
    updatePartnerInfo: function() {
        var t = this;
        wx.request({
            url: a.getUrl("Partner.ashx?action=GetPartnerInfo"),
            data: {
                openId: a.globalData.openId
            },
            success: function(a) {
                (a = a.data).success && t.setData({
                    subMemberNumber: a.subMemberNumber,
                    subReferralNumber: a.subReferralNumber,
                    totalAmount: a.totalAmount
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onShow: function() {},
    onReachBottom: function() {
        this.data.isEnd || (this.setData({
            pageIndex: this.data.pageIndex + 1
        }), this.loadData(!0));
    },
    swiperChange: function(a) {
        var t = a.detail.current;
        this.setData({
            page: t,
            pageIndex: 1,
            isEnd: !1,
            isEmpty: !1,
            listData: []
        }), this.loadData(!1);
    }
});