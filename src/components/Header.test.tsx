import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from './Header';

describe('Header Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<Header />);
    
    // Testa se o avatar de usuário (NS) está presente
    expect(getByText('NS')).toBeTruthy();
    
    // Testa se os botões de ação estão na tela
    expect(getByTestId('toggle-visibility-btn')).toBeTruthy();
    expect(getByTestId('notifications-btn')).toBeTruthy();
  });

  it('calls onToggleVisibility when visibility button is pressed', () => {
    const mockToggle = jest.fn();
    const { getByTestId } = render(<Header onToggleVisibility={mockToggle} />);
    
    fireEvent.press(getByTestId('toggle-visibility-btn'));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
