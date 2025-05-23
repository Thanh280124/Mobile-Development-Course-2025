import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditItem from '../app/items/editItem';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useLocalSearchParams: () => ({
    item: JSON.stringify({
      id: '123',
      name: 'Original Name',
      description: 'Original Description',
      gpsCoordinates: { latitude: 10, longitude: 106 },
      photoUri: null,
    }),
  }),
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ canceled: true })),
  MediaTypeOptions: {},
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({ coords: { latitude: 11.11, longitude: 22.22 } })
  ),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(JSON.stringify([
    { id: '123', name: 'Original Name', description: 'Original Description' }
  ]))),
  setItemAsync: jest.fn(() => Promise.resolve()),
}));

jest.spyOn(Alert, 'alert');

describe('EditItem Screen', () => {
  it('renders form fields with initial values', () => {
    const { getByDisplayValue } = render(<EditItem />);
    expect(getByDisplayValue('Original Name')).toBeTruthy();
    expect(getByDisplayValue('Original Description')).toBeTruthy();
  });

  it('shows alert if description is missing', async () => {
    const { getByPlaceholderText, getByText } = render(<EditItem />);
    fireEvent.changeText(getByPlaceholderText('Enter item name'), 'Test Name');
    fireEvent.changeText(getByPlaceholderText(/description/i), '');
    fireEvent.press(getByText(/Save Changes/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("You should add the description of the item");
    });
  });

  it('saves valid form and shows success alert (R5.3)', async () => {
    const { getByText, getByPlaceholderText } = render(<EditItem />);
    fireEvent.changeText(getByPlaceholderText('Enter item name'), 'Updated Name');
    fireEvent.changeText(getByPlaceholderText(/description/i), 'Updated Description');
    fireEvent.press(getByText(/Save Changes/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });

    // Get the last alert call
    const lastAlert = Alert.alert.mock.calls[Alert.alert.mock.calls.length - 1];
    // lastAlert is [title, message, buttons?, options?, type?]

    const buttons = lastAlert[2];
    if (buttons && Array.isArray(buttons)) {
      // Find "Save" button and simulate press
      const saveButton = buttons.find(b => b.text === 'Save');
      expect(saveButton).toBeDefined();

      await waitFor(() => saveButton.onPress());
    }

    // Confirm SecureStore.setItemAsync was called (save happened)
    await waitFor(() => {
      expect(SecureStore.setItemAsync).toHaveBeenCalled();
    });
  });
});
