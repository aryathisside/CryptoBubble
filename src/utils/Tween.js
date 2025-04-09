/* eslint-disable prettier/prettier */
class Tween {
  constructor(endValue, duration) {
    this.duration = duration; // Duration of the transition in milliseconds
    this.startValue = 0; // Initial value of the transition
    this.endValue = endValue; // Target value for the transition
    this.startTime = null; // Time when the transition starts
  }

  // Method to get the current value based on the transition progress
  get() {
    if (this.startTime === null) {
      // If the transition hasn't started, return the end value
      return this.endValue;
    }
    const elapsedTime = Date.now() - this.startTime; // Time elapsed since the transition started

    if (elapsedTime >= this.duration) {
      // If the transition duration has passed, reset startTime and return the end value
      this.startTime = null;
      return this.endValue;
    }

    const progress = elapsedTime / this.duration; // Fraction of the duration that has passed
    return Tween.interpolate(this.startValue, this.endValue, progress); // Interpolate between startValue and endValue
  }

  // Method to set a new end value and optionally reset the transition
  set(newEndValue, resetTransition = false) {
    if (resetTransition) {
      // Reset the transition
      this.startTime = null;
    } else {
      // Set the start value to the current value and restart the transition
      this.startValue = this.get();
      this.startTime = Date.now();
    }
    this.endValue = newEndValue; // Set the new end value
  }

  // Method to check if the transition is complete
  isDone() {
    if (this.startTime === null) {
      // If the transition hasn't started or is already complete, return true
      return true;
    }
    if (Date.now() >= this.startTime + this.duration) {
      // If the current time has passed the duration of the transition, mark it complete
      this.startTime = null;
      return true;
    }
    return false;
  }

  // Helper method to interpolate between two values based on a progress ratio
  static interpolate(startValue, endValue, ratio) {
    return startValue + (endValue - startValue) * ratio;
  }
}

export default Tween;
