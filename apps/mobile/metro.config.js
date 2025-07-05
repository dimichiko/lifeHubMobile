const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configurar para monorepo con pnpm
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
];

// Configurar watchman para monorepo
config.watchFolders = [
  path.resolve(__dirname, '../../node_modules'),
  path.resolve(__dirname, '../../packages'),
];

// Configurar resolver para evitar conflictos
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Configurar para soportar symlinks de pnpm
config.resolver.enableSymlinks = true;
config.resolver.unstable_enableSymlinks = true;

// Configurar extensiones
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];

// Configurar para evitar problemas de MIME type
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Configurar para monorepo específicamente
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config; 