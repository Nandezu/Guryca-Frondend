module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@': './',
          '@config': './config.js',
        },
      }],
      'react-native-reanimated/plugin',
    ],
  };
};