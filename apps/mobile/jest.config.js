module.exports = {
  moduleNameMapper: {
    '^lucide-react-native$': '<rootDir>/__mocks__/lucide-react-native.tsx',
    '^react-native-keychain$': '<rootDir>/__mocks__/react-native-keychain.ts',
  },
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|lucide-react-native|react-native-svg|react-native-screens|react-native-safe-area-context)/)',
  ],
};
