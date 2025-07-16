const { getDefaultConfig } = require("@expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Configurar las rutas de node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../../node_modules"),
];

// Habilitar symlinks
config.resolver.enableSymlinks = true;

// Configurar resolver para evitar problemas con pnpm
config.resolver.platforms = ["ios", "android", "native", "web"];

// Configurar watchman
config.watchFolders = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../../node_modules"),
];

module.exports = config;
