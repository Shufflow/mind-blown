module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          src: './src',
          '@components': './src/components',
          '@hocs': './src/utils/hocs',
          '@icons': './src/assets/icons',
          '@locales': './src/locales',
          '@routes': './src/routes',
          '@styles': './src/utils/styles',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
