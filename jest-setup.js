import '@testing-library/jest-native/extend-expect';

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: View,
    MaterialCommunityIcons: View,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest
      .fn()
      .mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockReturnValue(inset),
  };
});
