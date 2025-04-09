/* eslint-disable no-restricted-syntax */
// EventEmitter class for handling events
class EventEmitter {
  constructor() {
    this.listeners = [];
  }

  register(listener) {
    this.listeners.push(listener);
  }

  fire(...args) {
    for (const listener of this.listeners) {
      listener(...args);
    }
  }
}

export default EventEmitter;
