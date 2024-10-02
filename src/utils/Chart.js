/* eslint-disable no-restricted-syntax */
import useConfigStore from '../store/useConfigStore';
import CanvasManager from './CanvasManager';
import Helper from './Helper';

class Chart extends CanvasManager {
  constructor(element) {
    super(element);
    this.quotes = null;
    this.baseCurrency = null;
    this.period = null;
    this.colors = useConfigStore.getState().colorScheme;
    this.pointerX = null;
    this.eventFrame.register(() => this.render());
    this.eventResize.register(() => this.render());
    this.canvas.addEventListener('pointermove', (event) => this.handlePointerUpdate(event));
    this.canvas.addEventListener('pointerdown', (event) => this.handlePointerUpdate(event));
    this.canvas.addEventListener('pointerout', (event) => this.handlePointerOut(event));
  }

  handlePointerUpdate(event) {
    if (event.isPrimary) {
      const pointerX = Math.round(event.offsetX * window.devicePixelRatio);
      if (pointerX !== this.pointerX) {
        this.pointerX = pointerX;
        this.render();
      }
    }
  }

  handlePointerOut(event) {
    if (event.isPrimary && this.pointerX !== null) {
      this.pointerX = null;
      this.render();
    }
  }

  drawPointOnChart(value, position, currency, color) {
    const { context, width, height } = this;
    const { x, y } = position;
    const { devicePixelRatio } = window;
    const halfWidth = 0.5 * width;
    const halfHeight = 0.5 * height;
    const formattedValue = Helper.formatPrice(value, currency);

    context.beginPath();
    context.arc(x, y, 5 * devicePixelRatio, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.textAlign = x < halfWidth ? 'left' : 'right';
    context.fillText(formattedValue, x + (x < halfWidth ? 8 : -8) * devicePixelRatio, y + (y < halfHeight ? -10 : 10) * devicePixelRatio);
  }

  render() {
    const { quotes, baseCurrency, period, context, width, height, pointerX } = this;
    const { devicePixelRatio } = window;

    if (this.clear() || baseCurrency === null || period === null || quotes === null || quotes.length === 0) {
      return;
    }

    const step = width / (quotes.length - 1);
    let minPrice = quotes[0].p;
    let maxPrice = quotes[0].p;

    for (const quote of quotes) {
      if (quote.p > maxPrice) maxPrice = quote.p;
      if (quote.p < minPrice) minPrice = quote.p;
    }

    const priceRange = maxPrice - minPrice;
    let xPosition = 0;

    const minPosition = { x: 0, y: 0 };
    const maxPosition = { x: 0, y: 0 };
    let hoverPosition = null;
    let hoverQuote = null;

    context.beginPath();
    for (const quote of quotes) {
      const price = quote.p;
      const yPosition = (0.8 - 0.7 * ((price - minPrice) / priceRange)) * height;

      if (price === minPrice) {
        minPosition.x = xPosition;
        minPosition.y = yPosition;
      }
      if (price === maxPrice) {
        maxPosition.x = xPosition;
        maxPosition.y = yPosition;
      }
      if (pointerX && !hoverPosition && pointerX < xPosition + step / 2) {
        hoverPosition = { x: xPosition, y: yPosition };
        hoverQuote = quote;
      }

      if (xPosition === 0) {
        context.moveTo(xPosition, yPosition + 1);
      } else {
        context.lineTo(xPosition, yPosition + 1);
      }
      xPosition += step;
    }

    context.lineWidth = 2 * devicePixelRatio;
    context.strokeStyle = 'white';
    context.lineJoin = 'round';
    context.stroke();
    context.lineTo(xPosition, height);
    context.lineTo(0, height);
    context.closePath();

    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 100, 255, 1)');
    gradient.addColorStop(1, 'rgba(0, 100, 255, 0)');
    context.fillStyle = gradient;
    context.fill();

    const fontSize = Math.round(20 * devicePixelRatio);
    context.font = `${fontSize}px Arial`;
    context.textBaseline = 'middle';

    const minColor = Helper.getPrimaryColor(-1, this.colors);
    const maxColor = Helper.getPrimaryColor(1, this.colors);

    this.drawPointOnChart(minPrice, minPosition, baseCurrency, minColor);
    this.drawPointOnChart(maxPrice, maxPosition, baseCurrency, maxColor);

    if (hoverPosition && hoverQuote) {
      const { p: price, t: timestamp } = hoverQuote;
      const formattedPrice = Helper.formatPrice(price, baseCurrency);
      let textWidth = 0;
      try {
        textWidth = context.measureText(formattedPrice).width;
      } catch {
        // TO
      }
      textWidth = textWidth || 150;

      const paddingX = 6 * devicePixelRatio;
      const paddingY = 4 * devicePixelRatio;
      const boxWidth = textWidth + 2 * paddingX;
      const boxHeight = fontSize + 2 * paddingY;
      const boxX = Helper.clamp(hoverPosition.x - boxWidth / 2, 0, width - boxWidth);
      const boxY = 0;

      context.strokeStyle = '#666';
      context.beginPath();
      context.moveTo(hoverPosition.x, 0);
      context.lineTo(hoverPosition.x, height);
      context.moveTo(0, hoverPosition.y);
      context.lineTo(width, hoverPosition.y);
      context.closePath();
      context.stroke();

      context.fillStyle = 'white';
      context.beginPath();
      context.arc(hoverPosition.x, hoverPosition.y, 5 * devicePixelRatio, 0, 2 * Math.PI);
      context.closePath();
      context.fill();

      context.fillStyle = '#666';
      context.fillRect(boxX, boxY, boxWidth, boxHeight);
      context.textAlign = 'left';
      context.textBaseline = 'top';
      context.fillStyle = 'white';
      context.fillText(formattedPrice, boxX + paddingX, boxY + paddingY);

      const date = new Date(1000 * timestamp);
      date.setSeconds(0);
      // if (period !== 'week' && period !== 'month') {
      //   date.setMinutes(0);
      // }

      let dateString = date.toLocaleString();
      if (period === 'year') {
        dateString = date.toLocaleDateString();
      } else {
        try {
          dateString = date.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'America/New_York'
          });
        } catch {
          // NA
        }
      }

      context.textAlign = 'right';
      context.textBaseline = 'bottom';
      context.fillStyle = '#ccc';
      context.fillText(dateString, width - 6 * devicePixelRatio, height - 6 * devicePixelRatio);
    }
  }
}

export default Chart;
