import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ItemDetails from '../app/items/[id]';
import { Alert, Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// ✅ Expo Router mock
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useLocalSearchParams: () => ({
    item: JSON.stringify({
      id: '123',
      name: 'Test Item',
      description: 'Test Description',
      gpsCoordinates: { latitude: 10.1234, longitude: 106.5678 },
    }),
  }),
}));

// ✅ SecureStore mock
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() =>
    Promise.resolve(
      JSON.stringify([
        {
          id: '123',
          name: 'Test Item',
          description: 'Test Description',
          gpsCoordinates: { latitude: 10.1234, longitude: 106.5678 },
        },
      ])
    )
  ),
  setItemAsync: jest.fn(() => Promise.resolve()),
}));

// ✅ Linking mock (only this, to avoid TurboModule errors)
jest.spyOn(Linking, 'canOpenURL').mockImplementation(() => Promise.resolve(true));
jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());

jest.spyOn(Alert, 'alert');

describe('ItemDetails Screen', () => {
  it('renders item details properly', () => {
    const { getByText } = render(<ItemDetails />);
    expect(getByText('Test Item')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
    expect(getByText(/Latitude/)).toBeTruthy();
  });

  it('opens Google Maps on "View on Map" click (R2.3)', async () => {
    const { getByText } = render(<ItemDetails />);
    fireEvent.press(getByText(/View on Map/i));

    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(
        expect.stringContaining('google.com/maps')
      );
    });
  });

  it('shows confirmation alert when deleting (R9.3)', () => {
    const { getByText } = render(<ItemDetails />);
    fireEvent.press(getByText(/Delete/i));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      expect.any(Array)
    );
  });
});
