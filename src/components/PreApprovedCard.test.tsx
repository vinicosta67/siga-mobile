import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PreApprovedCard from './PreApprovedCard';

describe('PreApprovedCard Component', () => {
  const mockProps = {
    onPress: jest.fn(),
    count: 3,
  };

  it('renders correctly', () => {
    const { getByText } = render(<PreApprovedCard {...mockProps} />);
    
    expect(getByText('3 ofertas pré-aprovadas')).toBeTruthy();
    expect(getByText('Condições especiais para você')).toBeTruthy();
  });

  it('triggers onPress', () => {
    const { getByTestId } = render(<PreApprovedCard {...mockProps} />);
    
    fireEvent.press(getByTestId('pre-approved-card'));
    expect(mockProps.onPress).toHaveBeenCalled();
  });
});
