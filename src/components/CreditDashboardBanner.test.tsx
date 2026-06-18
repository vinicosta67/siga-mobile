import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreditDashboardBanner from './CreditDashboardBanner';

describe('CreditDashboardBanner Component', () => {
  const mockProps = {
    onSimulatePress: jest.fn(),
    isVisible: true,
  };

  it('renders correctly', () => {
    const { getByText } = render(<CreditDashboardBanner {...mockProps} />);
    
    expect(getByText('Crédito Especializado FNO | BNDES | Pronaf')).toBeTruthy();
    expect(getByText('Crédito disponível de até')).toBeTruthy();
    expect(getByText('R$ 850.000,00')).toBeTruthy();
    expect(getByText('Simular')).toBeTruthy();
  });

  it('hides the value when isVisible is false', () => {
    const { getByText, queryByText } = render(<CreditDashboardBanner {...mockProps} isVisible={false} />);
    
    expect(queryByText('R$ 850.000,00')).toBeNull();
    expect(getByText('••••••••')).toBeTruthy();
  });

  it('triggers onSimulatePress', () => {
    const { getByTestId } = render(<CreditDashboardBanner {...mockProps} />);
    
    fireEvent.press(getByTestId('simulate-button'));
    expect(mockProps.onSimulatePress).toHaveBeenCalled();
  });
});
