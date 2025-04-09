/* eslint-disable prettier/prettier */
class Canvas {
  constructor(padding) {
    this.size = null;
    this.imageBitmap = null;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.padding = padding;
  }

  begin(size) {
    const totalSize = size + 2 * this.padding;
    if (this.size !== totalSize) {
      this.size = totalSize;
      this.canvas.width = totalSize;
      this.canvas.height = totalSize;
    } else {
      this.context.clearRect(0, 0, totalSize, totalSize);
    }
  }

  end() {
    this.imageBitmap = null;
    try {
      createImageBitmap(this.canvas)
        // eslint-disable-next-line no-return-assign
        .then((bitmap) => (this.imageBitmap = bitmap))
        .catch(() => {});
    } catch {
      /* empty */
    }
  }

  createRadialGradient(x0, y0, r0, x1, y1, r1) {
    return this.context.createRadialGradient(x0 + this.padding, y0 + this.padding, r0, x1 + this.padding, y1 + this.padding, r1);
  }

  circle(x, y, radius) {
    this.context.beginPath();
    this.context.arc(x + this.padding, y + this.padding, radius, 0, 2 * Math.PI);
    this.context.closePath();
  }

  stroke(color, lineWidth) {
    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = color;
    this.context.stroke();
  }

  fill(color) {
    this.context.fillStyle = color;
    this.context.fill();
  }

  fillText(text, x, y, fontSize) {
    this.context.font = `${Math.ceil(fontSize)}px Arial`;
    this.context.fillText(text, x + this.padding, y + this.padding);
  }

  drawImage(image, x, y, width, height) {
    this.context.drawImage(image, x + this.padding, y + this.padding, width, height);
  }

  getImage() {
    return this.imageBitmap || this.canvas;
  }
}
export default Canvas;
