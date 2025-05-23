import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ListItem from '../app/listItem.jsx'; 
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../assets/images/default.png', () => ({}));
jest.spyOn(Alert, 'alert');

describe('ListItem Component', () => {
  let router;

  beforeEach(() => {
    jest.clearAllMocks();
    router = { push: jest.fn() };
    useRouter.mockReturnValue(router);
    SecureStore.getItemAsync.mockResolvedValue(JSON.stringify([
      { id: '1', name: 'Test Item', description: 'Test Desc', photoUri: 'file://photo.jpg' },
      { id: '2', name: 'Another Item', description: 'Another Desc' },
    ]));
  });

  it('renders list from secure store (R3.1, R3.2, R4.1, R10.1)', async () => {
    const { getByText } = render(<ListItem />);
    await waitFor(() => {
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('items');
      expect(getByText('Test Item')).toBeTruthy();
      expect(getByText('Another Item')).toBeTruthy();
      expect(getByText('Test Desc')).toBeTruthy();
    });
  });

  it('searches items by name or description (R6.1, R6.2, R6.3)', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ListItem />);
    const searchInput = getByPlaceholderText('Search items from your list');

    await waitFor(() => expect(getByText('Test Item')).toBeTruthy());
    fireEvent.changeText(searchInput, 'Test');

    await waitFor(() => {
      expect(getByText('Test Item')).toBeTruthy();
      expect(queryByText('Another Item')).toBeNull();
    });
  });

  it('navigates to item details (R3.3, R6.4)', async () => {
    const { findByText } = render(<ListItem />);
    const item = await findByText('Test Item');  // use findByText

    fireEvent.press(item);

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/items/1',
      params: { item: JSON.stringify({ id: '1', name: 'Test Item', description: 'Test Desc', photoUri: 'file://photo.jpg' }) },
    });
  });

  it('handles secure store errors (R9.1)', async () => {
    SecureStore.getItemAsync.mockRejectedValue(new Error('Load failed'));
    const { getByText } = render(<ListItem />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to load items. Please try again.');
    });
  });
});
