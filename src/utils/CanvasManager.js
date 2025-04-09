/* eslint-disable prettier/prettier */
import EventEmitter from './EventEmitter';

class CanvasManager {
  constructor(canvasElement) {
    this.frameHandle = null; // Handle for the animation frame
    this.lastTime = null; // Timestamp of the last frame
    this.elementWidth = 0; // Width of the canvas element
    this.elementHeight = 0; // Height of the canvas element
    this.nextContainerFill = 0; // Timestamp for the next container fill
    this.width = 0; // Width of the canvas in pixels
    this.height = 0; // Height of the canvas in pixels
    this.eventResize = new EventEmitter(); // Event emitter for resize events
    this.eventFrame = new EventEmitter(); // Event emitter for frame events

    this.frame = (timestamp) => {
      this.frameHandle = null;
      let deltaTime = 0;
      if (this.lastTime !== null) {
        deltaTime = Math.min(0.001 * (timestamp - this.lastTime), 0.1);
      }
      this.lastTime = timestamp;
      if (this.nextContainerFill < Date.now()) {
        this.fillContainer();
      }
      this.eventFrame.fire(deltaTime);
    };

    this.fillContainer = () => {
      this.nextContainerFill = Date.now() + 1000;
      const clientWidth = this.container.clientWidth - 10;
      const clientHeight = this.container.clientHeight - 10;
      const pixelWidth = Math.floor(clientWidth * window.devicePixelRatio);
      const pixelHeight = Math.floor(clientHeight * window.devicePixelRatio);

      if (this.elementWidth !== clientWidth || this.elementHeight !== clientHeight) {
        this.canvas.style.width = `${clientWidth}px`;
        this.canvas.style.height = `${clientHeight}px`;
        this.elementWidth = clientWidth;
        this.elementHeight = clientHeight;
      }
      if (this.width !== pixelWidth || this.height !== pixelHeight) {
        this.canvas.width = pixelWidth;
        this.canvas.height = pixelHeight;
        this.width = pixelWidth;
        this.height = pixelHeight;
        this.eventResize.fire();
      }
    };

    this.canvas = canvasElement;
    this.container = canvasElement.parentElement;
    this.context = canvasElement.getContext('2d');
  }

  // Start the rendering loop and listen for window resize events
  start() {
    window.addEventListener('resize', this.fillContainer);
    this.fillContainer();
    this.requestFrame();
  }

  // Stop the rendering loop and remove the window resize listener
  stop() {
    window.removeEventListener('resize', this.fillContainer);
    if (this.frameHandle !== null) {
      cancelAnimationFrame(this.frameHandle);
    }
  }

  // Clear the canvas
  clear() {
    const { context, width, height } = this;
    context.clearRect(0, 0, width, height);
  }

  // Request a new animation frame
  requestFrame() {
    if (this.frameHandle === null) {
      this.frameHandle = requestAnimationFrame(this.frame);
    }
  }
}
export default CanvasManager;
