const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

// Přidáme konfiguraci pro SVG, pokud ji používáte
defaultConfig.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg");
defaultConfig.resolver.sourceExts.push("svg");

module.exports = defaultConfig;