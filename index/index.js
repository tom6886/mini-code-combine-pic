var combine = require('combine.js').combine;

Page({
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  onReady: async function (e) {
    var context = wx.createCanvasContext('firstCanvas')
    const draw = new combine(context, 252, 356.4, 80);
    await draw.setImage("./1.png");
    await draw.setImage("./2.png");
    draw.draw();
  }
})
