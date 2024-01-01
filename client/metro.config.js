const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, "jsx", "json"],
    sourceExts: [...defaultConfig.resolver.sourceExts, "mjs", "cjs"],
  },
};
