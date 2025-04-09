class ImageLoader {
  static cache = {}; // Initialize an empty cache

  static get(url) {
    // Check if the image is already cached
    if (!this.cache[url]) {
      this.cache[url] = this.loadImage(url);
    }
    return this.cache[url]; // Return the cached promise
  }

  static loadImage(url) {
    return new Promise((resolve) => {
      const imageElement = new Image(); // Create a new Image element
      imageElement.src = url;

      imageElement.onload = () => resolve(imageElement); // Resolve the promise on load
      imageElement.onerror = () => resolve(null); // Resolve with null if there's an error
    });
  }
}

// Alias the ImageLoader class as ImageManager
const ImageManager = ImageLoader;

export default ImageManager;
