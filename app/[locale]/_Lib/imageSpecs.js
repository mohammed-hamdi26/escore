/**
 * Image Specifications Configuration
 *
 * Defines aspect ratios and sizes for all image types across the platform.
 * This configuration mirrors the backend specs in src/config/image-specs.ts
 */

export const IMAGE_SPECS = {
  // Game images
  gameLogo: {
    name: "Game Logo",
    aspectRatio: 1,
    aspectRatioString: "1:1",
    cropAspect: 1,
    sizes: {
      thumbnail: { width: 128, height: 128 },
      medium: { width: 512, height: 512 },
      large: { width: 1080, height: 1080 },
    },
  },
  gameCover: {
    name: "Game Cover",
    aspectRatio: 16 / 9,
    aspectRatioString: "16:9",
    cropAspect: 16 / 9,
    sizes: {
      thumbnail: { width: 320, height: 180 },
      medium: { width: 640, height: 360 },
      large: { width: 1280, height: 720 },
    },
  },

  // Team images
  teamLogo: {
    name: "Team Logo",
    aspectRatio: 1,
    aspectRatioString: "1:1",
    cropAspect: 1,
    sizes: {
      thumbnail: { width: 128, height: 128 },
      medium: { width: 512, height: 512 },
      large: { width: 1080, height: 1080 },
    },
  },
  teamCover: {
    name: "Team Cover",
    aspectRatio: 3 / 2,
    aspectRatioString: "3:2",
    cropAspect: 3 / 2,
    sizes: {
      thumbnail: { width: 300, height: 200 },
      medium: { width: 600, height: 400 },
      large: { width: 1200, height: 800 },
    },
  },

  // Player images
  playerPhoto: {
    name: "Player Photo",
    aspectRatio: 1,
    aspectRatioString: "1:1",
    cropAspect: 1,
    sizes: {
      thumbnail: { width: 128, height: 128 },
      medium: { width: 512, height: 512 },
      large: { width: 1080, height: 1080 },
    },
  },
  playerCover: {
    name: "Player Cover",
    aspectRatio: 3 / 2,
    aspectRatioString: "3:2",
    cropAspect: 3 / 2,
    sizes: {
      thumbnail: { width: 300, height: 200 },
      medium: { width: 600, height: 400 },
      large: { width: 1200, height: 800 },
    },
  },

  // Tournament images
  tournamentLogo: {
    name: "Tournament Logo",
    aspectRatio: 1,
    aspectRatioString: "1:1",
    cropAspect: 1,
    sizes: {
      thumbnail: { width: 128, height: 128 },
      medium: { width: 512, height: 512 },
      large: { width: 1080, height: 1080 },
    },
  },
  tournamentCover: {
    name: "Tournament Cover",
    aspectRatio: 3 / 2,
    aspectRatioString: "3:2",
    cropAspect: 3 / 2,
    sizes: {
      thumbnail: { width: 300, height: 200 },
      medium: { width: 600, height: 400 },
      large: { width: 1200, height: 800 },
    },
  },
  tournamentBracket: {
    name: "Tournament Bracket",
    aspectRatio: 16 / 9,
    aspectRatioString: "16:9",
    cropAspect: 16 / 9,
    sizes: {
      thumbnail: { width: 480, height: 270 },
      medium: { width: 960, height: 540 },
      large: { width: 1920, height: 1080 },
    },
  },

  // News images
  newsCover: {
    name: "News Cover",
    aspectRatio: 2,
    aspectRatioString: "2:1",
    cropAspect: 2,
    sizes: {
      thumbnail: { width: 300, height: 150 },
      medium: { width: 600, height: 300 },
      large: { width: 1200, height: 600 },
    },
  },

  // Avatar images
  authorAvatar: {
    name: "Author Avatar",
    aspectRatio: 1,
    aspectRatioString: "1:1",
    cropAspect: 1,
    sizes: {
      thumbnail: { width: 128, height: 128 },
      medium: { width: 512, height: 512 },
      large: { width: 1080, height: 1080 },
    },
  },
  userAvatar: {
    name: "User Avatar",
    aspectRatio: 1,
    aspectRatioString: "1:1",
    cropAspect: 1,
    sizes: {
      thumbnail: { width: 128, height: 128 },
      medium: { width: 512, height: 512 },
      large: { width: 1080, height: 1080 },
    },
  },
};

/**
 * Get image specification by type
 * @param {string} imageType - The type of image
 * @returns {Object|undefined} The image specification
 */
export function getImageSpec(imageType) {
  return IMAGE_SPECS[imageType];
}

/**
 * Check if an image type is valid
 * @param {string} imageType - The type to check
 * @returns {boolean} True if valid image type
 */
export function isValidImageType(imageType) {
  return imageType in IMAGE_SPECS;
}

/**
 * Get the aspect ratio for cropping
 * @param {string} imageType - The image type
 * @returns {number|undefined} The aspect ratio for the crop tool
 */
export function getCropAspect(imageType) {
  const spec = IMAGE_SPECS[imageType];
  return spec?.cropAspect;
}

/**
 * Get the aspect ratio string for display
 * @param {string} imageType - The image type
 * @returns {string|undefined} The aspect ratio string (e.g., "1:1", "16:9")
 */
export function getAspectRatioString(imageType) {
  const spec = IMAGE_SPECS[imageType];
  return spec?.aspectRatioString;
}

/**
 * Get the large size dimensions
 * @param {string} imageType - The image type
 * @returns {Object|undefined} The large size {width, height}
 */
export function getLargeSize(imageType) {
  const spec = IMAGE_SPECS[imageType];
  return spec?.sizes?.large;
}

/**
 * Get all image types as an array
 * @returns {string[]} Array of image type keys
 */
export function getImageTypes() {
  return Object.keys(IMAGE_SPECS);
}

/**
 * Map old aspect names to imageType
 * For backward compatibility with existing components
 */
export const ASPECT_TO_IMAGE_TYPE = {
  square: "teamLogo", // 1:1
  landscape: "gameCover", // 16:9
  portrait: null, // 3:4 - not used in new system
  "news-cover": "newsCover", // 2:1
  wide: null, // 2:1 - use newsCover
  "4:3": null, // Not in new system
  "3:2": "teamCover", // 3:2
};
