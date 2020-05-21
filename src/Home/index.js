import router from '@system.router'
import clipboard from '@system.clipboard'
import prompt from '@system.prompt'
import ad from '@service.ad'
export default Custom_page({
  // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
  private: {
    newsList: [],
    footerAdShow: false,
    modalShow: false,
    dateNow: '',
    footerAd: {}
  },
  onInit() {
    this.getData()
    //   this.queryFooterAd()
    this.dateNow = this.$app.$def.parseTime(Date.now(), '{y}-{m}-{d}')
    this.insertAd()
    this.queryFooterAd()
  },
  async getData() {
    const $appDef = this.$app.$def
    const {data} = await $appDef.$http.get(`/dujitang/index?key=${$appDef.key}`)
    if(data.code === 200) {
      this.newsList = data.newslist
    }
  },
  onShow() {
  },
  longPress(item, e) {
    clipboard.set({
      text: `${item.content}`,
      success () {
        prompt.showToast({
          message: '复制成功'
        })
      }
    })
  },
  hideFooterAd() {
      this.footerAdShow = false
      this.nativeAd && this.nativeAd.destroy()
  },
  queryFooterAd() {
    if(!ad.createNativeAd) {
      return 
    }
    //   原生广告
    this.nativeAd = ad.createNativeAd({
        adUnitId: '6dee957c6366425c9f401b5adcbcaa96'
    })
    this.nativeAd.load()
    this.nativeAd.onLoad((res) => {
      this.footerAd = res.adList[0]
      // prompt.showToast({
      //   message: this.footerAd
      // })
      this.footerAdShow = true
    })
    // // 上报广告曝光
    // this.nativeAd.reportAdShow({
    //     adId: ""
    // })
    // // 上报广告点击
    // this.nativeAd.reportAdClick({
    //     adId: ""
    // })
  },
  reportAdClick() {
    this.nativeAd && this.nativeAd.reportAdClick({
        adId: this.footerAd.adId
    })
  },
  reportAdShow() {
    this.nativeAd && this.nativeAd.reportAdShow({
        adId: this.footerAd.adId
    })
  },
//   插屏广告
  insertAd() {
    if(ad.createInterstitialAd) {
      this.interstitialAd = ad.createInterstitialAd({
          adUnitId: '83cb730f3aa2402caea65eb17a4a9898'
      })
      this.interstitialAd.onLoad(()=> {
          this.interstitialAd.show();
      })
    }
  },
  onHide() {
    this.interstitialAd && this.interstitialAd.destroy() 
  },
  closeModal() {
      this.modalShow = false
  }
})