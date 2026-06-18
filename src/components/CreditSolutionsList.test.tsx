import React from 'react';
import { render } from '@testing-library/react-native';
import CreditSolutionsList from './CreditSolutionsList';

describe('CreditSolutionsList Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<CreditSolutionsList />);
    
    expect(getByText('Crédito Rural FNO')).toBeTruthy();
    expect(getByText('Investimento BNDES')).toBeTruthy();
    expect(getByText('Microcrédito')).toBeTruthy();
  });
});
