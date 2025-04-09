/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
import Canvas from './Canvas';
import ImageManager from './ImageManager';
import Tween from './Tween';

const Constants = {
  bubblePadding: 10,
  bubbleBorder: 2,
  bubbleHitbox: 10
};

class Bubble {
  constructor(currency) {
    this.lastFingerprint = ''; // Unique identifier for rendering changes
    this.radiusTween = new Tween(0, 1000); // Tween for smooth radius changes
    this.color = ''; // Bubble color
    this.transitionRadius = null; // Radius during transition
    this.posX = 0; // X position
    this.posY = 0; // Y position
    this.speedX = 0; // X speed
    this.speedY = 0; // Y speed
    this.size = 0; // Bubble size
    this.radius = 0; // Bubble radius
    this.content = ''; // Bubble content
    this.visible = false; // Visibility flag
    this.latestPush = 0; // Timestamp of the latest data push
    this.renderFavoriteBorder = true; // Flag to render favorite border
    this.currency = currency; // Currency data associated with the bubble
    this.canvas = new Canvas(Constants.bubblePadding); // Canvas for rendering
   // Load the image asynchronously
   ImageManager.get(`${process.env.BUBBLE_IMAGE_PATH}/${currency.image}`)
   .then(image => {
     this.lazyImage = image; // Store the loaded image
     this.rerender(this.radius); // Rerender once the image is loaded
   })
   .catch(() => {
     console.error("Failed to load image");
     this.lazyImage = null; // Handle loading failure
   });
  }

  // Apply force to the bubble's speed
  applyForce(forceX, forceY) {
    this.speedX += forceX;
    this.speedY += forceY;
  }

  // Set the bubble's radius with optional transition time
  setRadius(radi, transitionTime) {
    const radius = Number.isFinite(radi) ? radi : 0;
    this.radiusTween.set(radius, transitionTime);
    if (!transitionTime) {
      this.transitionRadius = Math.max(radius, this.radius);
    }
  }

  // Set the bubble's color based on RGB values
  setColor(color) {
    const { red, green, blue } = color;
    this.color = `${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)}`;
  }

  // Set the bubble's content
  setContent(content) {
    this.content = content;
  }

  // Update the bubble's state
  update() {
    this.radius = this.radiusTween.get();
    this.visible = this.radius > 0;
  }

  // Rerender the bubble if its fingerprint has changed
  rerender(radius) {
    const image = this.lazyImage;
    const roundedRadius = Math.round(radius);
    const shouldRenderBorder = this.renderFavoriteBorder && false;
    const fingerprint = `${this.color} ${roundedRadius} ${this.content} ${Boolean(image)} ${shouldRenderBorder}`;

    if (fingerprint !== this.lastFingerprint) {
      this.lastFingerprint = fingerprint;
      const diameter = 2 * roundedRadius;
      this.canvas.begin(diameter);

      const gradient = this.canvas.createRadialGradient(roundedRadius, roundedRadius, 0, roundedRadius, roundedRadius, roundedRadius);
      gradient.addColorStop(0, `rgba(${this.color}, 0.05)`);
      gradient.addColorStop(0.8, `rgba(${this.color}, 0.1)`);
      gradient.addColorStop(0.9, `rgba(${this.color}, 0.4)`);
      gradient.addColorStop(1, `rgb(${this.color})`);

      this.canvas.circle(roundedRadius, roundedRadius, roundedRadius);
      this.canvas.fill(gradient);

      if (shouldRenderBorder) {
        const borderColor = 'yellow';
        this.canvas.circle(roundedRadius, roundedRadius, roundedRadius);
        this.canvas.stroke(borderColor, Constants.bubbleBorder);
      }

      const isLarge = roundedRadius > 30;
      const imageSize = roundedRadius * (isLarge ? 0.55 : 1.2);
      const imageWidth = imageSize * (image ? image.width / image.height : 1);
      const imageX = 0.5 * (diameter - imageWidth);
      const imageY = (diameter - imageSize) * (isLarge ? 0.14 : 0.5);

      if (image) {
        this.canvas.drawImage(image, imageX, imageY, imageWidth, imageSize);
      } else {
        const circleRadius = 0.5 * imageSize;
        this.canvas.circle(imageX + circleRadius, imageY + circleRadius, circleRadius);
        this.canvas.stroke('white', 1);
      }

      if (isLarge) {
        this.canvas.context.textAlign = 'center';
        this.canvas.context.fillStyle = 'white';

        // eslint-disable-next-line no-nested-ternary
        const symbolFull=this.currency.symbols.binance!==""? this.currency.symbols.binance :this.currency.symbols.kucoin!==""?this.currency.symbols.kucoin:this.currency.symbols.bybit!==""?this.currency.symbols.bybit:this.currency.symbols.gateio!==""?this.currency.symbols.gateio:this.currency.symbols.coinbase!==""?this.currency.symbols.coinbase:this.currency.symbols.mexc!==""?this.currency.symbols.mexc:this.currency.symbols.okx;
        let symbol="";
        if(symbolFull.includes('_')){
          symbol=symbolFull.split('_')[0];
        }else if(symbolFull.includes('-')){
          symbol=symbolFull.split('-')[0];
        }else{
          symbol=symbolFull.split('/')[0];
        }

        const symbolSize = roundedRadius * ( symbol < 5 ? 0.55 : 0.35);
        this.canvas.fillText(symbol, roundedRadius, 1.25 * roundedRadius, symbolSize);

        const contentSize = roundedRadius * (this.content.length > 8 ? 0.24 : 0.3);
        this.canvas.fillText(this.content, roundedRadius, 1.65 * roundedRadius, contentSize);
      }

      this.canvas.end();
    }
  }

  // Render the bubble on the provided context
  render(context) {
    const padding = this.radius + Constants.bubblePadding;
    const x = this.posX - padding;
    const y = this.posY - padding;

    if (this.transitionRadius !== null) {
      this.rerender(this.transitionRadius);
      const diameter = 2 * padding;
      context.drawImage(this.canvas.getImage(), x, y, diameter, diameter);
      if (this.radiusTween.isDone()) {
        this.transitionRadius = null;
      }
    } else {
      this.rerender(this.radius);
      context.drawImage(this.canvas.getImage(), x, y);
    }
  }
}

export default Bubble;
