class combine {
  constructor(ctx, width, height, percent) {
    this.ctx = ctx;
    this.canvas = new canvasItem(width, height, 0, 0);
    this.percent = percent;
    this.imgs = [];
  }

  async setImage(img) {
    this.imgs.push(new imageItem(await getImageInfo(img)));
    console.log(this.imgs);
  }

  draw() {
    this.canvas.slice(this.imgs.length);
    console.log(this.canvas);
    for (let index = 0; index < this.imgs.length; index++) {
      this.canvas.children[index].draw(this.ctx, this.imgs[index], this.percent);
    }

    this.ctx.draw();
  }
}

class canvasItem {
  constructor(width, height, offsetWidth, offsetHeight) {
    this.width = width;
    this.height = height;
    this.direction = width > height ? "horizontal" : "vertical";
    this.offsetWidth = offsetWidth;
    this.offsetHeight = offsetHeight;
    this.children = [];
  }

  slice(count) {
    this.children = [];
    if (this.direction === "vertical") {
      let height = this.height / count;
      for (let index = 0; index < count; index++) {
        this.children.push(new canvasItem(this.width, height, this.offsetWidth, index * height + this.offsetHeight));
      }
    } else {
      let width = this.width / count;
      for (let index = 0; index < count; index++) {
        this.children.push(new canvasItem(width, this.height, index * width + this.offsetWidth, this.offsetHeight));
      }
    }
  }

  draw(ctx, img, percent) {
    if (img.direction === this.direction) {
      img.resize(this.width, this.height, percent);
      ctx.drawImage("/" + img.path, (this.width - img.destWidth) / 2 + this.offsetWidth, (this.height - img.destHeight) / 2 + this.offsetHeight, img.destWidth, img.destHeight);
    } else {
      img.resize(this.height, this.width, percent);
      ctx.save();
      ctx.translate(this.width + this.offsetWidth, this.offsetHeight);
      ctx.rotate(90 * Math.PI / 180);
      ctx.drawImage("/" + img.path, (this.width - img.destHeight) / 2, (this.height - img.destWidth) / 2 , img.destWidth, img.destHeight);
      ctx.restore();
    }
  }
}

class imageItem {
  constructor(img) {
    this.path = img.path;
    this.width = img.width;
    this.height = img.height;
    this.direction = this.width > this.height ? "horizontal" : "vertical";
    this.aspect = this.width / this.height;
  }

  resize(canvas_width, canvas_height, percent) {
    const dest_width = canvas_width * percent / 100;
    const dest_height = canvas_height * percent / 100;
    const dest_aspect = canvas_width / canvas_height;

    // 等比例缩放
    if (this.aspect > dest_aspect) {
      this.destWidth = dest_width;
      this.destHeight = this.destWidth / this.aspect;
    } else {
      this.destHeight = dest_height;
      this.destWidth = this.destHeight * this.aspect;
    }
  }
}

const getImageInfo = path => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: path,
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    })
  });
}

module.exports.combine = combine;