import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContractCard from './ContractCard';

describe('ContractCard Component', () => {
  const mockProps = {
    title: 'FNO-CAR',
    value: 'R$ 150.000,00',
    dueDate: '20/10/2026',
    status: 'adimplente' as const,
    onPress: jest.fn(),
  };

  it('renders correctly', () => {
    const { getByText } = render(<ContractCard {...mockProps} />);
    
    expect(getByText('FNO-CAR')).toBeTruthy();
    expect(getByText('R$ 150.000,00')).toBeTruthy();
    expect(getByText('Vence em 20/10/2026')).toBeTruthy();
    expect(getByText('Adimplente')).toBeTruthy();
  });

  it('triggers onPress', () => {
    const { getByTestId } = render(<ContractCard {...mockProps} />);
    
    fireEvent.press(getByTestId('contract-card'));
    expect(mockProps.onPress).toHaveBeenCalled();
  });
});
