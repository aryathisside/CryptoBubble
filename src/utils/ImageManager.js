/* eslint-disable prettier/prettier */
// Define a utility class for handling image loading
class ImageLoader {
  // Static method to retrieve images
  static get(url) {
    // Check if the image is already cached
    let cachedImage = this.cache[url];

    // If the image is not cached, load it
    if (!cachedImage) {
      // Create a new image element
      const imageElement = document.createElement('img');

      // Flag to track whether the image has loaded
      let isLoaded = false;

      // Listen for the image load event
      imageElement.addEventListener('load', () => {
        // Set the flag to true when the image is loaded
        isLoaded = true;
      });

      // Set the image source to the specified URL, triggering loading
      imageElement.src = url;

      // Define a function to check if the image is loaded and return it
      cachedImage = () => (isLoaded ? imageElement : null);

      // Cache the image retrieval function for future use
      this.cache[url] = cachedImage;
    }
    // Return the cached image retrieval function
    return cachedImage;
  }
}

// Initialize an empty cache to store image retrieval functions
ImageLoader.cache = {};

// Alias the ImageLoader class as ImageManager
const ImageManager = ImageLoader;

export default ImageManager;
