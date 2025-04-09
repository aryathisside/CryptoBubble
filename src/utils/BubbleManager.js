/* eslint-disable prettier/prettier */
/* eslint-disable no-cond-assign */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import BubbleNew from './Bubble';
import CanvasManager from './CanvasManager';
import EventEmitter from './EventEmitter';
import Helper from './Helper';

// Constants
const Constants = {
  bubblePadding: 10,
  bubbleBorder: 2,
  bubbleHitbox: 10
};

// Check if the application is embedded
const isEmbedded = false;

class BubbleManager extends CanvasManager {
  constructor(canvasElement, properties) {
    super(canvasElement);
    this.needsRecalculation = false; // Flag to indicate if bubble properties need recalculation
    this.recalculationCount = 0; // Count of recalculations
    this.latestPush = 0; // Timestamp of the latest data push
    this.bubbles = []; // Array of bubbles
    this.bubblesDict = {}; // Dictionary of bubbles by currency ID
    this.pointerX = -1; // X position of the pointer
    this.pointerY = -1; // Y position of the pointer
    this.hoveredBubble = null; // Currently hovered bubble
    this.draggedBubble = null; // Currently dragged bubble
    this.possibleSelectedBubble = null; // Possible selected bubble
    this.timePointerDown = 0; // Timestamp of the pointer down event
    this.timeLastWakeUp = Date.now(); // Timestamp of the last wake-up
    this.selectedCurrencyId = null; // ID of the selected currency
    this.renderFavoriteBorder = true; // Flag to render favorite border
    this.eventSelect = new EventEmitter(); // Event emitter for selection events

    this.eventResize.register(() => {
      this.needsRecalculation = true;
      this.requestFrame();
    });

    this.eventFrame.register((deltaTime) => {
      if (this.needsRecalculation) {
        this.recalculate();
      }
      this.update(deltaTime);
      this.render();

      const timeSinceLastWakeUp = Date.now() - this.timeLastWakeUp;
      const delay = Math.round(timeSinceLastWakeUp / 150 - 20);
      const adjustedDelay = Math.max(0, Math.min(delay, 80));

      if (adjustedDelay > 0 && !isEmbedded) {
        window.setTimeout(() => this.requestFrame(), adjustedDelay);
      } else {
        this.requestFrame();
      }
    });

    this.properties = properties;

    canvasElement.addEventListener('pointerdown', (event) => this.handlePointerDown(event), { passive: false });
    canvasElement.addEventListener('pointermove', (event) => this.handlePointerMove(event));
    canvasElement.addEventListener('touchmove', (event) => this.handleTouchMove(event), { passive: false });
    canvasElement.addEventListener('pointerup', (event) => this.handlePointerUp(event));
    canvasElement.addEventListener('pointercancel', () => this.handlePointerCancel());
  }

  // Update the pointer's position
  updatePointerPosition(event) {
    this.pointerX = event.offsetX * window.devicePixelRatio;
    this.pointerY = event.offsetY * window.devicePixelRatio;
  }

  // Update the last wake-up time
  wakeUp() {
    this.timeLastWakeUp = Date.now();
  }

  // Get the bubble closest to the pointer
  getFocusedBubble() {
    for (let i = this.bubbles.length - 1; i >= 0; i -= 1) {
      const bubble = this.bubbles[i];
      if (bubble.visible) {
        const dx = bubble.posX - this.pointerX;
        const dy = bubble.posY - this.pointerY;
        const distanceSquared = dx * dx + dy * dy;
        const hitboxRadius = bubble.radius + Constants.bubbleHitbox;
        if (hitboxRadius * hitboxRadius >= distanceSquared) {
          return bubble;
        }
      }
    }
    return null;
  }

  // Handle the pointer down event
  handlePointerDown(event) {
    if (event.isPrimary) {
      this.timePointerDown = Date.now();
      this.canvas.setPointerCapture(event.pointerId);
      if (event.pointerType === 'mouse') {
        this.draggedBubble = this.hoveredBubble;
      } else {
        this.updatePointerPosition(event);
        this.draggedBubble = this.getFocusedBubble();
      }
      if (this.draggedBubble) {
        this.possibleSelectedBubble = this.draggedBubble;
      } else {
        this.launchExplosion();
      }
    }
  }

  // Handle the pointer move event
  handlePointerMove(event) {
    if (event.isPrimary) {
      this.updatePointerPosition(event);
      const focusedBubble = this.getFocusedBubble();
      if (event.pointerType === 'mouse') {
        this.hoveredBubble = focusedBubble;
        const cursorBubble = this.draggedBubble || this.hoveredBubble;
        this.canvas.style.cursor = cursorBubble ? 'pointer' : 'auto';
      }
      if (this.possibleSelectedBubble !== focusedBubble) {
        this.possibleSelectedBubble = null;
      }
    }
  }

  // Handle the touch move event
  handleTouchMove(event) {
    if (this.draggedBubble) {
      event.preventDefault();
    }
  }

  // Handle the pointer up event
  handlePointerUp(event) {
    if (event.isPrimary) {
      if (this.possibleSelectedBubble) {
        if (Date.now() - this.timePointerDown < 1000) {
          const { currency } = this.possibleSelectedBubble;
          this.possibleSelectedBubble = null;
          this.eventSelect.fire(currency);
        }
      }
      this.draggedBubble = null;
    }
  }

  // Handle the pointer cancel event
  handlePointerCancel() {
    this.hoveredBubble = null;
    this.draggedBubble = null;
  }

  // Launch an explosion effect on the bubbles
  launchExplosion() {
    for (const bubble of this.bubbles) {
      const dx = bubble.posX - this.pointerX;
      const dy = bubble.posY - this.pointerY;
      const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const force = 5000 / (distance * distance);
      bubble.applyForce(dx * force, dy * force);
    }
    this.wakeUp();
  }

  // Update the bubbles' positions and speeds
  update(deltaTime) {
    const dampingFactor = 0.5 ** deltaTime;
    const repulsionStrength = 0.001 * Math.min(this.width, this.height);

    for (const bubble of this.bubbles) {
      bubble.update();
    }

    for (let i = 0; i < this.bubbles.length; i += 1) {
      const bubble1 = this.bubbles[i];
      if (bubble1.visible) {
        for (let j = i + 1; j < this.bubbles.length; j += 1) {
          const bubble2 = this.bubbles[j];
          if (!bubble2.visible) {
            continue;
          }
          const dx = bubble1.posX - bubble2.posX;
          const dy = bubble1.posY - bubble2.posY;
          const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          const combinedRadius = bubble1.radius + bubble2.radius;

          if (distance < combinedRadius) {
            const force = 6 / distance;
            const fx = dx * force;
            const fy = dy * force;
            const ratio1 = 1 - bubble1.radius / combinedRadius;
            const ratio2 = bubble2.radius / combinedRadius - 1;

            bubble1.applyForce(fx * ratio1, fy * ratio1);
            bubble2.applyForce(fx * ratio2, fy * ratio2);
          }
        }

        bubble1.applyForce(Helper.getRandomForce() * repulsionStrength, Helper.getRandomForce() * repulsionStrength);
      }
    }

    if (this.draggedBubble) {
      const dx = this.pointerX - this.draggedBubble.posX;
      const dy = this.pointerY - this.draggedBubble.posY;
      const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const force = 5 / distance;

      this.draggedBubble.applyForce(dx * force, dy * force);
      this.wakeUp();
    }

    for (const bubble of this.bubbles) {
      bubble.speedX *= dampingFactor;
      bubble.speedY *= dampingFactor;
      bubble.posX += bubble.speedX * deltaTime;
      bubble.posY += bubble.speedY * deltaTime;

      if (bubble.posX < bubble.radius) {
        bubble.posX = bubble.radius;
        bubble.speedX *= -0.7;
      }
      if (bubble.posY < bubble.radius) {
        bubble.posY = bubble.radius;
        bubble.speedY *= -0.7;
      }
      if (bubble.posX > this.width - bubble.radius) {
        bubble.posX = this.width - bubble.radius;
        bubble.speedX *= -0.7;
      }
      if (bubble.posY > this.height - bubble.radius) {
        bubble.posY = this.height - bubble.radius;
        bubble.speedY *= -0.7;
      }
    }
  }

  // Render a border around a bubble
  renderBubbleBorder(bubble, color, width) {
    this.context.beginPath();
    this.context.arc(bubble.posX, bubble.posY, bubble.radius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.lineWidth = Constants.bubbleBorder * width;
    this.context.strokeStyle = color;
    this.context.stroke();
  }

  // Render all bubbles on the canvas
  render() {
    this.clear();
    let selectedBubble = null;

    for (const bubble of this.bubbles) {
      if (((bubble.renderFavoriteBorder = this.renderFavoriteBorder), bubble.visible)) {
        if (bubble.currency.id === this.selectedCurrencyId) {
          selectedBubble = bubble;
          continue;
        }
        if (this.draggedBubble === bubble) {
          continue;
        }
        bubble.render(this.context);
      }
    }

    if (this.draggedBubble) {
      if (this.draggedBubble !== selectedBubble) {
        this.draggedBubble.render(this.context);
        this.renderBubbleBorder(this.draggedBubble, 'white', 1);
      }
    } else if (this.hoveredBubble) {
      this.renderBubbleBorder(this.hoveredBubble, 'white', 1);
    }

    if (selectedBubble) {
      selectedBubble.render(this.context);
      const pulse = 0.5 * Math.sin(0.008 * Date.now()) + 0.5;
      const borderWidth = pulse + 2;
      const borderColor = `rgb(${Math.floor(255 * pulse)}, ${Math.floor(160 * pulse) + 95}, 255)`;
      this.renderBubbleBorder(selectedBubble, borderColor, borderWidth);
    }
  }

  // Recalculate the bubbles' properties
  recalculate() {
    if (this.needsRecalculation === false || this.bubbles.length === 0) {
      return;
    }

    const { size, color, colors, period, content, baseCurrency } = this.properties;
    const isInitialRecalculation = this.recalculationCount === 0;

    let totalSize = 0;
    let maxColorValue = 0;

    for (const bubble of this.bubbles) {
      const isNewPush = bubble.latestPush === this.latestPush;
      bubble.size = isNewPush ? Helper.calculateRadius(bubble.currency, size, period) : 0;
      if (bubble.size > 0) {
        totalSize += bubble.size;
        const colorValue = Math.abs(Helper.calculateColorValue(bubble.currency, color, period));
        if (colorValue > maxColorValue) {
          maxColorValue = colorValue;
        }
      }
    }

    const canvasArea = this.width * this.height;
    const sizeFactor = totalSize === 0 ? 0 : (canvasArea / totalSize) * 0.6;

    for (const bubble of this.bubbles) {
      const radius = Math.sqrt((bubble.size * sizeFactor) / Math.PI);
      bubble.setRadius(radius, isInitialRecalculation);

      const colorValue = Helper.calculateColorValue(bubble.currency, color, period);
      bubble.setColor(Helper.calculateColor(colorValue, colors, maxColorValue));
      bubble.setContent(Helper.generateContent(bubble.currency, content, period, baseCurrency));

      bubble.posX = Helper.clamp(bubble.posX, radius, this.width - radius);
      bubble.posY = Helper.clamp(bubble.posY, radius, this.height - radius);
    }

    this.recalculationCount += 1;
    this.wakeUp();
  }

  // Set the properties for the bubbles
  setProperties(properties) {
    this.properties = properties;
    this.needsRecalculation = true;
  }

  // Add or update bubbles based on the provided currencies
  pushCurrencies(currencies) {
    this.latestPush += 1;
    for (const currency of currencies) {
      const { id } = currency;
      let bubble = this.bubblesDict[id];
      if (!bubble) {
        bubble = new BubbleNew(currency);
        bubble.posX = Math.random() * this.width;
        bubble.posY = Math.random() * this.height;
        this.bubbles.push(bubble);
        this.bubblesDict[id] = bubble;
      }
      bubble.currency = currency;
      bubble.latestPush = this.latestPush;
    }
    this.recalculate();
  }
}



export default BubbleManager;