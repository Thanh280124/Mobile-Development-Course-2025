import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AddItem from '../app/addItem';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));
jest.spyOn(Alert, 'alert');

describe('AddItem Component', () => {
  let router;

  beforeEach(() => {
    jest.clearAllMocks();
    router = { push: jest.fn() };
    useRouter.mockReturnValue(router);
    SecureStore.getItemAsync.mockResolvedValue(null);
    SecureStore.setItemAsync.mockResolvedValue();
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
  });

  it('renders correctly (R9.2)', () => {
    // Tests UI rendering for usability
    const { getByText, getByPlaceholderText } = render(<AddItem />);
    expect(getByText('Add New Item')).toBeTruthy();
    expect(getByPlaceholderText('Enter item name')).toBeTruthy();
    expect(getByPlaceholderText('Add description and location about the item')).toBeTruthy();
    expect(getByText('Take Photo')).toBeTruthy();
    expect(getByText('Get GPS Location')).toBeTruthy();
  });

  it('validates mandatory fields (R2.2, R9.1)', async () => {
    // Tests input validation and error handling
    const { getByText } = render(<AddItem />);
    const addButton = getByText('Add Item');

    fireEvent.press(addButton);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'You should add the name and description of the item'
      );
    });
  });

  it('saves item to secure store with encryption (R2.1, R2.3, R4.1, R10.1)', async () => {
    // Tests item creation and encrypted storage
    const { getByPlaceholderText, getByText } = render(<AddItem />);
    const nameInput = getByPlaceholderText('Enter item name');
    const descInput = getByPlaceholderText('Add description and location about the item');
    const addButton = getByText('Add Item');

    fireEvent.changeText(nameInput, 'Test Item');
    fireEvent.changeText(descInput, 'Test Description');
    await act(async () => {
      fireEvent.press(addButton);
    });

    await waitFor(() => {
      expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(1);
      const [key, value] = SecureStore.setItemAsync.mock.calls[0];
      expect(key).toBe('items');
      expect(JSON.parse(value)).toEqual([
        {
          id: expect.any(String),
          name: 'Test Item',
          description: 'Test Description',
          photoUri: null,
          gpsCoordinates: null,
        },
      ]);
      expect(Alert.alert).toHaveBeenCalledWith('Perfect', 'Item added successfully!');
      expect(router.push).toHaveBeenCalledWith('/listItem');
    });
  });

  it('takes photo with optimized quality (R8.1, R8.2, R8.3)', async () => {
    // Tests photo capture with optimized quality
    const { getByText } = render(<AddItem />);
    ImagePicker.launchCameraAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://photo.jpg' }],
    });
    const takePhotoButton = getByText('Take Photo');

    await act(async () => {
      fireEvent.press(takePhotoButton);
    });

    await waitFor(() => {
      expect(ImagePicker.launchCameraAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.3,
        })
      );
    });
  });

  it('gets GPS coordinates (R2.1)', async () => {
    // Tests GPS coordinate retrieval
    const { getByText } = render(<AddItem />);
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 37.7749, longitude: -122.4194 },
    });
    const gpsButton = getByText('Get GPS Location');

    await act(async () => {
      fireEvent.press(gpsButton);
    });

    await waitFor(() => {
      expect(getByText(/Latitude: 37.77, Longitude: -122.4194/)).toBeTruthy();
    });
  });

  it('handles secure store errors (R2.4, R9.1)', async () => {
    // Tests error handling for storage failures
    SecureStore.setItemAsync.mockRejectedValue(new Error('Storage failed'));
    const { getByPlaceholderText, getByText } = render(<AddItem />);
    const nameInput = getByPlaceholderText('Enter item name');
    const descInput = getByPlaceholderText('Add description and location about the item');
    const addButton = getByText('Add Item');

    fireEvent.changeText(nameInput, 'Test Item');
    fireEvent.changeText(descInput, 'Test Description');
    await act(async () => {
      fireEvent.press(addButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to save item. Please try again.');
    });
  });

  it('handles camera permission denial (R9.1)', async () => {
    // Tests error handling for camera permission denial
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ status: 'denied' });
    const { getByText } = render(<AddItem />);
    const takePhotoButton = getByText('Take Photo');

    await act(async () => {
      fireEvent.press(takePhotoButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Camera permission is required to take photos.');
    });
  });
});