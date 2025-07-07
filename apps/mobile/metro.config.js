const { getDefaultConfig } = require("@expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../../node_modules"),
];
config.resolver.enableSymlinks = true;
module.exports = config;
