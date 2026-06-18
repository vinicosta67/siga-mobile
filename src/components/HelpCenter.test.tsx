import React from 'react';
import { render } from '@testing-library/react-native';
import HelpCenter from './HelpCenter';

describe('HelpCenter Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<HelpCenter />);
    
    expect(getByText('Atendimento')).toBeTruthy();
    expect(getByText('Chat via WhatsApp')).toBeTruthy();
    expect(getByText('Falar com gerente')).toBeTruthy();
  });
});
