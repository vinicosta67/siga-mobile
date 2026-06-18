import React from 'react';
import { render } from '@testing-library/react-native';
import CreditNavigationMenu from './CreditNavigationMenu';

describe('CreditNavigationMenu Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<CreditNavigationMenu />);
    
    expect(getByText('Oportunidades')).toBeTruthy();
    expect(getByText('Crédito Pré-Aprovado')).toBeTruthy();
    expect(getByText('Simular Crédito')).toBeTruthy();
    expect(getByText('Minhas Propostas')).toBeTruthy();
    expect(getByText('Meus Contratos')).toBeTruthy();
  });
});
