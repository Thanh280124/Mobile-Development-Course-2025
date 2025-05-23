// jest/setup.js
jest.mock('@expo/vector-icons/AntDesign', () => 'AntDesign');
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchCameraAsync: jest.fn(() =>
    Promise.resolve({
      canceled: true,
      assets: [],
    })
  ),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: 10,
        longitude: 20,
      },
    })
  ),
}));
