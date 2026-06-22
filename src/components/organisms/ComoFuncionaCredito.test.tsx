import React from 'react';
import { render } from '@testing-library/react-native';
import ComoFuncionaCredito from './ComoFuncionaCredito';

describe('ComoFuncionaCredito', () => {
  it('renders all steps correctly', () => {
    const { getByText } = render(<ComoFuncionaCredito />);

    expect(getByText('Como funciona o crédito pré-aprovado?')).toBeTruthy();
    expect(getByText('Analisamos seu histórico')).toBeTruthy();
    expect(getByText('Ofertas personalizadas')).toBeTruthy();
    expect(getByText('Simule e compare')).toBeTruthy();
    expect(getByText('Contrate pelo app')).toBeTruthy();
  });
});
