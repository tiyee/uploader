// pages/test/index.js
const WxUploader = require('../../libs/uploader')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    percent: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {



  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  click: function () {
    const _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为 img 标签的 src 属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        _this.setData({percent:0})
        const ctx = {
          maxConcurrency: 5,
          totalSize: 0,
          chunkSize: 1024 * 1024,
          uploadUrl: 'https://tiyee.cn/2/uploader/upload',
          mergeUrl: 'https://tiyee.cn/2/uploader/merge',
          touchUrl: 'https://tiyee.cn/2/uploader/init',
          testChunks: false,
          verfiyUrl: '',
          headers: { Token: '' },
          withCredentials: 'include',
        }
        const uploader = new WxUploader(ctx, tempFilePaths[0])
        uploader.on('success',(e)=>{
          wx.showModal({
            title: '地址',
            content: e.url,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        })
        uploader.on('progress', (e) => {
          _this.setData({
            percent: e.totalSize === 0 ? 0 :parseInt( e.uploadedSize * 100 / e.totalSize)
          })
        }
        )
        uploader.run()

      }
    })
  }
})