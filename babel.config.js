module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.jsx',
          '.json',
          '.tsx',
          '.ts',
        ],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/navigation': './src/navigation',
          '@/services': './src/services',
          '@/hooks': './src/hooks',
          '@/context': './src/context',
          '@/utils': './src/utils',
          '@/types': './src/types',
          '@/constants': './src/constants',
          '@/theme': './src/theme',
          '@/assets': './src/assets',
        },
      },
    ],
  ],
};
