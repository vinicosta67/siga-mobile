import React from 'react';
import { render } from '@testing-library/react-native';
import Badge from './Badge';

describe('Badge Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Badge text="Adimplente" />);
    expect(getByText('Adimplente')).toBeTruthy();
  });

  it('applies variant correctly', () => {
    const { getByTestId, getByText } = render(<Badge text="Sucesso" variant="success" testID="badge" />);
    expect(getByText('Sucesso')).toBeTruthy();
    expect(getByTestId('badge')).toBeTruthy();
  });
});
