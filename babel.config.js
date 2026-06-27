module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // No manual reanimated/worklets plugin entry: babel-preset-expo
    // auto-configures the Worklets Babel plugin for Reanimated 4 on Expo.
    // Adding 'react-native-reanimated/plugin' or 'react-native-worklets/plugin'
    // manually here would double-transform worklets and cause runtime errors.
    plugins: [],
  };
};
