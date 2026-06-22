import React from 'react';
import { render } from '@testing-library/react-native';
import PreAprovadoHeader from './PreAprovadoHeader';

describe('PreAprovadoHeader', () => {
  it('renders correctly with given props', () => {
    const { getByText } = render(
      <PreAprovadoHeader 
        totalValue={2500000} 
        numberOfLines={3} 
      />
    );

    expect(getByText('Você tem crédito pré-aprovado!')).toBeTruthy();
    expect(getByText('Baseado no seu histórico como cliente BASA')).toBeTruthy();
    // 2.500.000 could be formatted differently, but we expect it to be shown in the UI
    expect(getByText('R$ 2,5 mi')).toBeTruthy();
    expect(getByText('disponíveis em 3 linhas de crédito')).toBeTruthy();
  });

  it('formats values under 1 million correctly', () => {
    const { getByText } = render(
      <PreAprovadoHeader 
        totalValue={850000} 
        numberOfLines={2} 
      />
    );

    expect(getByText('R$ 850.000,00')).toBeTruthy();
    expect(getByText('disponíveis em 2 linhas de crédito')).toBeTruthy();
  });
});
